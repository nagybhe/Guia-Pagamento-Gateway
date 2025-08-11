require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Middleware para logar o payload recebido, com estrutura detalhada esperada
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] Requisição recebida: ${req.method} ${req.originalUrl}`);

    if (["POST", "PUT", "PATCH"].includes(req.method)) {
        // Log completo do payload recebido, com identação para facilitar leitura
        console.log("Payload recebido:");
        console.log(JSON.stringify(req.body, null, 2));
    }
    next();
});

// Rotas
const receitasRoutes = require("./routes/receitas");
const dareUnitarioRoutes = require("./routes/dareUnitario");
const dareLoteRoutes = require("./routes/dareLote");
const converterRoutes = require("./routes/converter");
// Swagger Docs
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Log para cada rota acionada
app.use("/converter", (req, res, next) => {
    console.log(`Rota /converter acionada: ${req.method} ${req.originalUrl}`);
    next();
}, converterRoutes);

app.use("/receitas", (req, res, next) => {
    console.log(`Rota /receitas acionada: ${req.method} ${req.originalUrl}`);
    next();
}, receitasRoutes);

app.use("/dare-unitario", (req, res, next) => {
    console.log(`Rota /dare-unitario acionada: ${req.method} ${req.originalUrl}`);
    next();
}, dareUnitarioRoutes);

app.use("/dare-lote", (req, res, next) => {
    console.log(`Rota /dare-lote acionada: ${req.method} ${req.originalUrl}`);
    next();
}, dareLoteRoutes);

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
    console.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "Rota não encontrada" });
});

// Só inicia o servidor se NÃO for ambiente de teste
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}

module.exports = app;
