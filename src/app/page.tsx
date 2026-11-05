"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Bookmark, Bot, ChartNoAxesCombined,
  Check, ChevronDown, CircleHelp, Clock3, Command, Compass, Crosshair, Database, Filter, Flame,
  Gauge, Globe2, Layers3, Lightbulb, Menu, MoreHorizontal, Play, Plus, Search, Send, Settings2,
  Sparkles, Target, TrendingUp, Video, WandSparkles, X, Youtube, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { activitySeries, categories, demoTrends, subcategories, type Platform, type Trend } from "@/lib/demo-data";

const navItems: { label: string; icon: LucideIcon; group?: string }[] = [
  { label: "Overview", icon: Layers3, group: "WORKSPACE" },
  { label: "Live Trends", icon: Activity },
  { label: "Platform Activity", icon: ChartNoAxesCombined },
  { label: "Video Potential", icon: Gauge },
  { label: "AI Content Lab", icon: WandSparkles, group: "CREATE" },
  { label: "Creator Radar", icon: Crosshair },
  { label: "Competitor Tracker", icon: Target },
  { label: "Saved Trends", icon: Bookmark, group: "LIBRARY" },
  { label: "Alerts", icon: Zap },
  { label: "Growth Planner", icon: TrendingUp },
  { label: "Settings", icon: Settings2, group: "PREFERENCES" },
];

const platformOptions = ["All platforms", "YouTube", "TikTok", "X"] as const;
const periodOptions = ["1 hour", "6 hours", "24 hours", "7 days", "30 days"] as const;
const regions = ["Global", "Chile", "Argentina", "Mexico", "United States", "Spain"];

function scoreColor(score: number) {
  if (score >= 80) return "mint";
  if (score >= 60) return "blue";
  return "amber";
}

function formatCount(value: number) {
  return new Intl.NumberFormat("es-CL", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function Sparkline({ values, color = "#9b8cff" }: { values: number[]; color?: string }) {
  const points = values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 100},${36 - (value / 100) * 32}`).join(" ");
  return <svg className="sparkline" viewBox="0 0 100 38" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function PlatformMark({ platform }: { platform: Platform }) {
  if (platform === "YouTube") return <span className="platform-mark youtube"><Youtube size={12} /></span>;
  if (platform === "TikTok") return <span className="platform-mark tiktok">♪</span>;
  return <span className="platform-mark xmark">𝕏</span>;
}

function TrendCard({ trend, onOpen, saved, onSave }: { trend: Trend; onOpen: (trend: Trend) => void; saved: boolean; onSave: (id: string) => void }) {
  return (
    <article className="trend-card">
      <div className="trend-art" onClick={() => onOpen(trend)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") onOpen(trend); }}>
        <div className={`art-orbit art-${trend.id}`}><span>{trend.category === "Gaming" ? "◈" : trend.category === "Technology" ? "⌘" : trend.category === "Lifestyle" ? "✳" : "✦"}</span></div>
        <div className="art-bottom"><span>{trend.category}</span><span className="demo-mini">DEMO DATA</span></div>
      </div>
      <div className="trend-card-body">
        <div className="trend-title-row"><div><div className="eyebrow">{trend.subcategory}</div><h3>{trend.name}</h3></div><button className={`icon-button save-button ${saved ? "is-saved" : ""}`} aria-label={saved ? "Quitar de guardados" : "Guardar tendencia"} onClick={() => onSave(trend.id)}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /></button></div>
        <div className="platform-row">{trend.platforms.map((platform) => <PlatformMark key={platform} platform={platform} />)}<span className="dot-separator" /> <span className={`status-pill status-${trend.status.toLowerCase()}`}>{trend.status}</span></div>
        <div className="trend-metrics">
          <div><span>Trend score</span><strong className={`score-${scoreColor(trend.trendScore)}`}>{trend.trendScore}<small>/100</small></strong></div>
          <div><span>Opportunity</span><strong className={`score-${scoreColor(trend.opportunityScore)}`}>{trend.opportunityScore}<small>/100</small></strong></div>
          <div><span>Saturation</span><strong className={trend.saturationScore > 65 ? "score-rose" : "score-muted"}>{trend.saturationScore}<small>/100</small></strong></div>
        </div>
        <div className="trend-chart"><Sparkline values={trend.series} color={trend.growth >= 0 ? "#42d6a1" : "#fb7185"} /><span className={trend.growth >= 0 ? "growth-up" : "growth-down"}>{trend.growth > 0 ? "+" : ""}{trend.growth}%</span></div>
        <div className="trend-card-footer"><span><Activity size={13} /> {formatCount(trend.analyzedPosts)} señales</span><span><Clock3 size={13} /> {trend.updatedAt}</span></div>
      </div>
    </article>
  );
}

function MetricCard({ title, value, delta, detail, icon: Icon, tone = "purple" }: { title: string; value: string; delta: string; detail: string; icon: LucideIcon; tone?: string }) {
  return <div className="metric-card"><div className="metric-top"><span>{title}</span><span className={`metric-icon ${tone}`}><Icon size={17} /></span></div><div className="metric-value">{value}</div><div className="metric-foot"><span className="metric-delta"><ArrowUpRight size={13} /> {delta}</span><span>{detail}</span></div></div>;
}

export default function Home() {
  const [activePage, setActivePage] = useState("Overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [subcategory, setSubcategory] = useState("All subcategories");
  const [platform, setPlatform] = useState<(typeof platformOptions)[number]>("All platforms");
  const [period, setPeriod] = useState<(typeof periodOptions)[number]>("24 hours");
  const [region, setRegion] = useState("Chile");
  const [sort, setSort] = useState("Opportunity");
  const [formatFilter, setFormatFilter] = useState("All formats");
  const [competitionFilter, setCompetitionFilter] = useState("Any competition");
  const [languageFilter, setLanguageFilter] = useState("All languages");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [script, setScript] = useState("");
  const [ideaTopic, setIdeaTopic] = useState("Minecraft: survival con una sola regla");
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [followers, setFollowers] = useState("2500");
  const [averageViews, setAverageViews] = useState("1800");
  const [videoTitle, setVideoTitle] = useState("");
  const [simulation, setSimulation] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try { setSavedIds(JSON.parse(localStorage.getItem("at-saved-trends") || "[]")); } catch { setSavedIds([]); }
  }, []);
  useEffect(() => { localStorage.setItem("at-saved-trends", JSON.stringify(savedIds)); }, [savedIds]);

  const filteredTrends = useMemo(() => {
    let result = [...demoTrends].filter((trend) => {
      const matchesSearch = `${trend.name} ${trend.category} ${trend.subcategory} ${trend.keywords.join(" ")}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All categories" || trend.category === category;
      const matchesSub = subcategory === "All subcategories" || trend.subcategory === subcategory;
      const matchesPlatform = platform === "All platforms" || trend.platforms.includes(platform as Platform);
      const periodHours: Record<string, number> = { "1 hour": 1, "6 hours": 6, "24 hours": 24, "7 days": 168, "30 days": 720 };
      const matchesPeriod = trend.ageHours <= periodHours[period];
      const matchesRegion = region === "Global" || trend.regions.includes(region);
      const matchesFormat = formatFilter === "All formats" || trend.format === (formatFilter === "Short video" ? "Short" : formatFilter === "Long video" ? "Long" : "Live");
      const competition = trend.saturationScore <= 33 ? "Low" : trend.saturationScore <= 65 ? "Medium" : "High";
      const matchesCompetition = competitionFilter === "Any competition" || competition === competitionFilter;
      const matchesLanguage = languageFilter === "All languages" || trend.language === (languageFilter === "Spanish" ? "es" : "en");
      const matchesSaved = activePage !== "Saved Trends" || savedIds.includes(trend.id);
      return matchesSearch && matchesCategory && matchesSub && matchesPlatform && matchesPeriod && matchesRegion && matchesFormat && matchesCompetition && matchesLanguage && matchesSaved;
    });
    if (sort === "Opportunity") result.sort((a, b) => b.opportunityScore - a.opportunityScore);
    if (sort === "Growth") result.sort((a, b) => b.growth - a.growth);
    if (sort === "Lowest saturation") result.sort((a, b) => a.saturationScore - b.saturationScore);
    if (sort === "Trend score") result.sort((a, b) => b.trendScore - a.trendScore);
    return result;
  }, [search, category, subcategory, platform, sort, activePage, savedIds, period, region, formatFilter, competitionFilter, languageFilter]);

  const toggleSaved = (id: string) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const announce = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2600); };

  function generateIdeas() {
    const topic = ideaTopic.trim() || "esta tendencia";
    setGeneratedIdeas([
      `El experimento que nadie está haciendo con ${topic.toLowerCase()}`,
      `Probé ${topic.toLowerCase()} con una regla absurda: esto cambió todo`,
      `3 errores que comete casi todo el mundo con ${topic.toLowerCase()}`,
      `De cero a resultado: una historia real alrededor de ${topic.toLowerCase()}`,
      `La versión que todavía no has visto de ${topic.toLowerCase()}`,
    ]);
    announce("Ideas de ejemplo generadas en modo DEMO.");
  }

  function runSimulation() {
    const avg = Math.max(0, Number(averageViews) || 0);
    if (!avg || !Number(followers)) { announce("Completa seguidores y promedio de visualizaciones."); return; }
    setSimulation(true);
  }

  const activeCategorySubs = subcategories[category] || [];
  const isTrendArea = ["Overview", "Live Trends", "Saved Trends"].includes(activePage);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Activity size={20} strokeWidth={2.6} /></div><div className="brand-name">algorithm<span>tracker</span><small>CREATOR INTELLIGENCE</small></div><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Cerrar menú"><X size={18} /></button></div>
        <div className="workspace-switch"><div className="workspace-avatar">S</div><div><strong>Silver Studio</strong><span>Free workspace</span></div><ChevronDown size={15} /></div>
        <nav className="side-nav">
          {navItems.map((item) => <div key={item.label}>{item.group && <div className="nav-group-label">{item.group}</div>}<button className={`nav-link ${activePage === item.label ? "active" : ""}`} onClick={() => { setActivePage(item.label); setMobileNavOpen(false); setSelectedTrend(null); }}><item.icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.label === "Alerts" && <span className="nav-count">2</span>}</button></div>)}
        </nav>
        <div className="sidebar-bottom"><div className="usage-card"><div className="usage-head"><span>Workspace usage</span><span>72%</span></div><div className="usage-track"><div /></div><p>Demo workspace · sin límites de API</p></div><button className="profile-row" onClick={() => setActivePage("Settings")}><div className="profile-avatar">SD</div><div><strong>Silver Disc</strong><span>Creator account</span></div><MoreHorizontal size={18} /></button></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)} aria-label="Abrir menú"><Menu size={19} /></button><div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div></div><div className="topbar-right"><label className="global-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar tendencias, temas..." /><kbd><Command size={10} /> K</kbd></label><select className="top-select region-select" value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Región">{regions.map((place) => <option key={place}>{place}</option>)}</select><div className="connection-status"><span className="status-dot" /> DEMO MODE</div><button className="top-icon icon-button" aria-label="Ayuda" onClick={() => announce("Los datos actuales son demostrativos y no representan actividad en vivo.")}><CircleHelp size={17} /></button><div className="top-avatar">SD</div></div></header>

        <div className="page-content">
          <div className="page-heading"><div><div className="eyebrow page-kicker"><span className="live-indicator" /> CREATOR INTELLIGENCE PLATFORM</div><h1>{activePage === "Overview" ? "Descubre dónde está la oportunidad." : activePage}</h1><p>{activePage === "Overview" ? "Señales de contenido para tomar mejores decisiones, antes de publicar." : pageDescription(activePage)}</p></div><div className="heading-actions"><div className="period-select"><Clock3 size={15} /><select value={period} onChange={(e) => setPeriod(e.target.value as typeof period)} aria-label="Período">{periodOptions.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></div><button className="button button-primary" onClick={() => setActivePage("Live Trends")}><Compass size={16} /> Explorar tendencias</button></div></div>

          <div className="demo-banner"><div className="demo-banner-icon"><Database size={16} /></div><div><strong>Entorno de demostración</strong><span>Los datos visibles son ilustrativos. Las integraciones reales todavía no están conectadas.</span></div><button onClick={() => setActivePage("Settings")}>Ver conexiones <ArrowRight size={14} /></button></div>

          {activePage === "Overview" && <>
            <section className="metric-grid">
              <MetricCard title="Tendencias detectadas" value="1,284" delta="+18.6%" detail="vs. período anterior" icon={Activity} tone="purple" />
              <MetricCard title="Oportunidades altas" value="86" delta="+12.2%" detail="score superior a 80" icon={Target} tone="green" />
              <MetricCard title="Señales multiplataforma" value="342" delta="+8.4%" detail="en 2 o más plataformas" icon={Globe2} tone="blue" />
              <MetricCard title="Emergentes ahora" value="24" delta="+4 nuevas" detail="en las últimas 6 horas" icon={Flame} tone="orange" />
            </section>
            <div className="overview-grid">
              <section className="panel activity-panel"><div className="panel-heading"><div><div className="eyebrow">MOMENTUM OVERVIEW</div><h2>Actividad de tendencias</h2><p>Índice normalizado por plataforma · últimas 24 horas</p></div><button className="subtle-button" onClick={() => setActivePage("Platform Activity")}>Ver actividad <ArrowRight size={14} /></button></div><div className="chart-legend"><span><i className="legend-dot yt" /> YouTube</span><span><i className="legend-dot tt" /> TikTok</span><span><i className="legend-dot xx" /> X</span><span className="chart-caption">Índice relativo · DEMO</span></div><div className="main-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activitySeries} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}><defs><linearGradient id="youtubeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b7cff" stopOpacity={0.22} /><stop offset="95%" stopColor="#8b7cff" stopOpacity={0} /></linearGradient><linearGradient id="tiktokFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#39c5d9" stopOpacity={0.14} /><stop offset="95%" stopColor="#39c5d9" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#252a38" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="time" tick={{ fill: "#727b91", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#727b91", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} /><Tooltip contentStyle={{ background: "#171b27", border: "1px solid #303748", borderRadius: 10, color: "#f4f5fb", fontSize: 12 }} /><Area type="monotone" dataKey="youtube" name="YouTube" stroke="#9b8cff" strokeWidth={2.3} fill="url(#youtubeFill)" /><Area type="monotone" dataKey="tiktok" name="TikTok" stroke="#3bc7d9" strokeWidth={2.3} fill="url(#tiktokFill)" /><Line type="monotone" dataKey="x" name="X" stroke="#e0a7ff" strokeWidth={2} dot={false} /></AreaChart></ResponsiveContainer></div><div className="chart-footnote"><span><span className="status-dot" /> Actualización de demo: hace 4 min</span><span>Los índices no representan volúmenes brutos comparables.</span></div></section>
              <section className="panel opportunity-panel"><div className="panel-heading"><div><div className="eyebrow">CREATOR ADVANTAGE</div><h2>Tu radar de oportunidad</h2><p>Señales con menor competencia relativa.</p></div><span className="panel-icon"><Sparkles size={17} /></span></div><div className="opportunity-feature"><div className="opportunity-number">94<span>/100</span></div><div><strong>Minecraft: una sola regla</strong><p>Alto crecimiento con saturación todavía baja.</p></div><div className="opportunity-bar"><span style={{ width: "94%" }} /></div><div className="opportunity-meta"><span>Opportunity score</span><span className="score-mint">Muy alta</span></div></div><div className="opportunity-list"><div><span className="opportunity-rank">02</span><span><strong>Pokémon · equipos temáticos</strong><small>Gaming · Emerging</small></span><b className="score-mint">91</b></div><div><span className="opportunity-rank">03</span><span><strong>IA · prototipos rápidos</strong><small>Technology · Rising</small></span><b className="score-blue">88</b></div></div><button className="text-link" onClick={() => setActivePage("Live Trends")}>Ver todas las oportunidades <ArrowRight size={14} /></button></section>
            </div>
            <section className="section-block"><div className="section-header"><div><div className="eyebrow">SIGNALS TO WATCH</div><h2>Tendencias destacadas</h2><p>Oportunidades ordenadas para creadores en crecimiento.</p></div><button className="subtle-button" onClick={() => setActivePage("Live Trends")}>Ver todas <ArrowRight size={14} /></button></div><div className="trend-grid">{[...demoTrends].sort((a,b) => b.opportunityScore-a.opportunityScore).slice(0,3).map((trend) => <TrendCard key={trend.id} trend={trend} onOpen={setSelectedTrend} saved={savedIds.includes(trend.id)} onSave={toggleSaved} />)}</div></section>
          </>}

          {isTrendArea && activePage !== "Overview" && <section className="section-block trends-page"><div className="filter-toolbar"><div className="filter-left"><div className="filter-select-wrap"><Filter size={15} /><select value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory("All subcategories"); }} aria-label="Categoría"><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></div>{activeCategorySubs.length > 0 && <div className="filter-select-wrap"><select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} aria-label="Subcategoría"><option>All subcategories</option>{activeCategorySubs.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></div>}<div className="filter-select-wrap"><select value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)} aria-label="Plataforma">{platformOptions.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></div><button className={`filter-more ${showFilters ? "active" : ""}`} onClick={() => setShowFilters(!showFilters)}><Plus size={14} /> Más filtros</button></div><div className="sort-select"><span>Ordenar por</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Opportunity</option><option>Growth</option><option>Lowest saturation</option><option>Trend score</option></select></div></div>{showFilters && <div className="advanced-filters"><span>Formato <select value={formatFilter} onChange={(e)=>setFormatFilter(e.target.value)}><option>All formats</option><option>Short video</option><option>Long video</option><option>Live</option></select></span><span>Competencia <select value={competitionFilter} onChange={(e)=>setCompetitionFilter(e.target.value)}><option>Any competition</option><option>Low</option><option>Medium</option><option>High</option></select></span><span>Idioma <select value={languageFilter} onChange={(e)=>setLanguageFilter(e.target.value)}><option>All languages</option><option>Spanish</option><option>English</option></select></span><span className="filter-note">Competencia estimada a partir de la saturación DEMO.</span></div>}<div className="results-heading"><div><h2>{activePage === "Saved Trends" ? "Tu biblioteca" : "Live trends"} <span>{filteredTrends.length}</span></h2><p>{activePage === "Saved Trends" ? "Tendencias que guardaste para revisar después." : `Señales detectadas en ${region} durante ${period.toLowerCase()}.`}</p></div><div className="results-note"><span className="status-dot" /> Datos de demostración</div></div>{filteredTrends.length ? <div className="trend-grid">{filteredTrends.map((trend) => <TrendCard key={trend.id} trend={trend} onOpen={setSelectedTrend} saved={savedIds.includes(trend.id)} onSave={toggleSaved} />)}</div> : <div className="empty-state"><div><Bookmark size={24} /></div><h3>No hay tendencias para mostrar</h3><p>Prueba con otra categoría o guarda una tendencia desde Live Trends.</p><button className="button button-secondary" onClick={() => { setActivePage("Live Trends"); setCategory("All categories"); setPlatform("All platforms"); }}>Explorar tendencias</button></div>}</section>}

          {activePage === "Platform Activity" && <div className="platform-page"><div className="platform-cards">{[{name:"YouTube",desc:"Descubrimiento de vídeos y señales públicas",color:"youtube",icon:Youtube,state:"DEMO ADAPTER"},{name:"TikTok",desc:"Tendencias y formatos con acceso autorizado",color:"tiktok",icon:Activity,state:"NO CONECTADO"},{name:"X",desc:"Conversaciones públicas y palabras clave",color:"xplatform",icon:Zap,state:"DEMO ADAPTER"}].map((item) => <div className="platform-card" key={item.name}><div className={`platform-large ${item.color}`}><item.icon size={20}/></div><span className="platform-state">{item.state}</span><h3>{item.name}</h3><p>{item.desc}</p><button className="text-link" onClick={() => announce(`${item.name}: ${item.state}. Revisa Settings para configurar credenciales.`)}>Ver detalles <ArrowRight size={14}/></button></div>)}</div><section className="panel activity-detail"><div className="panel-heading"><div><div className="eyebrow">CROSS-PLATFORM SIGNAL</div><h2>Comparación de actividad</h2><p>Índice normalizado de ejemplo · no son interacciones brutas</p></div><span className="demo-mini">DEMO</span></div><div className="large-activity-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={activitySeries} margin={{top:10,right:15,left:-20,bottom:0}}><CartesianGrid stroke="#252a38" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="time" tick={{fill:"#727b91",fontSize:11}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{fill:"#727b91",fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#171b27",border:"1px solid #303748",borderRadius:10,fontSize:12}}/><Line type="monotone" dataKey="youtube" stroke="#9b8cff" strokeWidth={2.5}/><Line type="monotone" dataKey="tiktok" stroke="#3bc7d9" strokeWidth={2.5}/><Line type="monotone" dataKey="x" stroke="#e0a7ff" strokeWidth={2.5}/></LineChart></ResponsiveContainer></div><p className="chart-explainer"><AlertTriangle size={14}/> Los proveedores reales aún no están conectados. La comparación utiliza exclusivamente la serie ilustrativa del entorno DEMO.</p></section></div>}

          {activePage === "AI Content Lab" && <div className="tool-layout"><section className="panel tool-main"><div className="tool-title-icon"><WandSparkles size={20}/></div><div className="eyebrow">IDEA GENERATOR</div><h2>Encuentra un ángulo propio.</h2><p>Parte de una señal y crea enfoques que aporten algo diferente, no una copia del vídeo popular.</p><label className="field-label">Tendencia o tema</label><input className="field-input" value={ideaTopic} onChange={(e)=>setIdeaTopic(e.target.value)} placeholder="Escribe una tendencia..."/><label className="field-label">Contexto adicional <span>opcional</span></label><textarea className="field-input field-textarea" value={script} onChange={(e)=>setScript(e.target.value)} placeholder="Tu audiencia, tono, recursos o enfoque personal..."/><button className="button button-primary generate-button" onClick={generateIdeas}><Sparkles size={16}/> Generar ideas <ArrowRight size={15}/></button><div className="inline-disclaimer"><Database size={14}/> Generación local de ejemplo · conecta un proveedor de IA para resultados reales.</div></section><section className="panel generated-panel"><div className="panel-heading"><div><div className="eyebrow">CONTENT DIRECTIONS</div><h2>Ideas para explorar</h2></div><span className="demo-mini">DEMO</span></div>{generatedIdeas.length ? <div className="generated-list">{generatedIdeas.map((idea,index)=><div className="generated-idea" key={idea}><span>0{index+1}</span><div><strong>{idea}</strong><small>{index===0?"Curiosidad + contraste":index===1?"Experimento + historia":index===2?"Utilidad + autoridad":index===3?"Storytelling": "Diferenciación"}</small></div><button className="icon-button" onClick={()=>{navigator.clipboard?.writeText(idea);announce("Idea copiada.")}} aria-label="Copiar idea"><Plus size={15}/></button></div>)}</div>:<div className="empty-ideas"><div><Lightbulb size={24}/></div><strong>Tus próximas ideas empiezan aquí</strong><span>Selecciona una tendencia y genera cinco ángulos diferentes.</span></div>}</section></div>}

          {activePage === "Video Potential" && <div className="simulator-layout"><section className="panel simulator-form"><div className="eyebrow">VIDEO PERFORMANCE MODEL</div><h2>Simula tu próximo vídeo.</h2><p>Usa tu rendimiento histórico como punto de partida. Sin datos comparables no se calculará una probabilidad de éxito.</p><label className="field-label">Tendencia seleccionada</label><select className="field-input" value={ideaTopic} onChange={(e)=>setIdeaTopic(e.target.value)}>{demoTrends.map((trend)=><option key={trend.id}>{trend.name}</option>)}</select><div className="two-fields"><div><label className="field-label">Seguidores / suscriptores</label><input className="field-input" type="number" min="0" value={followers} onChange={(e)=>setFollowers(e.target.value)}/></div><div><label className="field-label">Promedio de views (20 vídeos)</label><input className="field-input" type="number" min="0" value={averageViews} onChange={(e)=>setAverageViews(e.target.value)}/></div></div><label className="field-label">Título provisional</label><input className="field-input" value={videoTitle} onChange={(e)=>setVideoTitle(e.target.value)} placeholder="Escribe un título para tu vídeo"/><label className="field-label">Guion o estructura</label><textarea className="field-input field-textarea tall" value={script} onChange={(e)=>setScript(e.target.value)} placeholder="Pega tu hook, desarrollo y cierre..."/><button className="button button-primary generate-button" onClick={runSimulation}><Gauge size={16}/> Analizar potencial <ArrowRight size={15}/></button><div className="inline-disclaimer"><AlertTriangle size={14}/> Sin histórico propio y benchmarks comparables, no se muestra una predicción de views ni una probabilidad inventada.</div></section><section className="panel simulator-results"><div className="panel-heading"><div><div className="eyebrow">YOUR VIDEO OUTLOOK</div><h2>Resultado del análisis</h2></div><span className="demo-mini">ORIENTATIVO</span></div>{simulation ? <div className="simulation-output"><div className="simulation-score"><span>Base histórica declarada</span><strong>{formatCount(Number(averageViews)||0)}</strong><small>views promedio · proporcionado por ti</small></div><div className="simulation-note"><Check size={17}/><div><strong>Referencia de partida disponible</strong><p>El promedio de tus últimos 20 vídeos se usa como baseline. Aún no existe un dataset comparable conectado para calcular escenarios conservador, central u optimista.</p></div></div><div className="simulation-checks"><div><span>Guion recibido</span><b>{script.trim()?"Sí":"Pendiente"}</b></div><div><span>Título recibido</span><b>{videoTitle.trim()?"Sí":"Pendiente"}</b></div><div><span>Benchmark externo</span><b>No disponible</b></div></div></div> : <div className="empty-ideas"><div><Gauge size={25}/></div><strong>Tu análisis aparecerá aquí</strong><span>Completa tus métricas y agrega el contexto de tu vídeo para iniciar.</span></div>}</section></div>}

          {activePage === "Creator Radar" && <section className="panel coming-panel"><div className="coming-icon"><Crosshair size={24}/></div><div className="eyebrow">CREATOR DISCOVERY</div><h2>Encuentra crecimiento antes de que sea evidente.</h2><p>El radar de creadores necesita fuentes públicas autorizadas e históricos suficientes para comparar el rendimiento relativo al tamaño de cada canal.</p><div className="coming-state"><Database size={15}/> Preparado para integrar · Sin perfiles reales cargados</div><button className="button button-secondary" onClick={()=>setActivePage("Settings")}>Revisar integraciones</button></section>}
          {activePage === "Competitor Tracker" && <section className="panel coming-panel"><div className="coming-icon"><Target size={24}/></div><div className="eyebrow">CHANNEL MONITORING</div><h2>Haz seguimiento de canales relevantes.</h2><p>La estructura está prevista para guardar perfiles públicos, publicaciones recientes y alertas de rendimiento inusual. No se consulta ningún perfil sin conectar primero una fuente autorizada.</p><div className="coming-state"><Database size={15}/> Sin canales conectados</div><button className="button button-secondary" onClick={()=>announce("El seguimiento de canales estará disponible al conectar proveedores.")}>Añadir canal <Plus size={15}/></button></section>}
          {activePage === "Alerts" && <section className="panel coming-panel"><div className="coming-icon"><Zap size={24}/></div><div className="eyebrow">SIGNAL MONITORING</div><h2>Recibe alertas cuando cambie el momento.</h2><p>Las reglas de alerta se conectarán al motor de tendencias y a los trabajos programados. Esta versión muestra la estructura, sin enviar notificaciones ficticias.</p><div className="alert-preview"><span className="status-pill status-rising">Rising</span><strong>Gaming · crecimiento por encima de tu umbral</strong><small>Ejemplo de regla · no activa</small></div><button className="button button-secondary" onClick={()=>announce("Las alertas se activarán al configurar una fuente de datos.")}>Crear regla <Plus size={15}/></button></section>}
          {activePage === "Growth Planner" && <section className="panel coming-panel"><div className="coming-icon"><TrendingUp size={24}/></div><div className="eyebrow">CREATOR WORKFLOW</div><h2>Convierte señales en un plan publicable.</h2><p>El planificador organizará ideas, formatos y fechas con estados de producción. Se habilitará al conectar el perfil del creador y el calendario de contenido.</p><div className="planner-states"><span>Pendiente</span><span>En producción</span><span>Publicado</span><span>Completado</span></div><button className="button button-secondary" onClick={()=>setActivePage("AI Content Lab")}>Crear primera idea <ArrowRight size={15}/></button></section>}
          {activePage === "Settings" && <div className="settings-layout"><section className="panel settings-panel"><div className="eyebrow">DATA PROVIDERS</div><h2>Conexiones de plataforma</h2><p>Las credenciales se configurarán en el servidor mediante variables de entorno. Nunca se exponen al navegador.</p>{[{name:"YouTube Data API v3",env:"YOUTUBE_API_KEY",desc:"Búsqueda y métricas públicas de vídeos."},{name:"TikTok",env:"TIKTOK_CLIENT_KEY",desc:"Requiere confirmar acceso comercial autorizado."},{name:"X API",env:"X_BEARER_TOKEN",desc:"Búsqueda de publicaciones según permisos del plan."},{name:"Supabase",env:"SUPABASE_SERVICE_ROLE_KEY",desc:"Autenticación, persistencia e históricos."},{name:"AI provider",env:"AI_API_KEY",desc:"Generación y análisis de contenido desde el servidor."}].map((provider)=><div className="connection-row" key={provider.name}><div className="connection-symbol"><Database size={17}/></div><div><strong>{provider.name}</strong><span>{provider.desc}</span><small>{provider.env}</small></div><span className="connection-badge">No configurado</span></div>)}</section><section className="panel settings-panel"><div className="eyebrow">SCORING MODEL</div><h2>Ponderaciones del motor</h2><p>Modelo inicial documentado en <code>src/lib/scoring.ts</code>. Normalizar antes de comparar.</p><div className="weight-row"><span>Velocidad de crecimiento</span><b>28%</b></div><div className="weight-row"><span>Aceleración</span><b>18%</b></div><div className="weight-row"><span>Engagement relativo</span><b>18%</b></div><div className="weight-row"><span>Recencia</span><b>14%</b></div><div className="weight-row"><span>Distribución multiplataforma</span><b>12%</b></div><div className="weight-row"><span>Menor saturación</span><b>10%</b></div><div className="scoring-footnote">Los pesos son una baseline de MVP, no una verdad estadística. Deben calibrarse con resultados observados.</div></section></div>}

          <footer className="page-footer"><span>ALGORITHM TRACKER <b>v0.1.0</b></span><span><span className="status-dot"/> Demo environment · Datos no conectados</span><a href="https://github.com/SilverWallDiscs" target="_blank" rel="noreferrer">GitHub profile <ArrowUpRight size={12}/></a></footer>
        </div>
      </main>

      {selectedTrend && <div className="modal-backdrop" onClick={()=>setSelectedTrend(null)}><section className="trend-modal" onClick={(e)=>e.stopPropagation()}><button className="modal-close icon-button" onClick={()=>setSelectedTrend(null)} aria-label="Cerrar"><X size={19}/></button><div className="modal-art"><div className={`art-orbit art-${selectedTrend.id}`}><span>✦</span></div><span className="demo-mini">DEMO DATA</span></div><div className="modal-content"><div className="eyebrow">{selectedTrend.category} / {selectedTrend.subcategory}</div><h2>{selectedTrend.name}</h2><p>{selectedTrend.description}</p><div className="modal-platforms">{selectedTrend.platforms.map((item)=><span key={item}><PlatformMark platform={item}/>{item}</span>)}</div><div className="modal-score-grid"><div><span>Trend score</span><strong className="score-mint">{selectedTrend.trendScore}<small>/100</small></strong></div><div><span>Opportunity score</span><strong className="score-blue">{selectedTrend.opportunityScore}<small>/100</small></strong></div><div><span>Saturation score</span><strong className="score-rose">{selectedTrend.saturationScore}<small>/100</small></strong></div></div><div className="modal-chart"><div className="eyebrow">RELATIVE MOMENTUM · DEMO</div><Sparkline values={selectedTrend.series} color="#9b8cff"/></div><div className="modal-facts"><div><span>Publicaciones analizadas</span><b>{formatCount(selectedTrend.analyzedPosts)}</b></div><div><span>Creadores detectados</span><b>{formatCount(selectedTrend.creators)}</b></div><div><span>Primera detección</span><b>{selectedTrend.detectedAt}</b></div><div><span>Última actualización</span><b>{selectedTrend.updatedAt}</b></div></div><div className="modal-disclaimer"><AlertTriangle size={14}/> Datos demostrativos. No representan mediciones actuales ni predicciones de rendimiento.</div><div className="modal-actions"><button className="button button-secondary" onClick={()=>toggleSaved(selectedTrend.id)}><Bookmark size={15}/>{savedIds.includes(selectedTrend.id)?"Guardada":"Guardar tendencia"}</button><button className="button button-primary" onClick={()=>{setIdeaTopic(selectedTrend.name);setSelectedTrend(null);setActivePage("AI Content Lab");}}>Crear ideas <WandSparkles size={15}/></button></div></div></section></div>}
      {notice && <div className="toast"><Check size={16}/>{notice}</div>}
    </div>
  );
}

function pageDescription(page: string) {
  const descriptions: Record<string,string> = {
    "Live Trends":"Explora señales emergentes y encuentra espacios con menos competencia.",
    "Platform Activity":"Compara la evolución relativa de temas entre plataformas.",
    "Video Potential":"Evalúa el guion y el punto de partida de tu canal sin prometer viralidad.",
    "AI Content Lab":"Transforma tendencias en ideas originales y enfoques diferenciados.",
    "Creator Radar":"Descubre creadores cuyo crecimiento supera su tamaño actual.",
    "Competitor Tracker":"Sigue canales públicos y detecta publicaciones fuera de lo habitual.",
    "Saved Trends":"Tu colección de temas para investigar y convertir en contenido.",
    "Alerts":"Define qué señales merecen tu atención.",
    "Growth Planner":"Organiza tus ideas en un calendario de publicación accionable.",
    "Settings":"Gestiona fuentes de datos, conexiones y preferencias del workspace.",
  };
  return descriptions[page] || "Inteligencia de contenido para crecer con mejores decisiones.";
}