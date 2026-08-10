import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import CatalogBrowser from '@/components/CatalogBrowser';
import Navbar from '@/components/Navbar';
import {
  getTrendingMovies,
  getNetflixMovies,
  getPrimeMovies,
  getHotstarMovies,
  getTrendingTVSeries,
  getActionMovies,
  getThrillerMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getAnimationMovies,
  getCrimeMovies,
  getSciFiMovies,
  getTopRatedMovies,
  getLatestReleases,
  getHollywoodHindiDubbed,
  Movie,
} from '@/lib/tmdb';

export const revalidate = 3600; // Cache revalidation 1 hour

export default async function Home() {
  // Fetch all 16 categories concurrently using Promise.all
  const [
    trending,
    netflix,
    prime,
    hotstar,
    tvSeries,
    action,
    thriller,
    comedy,
    horror,
    romance,
    animation,
    crime,
    sciFi,
    topRated,
    latest,
    hollywoodDubbed,
  ] = await Promise.all([
    getTrendingMovies(),
    getNetflixMovies(),
    getPrimeMovies(),
    getHotstarMovies(),
    getTrendingTVSeries(),
    getActionMovies(),
    getThrillerMovies(),
    getComedyMovies(),
    getHorrorMovies(),
    getRomanceMovies(),
    getAnimationMovies(),
    getCrimeMovies(),
    getSciFiMovies(),
    getTopRatedMovies(),
    getLatestReleases(),
    getHollywoodHindiDubbed(),
  ]);

  // Global Deduplication set so movies don't repeat unnecessarily
  const seenIds = new Set<number>();

  const filterDups = (list: Movie[]) => {
    return list.filter((m) => {
      if (seenIds.has(m.id)) return false;
      seenIds.add(m.id);
      return true;
    });
  };

  const trendingList = filterDups(trending);
  const heroMovie = trendingList[0] || trending[0];

  const netflixList = filterDups(netflix);
  const primeList = filterDups(prime);
  const hotstarList = filterDups(hotstar);
  const tvSeriesList = filterDups(tvSeries);
  const actionList = filterDups(action);
  const thrillerList = filterDups(thriller);
  const comedyList = filterDups(comedy);
  const horrorList = filterDups(horror);
  const romanceList = filterDups(romance);
  const animationList = filterDups(animation);
  const crimeList = filterDups(crime);
  const sciFiList = filterDups(sciFi);
  const topRatedList = filterDups(topRated);
  const latestList = filterDups(latest);
  const hollywoodDubbedList = filterDups(hollywoodDubbed);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white pb-24 selection:bg-red-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Featured Blockbuster */}
      <HeroBanner movie={heroMovie} />

      {/* Main Catalog Explorer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-24 relative z-10 space-y-6 sm:space-y-12">
        {/* Interactive Quick Category Navigation Bar */}
        <CatalogBrowser />

        {/* Dynamic Multi-Category Content Rows */}
        <MovieRow id="netflix" title="🔴 Trending on Netflix" movies={netflixList.length > 0 ? netflixList : netflix} />
        <MovieRow id="prime" title="🟡 Prime Video Exclusives" movies={primeList.length > 0 ? primeList : prime} />
        <MovieRow id="hotstar" title="🟢 Disney+ Hotstar Hits" movies={hotstarList.length > 0 ? hotstarList : hotstar} />
        <MovieRow id="hollywood-dub" title="🎧 Hollywood & Foreign Blockbusters (Hindi Dubbed)" movies={hollywoodDubbedList.length > 0 ? hollywoodDubbedList : hollywoodDubbed} />
        <MovieRow id="tv" title="🍿 Binge-Worthy Web Series" movies={tvSeriesList.length > 0 ? tvSeriesList : tvSeries} />
        <MovieRow id="trending" title="🔥 Global Trending Hits in Hindi" movies={trendingList} />
        <MovieRow id="action" title="💥 Action & Superhero Spectacles" movies={actionList.length > 0 ? actionList : action} />
        <MovieRow id="thriller" title="😱 High-Octane Suspense & Thrillers" movies={thrillerList.length > 0 ? thrillerList : thriller} />
        <MovieRow id="comedy" title="😂 Blockbuster Comedy & Family Hits" movies={comedyList.length > 0 ? comedyList : comedy} />
        <MovieRow id="horror" title="👻 Horror & Supernatural Horrors" movies={horrorList.length > 0 ? horrorList : horror} />
        <MovieRow id="romance" title="💘 Romantic Hits & Emotional Dramas" movies={romanceList.length > 0 ? romanceList : romance} />
        <MovieRow id="animation" title="🐉 Animated & Anime Blockbusters" movies={animationList.length > 0 ? animationList : animation} />
        <MovieRow id="crime" title="🕵️ Crime & Mafia Thrillers" movies={crimeList.length > 0 ? crimeList : crime} />
        <MovieRow id="scifi" title="🚀 Sci-Fi & Space Adventures" movies={sciFiList.length > 0 ? sciFiList : sciFi} />
        <MovieRow id="toprated" title="🌟 IMDb Top Rated Legends" movies={topRatedList.length > 0 ? topRatedList : topRated} />
        <MovieRow id="latest" title="🎬 Fresh In Theaters & New Releases" movies={latestList.length > 0 ? latestList : latest} />
      </div>

      {/* Professional Footer */}
      <footer className="mt-16 sm:mt-20 border-t border-neutral-800/80 pt-6 pb-20 sm:pb-12 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 MovieBox Stream Engine. Powered by TMDB & Multi-CDN Stream Architecture.</p>
          <div className="flex space-x-4 sm:space-x-6">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 cursor-pointer">API Status</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
