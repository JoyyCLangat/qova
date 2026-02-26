import { describe, expect, it } from "vitest";
import { app } from "../src/server.js";

describe("Health endpoint", () => {
  it("should return ok status", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("qova-api");
  });
});

describe("404 handler", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await app.request("/unknown");
    expect(res.status).toBe(404);
  });
});
