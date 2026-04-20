import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Tv, 
  Search, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Info,
  ChevronRight,
  TrendingUp,
  Radio,
  Gamepad2,
  Filter,
  Star
} from 'lucide-react';
import { LEAGUES, League, Game } from './types';
import { getSportsSchedule, askAI } from './services/gemini';
import { cn } from './lib/utils';
import { format } from 'date-fns';

export default function App() {
  const [activeLeague, setActiveLeague] = useState<League>('MLB');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userZip, setUserZip] = useState('20176'); // Default set to 20176
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const filteredGames = showOnlyFavorites 
    ? games.filter(g => favoriteIds.includes(g.id))
    : games;
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const currentDate = new Date('2026-04-18T15:47:59-07:00');

  useEffect(() => {
    fetchSchedule();
  }, [activeLeague]);

  const fetchSchedule = async () => {
    setLoading(true);
    const data = await getSportsSchedule(activeLeague, currentDate.toISOString());
    setGames(data);
    setLoading(false);
  };

  const handleAskAI = async () => {
    if (!searchQuery.trim()) return;
    setIsAsking(true);
    setAiAnswer(null);
    const answer = await askAI(searchQuery, userZip, currentDate.toISOString());
    setAiAnswer(answer);
    setIsAsking(false);
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation / Header */}
      <header className="py-8 px-4 sm:px-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display logo-gradient uppercase">
            GAME ON!
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => {
                setActiveLeague(league.id);
                setShowOnlyFavorites(false);
              }}
              className={cn(
                "btn-pill",
                activeLeague === league.id && !showOnlyFavorites && "active"
              )}
            >
              {league.name === 'Soccer' ? 'EPL' : league.name}
            </button>
          ))}
          <button
            onClick={() => setShowOnlyFavorites(true)}
            className={cn(
              "btn-pill flex items-center gap-2",
              showOnlyFavorites && "active"
            )}
          >
            <Star className={cn("w-3 h-3", showOnlyFavorites ? "fill-current" : "")} />
            Favorites
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 mb-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <span className="section-label">AI Research & Search</span>
            <div className="immersive-card p-4 relative glow-overlay shadow-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Ask Gemini: 'Where can I watch the Lakers tonight in CA?'"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-accent-green focus:border-accent-green outline-none transition-all text-sm md:text-base"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button 
                    onClick={handleAskAI}
                    disabled={isAsking}
                    className="bg-accent-green disabled:opacity-50 disabled:cursor-not-allowed text-bg-dark px-6 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                  >
                    {isAsking ? '...' : 'Ask AI'}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {aiAnswer && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="bg-accent-green/10 border border-accent-green/20 rounded-2xl p-5">
                      <p className="text-slate-200 text-sm leading-relaxed">{aiAnswer}</p>
                      <button 
                        onClick={() => setAiAnswer(null)}
                        className="mt-3 text-[10px] font-bold uppercase tracking-widest text-accent-green/60 hover:text-accent-green"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col justify-center">
            <div className="flex items-center gap-4 bg-slate-100 px-4 py-3 rounded-2xl border border-slate-200">
              <MapPin className="w-4 h-4 text-accent-blue" />
              <div className="flex flex-col">
                <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Local Market</span>
                <input 
                  type="text" 
                  value={userZip} 
                  onChange={(e) => setUserZip(e.target.value)}
                  className="bg-transparent border-none text-sm p-0 focus:ring-0 font-bold"
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-10 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured / Live Area */}
        <section className="lg:col-span-2">
          <span className="section-label">Games & Broadcasts</span>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 immersive-card animate-pulse" />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {filteredGames.length > 0 ? filteredGames.map((game, i) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={game.id}
                    className="immersive-card p-8 group hover:border-accent-blue/30 relative"
                  >
                    <button 
                      onClick={(e) => toggleFavorite(game.id, e)}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-20"
                    >
                      <Star className={cn(
                        "w-5 h-5 transition-all text-accent-blue",
                        favoriteIds.includes(game.id) ? "fill-accent-blue scale-110" : "opacity-30 scale-100"
                      )} />
                    </button>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-1 flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xl font-bold">
                            {game.awayTeam[0]}
                          </div>
                          <div className="mt-4 font-display font-extrabold text-xl tracking-tight">{game.awayTeam}</div>
                        </div>
                        
                        <div className="font-serif italic text-2xl opacity-30">vs</div>

                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xl font-bold">
                            {game.homeTeam[0]}
                          </div>
                          <div className="mt-4 font-display font-extrabold text-xl tracking-tight">{game.homeTeam}</div>
                        </div>
                      </div>

                      <div className="md:w-px h-20 bg-slate-100 hidden md:block" />

                      <div className="md:w-56 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          {game.status === 'live' ? (
                            <div className="bg-[#ff4444] px-3 py-1 rounded text-[10px] font-black tracking-widest text-white">● LIVE</div>
                          ) : (
                            <div className="text-text-secondary text-xs font-bold flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {format(new Date(game.startTime), 'p')}
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-accent-blue uppercase">{game.league}</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {game.streamingServices.map((provider) => (
                            <div 
                              key={provider.name}
                              className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-100 transition-colors"
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px]",
                                provider.name.toLowerCase().includes('apple') && "bg-black",
                                provider.name.toLowerCase().includes('espn') && "bg-[#CC0000]",
                                provider.name.toLowerCase().includes('prime') && "bg-[#00A8E1]",
                                provider.name.toLowerCase().includes('paramount') && "bg-[#0066FF]",
                                !['apple', 'espn', 'prime', 'paramount'].some(k => provider.name.toLowerCase().includes(k)) && "bg-slate-800"
                              )}>
                                {provider.name.substring(0, 3).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Watch on</span>
                                <span className="text-xs font-bold">{provider.name}</span>
                              </div>
                              <ExternalLink className="w-3 h-3 ml-auto opacity-30" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="py-20 text-center immersive-card">
                    <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No games scheduled for this league today.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Sidebar / Coming Up */}
        <section className="flex flex-col gap-6">
          <span className="section-label">Coming Up Next</span>
          <div className="space-y-4">
            <div className="immersive-card p-5 flex items-center gap-4 hover:bg-slate-50 cursor-pointer">
              <div className="w-16 border-r border-slate-100 pr-4 text-center">
                <div className="text-sm font-bold">8:00</div>
                <div className="text-[10px] opacity-50 uppercase font-black">PM</div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">Yankees vs Red Sox</h4>
                <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">MLB • Regular Season</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[10px] font-bold border border-white/10">TV+</div>
            </div>

            <div className="immersive-card p-5 flex items-center gap-4 hover:bg-slate-50 cursor-pointer">
              <div className="w-16 border-r border-slate-100 pr-4 text-center">
                <div className="text-sm font-bold">9:30</div>
                <div className="text-[10px] opacity-50 uppercase font-black">PM</div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">Lakers vs Warriors</h4>
                <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">NBA • West Conf</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#CC0000] flex items-center justify-center text-[10px] font-bold border border-slate-100">E+</div>
            </div>

            <div className="immersive-card p-5 flex items-center gap-4 border-dashed border-accent-blue/30 bg-accent-blue/5 justify-center text-accent-blue font-bold text-xs py-10">
              <TrendingUp className="w-4 h-4" />
              Sync with Google Calendar
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-10 text-center">
          <p className="text-text-secondary text-[11px] font-bold uppercase tracking-[2px]">
            © 2026 GAME ON! • AI-Powered Broadcast Scout
          </p>
        </div>
      </footer>
    </div>
  );
}
