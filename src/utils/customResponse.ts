const responseHeaders = new Headers({ "Content-Type": "application/json" });

export default class CustomResponse extends Response {
  constructor(response: Record<string, any>, headerOverride?: ResponseInit) {
    const headers = new Headers(responseHeaders);
    if (headerOverride?.headers) {
      const overrideHeaders = new Headers(headerOverride.headers);
      overrideHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }
    super(JSON.stringify(response), { ...headerOverride, headers });
  }
}
