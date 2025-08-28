import Fastify from 'fastify';
import pg from 'pg';
import { researchTranslate } from './rag/orchestrator';
import externalRoutes from './connectors/external';
import anasIndexRoutes from './anas/index';

const app = Fastify({ logger: true });
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.register(externalRoutes);
app.register(anasIndexRoutes);

app.get('/lexicon/search', async (req, reply) => {
  const q = String((req.query as any).q || '').toLowerCase();
  const { rows } = await pool.query(
    `select * from lexicon where normalized like $1 order by confidence desc limit 50`,
    [q ? `%${q}%` : '%']
  );
  reply.send(rows);
});

app.post('/translate/research', async (req, reply) => {
  const { span_id } = req.body as any;
  try {
    const out = await researchTranslate(span_id, { model: 'claude-3-5-sonnet' });
    reply.send(out);
  } catch (e:any) {
    reply.code(400).send({ error: e.message || 'failed' });
  }
});

app.listen({ port: 8787, host: '0.0.0.0' });
