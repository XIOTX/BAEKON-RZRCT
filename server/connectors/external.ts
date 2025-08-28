import { FastifyInstance } from "fastify";
import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export default async function externalRoutes(app: FastifyInstance) {
  app.post("/connectors/log-external", async (req, reply) => {
    const body = req.body as any;
    await pool.query(
      `insert into external_logs(base_url, query, ts) values ($1,$2,$3)`,
      [body.baseUrl || null, body.q || null, body.ts || new Date().toISOString()]
    );
    reply.send({ ok:true });
  });
}
