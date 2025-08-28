import { assemblePrompt, retrieveNeighborhood, lookupLexicon, alignSeed, callLLM, validateJSON, getSpan, persistRun } from './steps.js';

export async function researchTranslate(spanId: string, cfg: any) {
  const span = await getSpan(spanId);
  const ctx = await retrieveNeighborhood(span, 5);
  if (!ctx.length) throw new Error('insufficient-evidence');
  const lex = await lookupLexicon(span);
  const align = await alignSeed(span);
  const llmInput = assemblePrompt({ mode:'research', span, ctx, lex, align, cards: ['stones-list@2025-08-20'] });
  const raw = await callLLM(llmInput, { model: cfg.model, temperature: 0 });
  const out = validateJSON(raw);
  for (const t of out.tokens) {
    if (!t.sources || !t.sources.length) { t.method = 'unknown'; delete t.gloss; }
  }
  return persistRun(out);
}
