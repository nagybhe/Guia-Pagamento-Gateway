# Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install --production

# Copia todo o restante do código para dentro do container
COPY . .

# Expõe a porta que seu app vai usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
