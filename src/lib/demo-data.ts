export type Platform = "YouTube" | "TikTok" | "X";
export type TrendStatus = "Emerging" | "Rising" | "Peak" | "Saturated" | "Declining";
export type TrendFormat = "Short" | "Long" | "Live";

export interface Trend {
  id: string; name: string; category: string; subcategory: string; platforms: Platform[];
  trendScore: number; opportunityScore: number; saturationScore: number; growth: number;
  analyzedPosts: number; creators: number; detectedAt: string; updatedAt: string; ageHours: number;
  regions: string[]; language: "es" | "en"; status: TrendStatus; format: TrendFormat;
  description: string; audience: string; keywords: string[]; series: number[]; source: "DEMO";
}

export const categories = [
  "Gaming", "Vlogging", "Technology", "Entertainment", "Comedy", "Lifestyle", "Education",
  "Finance", "Music", "Sports", "News", "Beauty", "Fashion", "Food", "Travel",
  "Podcast", "Animation", "DIY", "Science"
];

export const subcategories: Record<string, string[]> = {
  Gaming: ["Minecraft", "Roblox", "Fortnite", "GTA", "Pokémon", "Indie games", "Gaming general"],
  Technology: ["AI tools", "Gadgets", "Software", "Cybersecurity"],
  Entertainment: ["Film & TV", "Internet culture", "Creators"],
  Education: ["Science explainers", "Tutorials", "Languages"],
  Music: ["Reactions", "Production", "Discoveries"]
};

export const demoTrends: Trend[] = [
  {
    id: "t-01", name: "Minecraft: survival con una sola regla", category: "Gaming", subcategory: "Minecraft",
    platforms: ["YouTube", "TikTok", "X"], trendScore: 91, opportunityScore: 94, saturationScore: 28,
    growth: 184, analyzedPosts: 12840, creators: 642, detectedAt: "Hace 36 min", updatedAt: "Hace 4 min",
    ageHours: 0.6, regions: ["Chile", "Argentina", "Mexico", "Global"], language: "es",
    status: "Rising", format: "Short", description: "Retos de supervivencia con una restricción simple y fácil de entender en los primeros segundos.",
    audience: "Gaming · 13–24", keywords: ["minecraft challenge", "one rule", "survival"],
    series: [18,21,25,24,33,42,49,66,74,91], source: "DEMO"
  },
  {
    id: "t-02", name: "IA que convierte ideas en prototipos", category: "Technology", subcategory: "AI tools",
    platforms: ["YouTube", "X"], trendScore: 86, opportunityScore: 88, saturationScore: 39,
    growth: 126, analyzedPosts: 8930, creators: 1104, detectedAt: "Hace 5 h", updatedAt: "Hace 8 min",
    ageHours: 3.2, regions: ["Chile", "United States", "Spain", "Global"], language: "en",
    status: "Rising", format: "Long", description: "Demostraciones prácticas de herramientas que llevan una idea desde cero hasta un prototipo visible.",
    audience: "Technology · 18–34", keywords: ["AI workflow", "build in public", "prototype"],
    series: [22,27,29,31,36,42,51,64,76,86], source: "DEMO"
  },
  {
    id: "t-03", name: "Pokémon: equipos temáticos inesperados", category: "Gaming", subcategory: "Pokémon",
    platforms: ["YouTube", "TikTok"], trendScore: 82, opportunityScore: 91, saturationScore: 22,
    growth: 98, analyzedPosts: 5240, creators: 318, detectedAt: "Hace 7 h", updatedAt: "Hace 11 min",
    ageHours: 5.4, regions: ["Chile", "Argentina", "Global"], language: "es",
    status: "Emerging", format: "Short", description: "Equipos construidos alrededor de una idea, restricción o identidad visual en lugar del meta habitual.",
    audience: "Gaming · 16–30", keywords: ["pokemon team", "challenge run", "cobblemon"],
    series: [12,15,17,19,22,28,35,49,63,82], source: "DEMO"
  },
  {
    id: "t-04", name: "Setup minimalista: antes y después", category: "Lifestyle", subcategory: "Desk setup",
    platforms: ["TikTok", "YouTube"], trendScore: 78, opportunityScore: 66, saturationScore: 63,
    growth: 54, analyzedPosts: 17300, creators: 2980, detectedAt: "Hace 1 d", updatedAt: "Hace 15 min",
    ageHours: 19, regions: ["Chile", "Mexico", "Spain", "Global"], language: "es",
    status: "Peak", format: "Short", description: "Transformaciones visuales de espacios de trabajo con foco en orden, iluminación y presupuesto.",
    audience: "Lifestyle · 18–34", keywords: ["desk setup", "workspace", "before after"],
    series: [15,23,31,39,48,61,71,78,81,78], source: "DEMO"
  },
  {
    id: "t-05", name: "Historias de juegos indie en 60 segundos", category: "Gaming", subcategory: "Indie games",
    platforms: ["TikTok", "X"], trendScore: 69, opportunityScore: 84, saturationScore: 19,
    growth: 72, analyzedPosts: 2860, creators: 204, detectedAt: "Hace 10 h", updatedAt: "Hace 20 min",
    ageHours: 10, regions: ["Argentina", "Chile", "Global"], language: "en",
    status: "Rising", format: "Short", description: "Microhistorias y descubrimientos de juegos pequeños con una premisa sorprendente.",
    audience: "Gaming · 18–34", keywords: ["indie game", "hidden gems", "game story"],
    series: [9,13,15,18,21,30,34,45,58,69], source: "DEMO"
  },
  {
    id: "t-06", name: "Reacciones a lanzamientos y anuncios", category: "Entertainment", subcategory: "Internet culture",
    platforms: ["YouTube", "X"], trendScore: 61, opportunityScore: 42, saturationScore: 84,
    growth: 12, analyzedPosts: 24100, creators: 7100, detectedAt: "Hace 3 d", updatedAt: "Hace 30 min",
    ageHours: 65, regions: ["United States", "Spain", "Global"], language: "en",
    status: "Saturated", format: "Long", description: "Cobertura reactiva de anuncios populares: mucha demanda, pero también una competencia muy alta.",
    audience: "Entertainment · 16–34", keywords: ["reaction", "announcement", "first look"],
    series: [31,38,44,52,61,75,87,92,79,61], source: "DEMO"
  },
  {
    id: "t-07", name: "Rutinas de estudio sin voz", category: "Education", subcategory: "Study content",
    platforms: ["TikTok", "YouTube"], trendScore: 48, opportunityScore: 57, saturationScore: 52,
    growth: -8, analyzedPosts: 11200, creators: 1900, detectedAt: "Hace 6 d", updatedAt: "Hace 42 min",
    ageHours: 140, regions: ["Chile", "Argentina", "Global"], language: "es",
    status: "Declining", format: "Long", description: "Vídeos de enfoque y estudio con planos tranquilos, temporizadores y ambiente sonoro.",
    audience: "Education · 16–28", keywords: ["study with me", "focus", "deep work"],
    series: [82,79,76,73,69,65,62,57,52,48], source: "DEMO"
  }
];

export const activitySeries = [
  { time: "00:00", youtube: 22, tiktok: 31, x: 14 },
  { time: "03:00", youtube: 25, tiktok: 27, x: 18 },
  { time: "06:00", youtube: 29, tiktok: 39, x: 23 },
  { time: "09:00", youtube: 38, tiktok: 45, x: 31 },
  { time: "12:00", youtube: 44, tiktok: 58, x: 42 },
  { time: "15:00", youtube: 53, tiktok: 65, x: 49 },
  { time: "18:00", youtube: 67, tiktok: 76, x: 62 },
  { time: "21:00", youtube: 61, tiktok: 82, x: 58 }
];
