import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";
import { Readable } from "stream";

/**
 * Helper function to collect raw body from the request.
 */
export async function getRawBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}
