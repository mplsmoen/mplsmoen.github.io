// Fetches team RSS feeds and writes news-extra.json for the page (run by .github/workflows/news.yml).
// Edit FEEDS to add, remove or fix a feed. "team" is the page's section id:
// vikings, timberwolves, twins, wild, united, lynx, gophers
import {readFileSync, writeFileSync} from "node:fs";

const OUT = process.env.OUT || "news-extra.json";
const NYT = "https://www.nytimes.com/athletic/rss/";
const PP = "https://www.twincities.com/sports/";

const FEEDS = [
  {team: "twins", src: "The Athletic", url: NYT + "mlb/twins/"},
  {team: "timberwolves", src: "The Athletic", url: NYT + "nba/timberwolves/"},
  {team: "wild", src: "The Athletic", url: NYT + "nhl/wild/"},
  {team: "twins", src: "Twins Daily", url: "https://twinsdaily.com/news-rumors/minnesota-twins/?d=1&rss=1"},
  {team: "gophers", src: "The Daily Gopher", url: "https://www.thedailygopher.com/rss/index.xml"}, // if this fails, try /rss/current
  // Pioneer Press addresses below are best guesses: check the Actions log and fix any that fail.
  ...[["vikings", "nfl/minnesota-vikings"], ["timberwolves", "nba/minnesota-timberwolves"], ["twins", "mlb/minnesota-twins"],
      ["wild", "nhl/minnesota-wild"], ["lynx", "wnba/minnesota-lynx"], ["united", "soccer/minnesota-united-fc"],
      ["gophers", "college/gophers"]].map(([team, p]) => ({team, src: "Pioneer Press", url: PP + p + "/feed/"})),
];

const dec = s => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&#0?39;|&apos;/g, "'").replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n)).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
const tag = (x, t) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, "i")); return m ? dec(m[1]) : ""; };

export function parseFeed(xml) {
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  return blocks.map(b => {
    let url = tag(b, "link");
    if (!url) { const m = b.match(/<link[^>]*href="([^"]+)"/i); url = m ? m[1] : ""; }
    const d = new Date(tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date"));
    const desc = (tag(b, "description") || tag(b, "summary")).replace(/\s+/g, " ").trim();
    return {title: tag(b, "title"), url, ts: isNaN(d) ? null : d.toISOString(), desc: desc.length > 400 ? desc.slice(0, 400) : desc};
  }).filter(i => i.title && i.url && i.ts);
}

async function main() {
  let prev = {items: [], status: {}};
  try { prev = JSON.parse(readFileSync(OUT, "utf8")); } catch {}
  const status = {}, items = [];
  await Promise.all(FEEDS.map(async f => {
    const key = `${f.team}|${f.src}`;
    try {
      const r = await fetch(f.url, {headers: {"user-agent": "Mozilla/5.0 (compatible; mn-sports-headlines/1.0)", accept: "application/rss+xml, application/xml, text/xml, */*"}, signal: AbortSignal.timeout(20000)});
      if (!r.ok) throw new Error("HTTP " + r.status);
      const got = parseFeed(await r.text()).sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, 15);
      if (!got.length) throw new Error("no items found");
      got.forEach(i => items.push({team: f.team, src: f.src, ...i}));
      status[key] = "ok " + got.length;
    } catch (e) {
      status[key] = "error: " + e.message;
      (prev.items || []).filter(i => i.team === f.team && i.src === f.src).forEach(i => items.push(i)); // keep the last good copy
    }
    console.log(key, status[key]);
  }));
  items.sort((a, b) => b.ts.localeCompare(a.ts));
  const same = JSON.stringify({items, status}) === JSON.stringify({items: prev.items, status: prev.status});
  if (same) return console.log("No changes");
  writeFileSync(OUT, JSON.stringify({updated: new Date().toISOString(), status, items}, null, 1));
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) main();
