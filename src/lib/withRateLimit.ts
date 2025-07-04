type Handler = (req: Request) => Promise<Response>;

const rateLimitMap = new Map<string, number>();

export function withRateLimit(handler: Handler, options = { windowMs: 5000 }) {
  return async function wrappedHandler(req: Request): Promise<Response> {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const now = Date.now();

    const lastHit = rateLimitMap.get(ip) || 0;

    if (now - lastHit < options.windowMs) {
      return new Response("Too many requests. Please wait a few seconds.", {
        status: 429,
      });
    }

    rateLimitMap.set(ip, now);

    return handler(req);
  };
}
