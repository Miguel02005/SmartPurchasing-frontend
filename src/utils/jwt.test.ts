import { describe, it, expect } from "vitest";
import { decodeToken } from "./jwt";

function createFakeToken(payload: object) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.fakesignature`;
}

describe("decodeToken", () => {
    it("decodifica correctamente un token válido", () => {
    const token = createFakeToken({ sub: 1, email: "vendor@test.com" });
    const result = decodeToken(token);
    expect(result).toEqual({ sub: 1, email: "vendor@test.com" });
    });

    it("retorna null si el token está malformado", () => {
    const result = decodeToken("token-invalido-sin-puntos");
    expect(result).toBeNull();
    });
});