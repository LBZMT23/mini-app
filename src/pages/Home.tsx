import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { TopHeaderCard } from '../components/TopHeaderCard';
import { PageWrapper } from '../components/PageWrapper';
import { cn } from '../utils/cn';
import { MapPin, Clock, ChevronDown } from 'lucide-react';

const CITIES = ['全部城市', '北京', '上海', '广州', '深圳', '成都'];
const STATUSES = [
  { id: 'all', label: '全部' },
  { id: 'upcoming', label: '未开始' },
  { id: 'signup', label: '报名中' },
  { id: 'signend', label: '报名已截止' },
  { id: 'voting', label: '投票中' },
  { id: 'ended', label: '已结束' },
];

export const Home = () => {
  const { activities } = useAppContext();
  const navigate = useNavigate();
  
  const [cityFilter, setCityFilter] = useState(() => sessionStorage.getItem('homeCityFilter') || '全部城市');
  const [statusFilter, setStatusFilter] = useState(() => sessionStorage.getItem('homeStatusFilter') || 'all');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  
  useEffect(() => {
    sessionStorage.setItem('homeCityFilter', cityFilter);
  }, [cityFilter]);

  useEffect(() => {
    sessionStorage.setItem('homeStatusFilter', statusFilter);
  }, [statusFilter]);
  
  const [tabLineStyle, setTabLineStyle] = useState({ width: 0, transform: 'translateX(0px)' });
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeIndex = STATUSES.findIndex(s => s.id === statusFilter);
    const activeTab = tabsRef.current[activeIndex];
    if (activeTab) {
      setTabLineStyle({
        width: activeTab.offsetWidth,
        transform: `translateX(${activeTab.offsetLeft}px)`
      });
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [statusFilter]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('homeScrollPos');
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem('homeScrollPos', e.currentTarget.scrollTop.toString());
  };

  const filtered = activities.filter(d => 
    (cityFilter === '全部城市' || d.city === cityFilter) &&
    (statusFilter === 'all' || d.status === statusFilter) &&
    (keywordFilter === '' || d.title.includes(keywordFilter))
  );

  const getTagColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-500/85';
      case 'signup': return 'bg-[#ff5e00]/85';
      case 'signend': return 'bg-rose-600/85';
      case 'voting': return 'bg-amber-500/85';
      case 'ended': return 'bg-gray-500/85';
      default: return 'bg-black/40';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.6 } }
  };

  return (
    <PageWrapper type="fade">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pb-[120px] scrollbar-hide"
      >
        <TopHeaderCard 
          title="银龄风采展示" 
          subtitle="发现身边精彩活动，报名展现队伍风采" 
          onSearch={setKeywordFilter} 
        />

        <div className="pt-5 pb-1.5 bg-transparent">
          <div className="px-5 pb-[15px] relative z-[50]">
            {isCityOpen && (
              <div 
                className="fixed inset-0 z-[55]" 
                onClick={() => setIsCityOpen(false)}
              />
            )}
            <div className={cn("relative w-[140px] z-[60]", isCityOpen && "open")}>
              <div 
                className={cn(
                  "w-full h-10 bg-white border rounded-[20px] px-4 text-[15px] flex justify-between items-center cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300",
                  cityFilter !== '全部城市' ? "bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] text-white font-bold border-transparent" : "border-white/80 text-[#333]"
                )}
                onClick={() => setIsCityOpen(!isCityOpen)}
              >
                <span>{cityFilter}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-400", isCityOpen && "rotate-180")} />
              </div>
              <div className={cn(
                "absolute top-[calc(100%+8px)] left-0 w-[160px] bg-[#f8f9fa]/96 backdrop-blur-[30px] border-[1.5px] border-white rounded-[20px] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.12)] z-[60] transition-all duration-350 origin-top-left",
                isCityOpen ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible -translate-y-2.5 scale-95"
              )}>
                {CITIES.map(c => (
                  <div 
                    key={c}
                    className={cn(
                      "p-[10px_14px] text-[15px] font-medium rounded-[14px] cursor-pointer transition-colors hover:bg-black/5 active:bg-black/5 mb-1 last:mb-0",
                      cityFilter === c ? "text-[#ff5e00] bg-[#ff5e00]/10" : "text-[#333]"
                    )}
                    onClick={() => { setCityFilter(c); setIsCityOpen(false); }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex px-5 pb-2.5 relative w-max min-w-full items-center">
              {STATUSES.map((status, idx) => (
                <div 
                  key={status.id}
                  ref={el => tabsRef.current[idx] = el}
                  className={cn(
                    "px-[14px] py-2.5 text-[15px] cursor-pointer whitespace-nowrap relative z-[1] transition-all duration-200 shrink-0",
                    statusFilter === status.id ? "text-black font-bold text-base" : "text-[#777]"
                  )}
                  onClick={() => setStatusFilter(status.id)}
                >
                  {status.label}
                </div>
              ))}
              <div 
                className="absolute bottom-2 left-0 h-1 flex justify-center transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] pointer-events-none"
                style={tabLineStyle}
              >
                <div className="w-6 h-full bg-[#ff5e00] rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <motion.div key={`${cityFilter}-${statusFilter}`} variants={containerVariants} initial="hidden" animate="show">
          {filtered.map((d) => (
            <motion.div 
              key={d.id}
              variants={itemVariants}
              className="mx-5 mb-5 bg-gradient-to-br from-white/70 to-[#dcf5ff]/50 backdrop-blur-[20px] border-[1.5px] border-white rounded-[32px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] cursor-pointer"
              onClick={() => navigate(`/detail/${d.id}`, { state: { filterKey: `${cityFilter}-${statusFilter}` } })}
            >
              <div className="relative h-[160px] mb-3 bg-[#eee] rounded-[20px]">
                <motion.img layoutId={`hero-img-${d.id}-${cityFilter}-${statusFilter}`} src={d.img} className="w-full h-full object-cover rounded-[20px]" alt={d.title} />
                <div className={cn("absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white backdrop-blur-sm border border-white/20", getTagColor(d.status))}>
                  {d.statusText}
                </div>
              </div>
              <h2 className="text-[18px] font-extrabold mb-2 text-[#111]">{d.title}</h2>
              <div className="text-[13px] text-[#555] flex items-center mb-1.5">
                <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                {d.loc}
              </div>
              <div className="text-[13px] text-[#555] flex items-center mb-1.5">
                <Clock className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                {d.time}
              </div>
              <div className="mt-3 pt-3 border-t border-white/30 flex items-center justify-between">
                <div className="text-xs text-[#555]">
                  已报名 <b className="text-[#ff5e00] text-[15px]">{d.cur}</b> / {d.max} 支
                </div>
                <div className="px-4 py-2 bg-white text-[#ff5e00] rounded-[18px] text-[13px] font-bold">
                  查看详情
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  );
};
