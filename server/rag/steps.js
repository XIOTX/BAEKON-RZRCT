import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function getSpan(id){
  const { rows } = await pool.query(`select * from spans where id=$1`, [id]);
  if (!rows.length) throw new Error('span-not-found');
  return rows[0];
}

export async function retrieveNeighborhood(span, k=5){
  const { rows } = await pool.query(
    `select * from spans where document_id=$1 and span_index between $2 and $3 order by span_index`,
    [span.document_id, span.span_index-2, span.span_index+2]
  );
  return rows.slice(0,k);
}

export async function lookupLexicon(span){
  const toks = (span.tokens||[]).map(t=>t.surface || t);
  const { rows } = await pool.query(`select * from lexicon where surface_form = any($1)`, [toks]);
  return rows;
}

export async function alignSeed(span){
  return { method: 'heuristic', token_map: [], score: 0.0 };
}

export function assemblePrompt({mode, span, ctx, lex, align, cards}){
  return { system: 'BÆKON RESEARCH MODE. No source, no answer. JSON per schema.', mode, span, ctx, lex, align, cards };
}

export async function callLLM(payload, opts){
  // Stub; replace with your LLM client/proxy
  return JSON.stringify({
    mode:'research', span_id: payload.span?.id || 'unknown', tokens: [], unresolved: [],
    provenance:{ prompt_hash:'stub', card_ids: payload.cards||[], retrieval_ids: [], model: opts.model },
    notes: 'insufficient-evidence (stub)'
  });
}

export function validateJSON(raw){ try { return JSON.parse(raw); } catch(e){ throw new Error('invalid-json'); } }
export async function persistRun(out){ return out; }
