# GUIA DE PAGAMENTO GATEWAY

## Descrição
Este projeto é uma API desenvolvida com Node.js que funciona como um Gateway para emissão de guias de pagamento. Ele integra-se com os serviços para permitir a emissão de guias unitárias e em lote, além de fornecer endpoints para consulta das receitas disponíveis e gerenciamento das guias emitidas.

# Licenças
[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](https://choosealicense.com/no-permission/)
[![Proprietary Software](https://img.shields.io/badge/Software-Proprietary-blue.svg)](#)

# Ferramentas e Linguagens Utilizadas
### Ferramentas 🛠️
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SEUUSERNAME) ![Windows](https://img.shields.io/badge/Windows-000?style=for-the-badge&logo=windows&logoColor=2CA5E0) ![AquaSec](https://img.shields.io/badge/aqua-%231904DA.svg?style=for-the-badge&logo=aqua&logoColor=#0018A8) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

### Linguagens 👩‍💻

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
---
### 📋 Pré-requisitos

- [Node.js](https://nodejs.org/en/download)
- npm

## Estrutura do Projeto
### 📂 Estrutura de Pastas
```bash
project-root/
back-end/
├── config/                   # Configurações do projeto (variáveis, URLs, chaves de API etc).
├── coverage/                 # Relatórios de cobertura dos testes automatizados.
├── docs/                     # Documentação do projeto, como arquivos Swagger e especificações.
├── routes/                   # Definição das rotas/endpoints da API.
├── tests/                    # Testes automatizados para rotas e funcionalidades do backend.
├── Dockerfile                # Instruções para criar a imagem Docker do backend.
├── docker-compose.yml        # Configuração para orquestração de containers Docker (ex: backend, banco, etc).
├── index.js                  # Ponto de entrada do backend, inicializa o servidor e configura as rotas.
├── package.json              # Lista dependências, scripts e metadados do projeto Node.js.
└── package-lock.json         # Registro exato das versões das dependências instaladas.

```

## Como Usar
### 1. Instale as dependências no backend/
Antes de rodar o script, instale as dependências necessárias:
```sh
npm install axios dotenv express@5.1.0 swagger-ui-express yamljs jest supertest --save-dev jest supertest
```

### 2. Você pode executar o comando diretamente dentro da pasta back-end/
```sh
node index.js
```

### 3. Para rodar o projeto continuamente no Docker, use este comando para construir a imagem e iniciar o container na porta 3000:
```sh
docker build -t guia-pagamento . && docker run -p 3000:3000 guia-pagamento 
```
### 4. Para executar os testes automatizados do projeto, navegue até a pasta tests/ e rode os testes usando o Jest. Isso garante que todas as funcionalidades estejam funcionando conforme esperado.
```sh
cd tests && npx jest
```