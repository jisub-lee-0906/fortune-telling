import assert from "node:assert/strict";
import test from "node:test";

import { createInterpretHandler } from "../app/api/interpret/handler.ts";

const validBody = JSON.stringify({ year: 2024, month: 2, day: 29, hour: 12, minute: 0 });

function requestWithBody(body: BodyInit, headers: HeadersInit = {}) {
  return new Request("http://localhost/api/interpret", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
}

test("rejects a chunked oversized body before reading the remaining stream", async () => {
  let pulls = 0;
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulls += 1;
      if (pulls === 1) controller.enqueue(new Uint8Array(3000));
      else if (pulls === 2) controller.enqueue(new Uint8Array(2000));
      else controller.enqueue(new Uint8Array(3000));
    },
    cancel() {
      cancelled = true;
    },
  });
  const handler = createInterpretHandler({
    backendUrl: "http://backend:8000",
    token: "server-token",
    fetchImpl: async () => { throw new Error("upstream must not be called"); },
  });

  const response = await handler(requestWithBody(stream));

  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
  assert.equal(pulls, 2);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("denies upstream redirects without forwarding the token to a second location", async () => {
  const handler = createInterpretHandler({
    backendUrl: "http://backend:8000",
    token: "server-token",
    fetchImpl: async (_input, init) => {
      assert.equal(init?.redirect, "error");
      assert.equal(new Headers(init?.headers).get("x-interpret-token"), "server-token");
      throw new TypeError("redirect mode is set to error");
    },
  });

  const response = await handler(requestWithBody(validBody));

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { detail: "Interpretation service unavailable" });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("maps upstream timeout to a fixed 503 response", async () => {
  const handler = createInterpretHandler({
    backendUrl: "http://backend:8000",
    token: "server-token",
    fetchImpl: async () => { throw new DOMException("secret upstream detail", "TimeoutError"); },
  });

  const response = await handler(requestWithBody(validBody));

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { detail: "Interpretation service timed out" });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("propagates successful upstream status, content type, and body", async () => {
  const handler = createInterpretHandler({
    backendUrl: "http://backend:8000/",
    token: "server-token",
    fetchImpl: async (input, init) => {
      assert.equal(input, "http://backend:8000/interpret");
      assert.equal(init?.body, validBody);
      return new Response("accepted", {
        status: 202,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    },
  });

  const response = await handler(requestWithBody(validBody));

  assert.equal(response.status, 202);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(await response.text(), "accepted");
});

test("rejects empty and invalid JSON without calling upstream", async () => {
  let calls = 0;
  const handler = createInterpretHandler({
    backendUrl: "http://backend:8000",
    token: "server-token",
    fetchImpl: async () => { calls += 1; return new Response(); },
  });

  const empty = await handler(requestWithBody(""));
  const invalid = await handler(requestWithBody("{"));

  assert.equal(empty.status, 400);
  assert.equal(invalid.status, 400);
  assert.equal(calls, 0);
});
