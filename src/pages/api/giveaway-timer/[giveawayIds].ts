import type { APIRoute } from 'astro';
import { fetchGiveawayInfo, type GiveawayAPIResponse } from '../../../utils/scrapeGiveaway';

export const prerender = false;

const JSONResponse = (body: object, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const GET: APIRoute = async ({ params }): Promise<Response> => {
  const giveawayIds = params.giveawayIds?.split(',');
  const serverStart = performance.now();

  if (!giveawayIds || giveawayIds.length === 0) {
    return JSONResponse({ error: true, message: 'Missing giveaway IDs' }, 400);
  }

  const results = await Promise.all(
    giveawayIds.map(async (giveawayId: string) => {
      try {
        const result = await fetchGiveawayInfo(giveawayId);
        const serverProcessingTime = performance.now() - serverStart;

        if (result === null) {
          return {
            id: giveawayId,
            error: true,
            hasEnded: false,
            result: null,
            message: 'No data found',
            serverTimestamp: Math.floor(serverStart / 1000) // Unix timestamp en segundos
          } satisfies GiveawayAPIResponse & { id: string };
        }

        if (result === 'ended') {
          const now = new Date().toISOString();
          return {
            id: giveawayId,
            error: false,
            hasEnded: true,
            result: {
              remainingSeconds: 0,
              end: now,
              current: now,
            },
            message: 'Giveaway ended',
            serverTimestamp: Math.floor(serverStart / 1000)
          } satisfies GiveawayAPIResponse & { id: string };
        }

        // Ajuste conservador (50% del tiempo de procesamiento)
        const adjustedSeconds = Math.max(
          0, 
          result.remainingSeconds - Math.floor(serverProcessingTime * 0.5 / 1000)
        );

        return {
          id: giveawayId,
          error: false,
          hasEnded: false,
          result: {
            ...result,
            remainingSeconds: adjustedSeconds
          },
          message: null,
          serverTimestamp: Math.floor(serverStart / 1000)
        } satisfies GiveawayAPIResponse & { id: string };
      } catch (err) {
        return {
          id: giveawayId,
          error: true,
          hasEnded: false,
          result: null,
          message: err instanceof Error ? err.message : 'Unknown error',
          serverTimestamp: Math.floor(serverStart / 1000)
        } satisfies GiveawayAPIResponse & { id: string };
      }
    })
  );

  const response = results.reduce((acc, curr) => {
    acc[curr.id] = {
      error: curr.error,
      hasEnded: curr.hasEnded,
      result: curr.result,
      message: curr.message ?? null,
      serverTimestamp: curr.serverTimestamp
    };
    return acc;
  }, {} as Record<string, GiveawayAPIResponse>);

  return JSONResponse(response);
};