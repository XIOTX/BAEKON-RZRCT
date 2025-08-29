import { useEffect, useState } from "react";

type Row = {
  title: string;
  author: string;
  date_posted: string;
  tags: string;
  english_text?: string;
  full_text?: string;
};

type LexiconEntry = {
  aylid: string;
  english: string;
  confidence: number;
  length: number;
  notes: string;
};

export default function AnaIndex(){
  const [q, setQ] = useState("");
  const [fields, setFields] = useState<string[]>(["title","english_text","full_text"]);
  const [from, setFrom] = useState<string>("2000-01-01");
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0,10));
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState<number|null>(null);
  const [showCredit, setShowCredit] = useState(false);
  const [searchMode, setSearchMode] = useState<"ana" | "aylid">("ana");
  const [lexiconResults, setLexiconResults] = useState<LexiconEntry[]>([]);
  const [aylidLexicon, setAylidLexicon] = useState<LexiconEntry[]>([]);

  // Load Aylid lexicon
  useEffect(() => {
    fetch('/data/aylid_lexicon.json')
      .then(res => res.json())
      .then(data => setAylidLexicon(data.lexicon || []))
      .catch(err => console.error('Failed to load Aylid lexicon:', err));
  }, []);

  async function search(){
    if (searchMode === "aylid") {
      searchAylidLexicon();
    } else {
      const params = new URLSearchParams({ q, fields: fields.join(","), from, to });
      const res = await fetch(`/anas-index/search?${params.toString()}`);
      const data = await res.json();
      setRows(data || []);
      setOpen(null);
    }
  }

  function searchAylidLexicon() {
    if (!q.trim()) {
      setLexiconResults([]);
      return;
    }
    
    const query = q.toLowerCase();
    const results = aylidLexicon.filter(entry => 
      entry.aylid.toLowerCase().includes(query) || 
      entry.english.toLowerCase().includes(query)
    );
    setLexiconResults(results);
  }

  useEffect(()=>{ search(); },[searchMode, aylidLexicon]);

  function toggleField(name:string){
    setFields(prev => prev.includes(name) ? prev.filter(x=>x!==name) : [...prev, name]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <button 
            className={`cyber-button text-xs ${searchMode === "ana" ? "bg-cyan-500/30" : ""}`}
            onClick={() => setSearchMode("ana")}
          >
            Ana's Index
          </button>
          <button 
            className={`cyber-button text-xs ${searchMode === "aylid" ? "bg-cyan-500/30" : ""}`}
            onClick={() => setSearchMode("aylid")}
          >
            Aylid Lexicon
          </button>
        </div>
        <button className="cyber-button text-xs" onClick={()=>setShowCredit(s=>!s)}>
          credit
        </button>
        {showCredit && (
          <div className="text-xs text-zinc-400">
            {searchMode === "ana" 
              ? <>Based on work by <a className="underline" href="https://github.com/ana-goge/Forgotten-Languages-Analysis" target="_blank">ana-goge</a>. Logic mirrored; UI restyled.</>
              : <>Aylid-English lexicon from <a className="underline" href="https://docs.google.com/spreadsheets/d/1YO8j5TuaZjv1ahiPAwP2hIhmbPfuYW0SIKti8BNMOjU/edit" target="_blank">FL community research</a>.</>
            }
          </div>
        )}
      </div>

      {searchMode === "ana" ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="cyber-input" placeholder="Keyword…" value={q} onChange={e=>setQ(e.target.value)} />
          <div className="cyber-input flex gap-2 flex-wrap items-center">
            {["title","author","tags","english_text","full_text"].map(f=>(
              <label key={f} className="text-xs flex items-center gap-1">
                <input type="checkbox" checked={fields.includes(f)} onChange={()=>toggleField(f)} />
                {f}
              </label>
            ))}
          </div>
          <input className="cyber-input" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          <input className="cyber-input" type="date" value={to}   onChange={e=>setTo(e.target.value)} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <input 
            className="cyber-input" 
            placeholder="Search Aylid or English..." 
            value={q} 
            onChange={e=>setQ(e.target.value)} 
          />
          <div className="text-xs text-zinc-400 font-mono">
            📚 {aylidLexicon.length} entries loaded • Search by Aylid term or English translation
          </div>
        </div>
      )}

      <button onClick={search} className="cyber-button">Search</button>

      <div className="cyber-border">
        {searchMode === "ana" ? (
          <>
            <div className="grid grid-cols-[150px_1fr_160px] px-3 py-2 text-xs text-zinc-400 border-b border-white/10">
              <div>Date</div><div>Title</div><div>Author</div>
            </div>
            {rows.map((r, i)=> (
              <div key={i} className="border-b border-white/5">
                <div className="grid grid-cols-[150px_1fr_160px] px-3 py-2 cursor-pointer hover:bg-white/5" onClick={()=>setOpen(open===i?null:i)}>
                  <div className="text-zinc-300">{r.date_posted?.slice(0,10) || "—"}</div>
                  <div className="text-zinc-100">{r.title || "—"}</div>
                  <div className="text-zinc-400">{r.author || "—"}</div>
                </div>
                {open===i && (
                  <div className="p-3 bg-white/5">
                    <div className="text-xs text-zinc-400 mb-2">Tags: {r.tags || "—"}</div>
                    <details className="mb-2">
                      <summary className="cursor-pointer">English Text</summary>
                      <pre className="whitespace-pre-wrap text-sm text-zinc-200">{r.english_text || "—"}</pre>
                    </details>
                    <details>
                      <summary className="cursor-pointer">Full Text</summary>
                      <pre className="whitespace-pre-wrap text-sm text-zinc-200">{r.full_text || "—"}</pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
            {rows.length===0 && (
              <div className="p-6 text-sm text-zinc-400">No results — adjust your query/fields/dates.</div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_1fr_80px_60px] px-3 py-2 text-xs text-zinc-400 border-b border-white/10">
              <div>Aylid</div><div>English</div><div>Confidence</div><div>Notes</div>
            </div>
            {lexiconResults.map((entry, i)=> (
              <div key={i} className="grid grid-cols-[1fr_1fr_80px_60px] px-3 py-2 border-b border-white/5 hover:bg-white/5">
                <div className="text-cyan-300 font-mono">{entry.aylid}</div>
                <div className="text-zinc-100">{entry.english}</div>
                <div className={`text-center ${
                  entry.confidence >= 0.9 ? 'text-terminal-green' :
                  entry.confidence >= 0.7 ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {Math.round(entry.confidence * 100)}%
                </div>
                <div className="text-xs text-zinc-500">{entry.notes}</div>
              </div>
            ))}
            {lexiconResults.length===0 && q.trim() && (
              <div className="p-6 text-sm text-zinc-400">No lexicon matches found for "{q}"</div>
            )}
            {lexiconResults.length===0 && !q.trim() && (
              <div className="p-6 text-sm text-zinc-400">Enter search term to find Aylid-English translations</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
