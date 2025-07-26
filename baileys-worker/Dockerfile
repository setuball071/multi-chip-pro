# 1. Comece com uma imagem base do Node.js
FROM node:18-slim

# 2. Defina o diretório de trabalho dentro do nosso "mini-computador"
WORKDIR /usr/src/app

# 3. Copie os arquivos de dependência e instale-os
#    Isso é feito separado para aproveitar o cache do Docker
COPY package*.json ./
RUN npm install

# 4. Copie todo o resto do código da pasta atual para o diretório de trabalho
COPY . .

# 5. Diga ao container qual comando executar quando ele iniciar
CMD [ "node", "index.js" ]