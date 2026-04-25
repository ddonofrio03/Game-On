import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  ExternalLink,
  MapPin,
  Search,
  Star,
  Trophy,
  Tv,
  Youtube,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from './lib/utils';
import { getSportsSchedule } from './services/api';
import { Game, LEAGUES, League } from './types';

const NETWORK_URLS: Record<string, string> = {
  'espn+': 'https://plus.espn.com',
  espn2: 'https://www.espn.com/watch',
  espn: 'https://www.espn.com/watch',
  abc: 'https://abc.com/watch-live',
  fox: 'https://www.fox.com/live',
  fs1: 'https://www.foxsports.com/live',
  fs2: 'https://www.foxsports.com/live',
  nbc: 'https://www.nbc.com/live',
  peacock: 'https://www.peacocktv.com',
  tnt: 'https://watch.tntdrama.com',
  tbs: 'https://www.tbs.com/watchtbs',
  truetv: 'https://www.trutv.com/watchtrutv',
  'mlb.tv': 'https://www.mlb.com/tv',
  'nhl.tv': 'https://www.nhl.com/tv',
  'nba tv': 'https://www.nba.com/watch',
  apple: 'https://tv.apple.com',
  prime: 'https://www.amazon.com/primevideo',
  amazon: 'https://www.amazon.com/primevideo',
  paramount: 'https://www.paramountplus.com',
  'nfl network': 'https://www.nfl.com/network',
  'youtube tv': 'https://tv.youtube.com',
};

function getNetworkUrl(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(NETWORK_URLS)) {
    if (lower.includes(key)) return url;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`${name} live stream`)}`;
}

const NETWORK_STYLES: Record<string, { bg: string; label: string }> = {
  'espn+': { bg: '#0055A5', label: 'ESPN+' },
  espn2: { bg: '#CC0000', label: 'ESPN2' },
  espn: { bg: '#CC0000', label: 'ESPN' },
  abc: { bg: '#000000', label: 'ABC' },
  fox: { bg: '#003366', label: 'FOX' },
  fs1: { bg: '#003366', label: 'FS1' },
  fs2: { bg: '#003366', label: 'FS2' },
  nbc: { bg: '#FFA500', label: 'NBC' },
  peacock: { bg: '#000000', label: 'PCK' },
  tnt: { bg: '#0066CC', label: 'TNT' },
  tbs: { bg: '#FF5500', label: 'TBS' },
  truetv: { bg: '#FF5500', label: 'truTV' },
  'mlb.tv': { bg: '#002D72', label: 'MLB' },
  'nhl.tv': { bg: '#000000', label: 'NHL' },
  'nba tv': { bg: '#006BB6', label: 'NBA' },
  apple: { bg: '#000000', label: 'TV+' },
  prime: { bg: '#00A8E1', label: 'PRM' },
  paramount: { bg: '#0066FF', label: 'P+' },
  'nfl network': { bg: '#013369', label: 'NFL' },
  amazon: { bg: '#00A8E1', label: 'PRM' },
};

function getNetworkStyle(name: string): { bg: string; label: string } {
  const lower = name.toLowerCase();
  for (const [key, style] of Object.entries(NETWORK_STYLES)) {
    if (lower.includes(key)) return style;
  }
  return { bg: '#334155', label: name.substring(0, 4).toUpperCase() };
}

function formatGameTime(startTime: string): string {
  return format(new Date(startTime), 'EEE, p');
}

export default function App() {
  const [activeLeague, setActiveLeague] = useState<League>('MLB');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteTeams');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem('favoriteTeams', JSON.stringify(favoriteTeams));
  }, [favoriteTeams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getSportsSchedule(activeLeague);
      setGames(data);
      setLoading(false);
    };
    load();
  }, [activeLeague]);

  const toggleFavoriteTeam = (team: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team],
    );
  };

  const searchedGames = useMemo(() => {
    if (!searchQuery.trim()) return games;
    const query = searchQuery.toLowerCase();

    return games.filter((g) => {
      const fields = [
        g.homeTeam,
        g.awayTeam,
        g.competition ?? '',
        g.venue ?? '',
        ...g.streamingServices.map((s) => s.name),
      ]
        .join(' ')
        .toLowerCase();

      return fields.includes(query);
    });
  }, [games, searchQuery]);

  const filteredGames = showOnlyFavorites
    ? searchedGames.filter(
        (g) => favoriteTeams.includes(g.homeTeam) || favoriteTeams.includes(g.awayTeam),
      )
    : searchedGames;

  const comingUp = useMemo(
    () =>
      [...games]
        .filter((g) => g.status === 'upcoming')
        .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))
        .slice(0, 3),
    [games],
  );

  return (
    <div className="min-h-screen font-sans">
      <header className="py-8 px-4 sm:px-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Game On!"
            className="h-20 w-auto rounded-xl"
          />
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[2px] text-text-secondary">
              Data Source
            </p>
            <p className="text-sm font-semibold">ESPN Scoreboard APIs (live + scheduled)</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => {
                setActiveLeague(league.id);
                setShowOnlyFavorites(false);
              }}
              className={cn(
                'btn-pill',
                activeLeague === league.id && !showOnlyFavorites && 'active',
              )}
            >
              {league.name}
            </button>
          ))}
          <button
            onClick={() => setShowOnlyFavorites(true)}
            className={cn('btn-pill flex items-center gap-2', showOnlyFavorites && 'active')}
          >
            <Star className={cn('w-3 h-3', showOnlyFavorites ? 'fill-current' : '')} /> Favorites
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-10 mb-8">
        <div className="immersive-card p-4 relative glow-overlay shadow-2xl">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team, event, venue, or network (e.g., Lakers, Yankees, ESPN)"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-accent-green focus:border-accent-green outline-none transition-all"
          />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-10 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <span className="section-label">Games, Times, Scores & Streaming</span>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 immersive-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGames.length > 0 ? (
                filteredGames.map((game, i) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    key={game.id}
                    className="immersive-card p-6 group hover:border-accent-blue/30 relative"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[2px] font-bold text-text-secondary">
                            {game.competition}
                          </div>
                          <div className="text-lg font-bold mt-1">
                            {game.awayTeam} @ {game.homeTeam}
                          </div>
                          <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> {formatGameTime(game.startTime)}
                          </div>
                          {game.venue && (
                            <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                              <MapPin className="w-4 h-4" /> {game.venue}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {game.status === 'live' && (
                            <div className="bg-[#ff4444] px-3 py-1 rounded text-[10px] font-black tracking-widest text-white">
                              ● LIVE
                            </div>
                          )}
                          {game.status === 'finished' && (
                            <div className="bg-slate-700 px-3 py-1 rounded text-[10px] font-black tracking-widest text-white">
                              FINAL
                            </div>
                          )}
                          {game.status === 'upcoming' && (
                            <div className="bg-accent-blue px-3 py-1 rounded text-[10px] font-black tracking-widest text-white">
                              UPCOMING
                            </div>
                          )}
                          <div className="text-xs mt-2 text-slate-500">{game.statusDetail}</div>
                        </div>
                      </div>

                      {!game.isEvent && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold">
                          Score: {game.awayTeam}{' '}
                          <span className="text-base">{game.awayScore ?? '-'}</span> -{' '}
                          <span className="text-base">{game.homeScore ?? '-'}</span> {game.homeTeam}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={(e) => toggleFavoriteTeam(game.awayTeam, e)}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-bold border',
                            favoriteTeams.includes(game.awayTeam)
                              ? 'bg-accent-blue text-white border-accent-blue'
                              : 'bg-white text-slate-600 border-slate-300',
                          )}
                        >
                          <Star
                            className={cn(
                              'w-3 h-3 inline mr-1',
                              favoriteTeams.includes(game.awayTeam) && 'fill-white',
                            )}
                          />{' '}
                          {favoriteTeams.includes(game.awayTeam) ? 'Following' : 'Follow'}{' '}
                          {game.awayTeam}
                        </button>
                        <button
                          onClick={(e) => toggleFavoriteTeam(game.homeTeam, e)}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-bold border',
                            favoriteTeams.includes(game.homeTeam)
                              ? 'bg-accent-blue text-white border-accent-blue'
                              : 'bg-white text-slate-600 border-slate-300',
                          )}
                        >
                          <Star
                            className={cn(
                              'w-3 h-3 inline mr-1',
                              favoriteTeams.includes(game.homeTeam) && 'fill-white',
                            )}
                          />{' '}
                          {favoriteTeams.includes(game.homeTeam) ? 'Following' : 'Follow'}{' '}
                          {game.homeTeam}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {game.streamingServices.map((provider) => (
                          <a
                            key={provider.name}
                            href={getNetworkUrl(provider.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-100 transition-colors no-underline"
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] text-white"
                              style={{ backgroundColor: getNetworkStyle(provider.name).bg }}
                            >
                              {getNetworkStyle(provider.name).label}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">
                                Watch on
                              </span>
                              <span className="text-xs font-bold truncate">{provider.name}</span>
                              {provider.onYouTubeTV && (
                                <span className="text-[10px] mt-1 text-red-600 font-bold flex items-center gap-1">
                                  <Youtube className="w-3 h-3" /> Usually on YouTube TV
                                </span>
                              )}
                            </div>
                            <ExternalLink className="w-3 h-3 ml-auto opacity-30" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center immersive-card">
                  <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No matching games found.</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-6">
          <span className="section-label">Coming Up Next</span>
          <div className="space-y-4">
            {comingUp.length > 0 ? (
              comingUp.map((game) => (
                <div key={game.id} className="immersive-card p-4 flex items-center gap-4">
                  <div className="w-16 border-r border-slate-100 pr-4 text-center">
                    <div className="text-sm font-bold">{format(new Date(game.startTime), 'h:mm')}</div>
                    <div className="text-[10px] opacity-50 uppercase font-black">
                      {format(new Date(game.startTime), 'aaa')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold">
                      {game.awayTeam} @ {game.homeTeam}
                    </h4>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                      {game.league} • {game.streamingServices[0]?.name ?? 'Local listings'}
                    </div>
                  </div>
                  <Tv className="w-4 h-4 text-slate-400" />
                </div>
              ))
            ) : (
              <div className="immersive-card p-5 text-sm text-slate-500">
                No upcoming events in this feed.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-10 text-center">
          <p className="text-text-secondary text-[11px] font-bold uppercase tracking-[2px]">
            © 2026 GAME ON! • Real-time schedule & streaming helper
          </p>
        </div>
      </footer>
    </div>
  );
}
