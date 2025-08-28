export default function Interlinear({ tokens }: { tokens: any[] }) {
  return (
    <div className="grid gap-2 p-4 bg-white/5 rounded-2xl">
      {tokens.map((t, i) => (
        <div key={i} className="grid grid-cols-5 items-baseline">
          <div className="font-mono text-zinc-200">{t.surface}</div>
          <div className="text-zinc-400">{t.lemma ?? "—"}</div>
          <div className="text-zinc-100">{t.gloss ?? "[UNKNOWN]"}</div>
          <div className="text-xs text-zinc-500">{t.method} • {Math.round((t.confidence||0)*100)}%</div>
          <div className="text-xs text-purple-300/80 truncate">{(t.sources||[]).join(', ')}</div>
        </div>
      ))}
    </div>
  );
}
