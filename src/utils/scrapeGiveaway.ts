import axios from 'axios';
import * as cheerio from 'cheerio';

const LANGUAGES = ['', 'fr', 'en', 'es'] as const;
type Language = typeof LANGUAGES[number];

export type GiveawayResult =
  | { remainingSeconds: number; end: string; current: string }
  | 'ended'
  | null;

export type GiveawayAPIResponse = {
  error: boolean;
  hasEnded: boolean;
  result: GiveawayResult | null;
  message: string | null;
  serverTimestamp?: number;
};

// Constantes para la optimización
const COUNTDOWN_MARGIN_BEFORE = 500; // Caracteres antes del countdown
const COUNTDOWN_MARGIN_AFTER = 1000; // Caracteres después del countdown
const LINE_CACHE_RANGE = [2000, 2100]; // Rango de líneas aproximado

const buildGiveawayUrl = (lang: Language, id: string): string =>
  lang === ''
    ? `https://www.instant-gaming.com/giveaway/${id}`
    : `https://www.instant-gaming.com/${lang}/giveaway/${id}`;

const requestPageHtml = async (url: string, lang: Language): Promise<string | null> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': `${lang || 'en-US,en;q=0.9,fr;q=0.8,es;q=0.7'}`,
      },
      timeout: 5000
    });
    return data;
  } catch {
    return null;
  }
};

const getCountdownSnippet = (html: string): string => {
  // Primero intentamos por el rango de líneas conocido (más rápido)
  const lines = html.split('\n');
  if (lines.length > LINE_CACHE_RANGE[1]) {
    const snippetByLine = lines.slice(LINE_CACHE_RANGE[0], LINE_CACHE_RANGE[1]).join('\n');
    if (snippetByLine.includes('id="giveaway-countdown"')) {
      return snippetByLine;
    }
  }

  // Fallback a búsqueda por posición si no está en el rango esperado
  const index = html.indexOf('id="giveaway-countdown"');
  if (index === -1) return html; // Devolvemos todo si no encontramos el countdown

  return html.slice(
    Math.max(0, index - COUNTDOWN_MARGIN_BEFORE),
    Math.min(html.length, index + COUNTDOWN_MARGIN_AFTER)
  );
};

const parseCountdown = (html: string): GiveawayResult => {
  const snippet = getCountdownSnippet(html);
  const $ = cheerio.load(snippet);

  const countdown = $('#giveaway-countdown');
  if (countdown.length === 0) return 'ended';

  const end = parseInt(countdown.attr('data-end-date') || '', 10);
  const current = parseInt(countdown.attr('data-current-date') || '', 10);

  if (isNaN(end) || isNaN(current)) return null;
  if (end <= current) return 'ended';

  return {
    remainingSeconds: end - current,
    end: new Date(end * 1000).toISOString(),
    current: new Date(current * 1000).toISOString(),
  };
};

export async function fetchGiveawayInfo(id: string): Promise<GiveawayResult> {
  const startTime = performance.now();
  
  for (const lang of LANGUAGES) {
    try {
      const url = buildGiveawayUrl(lang, id);
      const html = await requestPageHtml(url, lang);
      if (!html) continue;

      const result = parseCountdown(html);
      if (result === null) continue;

      const processingTime = performance.now() - startTime;
      const shouldAdjust = processingTime > 1500;
      
      if (result === 'ended') return 'ended';
      
      return {
        ...result,
        remainingSeconds: shouldAdjust
          ? Math.max(0, result.remainingSeconds - Math.floor(processingTime * 0.7 / 1000))
          : result.remainingSeconds
      };
    } catch {
      continue;
    }
  }
  return null;
}