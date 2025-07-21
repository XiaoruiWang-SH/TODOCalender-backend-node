FROM node:22
RUN npm install -g pnpm@10

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "run", "dev"]