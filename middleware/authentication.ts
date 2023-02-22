import { load } from "https://deno.land/std@0.177.0/dotenv/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
const env = await load();
const { WEB_KEY } = env;

export const verifyToken = async (context: any, next: any) => {
  const { request, response }: { request: any; response: any } = context;
  try {
    const authorizationToken = request.headers.get("Authorization");
    const encoder = new TextEncoder();
    const jsonWebKey = encoder.encode(WEB_KEY);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      jsonWebKey,
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );

    const validToken = await verify(authorizationToken, cryptoKey);

    if (!validToken) throw new Error("Invalid authorization token");

    response.body = {
      success: true,
      message: "The token is valid",
    };
    next();
  } catch (error) {
    response.body = {
      success: false,
      error: error.message,
    };
  }
};
