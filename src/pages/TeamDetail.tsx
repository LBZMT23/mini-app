import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { PageWrapper } from '../components/PageWrapper';
import { ChevronLeft, Share2, Heart, Download, Image as ImageIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { MOCK_TEAMS } from './VoteList';

export const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { activities, isLoggedIn, setIsLoginOpen, showToast } = useAppContext();
  
  const filterKey = location.state?.filterKey || '-votes';
  
  const initialTeam = MOCK_TEAMS.find(t => t.id === Number(id)) || MOCK_TEAMS[0];

  const [team, setTeam] = useState({
    ...initialTeam,
    desc: `${initialTeam.name}是一支充满活力的队伍，${initialTeam.slogan}。我们常年坚持训练，不仅强身健体，更让我们结识了许多志同道合的朋友。希望通过这次比赛，展现我们的风采！`,
  });

  const item = activities.find(a => a.id === team.activityId);
  const [userVotesLeft, setUserVotesLeft] = useState(5);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [posterModalOpen, setPosterModalOpen] = useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`teamDetailScrollPos-${id}`);
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem(`teamDetailScrollPos-${id}`, e.currentTarget.scrollTop.toString());
  };

  if (!item) return null;

  const handleVoteClick = () => {
    if (item.status === 'ended') {
      showToast('活动已结束');
      return;
    }
    if (!isLoggedIn) {
      showToast('尚未登录，请先登录');
      setIsLoginOpen(true);
      return;
    }
    if (item.status === 'upcoming' || item.status === 'signup' || item.status === 'signend') {
      showToast('投票未开始');
      return;
    }
    if (userVotesLeft <= 0) {
      showToast('今日额度已用完');
      return;
    }
    
    setConfirmModalOpen(true);
  };

  const confirmVote = () => {
    setUserVotesLeft(prev => prev - 1);
    setTeam(prev => ({ ...prev, votes: prev.votes + 1, todayVotes: prev.todayVotes + 1 }));
    setConfirmModalOpen(false);
    showToast('投票成功！');
  };

  return (
    <PageWrapper type="fade">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide bg-[#f0f2f5]"
      >
        {/* Top Bar */}
        <div className="fixed top-0 left-0 w-full h-[100px] flex items-end justify-between px-5 pb-[15px] z-[100] pointer-events-none">
          <div 
            className="w-11 h-11 rounded-full bg-white/40 backdrop-blur-[15px] border border-white/60 flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-[22px] h-[22px] text-[#111]" strokeWidth={2.5} />
          </div>
          <div 
            className="w-11 h-11 rounded-full bg-white/40 backdrop-blur-[15px] border border-white/60 flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={() => showToast('分享文案已复制')}
          >
            <Share2 className="w-[22px] h-[22px] text-[#111]" strokeWidth={2.5} />
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[360px] bg-[#eee]">
          <motion.img layoutId={`team-img-${team.id}-${filterKey}`} src={team.img} className="w-full h-full object-cover" alt={team.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-[12px] font-bold px-2 py-1 rounded-md border border-white/30">
                {team.id}号
              </span>
              <span className="bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] text-white text-[12px] font-bold px-2 py-1 rounded-md shadow-sm">
                当前排名 NO.{team.rank}
              </span>
            </div>
            <h1 className="text-[24px] font-extrabold mb-1">{team.name}</h1>
            <p className="text-[14px] text-white/80 line-clamp-2 leading-relaxed">{team.slogan}</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mx-5 -mt-6 relative z-10 bg-white rounded-[24px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.05)] mb-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 text-center border-r border-[#f0f2f5]">
              <div className="text-[12px] text-[#999] mb-1">当前票数</div>
              <div className="text-[24px] font-extrabold text-[#ff5e00] leading-none">{team.votes}</div>
            </div>
            <div className="flex-1 text-center border-r border-[#f0f2f5]">
              <div className="text-[12px] text-[#999] mb-1">今日新增</div>
              <div className="text-[20px] font-bold text-[#10b981] leading-none">+{team.todayVotes}</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-[12px] text-[#999] mb-1">距离上一名</div>
              <div className="text-[20px] font-bold text-[#333] leading-none">130</div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="mx-5 bg-white rounded-[24px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mb-5">
          <h3 className="text-[16px] font-extrabold text-[#111] mb-4 flex items-center">
            <div className="w-1 h-4 bg-[#ff5e00] rounded-full mr-2" />
            队伍介绍
          </h3>
          <div className="text-[14px] text-[#666] leading-relaxed whitespace-pre-wrap">
            {team.desc}
          </div>
        </div>

        {/* Poster Button */}
        <div className="mx-5">
          <div 
            className="w-full h-[54px] bg-white border border-[#ff5e00]/20 rounded-[27px] flex items-center justify-center text-[15px] font-bold text-[#ff5e00] shadow-sm cursor-pointer active:bg-[#fff4ed] transition-colors"
            onClick={() => setPosterModalOpen(true)}
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            生成拉票海报
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#f0f2f5] px-5 py-3 pb-safe z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button
          className={cn(
            "w-full h-[48px] rounded-[24px] text-[16px] font-bold flex items-center justify-center transition-all",
            item.status === 'ended'
              ? "bg-[#f5f5f5] text-[#999]"
              : !isLoggedIn 
                ? "bg-[#f5f5f5] text-[#666]" 
                : item.status !== 'voting'
                  ? "bg-[#f5f5f5] text-[#999]"
                  : userVotesLeft <= 0
                    ? "bg-[#f5f5f5] text-[#999]"
                    : "bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] text-white shadow-[0_4px_15px_rgba(255,94,0,0.3)] active:scale-95"
          )}
          onClick={handleVoteClick}
        >
          {item.status === 'ended'
            ? "投票已结束"
            : !isLoggedIn 
              ? "登录后投票" 
              : item.status !== 'voting'
                ? "投票未开始"
                : userVotesLeft <= 0
                  ? "今日额度已用完"
                  : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      投 TA 一票
                    </>
                  )
          }
        </button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-5">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setConfirmModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-[320px] bg-white rounded-[24px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-[#fff4ed] rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-[#ff5e00]" fill="#ff5e00" />
                </div>
                <h3 className="text-[18px] font-extrabold text-[#111] mb-2">确认投票</h3>
                <p className="text-[14px] text-[#666] leading-relaxed">
                  您将为 <span className="font-bold text-[#ff5e00]">{team.name}</span> 投出宝贵的一票。<br/>
                  今日还剩 <span className="font-bold text-[#ff5e00]">{userVotesLeft}</span> 票。
                </p>
              </div>
              <div className="flex border-t border-[#f5f5f5]">
                <div 
                  className="flex-1 py-4 text-center text-[15px] font-bold text-[#666] cursor-pointer active:bg-[#f9f9f9]"
                  onClick={() => setConfirmModalOpen(false)}
                >
                  取消
                </div>
                <div className="w-[1px] bg-[#f5f5f5]" />
                <div 
                  className="flex-1 py-4 text-center text-[15px] font-bold text-[#ff5e00] cursor-pointer active:bg-[#fff4ed]"
                  onClick={confirmVote}
                >
                  确认投票
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Poster Modal */}
      <AnimatePresence>
        {posterModalOpen && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-5">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setPosterModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[320px] bg-white rounded-[16px] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Poster Content */}
              <div className="relative w-full aspect-[3/4] bg-[#ff5e00] flex flex-col items-center justify-between p-6 text-white">
                <div className="text-center w-full">
                  <h2 className="text-[20px] font-extrabold mb-1 truncate">{item.title}</h2>
                  <div className="text-[12px] opacity-80">我是 {team.id}号 {team.name}</div>
                </div>
                
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                  <img src={team.img} className="w-full h-full object-cover" alt="Team" />
                </div>
                
                <div className="text-center w-full">
                  <div className="text-[16px] font-bold mb-2">"{team.slogan}"</div>
                  <div className="w-24 h-24 bg-white rounded-lg mx-auto p-2">
                    {/* Placeholder for QR Code */}
                    <div className="w-full h-full border-2 border-dashed border-[#ccc] flex items-center justify-center text-[#999] text-[10px]">
                      扫码为我投票
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Poster Actions */}
              <div className="p-4 bg-white flex justify-center">
                <div 
                  className="flex items-center justify-center gap-2 bg-[#f0f2f5] text-[#333] px-6 py-2.5 rounded-full text-[14px] font-bold cursor-pointer active:bg-[#e5e7eb]"
                  onClick={() => {
                    showToast('海报已保存到相册');
                    setPosterModalOpen(false);
                  }}
                >
                  <Download className="w-4 h-4" />
                  保存海报
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-white text-[14px] z-10 cursor-pointer"
              onClick={() => setPosterModalOpen(false)}
            >
              关闭
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};
