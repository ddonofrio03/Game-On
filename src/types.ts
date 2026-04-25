export type League = 'MLB' | 'NFL' | 'NBA' | 'NHL' | 'Soccer' | 'UCL' | 'Golf';

export interface StreamingProvider {
  name: string;
  url?: string;
  icon?: string;
  onYouTubeTV?: boolean;
}

export interface Game {
  id: string;
  league: League;
  awayTeam: string;
  homeTeam: string;
  startTime: string;
  streamingServices: StreamingProvider[];
  status: 'live' | 'upcoming' | 'finished';
  statusDetail?: string;
  competition?: string;
  isEvent?: boolean; // true for golf tournaments (not head-to-head)
  awayScore?: string;
  homeScore?: string;
  venue?: string;
}

export const LEAGUES: { id: League; name: string }[] = [
  { id: 'MLB', name: 'MLB' },
  { id: 'NBA', name: 'NBA' },
  { id: 'NHL', name: 'NHL' },
  { id: 'Soccer', name: 'EPL' },
  { id: 'UCL', name: 'UCL' },
  { id: 'NFL', name: 'NFL' },
  { id: 'Golf', name: 'Golf' },
];
