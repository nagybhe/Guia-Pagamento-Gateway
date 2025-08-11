const request = require("supertest");
const app = require("../index");
const axios = require("axios");

jest.mock("axios");

describe("Testa rotas /dare-unitario", () => {
    jest.setTimeout(30000);

    const validUnitarioPayload = {
        receita: {
            codigo: "081-4",
            codigoServicoDARE: 8101,
            escopoUso: 0,
            nome: "ICMS - Parcelamento de débito fiscal não inscrito (08101)",
        },
        referencia: "08/2025",
        dataVencimento: "2025-08-20T00:00:00Z",
        valor: 100.0,
        inscricaoEstadual: "123456789012",
        cnpj: "57412818000139",
        razaoSocial: "Maria Oliveira ME",
        endereco: "Rua Exemplo, 123",
        cidade: "São Paulo",
        uf: "SP",
        telefone: "(11)99999-9999",
        linha08: "123456789",
        gerarPDF: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockAxiosSuccess = (data = { sucesso: true }) => {
        axios.post.mockResolvedValue({ data });
    };
    const mockAxiosFailure = (status = 500, message = "Erro interno") => {
        axios.post.mockRejectedValue({
            response: { status, data: { message } },
            message,
        });
    };

    test("POST /dare-unitario/emitir deve retornar 200 com payload válido", async () => {
        mockAxiosSuccess({ itensParaGeracao: [validUnitarioPayload] });
        const res = await request(app)
            .post("/dare-unitario/emitir")
            .send(validUnitarioPayload);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("itensParaGeracao");
    });

    test("GET /dare-unitario/emitir deve retornar 200 com lista de DAREs unitários", async () => {
        const fakeList = [
            {
                id: "abc123",
                codigoReceita: "081-4",
                valor: 100,
                dataEmissao: "2025-08-11T15:30:00Z",
                urlPdf: "http://localhost/pdf/abc123.pdf",
            },
        ];
        const cacheModule = require("../routes/dareUnitario");
        cacheModule.cacheDareUnitario = fakeList;

        const res = await request(app).get("/dare-unitario/emitir");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("id");
    });

    test("POST /dare-unitario/emitir deve retornar erro com payload inválido", async () => {
        const invalidPayload = { receita: {} };
        mockAxiosFailure(400, "Payload inválido");
        const res = await request(app)
            .post("/dare-unitario/emitir")
            .send(invalidPayload);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });

    test("POST /dare-unitario/emitir deve tratar erro 500 da API externa", async () => {
        mockAxiosFailure(500, "Erro interno da API");
        const res = await request(app)
            .post("/dare-unitario/emitir")
            .send(validUnitarioPayload);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });

    test("POST /dare-unitario/emitir com valor negativo deve retornar erro", async () => {
        const payload = { ...validUnitarioPayload, valor: -10 };
        mockAxiosFailure(400, "Valor inválido");
        const res = await request(app).post("/dare-unitario/emitir").send(payload);
        expect(res.statusCode).toBe(500);
    });

    test("POST /dare-unitario/emitir com payload malicioso deve ser tratado", async () => {
        const payload = { ...validUnitarioPayload, codigoBarra44: "<script>alert(1)</script>" };
        mockAxiosSuccess({ itensParaGeracao: [payload] });
        const res = await request(app).post("/dare-unitario/emitir").send(payload);
        expect(res.statusCode).toBe(200);
    });

    test("POST /dare-unitario/emitir sem campos opcionais deve funcionar", async () => {
        const { inscricaoEstadual, telefone, ...minPayload } = validUnitarioPayload;
        mockAxiosSuccess({ itensParaGeracao: [minPayload] });
        const res = await request(app).post("/dare-unitario/emitir").send(minPayload);
        expect(res.statusCode).toBe(200);
    });

    test("POST /rota-inexistente deve retornar 404", async () => {
        const res = await request(app).post("/rota-inexistente");
        expect(res.statusCode).toBe(404);
    });
});
