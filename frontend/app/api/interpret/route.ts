import { NextRequest } from "next/server";

import { createInterpretHandler } from "./handler";

export const runtime = "nodejs";

const handleInterpret = createInterpretHandler();

export async function POST(request: NextRequest) {
  return handleInterpret(request);
}
