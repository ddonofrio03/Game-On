import { Game, League, StreamingProvider } from '../types';

const ESPN_ENDPOINTS: Record<League, string> = {
  MLB: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
  NBA: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  NHL: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
  NFL: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  Soccer: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
  UCL: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard',
  Golf: 'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard',
};

const YOUTUBE_TV_CARRIED_NETWORKS = [
  'abc',
  'cbs',
  'espn',
  'espn2',
  'fox',
  'fs1',
  'fs2',
  'nbc',
  'nfl network',
  'nba tv',
  'tnt',
  'tbs',
  'truetv',
  'golf channel',
  'mlb network',
  'nhl network',
  'nbc sports',
  'big ten network',
  'sec network',
];

function mapStatus(espnStatus: string): 'live' | 'upcoming' | 'finished' {
  if (espnStatus === 'STATUS_IN_PROGRESS' || espnStatus === 'STATUS_HALFTIME') return 'live';
  if (espnStatus === 'STATUS_FINAL') return 'finished';
  return 'upcoming';
}

function getBroadcasts(comp: any): StreamingProvider[] {
  const fromBroadcasts = comp.broadcasts?.flatMap((b: any) => b.names ?? []) ?? [];
  const fromGeo = comp.geoBroadcasts?.flatMap((b: any) => b.media?.shortName ?? []) ?? [];
  const names = [...fromBroadcasts, ...fromGeo]
    .map((name: string) => name.trim())
    .filter(Boolean);

  if (names.length === 0) {
    return [{ name: 'Check local listings' }];
  }

  return [...new Set(names)].map((name) => {
    const lower = name.toLowerCase();
    return {
      name,
      onYouTubeTV: YOUTUBE_TV_CARRIED_NETWORKS.some((network) => lower.includes(network)),
    };
  });
}

export async function getSportsSchedule(league: League): Promise<Game[]> {
  try {
    const url = ESPN_ENDPOINTS[league];
    const res = await fetch(url);
    if (!res.ok) throw new Error(`ESPN API error: ${res.status}`);
    const data = await res.json();

    return (data.events ?? []).map((event: any) => {
      const comp = event.competitions?.[0] ?? {};
      const services = getBroadcasts(comp);
      const statusDetail = comp.status?.type?.shortDetail ?? comp.status?.type?.detail;
      const venue = comp.venue?.fullName;

      if (league === 'Golf') {
        const leaders = (comp.competitors ?? [])
          .slice(0, 2)
          .map((c: any) => c.athlete?.displayName ?? c.team?.displayName ?? '')
          .filter(Boolean)
          .join(' & ');

        return {
          id: event.id,
          league,
          homeTeam: event.name ?? 'PGA Tournament',
          awayTeam: leaders || 'See Leaderboard',
          startTime: comp.date ?? event.date ?? new Date().toISOString(),
          status: mapStatus(comp.status?.type?.name ?? ''),
          statusDetail,
          competition: event.shortName ?? event.name,
          streamingServices: services,
          isEvent: true,
          venue,
        } as Game;
      }

      const home = comp.competitors?.find((c: any) => c.homeAway === 'home');
      const away = comp.competitors?.find((c: any) => c.homeAway === 'away');

      return {
        id: event.id,
        league,
        homeTeam: home?.team?.displayName ?? 'TBD',
        awayTeam: away?.team?.displayName ?? 'TBD',
        startTime: comp.date ?? event.date,
        status: mapStatus(comp.status?.type?.name ?? ''),
        statusDetail,
        competition: event.name,
        streamingServices: services,
        homeScore: home?.score,
        awayScore: away?.score,
        venue,
      } as Game;
    });
  } catch (error) {
    console.error('ESPN API error:', error);
    return [];
  }
}
