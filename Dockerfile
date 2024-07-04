FROM oven/bun:alpine

WORKDIR /usr/src/app

COPY package.json bun.lockb ./

RUN bun install

COPY src ./src

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
