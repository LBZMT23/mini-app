import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { PageWrapper } from '../components/PageWrapper';
import { ChevronLeft, Share2, Heart, Download, Image as ImageIcon, List, Trophy, Info } from 'lucide-react';
import { cn } from '../utils/cn';
import { MOCK_TEAMS } from './VoteList';

export const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { activities, isLoggedIn, setIsLoginOpen, showToast } = useAppContext();
  
  const filterKey = location.state?.filterKey || '-votes';
  
  const initialTeam = MOCK_TEAMS.find(t => t.id === Number(id));

  const [team, setTeam] = useState(initialTeam ? {
    ...initialTeam,
    desc: `${initialTeam.name}是一支充满活力的队伍，${initialTeam.slogan}。我们常年坚持训练，不仅强身健体，更让我们结识了许多志同道合的朋友。希望通过这次比赛，展现我们的风采！`,
  } : null);

  const item = activities.find(a => a.id === team?.activityId);
  const [userVotesLeft, setUserVotesLeft] = useState(5);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Mock multiple images for carousel
  const images = [
    team.img,
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400'
  ];

  // Mock trend data
  const trendData = [
    { date: '03-18', votes: 120 },
    { date: '03-19', votes: 150 },
    { date: '03-20', votes: 180 },
    { date: '03-21', votes: 140 },
    { date: '03-22', votes: team?.todayVotes || 0 }
  ];
  const maxTrendVotes = Math.max(...trendData.map(d => d.votes));

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

  if (!team || !item) {
    return (
      <PageWrapper type="fade">
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] px-5">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Info className="w-10 h-10 text-[#ccc]" />
          </div>
          <h2 className="text-[18px] font-bold text-[#333] mb-2">队伍不存在</h2>
          <p className="text-[14px] text-[#999] text-center mb-8">该队伍可能已被删除或尚未进入投票池</p>
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

  const handleShare = async () => {
    if (!team || !item) return;
    const shareText = `快来为【${team.name}】投票吧！\n活动：${item.title}\n链接：${window.location.href}`;
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('分享文案已复制');
    } catch (err) {
      showToast('复制失败，请手动复制链接');
    }
  };

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
    if (team.todayVotes >= 3) {
      showToast('该队伍今日已满');
      return;
    }
    
    setConfirmModalOpen(true);
  };

  const confirmVote = () => {
    setUserVotesLeft(prev => prev - 1);
    setTeam(prev => prev ? ({ ...prev, votes: prev.votes + 1, todayVotes: prev.todayVotes + 1 }) : null);
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
            onClick={handleShare}
          >
            <Share2 className="w-[22px] h-[22px] text-[#111]" strokeWidth={2.5} />
          </div>
        </div>

        {/* Hero Image Carousel */}
        <div className="relative w-full h-[360px] bg-[#eee] overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="w-full h-full shrink-0 relative cursor-pointer"
                onClick={() => setPreviewImage(img)}
              >
                <img src={img} className="w-full h-full object-cover" alt={`${team.name} - ${idx + 1}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-[100px] left-0 w-full flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  currentImageIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/50"
                )}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-white z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-[12px] font-bold px-2 py-1 rounded-md border border-white/30">
                {team.id}号
              </span>
              <span className="bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] text-white text-[12px] font-bold px-2 py-1 rounded-md shadow-sm">
                当前排名 NO.{team.rank}
              </span>
              <span className="bg-black/30 backdrop-blur-md text-white text-[12px] font-bold px-2 py-1 rounded-md border border-white/20">
                {item.title}
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

        {/* Vote Trend Card */}
        <div className="mx-5 bg-white rounded-[24px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mb-5">
          <h3 className="text-[16px] font-extrabold text-[#111] mb-4 flex items-center">
            <div className="w-1 h-4 bg-[#10b981] rounded-full mr-2" />
            近期票数走势
          </h3>
          <div className="h-[120px] flex items-end justify-between gap-2 pt-4">
            {trendData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] text-[#999] font-bold">{data.votes}</div>
                <div className="w-full bg-[#f0f2f5] rounded-t-md relative flex items-end justify-center" style={{ height: '80px' }}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.votes / maxTrendVotes) * 100}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={cn(
                      "w-full rounded-t-md",
                      idx === trendData.length - 1 ? "bg-gradient-to-t from-[#ff9a44] to-[#ff5e00]" : "bg-[#e5e7eb]"
                    )}
                  />
                </div>
                <div className="text-[10px] text-[#666]">{data.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Voting Rules */}
        <div className="mx-5 bg-white rounded-[24px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] font-extrabold text-[#111] flex items-center">
              <Info className="w-4 h-4 text-[#ff5e00] mr-1.5" />
              计票规则
            </h3>
            {item.status !== 'ended' && (
              <div className="text-[12px] text-[#666]">
                今日剩余 {isLoggedIn ? <span className="font-bold text-[#ff5e00] text-[14px]">{userVotesLeft}</span> : <span className="font-bold text-[#ff5e00] text-[14px] underline cursor-pointer" onClick={() => setIsLoginOpen(true)}>登录后查看</span>} 票
              </div>
            )}
          </div>
          <div className="bg-[#fff4ed] rounded-xl p-3 text-[13px] text-[#ff5e00] leading-relaxed">
            <p className="mb-1">• 微信用户：每投1票计为 <strong>1票</strong></p>
            <p>• 银行用户：每投1票计为 <strong>2票</strong></p>
          </div>
        </div>

        {/* Poster Button */}
        <div className="mx-5 mb-6">
          <div 
            className="w-full h-[54px] bg-white border border-[#ff5e00]/20 rounded-[27px] flex items-center justify-center text-[15px] font-bold text-[#ff5e00] shadow-sm cursor-pointer active:bg-[#fff4ed] transition-colors"
            onClick={() => setPosterModalOpen(true)}
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            生成拉票海报
          </div>
        </div>

        {/* Quick Links */}
        <div className="mx-5 mb-8 flex gap-3">
          <div 
            className="flex-1 h-[44px] bg-white rounded-[22px] flex items-center justify-center text-[14px] font-bold text-[#666] shadow-sm border border-[#e5e7eb] cursor-pointer active:bg-[#f9f9f9]"
            onClick={() => navigate(`/vote-list/${item.id}`)}
          >
            <List className="w-4 h-4 mr-1.5" />
            返回投票列表
          </div>
          <div 
            className="flex-1 h-[44px] bg-white rounded-[22px] flex items-center justify-center text-[14px] font-bold text-[#666] shadow-sm border border-[#e5e7eb] cursor-pointer active:bg-[#f9f9f9]"
            onClick={() => navigate(`/leaderboard/${item.id}`)}
          >
            <Trophy className="w-4 h-4 mr-1.5" />
            查看排行榜
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
                    : team.todayVotes >= 3
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
                  : team.todayVotes >= 3
                    ? "该队伍今日已满"
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

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90" onClick={() => setPreviewImage(null)}>
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={previewImage} 
              className="max-w-full max-h-full object-contain"
              alt="Preview"
            />
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};
