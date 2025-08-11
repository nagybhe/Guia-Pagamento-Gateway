const request = require("supertest");
const app = require("../index");

describe("Testa rota /receitas", () => {
    jest.setTimeout(30000);

    test("GET /receitas deve retornar 200", async () => {
        const res = await request(app).get("/receitas");
        expect(res.statusCode).toBe(200);
    });
});
