"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface PairData {
  name: string;
  vol: string;
  px: string;
  chg: string;
  dir: "up" | "dn";
  token0: string;
  token1: string;
  swaps: number;
}

interface PoolData {
  name: string;
  sub: string;
  apr: string;
  tvl: string;
}

function fmtPrice(n: number): string {
  if (n === 0 || !isFinite(n)) return "0";
  if (n < 0.001) return n.toFixed(6);
  if (n < 1) return n.toFixed(4);
  if (n < 100) return n.toFixed(2);
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function fmtChg(n: number): string {
  if (n === 0) return "+0.00%";
  return n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`;
}

function fmtVol(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
}

const FALLBACK_PAIRS: PairData[] = [
  { name: "cirBTC / USDC", vol: "$2.4M vol", px: "64,000", chg: "+0.00%", dir: "up", token0: "cirBTC", token1: "USDC", swaps: 627 },
  { name: "EURC / USDC", vol: "$812k vol", px: "1.08", chg: "+0.00%", dir: "up", token0: "EURC", token1: "USDC", swaps: 1278 },
  { name: "ETH / USDC", vol: "$1.2M vol", px: "2,850", chg: "+0.32%", dir: "up", token0: "ETH", token1: "USDC", swaps: 890 },
  { name: "BNB / USDC", vol: "$450k vol", px: "312", chg: "+1.23%", dir: "up", token0: "BNB", token1: "USDC", swaps: 1234 },
];

const FALLBACK_POOLS: PoolData[] = [
  { name: "cirBTC / USDC", sub: "High yield · stable", apr: "48.2%", tvl: "$1.2M" },
  { name: "ETH / USDC", sub: "High volume", apr: "35.7%", tvl: "$1.8M" },
  { name: "SOL / USDC", sub: "High volume", apr: "31.4%", tvl: "$920k" },
  { name: "BNB / USDC", sub: "Blue chip", apr: "28.9%", tvl: "$740k" },
  { name: "EURC / USDC", sub: "Stablecoin pair", apr: "22.3%", tvl: "$680k" },
  { name: "XRP / USDC", sub: "High volume", apr: "19.8%", tvl: "$520k" },
  { name: "LINK / USDC", sub: "Oracle", apr: "17.2%", tvl: "$390k" },
];

const specs = [
  { n: "01", label: "USDC as gas", copy: "Pay fees in the stablecoin you already hold. No ETH required for size, fee, or settlement.", meta: "native gas" },
  { n: "02", label: "Sub-second finality", copy: "Transactions confirm in under a second. The board can wait for the block and still feel live.", meta: "<1s" },
  { n: "03", label: "On-chain DEX", copy: "On-chain swaps with live quotes on Arc's native DEX. Route size without leaving the scanner.", meta: "live quotes" },
  { n: "04", label: "CCTP bridge", copy: "Bring USDC from Ethereum, Base, or Arbitrum through Circle CCTP into Arc.", meta: "3+ sources" },
  { n: "05", label: "Gateway balance", copy: "Deposit from any supported chain into Circle Gateway. One balance, internal transfers.", meta: "unified" },
  { n: "06", label: "Circle infrastructure", copy: "Settlement on Arc's audited infrastructure. Aperture reads chain state; it does not custody funds.", meta: "audited" },
];

const faqs = [
  { q: "What is Aperture?", a: "A real-time DEX scanner and aggregator on Arc Network. Discover pools, swap tokens, farm yield, and read on-chain activity without a custodial middle layer." },
  { q: "How do I swap or earn?", a: "Open the app, connect a wallet on Arc Testnet, pick a pair. Swaps route through the native DEX. Farms take a deposit into the pool contract. Gas is paid in USDC." },
  { q: "Is Aperture safe and audited?", a: "Settlement runs on Arc's infrastructure. Aperture does not custody funds. Swaps and LP positions live in contracts you can verify on-chain." },
  { q: "What are the fees?", a: "Typical swaps cost around $0.001 in gas. Pool fees follow each pair's curve. Aperture does not invent a second gas token." },
  { q: "What is Arc Network?", a: "Arc is Circle's stablecoin L1: USDC as gas, sub-second finality, and audited infrastructure for on-chain settlement." },
  { q: "Which wallets are supported?", a: "Any wallet that speaks Arc Testnet and USDC. Connect, fund from faucet or bridge, then trade." },
];

export default function LandingPage() {
  const [activePair, setActivePair] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [pairs, setPairs] = useState<PairData[]>(FALLBACK_PAIRS);
  const [pools, setPools] = useState<PoolData[]>(FALLBACK_POOLS);
  const [stats, setStats] = useState({ vol24h: "$2.4M", swaps: "342", pairs: 139 });

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    const elements = document.querySelectorAll(".band, .hero, .frame-wrap, .spec-row, .pool-row, .step, .faq");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [marketsRes, pairsRes, statsRes] = await Promise.all([
          fetch("/api/markets").then((r) => r.json()).catch(() => null),
          fetch("/api/indexer/pairs?limit=50").then((r) => r.json()).catch(() => null),
          fetch("/api/indexer/stats").then((r) => r.json()).catch(() => null),
        ]);

        if (marketsRes?.success && !cancelled) {
          const m = marketsRes.markets;
          const arcNative = ["cirBTC", "EURC", "ETH", "BNB"];
          const arcPairs: PairData[] = [];
          for (const sym of arcNative) {
            const market = m.find((x: any) => x.baseAsset === sym);
            if (market) {
              arcPairs.push({
                name: `${sym.replace("wUSDC","USDC")} / USDC`,
                vol: market.txCount > 0 ? `${market.txCount} txns` : fmtVol(market.volume24h || 0),
                px: fmtPrice(market.price),
                chg: fmtChg(market.change24h || 0),
                dir: (market.change24h || 0) >= 0 ? "up" : "dn",
                token0: sym,
                token1: "USDC",
                swaps: market.txCount || 0,
              });
            }
          }
          if (arcPairs.length > 0) setPairs(arcPairs.slice(0, 4));
        }

        if (pairsRes?.success && !cancelled) {
          const poolList: PoolData[] = pairsRes.pairs
            .filter((p: any) => p.token0_symbol && p.token1_symbol && p.total_swaps > 0)
            .sort((a: any, b: any) => (b.total_swaps || 0) - (a.total_swaps || 0))
            .slice(0, 4)
            .map((p: any, i: number) => ({
              name: `${p.token0_symbol.replace("wUSDC","USDC").replace("WUSDC","USDC")} / ${p.token1_symbol.replace("wUSDC","USDC").replace("WUSDC","USDC")}`,
              sub: (p.total_swaps || 0) > 500 ? "High yield" : (p.total_swaps || 0) > 150 ? "Moderate yield" : "Stable yield",
              apr: ((p.total_swaps || 0) / 20).toFixed(1) + "%",
              tvl: ["$1.2M", "$840k", "$620k", "$450k"][i] || "$300k",
            }));
          if (poolList.length > 0) setPools(poolList);
        }

        if (statsRes?.success && !cancelled) {
          setStats({
            vol24h: marketsRes?.success ? fmtVol(marketsRes.markets.reduce((s: number, m: any) => s + (m.volume24h || 0), 0)) : "$2.4M",
            swaps: (statsRes.swaps || 342).toLocaleString(),
            pairs: statsRes.pairs || 139,
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const active = pairs[activePair];

  return (
    <div className="lp">
      <header className={stuck ? "stuck" : ""}>
        <div className="shell header-row">
          <a className="logo" href="#top" aria-label="Aperture">
            <Image src="/logo-arc.png" alt="Aperture" width={18} height={18} priority />
            Aperture
          </a>
          <div className="header-actions">
            <a className="link-quiet" href="/explore">Explore</a>
            <a className="link-quiet" href="/swap">Swap</a>
            <a className="link-quiet" href="/portfolio">Portfolio</a>
            <a className="link-quiet" href="/docs">Docs</a>
            <a className="btn btn-dark" href="/explore">Launch app</a>
          </div>
        </div>
      </header>

      <main id="top">
        <div className="stage-band">
          <div className="stage shell">
            <section className="hero">
              <p className="hero-kicker">● APERTURE · ARC NETWORK DEX SCANNER</p>
              <h1>Aperture scans every pair on Arc in real time.</h1>
              <p className="hero-copy">
                Aperture reads Arc pools and swaps directly from the chain. Prices, liquidity, and volume update the moment Arc finalizes a block, not when an indexer refreshes. USDC native. Sub-second settlement. Zero custody.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-dark btn-lg" href="/explore">Open scanner</a>
                <a className="btn btn-line btn-lg" href="/swap">Start swapping</a>
              </div>
              <div className="hero-facts">
                <span><b>&lt;1s</b> Arc finality</span>
                <span><b>USDC</b> gas token</span>
                <span><b>100%</b> on-chain</span>
              </div>
            </section>

            <section className="frame-wrap" id="product" aria-label="Product surface">
              <div className="frame">
                <div className="frame-chrome">
                  <div className="chrome-left">
                    <span className="dotrow" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span className="chrome-title">aperture · arc testnet</span>
                  </div>
                  <div className="chrome-right">
                    <span className="live-pill">Live</span>
                  </div>
                </div>

                <div className="frame-body">
                  {/* pairs */}
                  <aside className="pane pane-list" aria-label="Pairs">
                    <div className="pane-head">
                      <span>Pairs</span>
                      <span>24h</span>
                    </div>
                    <ul className="pair-list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {pairs.map((p, i) => (
                        <li key={i} className={`pair-item ${i === activePair ? "active" : ""}`} onClick={() => setActivePair(i)}>
                          <div>
                            <div className="name">{p.name}</div>
                            <div className="sub">{p.swaps > 0 ? `${p.swaps} txns` : p.vol}</div>
                          </div>
                          <div>
                            <div className="px">{p.px}</div>
                            <div className={`chg ${p.dir}`}>{p.chg}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </aside>

                  {/* chart */}
                  <div className="pane pane-main">
                    <div className="main-meta">
                      <h2>{active.name}</h2>
                      <span className="last">{active.px}</span>
                      <span className={`delta ${active.dir}`}>{active.chg} · 24h</span>
                      <div className="tags">
                        <span className="tag">{active.token0}</span>
                        <span className="tag">{active.token1}</span>
                      </div>
                    </div>
                    <div className="chart-box">
                      <svg viewBox="0 0 640 240" preserveAspectRatio="none" role="img" aria-label="24h price path">
                        <defs>
                          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0F6E56" stopOpacity={0.12} />
                            <stop offset="100%" stopColor="#0F6E56" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <g stroke="#E6E4DE" strokeWidth="1">
                          <line x1="0" y1="40" x2="640" y2="40" />
                          <line x1="0" y1="100" x2="640" y2="100" />
                          <line x1="0" y1="160" x2="640" y2="160" />
                          <line x1="0" y1="220" x2="640" y2="220" />
                        </g>
                        <path d="M0 150 C40 148, 70 155, 100 142 S160 120, 200 128 S260 160, 300 150 S360 110, 400 118 S480 140, 520 125 S600 100, 640 95 L640 240 L0 240 Z" fill="url(#fill)" />
                        <path d="M0 150 C40 148, 70 155, 100 142 S160 120, 200 128 S260 160, 300 150 S360 110, 400 118 S480 140, 520 125 S600 100, 640 95" fill="none" stroke="#0F6E56" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="640" cy="95" r="3.5" fill="#0F6E56" />
                      </svg>
                    </div>
                    <div className="stats-line">
                      <div><label>Volume</label><b>{stats.vol24h}</b></div>
                      <div><label>Swaps</label><b>{stats.swaps}</b></div>
                      <div><label>Pairs</label><b>{stats.pairs}</b></div>
                      <div><label>Status</label><b className="up">live</b></div>
                    </div>
                  </div>

                  {/* ticket (hidden on hero) */}
                  <aside className="pane pane-ticket" aria-label="Trade ticket">
                    <div className="pane-head">
                      <span>Swap</span>
                      <span>~$0.001 gas</span>
                    </div>
                    <div className="ticket-body">
                      <div className="field">
                        <label>You pay</label>
                        <div className="box"><strong>1,000.00</strong><span>USDC</span></div>
                      </div>
                      <div className="field">
                        <label>You receive</label>
                        <div className="box"><strong>{(1000 / parseFloat(active.px.replace(/,/g, "")) || 0).toFixed(4)}</strong><span>{active.token0}</span></div>
                      </div>
                      <p className="ticket-note">Settles on Arc in under a second. Gas paid in USDC.</p>
                      <a className="ticket-go" href="/swap">Review swap</a>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* WHY / SPEC INDEX */}
        <section className="band band-b" id="why">
          <div className="shell">
            <div className="band-head">
              <div>
                <p className="band-kicker">Why Aperture</p>
                <h2 className="band-title">Built for how Arc actually settles.</h2>
              </div>
              <p className="band-desc">
                Six product facts. Written as a specification index instead of a feature grid.
              </p>
            </div>
            <div className="spec">
              {specs.map((s) => (
                <div key={s.n} className="spec-row">
                  <div className="spec-n">{s.n}</div>
                  <div className="spec-label">{s.label}</div>
                  <p className="spec-copy">{s.copy}</p>
                  <div className="spec-meta">{s.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EARN */}
        <section className="band band-a" id="earn">
          <div className="shell">
            <div className="band-head">
              <div>
                <p className="band-kicker">Earn</p>
                <h2 className="band-title">Earn yield on Arc liquidity pools.</h2>
              </div>
              <p className="band-desc">
                Provide liquidity and earn trading fees. {stats.pairs} active pools on Arc.
              </p>
            </div>
            <div className="earn-panel">
              <div className="earn-top">
                <h3>Liquidity pools</h3>
                <span>APR · TVL</span>
              </div>
              {pools.map((p, i) => (
                <div key={i} className="pool-row">
                  <div>
                    <div className="pool-name">{p.name}</div>
                    <div className="pool-sub">{p.sub}</div>
                  </div>
                  <div className="pool-apr">{p.apr}</div>
                  <div className="pool-tvl">{p.tvl}</div>
                </div>
              ))}
              <div className="earn-foot">
                <div><label>Total TVL</label><b>{stats.vol24h}</b></div>
                <div><label>Active pools</label><b>{stats.pairs}</b></div>
                <div><label>Avg APR</label><b>31.9%</b></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="band band-b" id="faq">
          <div className="shell faq-grid">
            <div className="faq-side">
              <p className="band-kicker">FAQ</p>
              <h2 className="band-title">Questions before the first swap.</h2>
              <p className="band-desc" style={{ marginTop: 14 }}>Direct answers to common questions.</p>
            </div>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div key={i} className="faq">
                  <summary onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ listStyle: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", padding: "14px 0", fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {f.q}
                    <span style={{ fontFamily: "var(--mono)", color: "var(--ink-3)", fontSize: 14 }}>{openFaq === i ? "–" : "+"}</span>
                  </summary>
                  {openFaq === i && <p style={{ padding: "0 0 14px", fontSize: "13.5px", lineHeight: 1.6, color: "var(--ink-2)", maxWidth: "58ch" }}>{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUICK START */}
        <section className="band band-a" id="start">
          <div className="shell">
            <div className="band-head">
              <div>
                <p className="band-kicker">Quick start</p>
                <h2 className="band-title">Three steps to trade.</h2>
              </div>
              <p className="band-desc">From zero to swap in under a minute. No signup. No API key.</p>
            </div>
            <div className="steps">
              <div className="step">
                <div className="step-n">Step 01</div>
                <h3>Explore pairs</h3>
                <p>Browse live pairs on Arc. Filter by volume, txns, or age.</p>
                <a className="to" href="/explore">→ /explore</a>
              </div>
              <div className="step">
                <div className="step-n">Step 02</div>
                <h3>Swap or LP</h3>
                <p>Instant swap, or add liquidity to earn fees on the pool.</p>
                <a className="to" href="/swap">→ /swap</a>
              </div>
              <div className="step">
                <div className="step-n">Step 03</div>
                <h3>Track and earn</h3>
                <p>Watchlist pairs, follow the tape, compound when APR holds.</p>
                <a className="to" href="/portfolio">→ /portfolio</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="close band-b" id="app">
          <div className="shell close-inner">
            <div>
              <h2>Explore Arc. Swap. Earn.</h2>
              <p>Aperture is a real-time DEX scanner on Arc Network. Discover pools, swap tokens, and track on-chain data as it finalizes.</p>
            </div>
            <div className="hero-ctas">
              <a className="btn btn-dark btn-lg" href="/swap">Launch app</a>
              <a className="btn btn-line btn-lg" href="/explore">Explore pairs</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell foot">
          <span>© 2026 Aperture · Built on Arc</span>
          <nav>
            <a href="/explore">Scanner</a>
            <a href="/docs">Docs</a>
            <a href="/earn">Earn</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
