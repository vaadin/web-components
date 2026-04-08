FROM node:24-slim

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

EXPOSE 8080

CMD ["npx", "web-dev-server", "--node-resolve", "--port", "8080", "--hostname", "0.0.0.0", "--root-dir", "."]
