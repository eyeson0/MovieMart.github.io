import React from 'react';
import { Play, ShieldAlert, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenDmca: () => void;
  onNavigate: (view: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDmca, onNavigate }) => {
  return (
    <footer className="mt-20 bg-[#070707] border-t border-white/10 py-12 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Row: Brand & Quick Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#E50914] flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <span className="text-xl font-black text-white">
              MOVIE<span className="text-[#E50914]">MART</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => onNavigate('movies')} className="hover:text-white transition-colors cursor-pointer">
              Movies
            </button>
            <button onClick={() => onNavigate('series')} className="hover:text-white transition-colors cursor-pointer">
              Series
            </button>
            <button onClick={() => onNavigate('dubbed')} className="hover:text-white transition-colors cursor-pointer">
              Hindi & Nepali Dubbed
            </button>
            <button onClick={() => onNavigate('my-list')} className="hover:text-white transition-colors cursor-pointer">
              My List
            </button>
            <button onClick={onOpenDmca} className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DMCA / Copyright</span>
            </button>
          </div>
        </div>

        {/* TMDB Attribution & Legal Notice */}
        <div className="p-4 rounded-xl bg-[#101010] border border-white/5 space-y-2 text-[11px] leading-relaxed text-gray-400">
          <div className="flex items-center gap-2 text-white font-bold">
            <span>Metadata & Content Integrity Disclosure</span>
          </div>
          <p>
            Movie Mart provides catalog discovery and authorized streaming integration for verified media sources. 
            This product uses the TMDB API but is not endorsed or certified by TMDB. 
            All movie posters, backdrops, and third-party trademarks are property of their respective production studios and rightsholders. 
            Public domain titles are cataloged under applicable United States and international copyright exemptions.
          </p>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Movie Mart Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Ad Choices & 24h Pass</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
