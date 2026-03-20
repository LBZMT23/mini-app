import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../utils/cn';

interface TopHeaderCardProps {
  title: string;
  subtitle: string;
  onSearch: (keyword: string) => void;
}

export const TopHeaderCard = ({ title, subtitle, onSearch }: TopHeaderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded && !keyword) {
        setIsExpanded(false);
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    };

    // Listen to scroll events on the window or any scrollable container
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isExpanded, keyword]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    onSearch(e.target.value);
  };

  const handleBlur = () => {
    if (!keyword) setIsExpanded(false);
  };

  return (
    <div className="bg-gradient-to-b from-[#ffcdb2] via-[#ffe4d6] to-[#f4f5f7] rounded-b-[30px] pb-[30px] shadow-[0_4px_20px_rgba(255,205,178,0.2)]">
      <div className="h-[44px] w-full"></div>
      <div className="px-5 pt-2.5">
        <h1 className="text-[26px] font-extrabold mb-1.5 text-[#222]">{title}</h1>
        <p className="text-sm text-[#666] mb-5">{subtitle}</p>
        <div className="flex justify-end mb-0">
          <div className={cn(
            "h-12 rounded-[24px] bg-white/50 backdrop-blur-[15px] border border-white flex items-center overflow-hidden transition-all duration-[400ms] ease-in-out",
            isExpanded ? "w-full bg-white" : "w-12"
          )}>
            <div 
              className="w-12 h-12 flex items-center justify-center shrink-0 cursor-pointer"
              onClick={() => {
                setIsExpanded(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
            >
              <Search className="w-5 h-5 text-[#333]" strokeWidth={2.5} />
            </div>
            <input 
              ref={inputRef}
              type="text" 
              className={cn(
                "flex-1 border-none outline-none bg-transparent text-[15px] pr-[15px] transition-opacity duration-300 min-w-0",
                isExpanded ? "opacity-100" : "opacity-0"
              )}
              placeholder="搜索活动名称或地点"
              value={keyword}
              onChange={handleInput}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
