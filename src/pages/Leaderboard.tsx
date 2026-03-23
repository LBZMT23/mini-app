import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { PageWrapper } from '../components/PageWrapper';
import { ChevronLeft, Trophy, Medal, RefreshCw, List, Share2, Info } from 'lucide-react';
import { cn } from '../utils/cn';
import { MOCK_TEAMS, Team } from './VoteList';

export const Leaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, showToast } = useAppContext();
  
  const item = activities.find(a => a.id === Number(id));
  const [teams] = useState<Team[]>(() => {
    return [...MOCK_TEAMS]
      .filter(t => t.activityId === Number(id))
      .sort((a, b) => b.votes - a.votes)
      .map((t, i) => ({ ...t, rank: i + 1 }));
  });

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`leaderboardScrollPos-${id}`);
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem(`leaderboardScrollPos-${id}`, e.currentTarget.scrollTop.toString());
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // In a real app, this would fetch new data
      showToast('榜单已刷新');
    }, 800);
  };

  const handleShare = async () => {
    if (!item) return;
    const shareText = `快来看看【${item.title}】的最新排行榜吧！\n链接：${window.location.href}`;
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('分享文案已复制');
    } catch (err) {
      showToast('复制失败，请手动复制链接');
    }
  };

  if (!item) {
    return (
      <PageWrapper type="fade">
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] px-5 h-screen">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Info className="w-10 h-10 text-[#ccc]" />
          </div>
          <h2 className="text-[18px] font-bold text-[#333] mb-2">活动不存在</h2>
          <p className="text-[14px] text-[#999] text-center mb-8">该活动可能已被删除或尚未开始</p>
          <div 
            className="w-[200px] h-[44px] bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer active:scale-95 transition-transform"
            onClick={() => navigate('/')}
          >
            返回首页
          </div>
        </div>
      </PageWrapper>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.3 } }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd700] to-[#f59e0b] flex items-center justify-center text-white font-extrabold shadow-md border-2 border-white"><Trophy className="w-4 h-4" /></div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e5e7eb] to-[#9ca3af] flex items-center justify-center text-white font-extrabold shadow-md border-2 border-white"><Medal className="w-4 h-4" /></div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fcd34d] to-[#d97706] flex items-center justify-center text-white font-extrabold shadow-md border-2 border-white"><Medal className="w-4 h-4" /></div>;
    return <div className="w-8 h-8 rounded-full bg-[#f0f2f5] flex items-center justify-center text-[#999] font-bold">{rank}</div>;
  };

  return (
    <PageWrapper type="fade">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pb-[40px] scrollbar-hide bg-[#f0f2f5]"
      >
        {/* Top Bar */}
        <div className="sticky top-0 left-0 w-full h-[88px] flex items-end justify-between px-5 pb-[10px] z-[100] bg-[#f0f2f5]/80 backdrop-blur-md">
          <div 
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-5 h-5 text-[#111]" strokeWidth={2.5} />
          </div>
          <div className="flex gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 text-[#111]" strokeWidth={2.5} />
            </div>
            <div 
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer"
              onClick={handleRefresh}
            >
              <RefreshCw className={cn("w-5 h-5 text-[#111]", isRefreshing && "animate-spin")} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Activity Info Card */}
        <div className="mx-5 mt-2 mb-8 bg-white rounded-[24px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <h1 className="text-[20px] font-extrabold text-[#111] mb-2 relative z-10">人气排行榜</h1>
          <p className="text-[14px] text-[#666] relative z-10 mb-5">{item.title}</p>
          
          <div className="bg-gradient-to-r from-[#fff4ed] to-[#fffaf5] rounded-[16px] p-4 border border-[#ffe4cc] flex justify-between items-center relative z-10">
            <div className="flex-1 text-center">
              <div className="text-[12px] text-[#d97706] opacity-80 mb-1">总票数</div>
              <div className="text-[18px] font-extrabold text-[#ea580c]">{teams.reduce((sum, t) => sum + t.votes, 0)}</div>
            </div>
            <div className="w-[1px] h-8 bg-[#ffe4cc] mx-2"></div>
            <div className="flex-1 text-center">
              <div className="text-[12px] text-[#d97706] opacity-80 mb-1">参与队伍</div>
              <div className="text-[18px] font-extrabold text-[#ea580c]">{teams.length}</div>
            </div>
            <div className="w-[1px] h-8 bg-[#ffe4cc] mx-2"></div>
            <div className="flex-1 text-center">
              <div className="text-[12px] text-[#d97706] opacity-80 mb-1">状态</div>
              <div className="text-[14px] font-bold text-[#ea580c] mt-1">
                {item.status === 'voting' ? '投票中' : item.status === 'ended' ? '已结束' : '未开始'}
              </div>
            </div>
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-5">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Info className="w-10 h-10 text-[#ccc]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#333] mb-2">暂无排名数据</h2>
            <p className="text-[14px] text-[#999] text-center mb-8">当前活动还没有队伍进入投票池</p>
            <div 
              className="w-[200px] h-[44px] bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer active:scale-95 transition-transform"
              onClick={() => navigate(`/vote-list/${id}`)}
            >
              返回投票列表
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="mx-5 relative z-10 flex items-end justify-center gap-2 mb-6">
              {/* 2nd Place */}
          {teams[1] && (
            <div className="flex-1 flex flex-col items-center" onClick={() => navigate(`/team-detail/${teams[1].id}`)}>
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full border-4 border-[#e5e7eb] overflow-hidden shadow-lg">
                  <img src={teams[1].img} className="w-full h-full object-cover" alt={teams[1].name} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  {getRankIcon(2)}
                </div>
              </div>
              <div className="bg-white w-full rounded-t-[16px] pt-4 pb-3 px-2 text-center shadow-sm mt-1 h-[100px] flex flex-col justify-end border-t-4 border-[#e5e7eb]">
                <div className="text-[12px] font-bold text-[#111] truncate w-full mb-1">{teams[1].name}</div>
                <div className="text-[14px] font-extrabold text-[#ff5e00]">{teams[1].votes}票</div>
                <div className="text-[10px] text-[#10b981]">今日 +{teams[1].todayVotes}</div>
              </div>
            </div>
          )}
          
          {/* 1st Place */}
          {teams[0] && (
            <div className="flex-1 flex flex-col items-center z-10" onClick={() => navigate(`/team-detail/${teams[0].id}`)}>
              <div className="relative mb-2">
                <div className="w-20 h-20 rounded-full border-4 border-[#ffd700] overflow-hidden shadow-xl">
                  <img src={teams[0].img} className="w-full h-full object-cover" alt={teams[0].name} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  {getRankIcon(1)}
                </div>
              </div>
              <div className="bg-white w-full rounded-t-[16px] pt-4 pb-4 px-2 text-center shadow-md mt-1 h-[120px] flex flex-col justify-end border-t-4 border-[#ffd700]">
                <div className="text-[13px] font-extrabold text-[#111] truncate w-full mb-1">{teams[0].name}</div>
                <div className="text-[16px] font-extrabold text-[#ff5e00]">{teams[0].votes}票</div>
                <div className="text-[11px] text-[#10b981]">今日 +{teams[0].todayVotes}</div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {teams[2] && (
            <div className="flex-1 flex flex-col items-center" onClick={() => navigate(`/team-detail/${teams[2].id}`)}>
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full border-4 border-[#fcd34d] overflow-hidden shadow-lg">
                  <img src={teams[2].img} className="w-full h-full object-cover" alt={teams[2].name} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  {getRankIcon(3)}
                </div>
              </div>
              <div className="bg-white w-full rounded-t-[16px] pt-4 pb-3 px-2 text-center shadow-sm mt-1 h-[90px] flex flex-col justify-end border-t-4 border-[#fcd34d]">
                <div className="text-[12px] font-bold text-[#111] truncate w-full mb-1">{teams[2].name}</div>
                <div className="text-[14px] font-extrabold text-[#ff5e00]">{teams[2].votes}票</div>
                <div className="text-[10px] text-[#10b981]">今日 +{teams[2].todayVotes}</div>
              </div>
            </div>
          )}
        </div>

        {/* Rest of the List */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="mx-5 space-y-3 mb-6"
        >
          {teams.slice(3).map((team, index) => (
            <motion.div 
              key={team.id}
              variants={itemVariants}
              className="bg-white rounded-[16px] p-3 flex items-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.03)] cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/team-detail/${team.id}`)}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(index + 4)}
              </div>
              
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#eee] shrink-0">
                <img src={team.img} className="w-full h-full object-cover" alt={team.name} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="bg-[#f0f2f5] text-[#666] text-[10px] font-bold px-1.5 py-0.5 rounded-sm shrink-0">{team.id}号</span>
                  <h3 className="text-[15px] font-extrabold text-[#111] truncate">{team.name}</h3>
                </div>
              </div>
              
              <div className="text-right shrink-0">
                <div className="text-[16px] font-extrabold text-[#ff5e00]">{team.votes}</div>
                <div className="text-[10px] text-[#999]">票</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

            {/* Bottom Actions */}
            <div className="mx-5 flex justify-center pb-6">
              <div 
                className="flex items-center justify-center gap-2 bg-white text-[#666] px-6 py-2.5 rounded-full text-[14px] font-bold shadow-sm cursor-pointer active:bg-[#f9f9f9] border border-[#e5e7eb]"
                onClick={() => navigate(`/vote-list/${id}`)}
              >
                <List className="w-4 h-4" />
                返回投票列表
              </div>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
};
