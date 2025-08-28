import { useState } from "react";
export default function ExternalSearch() {
  const [baseUrl, setBaseUrl] = useState("https://forgotten-languages-search.streamlit.app/");
  const [q, setQ] = useState("");
  const url = q ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}q=${encodeURIComponent(q)}` : baseUrl;
  async function logOpen() {
    try {
      await fetch("/connectors/log-external", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ baseUrl, q, ts: new Date().toISOString() })
      });
    } catch {}
  }
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="p-3 bg-white/5 rounded-xl mb-2 grid grid-cols-[1fr_auto_auto] gap-2">
        <input className="bg-black/30 rounded px-3 py-2" placeholder="Search query…" value={q} onChange={e=>setQ(e.target.value)} />
        <input className="bg-black/30 rounded px-3 py-2" value={baseUrl} onChange={e=>setBaseUrl(e.target.value)} />
        <button onClick={logOpen} className="px-3 py-2 rounded bg-purple-500/30 hover:bg-purple-500/50">Open</button>
      </div>
      <iframe src={url} className="w-full h-full rounded-xl border border-white/10" />
    </div>
  );
}
