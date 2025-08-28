import pg from 'pg';
import fs from 'fs';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function seedLexicon() {
  const rows = JSON.parse(fs.readFileSync('seeds/stones_min.json','utf8'));
  for (const r of rows) {
    await pool.query(
      `insert into lexicon(id,surface_form,normalized,pos,gloss,domain,confidence,source_ref,notes)
       values (gen_random_uuid(), $1, lower($1), $2, $3, null, $4, $5, null)
       on conflict do nothing`,
      [r.surface_form, r.pos || null, r.gloss, r.confidence, r.source_ref]
    );
  }
  console.log(`Seeded ${rows.length} lexicon rows`);
  process.exit(0);
}
seedLexicon().catch(e=>{console.error(e);process.exit(1);});
