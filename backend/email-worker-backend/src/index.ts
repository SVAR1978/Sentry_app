import http from "node:http";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 10000;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("email worker service is running\n");
});

server.listen(port, () => {
  console.log(`Email worker service listening on port ${port}`);
});

await import("./workers/emailWorker.js");