const request = require("supertest");
const app = require("../index");
const axios = require("axios");

jest.mock("axios");

describe("Testa rotas /dare-lote", () => {
    jest.setTimeout(30000);

    const validLotePayload = {
        itensParaGeracao: [
            {
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
                valorJuros: 0,
                valorMulta: 0,
                valorTotal: 100.0,
            },
        ],
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

    test("POST /dare-lote/emitir deve retornar 200 com payload válido", async () => {
        mockAxiosSuccess({ itensParaGeracao: validLotePayload.itensParaGeracao });
        const res = await request(app)
            .post("/dare-lote/emitir")
            .send(validLotePayload);
        expect(res.statusCode).toBe(200);
        expect(res.body.itensParaGeracao.length).toBeGreaterThan(0);
    });

    test("GET /dare-lote/emitir deve retornar 200 com lista de DAREs em lote", async () => {
        const fakeList = [
            {
                id: "lote123",
                codigoReceita: "081-4",
                valor: 100,
                dataEmissao: "2025-08-11T15:30:00Z",
                urlPdf: "http://localhost/pdf/lote123.pdf",
            },
        ];
        const cacheModule = require("../routes/dareLote");
        cacheModule.cacheDareLote = fakeList;

        const res = await request(app).get("/dare-lote/emitir");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("id");
    });

    test("POST /dare-lote/emitir deve retornar erro com payload inválido", async () => {
        const invalidPayload = { itensParaGeracao: [] };
        mockAxiosFailure(400, "Payload inválido");
        const res = await request(app).post("/dare-lote/emitir").send(invalidPayload);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });

    test("POST /dare-lote/emitir deve tratar erro 500 da API externa", async () => {
        mockAxiosFailure(500, "Erro interno da API");
        const res = await request(app)
            .post("/dare-lote/emitir")
            .send(validLotePayload);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error");
    });

    test("POST /dare-lote/emitir com data inválida deve retornar erro", async () => {
        const payload = {
            itensParaGeracao: [
                {
                    ...validLotePayload.itensParaGeracao[0],
                    dataVencimento: "data-invalida",
                },
            ],
        };
        mockAxiosFailure(400, "Data inválida");
        const res = await request(app).post("/dare-lote/emitir").send(payload);
        expect(res.statusCode).toBe(500);
    });
});
