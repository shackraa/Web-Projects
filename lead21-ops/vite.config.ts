import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { POST as sendMail } from "./api/send-mail";

function mailApiPlugin(): Plugin {
  return {
    name: "lead21-mail-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/api/send-mail" || req.method !== "POST") {
          next();
          return;
        }
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = Buffer.concat(chunks).toString("utf8");
        const request = new Request("http://127.0.0.1/api/send-mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        try {
          const response = await sendMail(request);
          const text = await response.text();
          res.statusCode = response.status;
          res.setHeader("Content-Type", "application/json");
          res.end(text);
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, mode: "hata", detail: String(e) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mailApiPlugin()],
  preview: {
    host: "127.0.0.1",
    port: 4173,
    // Cloudflare quick tunnel / alternate public hosts
    allowedHosts: true,
  },
});
