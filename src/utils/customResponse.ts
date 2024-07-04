const DEFAULT_HEADERS = Object.freeze({ "Content-Type": "application/json" });

interface JsonResponseOptions extends ResponseInit {
  status?: number;
}

export class JsonResponse extends Response {
  constructor(
    body: Record<string, unknown>,
    options: JsonResponseOptions = {}
  ) {
    const headers = new Headers(DEFAULT_HEADERS);

    if (options.headers) {
      const overrideHeaders = new Headers(options.headers);
      overrideHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    let serializedBody: string;
    try {
      serializedBody = JSON.stringify(body);
    } catch (error) {
      console.error("Failed to serialize response body:", error);
      serializedBody = JSON.stringify({
        error: "Failed to serialize response",
      });
      options.status = options.status || 500;
    }

    super(serializedBody, {
      status: options.status || 200,
      ...options,
      headers,
    });
  }
}
