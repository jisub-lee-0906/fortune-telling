const MAX_BODY_BYTES = 4096;
const UPSTREAM_TIMEOUT_MS = 70_000;

type FetchLike = typeof fetch;

type HandlerOptions = {
  backendUrl?: string;
  token?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
};

function jsonResponse(detail: string, status: number) {
  return Response.json(
    { detail },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function readBoundedBody(request: Request, maxBytes = MAX_BODY_BYTES) {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    const parsedLength = Number(declaredLength);
    if (!Number.isFinite(parsedLength) || parsedLength < 0) {
      throw new ResponseError(400, "Invalid Content-Length");
    }
    if (parsedLength > maxBytes) {
      throw new ResponseError(413, "Payload too large");
    }
  }

  if (!request.body) {
    throw new ResponseError(400, "Request body is required");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel("payload_too_large").catch(() => undefined);
        throw new ResponseError(413, "Payload too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  if (total === 0) {
    throw new ResponseError(400, "Request body is required");
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

class ResponseError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function createInterpretHandler(options: HandlerOptions = {}) {
  const backendUrl = options.backendUrl ?? process.env.BACKEND_API_URL;
  const token = options.token ?? process.env.INTERPRET_SERVER_TOKEN;
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? UPSTREAM_TIMEOUT_MS;

  return async function handle(request: Request) {
    if (!backendUrl || !token) {
      return jsonResponse("Paid interpretation is disabled", 503);
    }

    let body: string;
    try {
      body = await readBoundedBody(request);
      JSON.parse(body);
    } catch (error) {
      if (error instanceof ResponseError) return jsonResponse(error.message, error.status);
      if (error instanceof SyntaxError || error instanceof TypeError) {
        return jsonResponse("Invalid JSON body", 400);
      }
      return jsonResponse("Invalid request body", 400);
    }

    try {
      const response = await fetchImpl(`${backendUrl.replace(/\/$/, "")}/interpret`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Interpret-Token": token,
        },
        body,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(timeoutMs),
      });
      const headers = new Headers({
        "Cache-Control": "no-store",
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      });
      return new Response(response.body, { status: response.status, headers });
    } catch (error) {
      const name = error instanceof Error ? error.name : "";
      if (name === "TimeoutError" || name === "AbortError") {
        return jsonResponse("Interpretation service timed out", 503);
      }
      return jsonResponse("Interpretation service unavailable", 502);
    }
  };
}
