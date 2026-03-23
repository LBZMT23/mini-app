import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, Trophy, Medal, AlertCircle } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { MOCK_TEAMS } from './VoteList';
import { cn } from '../utils/cn';

export const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities } = useAppContext();
  
  const item = activities.find(a => a.id === Number(id));
  
  const [activeTab, setActiveTab] = useState<'match' | 'pop'>('match');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (item) {
      if (!item.matchResultPublished && item.popResultPublished) {
        setActiveTab('pop');
      }
    }
  }, [item]);

  if (!item) return null;

  // Mock data generation for offline match results
  const matchResults = MOCK_TEAMS.filter(t => t.activityId === Number(id))
    .map((t, index) => ({
      ...t,
      score: (95 - index * 1.5).toFixed(1),
      matchRank: index + 1
    }))
    .sort((a, b) => Number(b.score) - Number(a.score));

  // Popularity results
  const popResults = MOCK_TEAMS.filter(t => t.activityId === Number(id))
    .sort((a, b) => b.votes - a.votes)
    .map((t, index) => ({
      ...t,
      popRank: index + 1
    }));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd700] to-[#f59e0b] flex items-center justify-center text-white font-bold shadow-md"><Trophy className="w-4 h-4" /></div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e2e8f0] to-[#94a3b8] flex items-center justify-center text-white font-bold shadow-md"><Medal className="w-4 h-4" /></div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fcd34d] to-[#d97706] flex items-center justify-center text-white font-bold shadow-md"><Medal className="w-4 h-4" /></div>;
    return <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#666] font-bold text-sm">{rank}</div>;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
  };

  return (
    <PageWrapper type="slide">
      <div className="fixed top-0 left-0 w-full h-[88px] bg-white/85 backdrop-blur-[20px] flex items-end justify-center pb-3 z-[100] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
        <div className="absolute left-5 bottom-3 w-8 h-8 flex items-center justify-center cursor-pointer" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-[#111]" strokeWidth={2.5} />
        </div>
        <div className="text-[17px] font-bold text-[#111]">比赛结果</div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[88px] pb-10 scrollbar-hide">
        <div className="p-5">
          <div className="bg-gradient-to-br from-[#ff5e00] to-[#ff9a44] rounded-[24px] p-6 text-white shadow-[0_10px_30px_rgba(255,94,0,0.2)] mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h1 className="text-[20px] font-extrabold mb-4 relative z-10 leading-tight">{item.title}</h1>
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center text-[13px] bg-white/20 px-3 py-1.5 rounded-full w-fit">
                <span className="opacity-90 mr-2">线下比赛结果:</span>
                <span className="font-bold">{item.matchResultPublished ? '已发布' : '未发布'}</span>
              </div>
              <div className="flex items-center text-[13px] bg-white/20 px-3 py-1.5 rounded-full w-fit">
                <span className="opacity-90 mr-2">人气奖结果:</span>
                <span className="font-bold">{item.popResultPublished ? '已发布' : '未发布'}</span>
              </div>
            </div>
          </div>

          <div className="flex bg-black/5 p-1 rounded-[16px] mb-6">
            <div 
              className={cn(
                "flex-1 text-center py-2.5 rounded-[12px] text-[15px] font-bold transition-all duration-300 cursor-pointer",
                activeTab === 'match' ? "bg-white text-[#ff5e00] shadow-sm" : "text-[#666]"
              )}
              onClick={() => setActiveTab('match')}
            >
              线下比赛结果
            </div>
            <div 
              className={cn(
                "flex-1 text-center py-2.5 rounded-[12px] text-[15px] font-bold transition-all duration-300 cursor-pointer",
                activeTab === 'pop' ? "bg-white text-[#ff5e00] shadow-sm" : "text-[#666]"
              )}
              onClick={() => setActiveTab('pop')}
            >
              人气奖结果
            </div>
          </div>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show"
            className={cn("transition-opacity duration-300", isRefreshing ? "opacity-50" : "opacity-100")}
          >
            {activeTab === 'match' && (
              !item.matchResultPublished ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-[#ccc]" />
                  </div>
                  <div className="text-[17px] font-bold text-[#111] mb-2">线下比赛结果未公布</div>
                  <div className="text-[14px] text-[#888]">请耐心等待评委打分及最终结果发布</div>
                </div>
              ) : (
                <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-black/5">
                  <div className="flex text-[13px] font-bold text-[#888] p-[16px_20px] bg-[#f8f9fa] border-b border-black/5">
                    <div className="w-12 text-center">排名</div>
                    <div className="flex-1 pl-2">队伍名称</div>
                    <div className="w-20 text-right">比赛分值</div>
                  </div>
                  {matchResults.map((team, index) => (
                    <motion.div 
                      key={team.id} 
                      variants={itemVariants}
                      className="flex items-center p-[16px_20px] border-b border-black/5 last:border-b-0 cursor-pointer active:bg-black/5 transition-colors"
                      onClick={() => navigate(`/team-detail/${team.id}`)}
                    >
                      <div className="w-12 flex justify-center">
                        {renderRankBadge(team.matchRank)}
                      </div>
                      <div className="flex-1 pl-2 pr-4">
                        <div className="text-[15px] font-bold text-[#111] line-clamp-1">{team.name}</div>
                      </div>
                      <div className="w-20 text-right text-[16px] font-extrabold text-[#ff5e00]">
                        {team.score}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'pop' && (
              !item.popResultPublished ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-[#ccc]" />
                  </div>
                  <div className="text-[17px] font-bold text-[#111] mb-2">人气奖结果未公布</div>
                  <div className="text-[14px] text-[#888]">投票结束后将尽快公布最终结果</div>
                </div>
              ) : (
                <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-black/5">
                  <div className="flex text-[13px] font-bold text-[#888] p-[16px_20px] bg-[#f8f9fa] border-b border-black/5">
                    <div className="w-12 text-center">排名</div>
                    <div className="flex-1 pl-2">队伍名称</div>
                    <div className="w-20 text-right">最终票数</div>
                  </div>
                  {popResults.map((team, index) => (
                    <motion.div 
                      key={team.id} 
                      variants={itemVariants}
                      className="flex items-center p-[16px_20px] border-b border-black/5 last:border-b-0 cursor-pointer active:bg-black/5 transition-colors"
                      onClick={() => navigate(`/team-detail/${team.id}`)}
                    >
                      <div className="w-12 flex justify-center">
                        {renderRankBadge(team.popRank)}
                      </div>
                      <div className="flex-1 pl-2 pr-4">
                        <div className="text-[15px] font-bold text-[#111] line-clamp-1">{team.name}</div>
                      </div>
                      <div className="w-20 text-right text-[16px] font-extrabold text-[#ff5e00]">
                        {team.votes}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};
