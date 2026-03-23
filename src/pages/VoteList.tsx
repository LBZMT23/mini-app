import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { PageWrapper } from '../components/PageWrapper';
import { ChevronLeft, Share2, RefreshCw, Search, Info, Trophy, Heart } from 'lucide-react';
import { cn } from '../utils/cn';

export interface Team {
  id: number;
  activityId: number;
  name: string;
  slogan: string;
  img: string;
  votes: number;
  todayVotes: number;
  rank: number;
}

export const MOCK_TEAMS: Team[] = [
  { id: 101, activityId: 2, name: '朝阳太极之光', slogan: '太极生两仪，舞动夕阳红', img: 'https://images.unsplash.com/photo-1552084117-56a98a96e1b7?w=400', votes: 1250, todayVotes: 0, rank: 1 },
  { id: 102, activityId: 1, name: '滨江活力舞蹈队', slogan: '活力四射，舞出自我！', img: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400', votes: 1120, todayVotes: 1, rank: 2 },
  { id: 103, activityId: 3, name: '老干部合唱团', slogan: '唱响夕阳红，歌声满天下', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', votes: 980, todayVotes: 2, rank: 3 },
  { id: 104, activityId: 4, name: '深圳银发模特队', slogan: '走出自信风采，展现银发魅力', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400', votes: 850, todayVotes: 0, rank: 4 },
  { id: 105, activityId: 6, name: '浦东新区象棋队', slogan: '棋逢对手，乐在其中', img: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400', votes: 720, todayVotes: 1, rank: 5 },
  { id: 106, activityId: 5, name: '青羊区书法协会', slogan: '笔墨丹青，传承文化', img: 'https://images.unsplash.com/photo-1544626129-8472f8837eec?w=400', votes: 650, todayVotes: 2, rank: 6 },
  { id: 107, activityId: 1, name: '西湖区广场舞之星', slogan: '舞动西湖，展现风采', img: 'https://images.unsplash.com/photo-1504609774514-cb18d022b72a?w=400', votes: 540, todayVotes: 0, rank: 7 },
  { id: 108, activityId: 2, name: '天河区太极拳队', slogan: '行云流水，刚柔并济', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400', votes: 420, todayVotes: 1, rank: 8 },
  { id: 109, activityId: 3, name: '越秀区金秋合唱团', slogan: '金秋岁月，歌声嘹亮', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', votes: 380, todayVotes: 2, rank: 9 },
  { id: 110, activityId: 4, name: '福田区风采模特队', slogan: '时尚不分年龄', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400', votes: 350, todayVotes: 0, rank: 10 },
  { id: 111, activityId: 5, name: '武侯区墨香书画社', slogan: '墨香四溢，书画人生', img: 'https://images.unsplash.com/photo-1544626129-8472f8837eec?w=400', votes: 310, todayVotes: 1, rank: 11 },
  { id: 112, activityId: 6, name: '闵行区楚汉棋社', slogan: '楚汉争霸，智者胜', img: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400', votes: 290, todayVotes: 2, rank: 12 },
];

export const VoteList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, isLoggedIn, setIsLoginOpen, showToast } = useAppContext();
  
  const item = activities.find(a => a.id === Number(id));
  
  const [keyword, setKeyword] = useState(() => sessionStorage.getItem(`voteListKeyword-${id}`) || '');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS.filter(t => t.activityId === Number(id)));
  const [userVotesLeft, setUserVotesLeft] = useState(5);
  const [sortBy, setSortBy] = useState<'votes' | 'id'>(() => (sessionStorage.getItem(`voteListSortBy-${id}`) as 'votes' | 'id') || 'votes');
  
  const filterKey = `${keyword}-${sortBy}`;
  
  // Modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem(`voteListKeyword-${id}`, keyword);
  }, [keyword, id]);

  useEffect(() => {
    sessionStorage.setItem(`voteListSortBy-${id}`, sortBy);
  }, [sortBy, id]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`voteListScrollPos-${id}`);
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem(`voteListScrollPos-${id}`, e.currentTarget.scrollTop.toString());
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey(prev => prev + 1);
      showToast('列表已刷新');
    }, 800);
  };

  const handleShare = async () => {
    if (!item) return;
    const shareText = `快来看看【${item.title}】的最新投票列表吧！\n链接：${window.location.href}`;
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('分享文案已复制');
    } catch (err) {
      showToast('复制失败，请手动复制链接');
    }
  };

  const handleVoteClick = (team: Team) => {
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
    
    setSelectedTeam(team);
    setConfirmModalOpen(true);
  };

  const confirmVote = () => {
    if (!selectedTeam) return;
    
    setUserVotesLeft(prev => prev - 1);
    setTeams(prev => prev.map(t => {
      if (t.id === selectedTeam.id) {
        return { ...t, votes: t.votes + 1, todayVotes: t.todayVotes + 1 };
      }
      return t;
    }));
    
    setConfirmModalOpen(false);
    setSelectedTeam(null);
    showToast('投票成功！');
  };

  const teamsWithRank = [...teams]
    .sort((a, b) => b.votes - a.votes)
    .map((t, index) => ({ ...t, rank: index + 1 }));

  const filteredTeams = teamsWithRank
    .filter(t => t.name.includes(keyword) || t.id.toString().includes(keyword))
    .sort((a, b) => {
      if (sortBy === 'votes') {
        return b.votes - a.votes;
      }
      return a.id - b.id;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } }
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
          <div 
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 text-[#111]" strokeWidth={2.5} />
          </div>
        </div>

        {/* Activity Info Card */}
        <div className="mx-5 mt-2 mb-5 bg-white rounded-[24px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)]">
          <h1 className="text-[18px] font-extrabold mb-3 text-[#111] leading-snug">{item.title}</h1>
          <div className="flex items-center text-[13px] text-[#666] mb-4">
            <span className="bg-[#f5f5f5] px-2.5 py-1 rounded-md mr-2">投票时间</span>
            {item.voteTimeStr}
          </div>
          
          <div className="bg-gradient-to-r from-[#fff4ed] to-[#fffaf5] rounded-[16px] p-4 border border-[#ffe4cc]">
            {item.status !== 'ended' && (
              <div className="flex justify-between items-center mb-3">
                <div className="text-[14px] font-bold text-[#b45309]">今日剩余票数</div>
                <div className="text-[20px] font-extrabold text-[#ea580c]">
                  {isLoggedIn ? userVotesLeft : <span className="text-[14px] font-medium text-[#ea580c] underline underline-offset-2" onClick={() => setIsLoginOpen(true)}>登录后查看</span>}
                </div>
              </div>
            )}
            <div className={cn("text-[12px] text-[#d97706] leading-relaxed opacity-80", item.status === 'ended' && "text-center")}>
              计票规则：微信用户1票=1票，银行认证用户1票=2票。每人每天最多可投5票，单支队伍每天最多可投3票。
            </div>
          </div>
        </div>

        {/* Actions & Search */}
        <div className="mx-5 mb-5 space-y-4">
          <div className="flex gap-3">
            <div 
              className="flex-1 bg-white h-[44px] rounded-[22px] flex items-center justify-center text-[14px] font-bold text-[#111] shadow-sm cursor-pointer"
              onClick={() => navigate(`/leaderboard/${item.id}`)}
            >
              <Trophy className="w-4 h-4 mr-1.5 text-[#eab308]" />
              查看排行榜
            </div>
            <div 
              className="flex-1 bg-white h-[44px] rounded-[22px] flex items-center justify-center text-[14px] font-bold text-[#111] shadow-sm cursor-pointer"
              onClick={handleRefresh}
            >
              <RefreshCw className={cn("w-4 h-4 mr-1.5 text-[#3b82f6]", isRefreshing && "animate-spin")} />
              刷新列表
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#999]" />
            </div>
            <input
              type="text"
              className="w-full h-[44px] bg-white border-none rounded-[22px] pl-10 pr-4 text-[14px] text-[#333] placeholder-[#999] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff5e00]/20"
              placeholder="搜索队伍编号或名称..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 px-2 pt-1">
            <div 
              className={cn("text-[14px] font-bold transition-colors cursor-pointer relative", sortBy === 'votes' ? "text-[#ff5e00]" : "text-[#666]")}
              onClick={() => setSortBy('votes')}
            >
              按票数排序
              {sortBy === 'votes' && (
                <motion.div layoutId="sort-indicator" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#ff5e00] rounded-full" />
              )}
            </div>
            <div 
              className={cn("text-[14px] font-bold transition-colors cursor-pointer relative", sortBy === 'id' ? "text-[#ff5e00]" : "text-[#666]")}
              onClick={() => setSortBy('id')}
            >
              按编号排序
              {sortBy === 'id' && (
                <motion.div layoutId="sort-indicator" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#ff5e00] rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Team List */}
        <motion.div 
          key={`${filterKey}-${refreshKey}`}
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="mx-5 grid grid-cols-2 gap-3"
        >
          {filteredTeams.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-[40px]">
              <Info className="w-12 h-12 text-[#ddd] mb-3" strokeWidth={1.5} />
              <div className="text-[13px] text-[#999]">没有找到相关队伍</div>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <motion.div 
                key={team.id}
                variants={itemVariants}
                className="bg-white/60 backdrop-blur-md border border-white/50 rounded-[20px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex flex-col cursor-pointer"
                onClick={() => navigate(`/team-detail/${team.id}`, { state: { filterKey } })}
              >
                <div className="relative h-[160px] bg-[#eee]">
                  <motion.img layoutId={`team-img-${team.id}-${filterKey}`} src={team.img} className="w-full h-full object-cover" alt={team.name} />
                  <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-lg border border-white/20">
                    NO.{team.rank}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-[#f0f2f5] text-[#666] text-[10px] font-bold px-1.5 py-0.5 rounded-sm shrink-0">{team.id}号</span>
                    <h3 className="text-[15px] font-extrabold text-[#111] truncate">{team.name}</h3>
                  </div>
                  <p className="text-[11px] text-[#666] mb-3 line-clamp-2 leading-snug">{team.slogan}</p>
                  
                  <div className="mt-auto">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#999] mb-0.5">当前票数</span>
                        <span className="text-[16px] font-extrabold text-[#ff5e00] leading-none">{team.votes}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-[#999] mb-0.5">今日新增</span>
                        <span className="text-[12px] font-bold text-[#10b981] leading-none">+{team.todayVotes}</span>
                      </div>
                    </div>
                    
                    <button
                      className={cn(
                        "w-full h-[36px] rounded-[18px] text-[13px] font-bold flex items-center justify-center transition-all",
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
                                  : "bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] text-white shadow-[0_4px_10px_rgba(255,94,0,0.2)] active:scale-95"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVoteClick(team);
                      }}
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
                                    <Heart className="w-3.5 h-3.5 mr-1.5" />
                                    投 TA 一票
                                  </>
                                )
                      }
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModalOpen && selectedTeam && (
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
                  您将为 <span className="font-bold text-[#ff5e00]">{selectedTeam.name}</span> 投出宝贵的一票。<br/>
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
    </PageWrapper>
  );
};
