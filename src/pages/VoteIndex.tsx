import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { TopHeaderCard } from '../components/TopHeaderCard';
import { PageWrapper } from '../components/PageWrapper';
import { cn } from '../utils/cn';
import { Clock, Info } from 'lucide-react';

const STATUSES = [
  { id: 'voting', label: '投票中' },
  { id: 'ended', label: '已结束' },
];

export const VoteIndex = () => {
  const { activities, showToast } = useAppContext();
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState(() => sessionStorage.getItem('voteStatusFilter') || 'voting');
  const [keywordFilter, setKeywordFilter] = useState('');
  
  useEffect(() => {
    sessionStorage.setItem('voteStatusFilter', statusFilter);
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
    }
  }, [statusFilter]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('voteScrollPos');
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem('voteScrollPos', e.currentTarget.scrollTop.toString());
  };

  const voteData = activities.filter(d => d.voteTeamCount > 0 && (d.status === 'voting' || d.status === 'ended'));
  
  const filtered = voteData.filter(d => 
    d.status === statusFilter && 
    (keywordFilter === '' || d.title.includes(keywordFilter) || d.loc.includes(keywordFilter))
  );

  const getTagColor = (status: string) => {
    switch(status) {
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
          title="人气投票" 
          subtitle="发现心仪队伍，投出你宝贵的一票" 
          onSearch={setKeywordFilter} 
        />

        <div className="pt-5 pb-1.5 bg-transparent">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex px-5 pb-2.5 relative w-max min-w-full items-center">
              {STATUSES.map((status, idx) => (
                <div 
                  key={status.id}
                  ref={el => tabsRef.current[idx] = el}
                  className={cn(
                    "flex-1 text-center py-2.5 text-[15px] cursor-pointer whitespace-nowrap relative z-[1] transition-all duration-200 shrink-0",
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

        <motion.div key={`${statusFilter}`} variants={containerVariants} initial="hidden" animate="show">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[60px] opacity-100">
              <Info className="w-[60px] h-[60px] text-[#ddd] mb-4" strokeWidth={1.5} />
              <div className="text-sm text-[#999]">当前分类暂无投票活动</div>
            </div>
          ) : (
            filtered.map((d) => (
              <motion.div 
                key={d.id}
                variants={itemVariants}
                className="mx-5 mb-5 bg-gradient-to-br from-white/70 to-[#dcf5ff]/50 backdrop-blur-[20px] border-[1.5px] border-white rounded-[32px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] cursor-pointer"
                onClick={() => showToast('即将进入投票列表页 (模块8)')}
              >
                <div className="relative h-[140px] mb-3 bg-[#eee] rounded-[20px]">
                  <img src={d.img} className="w-full h-full object-cover rounded-[20px]" alt={d.title} />
                  <div className={cn("absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white backdrop-blur-sm border border-white/20", getTagColor(d.status))}>
                    {d.statusText}
                  </div>
                </div>
                <h2 className="text-[18px] font-extrabold mb-1 text-[#111]">{d.title}</h2>
                <div className="text-[13px] text-[#555] flex items-center mb-0">
                  <Clock className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                  投票时间：{d.voteTimeStr}
                </div>
                <div className="flex gap-5 mt-3 pt-3 border-t border-dashed border-black/10">
                  <div className="flex flex-col items-start">
                    <span className="text-[18px] font-extrabold text-[#ff5e00] mb-0.5">{d.voteTeamCount}</span>
                    <span className="text-[11px] text-[#666]">参与队伍</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[18px] font-extrabold text-[#ff5e00] mb-0.5">{d.totalVotes.toLocaleString()}</span>
                    <span className="text-[11px] text-[#666]">累计票数</span>
                  </div>
                  <div className="flex-1"></div>
                  <div className={cn(
                    "px-4 py-2 rounded-[18px] text-[13px] font-bold self-end -mt-[30px]",
                    d.status === 'ended' 
                      ? "bg-white text-[#666] border border-[#ddd] shadow-none" 
                      : "bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] text-white shadow-[0_4px_10px_rgba(255,94,0,0.2)]"
                  )}>
                    {d.status === 'ended' ? '查看结果' : '进入投票'}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};
