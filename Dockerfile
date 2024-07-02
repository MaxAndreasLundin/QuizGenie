FROM oven/bun:alpine

WORKDIR /usr/src/app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "--hot", "run", "src/index.ts"]
