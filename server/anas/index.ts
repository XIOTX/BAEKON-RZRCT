import { FastifyInstance } from "fastify";
import fs from "fs"; import zlib from "zlib"; import path from "path"; import Database from "better-sqlite3";

function ensureDb(dbPathGz: string, dbPath: string){
  if (fs.existsSync(dbPath)) return dbPath;
  if (fs.existsSync(dbPathGz)) {
    const buf = zlib.gunzipSync(fs.readFileSync(dbPathGz));
    fs.writeFileSync(dbPath, buf);
    return dbPath;
  }
  throw new Error(`SQLite DB not found. Expected at ${dbPath} or ${dbPathGz}. Run scripts/fetch_anas_index.sh`);
}

export default async function anasIndexRoutes(app: FastifyInstance){
  app.get("/anas-index/search", async (req, reply) => {
    const q = (req.query as any).q?.toString() || "";
    const fields = ((req.query as any).fields || "title,english_text,full_text").toString().split(",").map((s:string)=>s.trim()).filter(Boolean);
    const from = (req.query as any).from?.toString();
    const to   = (req.query as any).to?.toString();

    const root = process.cwd();
    const gz = process.env.ANAS_INDEX_DB_GZ || path.join(root, "integrations/ana_index/newdb.db.gz");
    const dbp= process.env.ANAS_INDEX_DB    || path.join(root, "integrations/ana_index/newdb.db");
    const dbFile = ensureDb(gz, dbp);
    const db = new Database(dbFile, { readonly: true });

    const likes:string[] = []; const params:any = {};
    if (q) {
      fields.forEach((f: string, i: number) => { likes.push(`${f} LIKE @p${i}`); params[`p${i}`] = `%${q}%`; });
    }
    let where = likes.length ? `(${likes.join(" OR ")})` : "1=1";
    if (from) where += " AND date_posted >= @from";
    if (to)   where += " AND date_posted <  date(@to, '+1 day')";
    if (from) params.from = from;
    if (to)   params.to   = to;

    const rows = db.prepare(`
      SELECT title, author, date_posted, tags, english_text, full_text
      FROM articles
      WHERE ${where}
      ORDER BY date_posted DESC, title ASC
      LIMIT 500
    `).all(params);
    db.close();
    reply.send(rows);
  });
}
