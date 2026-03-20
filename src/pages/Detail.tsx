import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { PageWrapper } from '../components/PageWrapper';
import { ChevronLeft, Share2, MapPin, Clock, Info, Award, BarChart2, Trophy, Vote } from 'lucide-react';
import { cn } from '../utils/cn';

export const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { activities, isLoggedIn, myRegistrations, setIsLoginOpen, showToast } = useAppContext();
  
  const item = activities.find(a => a.id === Number(id));
  const filterKey = location.state?.filterKey || '全部城市-all';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!item) return null;

  const regData = myRegistrations[item.id];

  const handleEnroll = () => {
    if (!isLoggedIn) {
      showToast('请先登录后进行操作');
      setIsLoginOpen(true);
      return;
    }
    
    if (item.status === 'signup') {
      if (regData) {
        if (regData.auditStatus === 'approved') {
          navigate(`/my-registration/${item.id}`);
        } else {
          navigate(`/signup/${item.id}`);
        }
      } else {
        navigate(`/signup/${item.id}`);
      }
    } else {
      showToast(`提示：当前状态为 [${item.statusText}]，无法进行报名操作`);
    }
  };

  const handleSC = (m: string) => {
    if (!isLoggedIn) {
      showToast('尚未登录，请先登录');
      setIsLoginOpen(true);
      return;
    }
    if (m === '我的报名') {
      if (regData) {
        navigate(`/my-registration/${item.id}`);
      } else {
        showToast('您还未报名该活动');
      }
    } else {
      showToast('功能开发中: ' + m);
    }
  };

  const getActionBtnProps = () => {
    if (item.status === 'signup' && isLoggedIn && regData) {
      if (regData.auditStatus === 'pending') {
        return { text: '待审核 (点击修改)', className: 'bg-[#f59e0b] shadow-[0_8px_20px_rgba(245,158,11,0.2)]' };
      } else if (regData.auditStatus === 'rejected') {
        return { text: '已驳回 (点击修改)', className: 'bg-[#ef4444] shadow-[0_8px_20px_rgba(239,68,68,0.2)]' };
      } else if (regData.auditStatus === 'approved') {
        return { text: '审核通过 (查看详情)', className: 'bg-[#10b981] shadow-[0_8px_20px_rgba(16,185,129,0.2)]' };
      }
    }
    
    if (item.status === 'signup') {
      return { text: '立即报名', className: 'bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] shadow-[0_8px_20px_rgba(255,94,0,0.2)]' };
    }
    
    return { text: item.statusText, className: 'bg-[#d9d9d9] text-white shadow-none cursor-not-allowed' };
  };

  const actionProps = getActionBtnProps();

  const detailContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };
  
  const detailItemVariants = {
    hidden: { opacity: 0, y: 60 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.2, duration: 0.5 } }
  };

  return (
    <PageWrapper type="fade">
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

      <motion.div variants={detailContainerVariants} initial="hidden" animate="show" className="flex-1 overflow-y-auto pb-[120px] scrollbar-hide">
        <div className="w-full h-[320px] relative z-[1]">
          <motion.img layoutId={`hero-img-${item.id}-${filterKey}`} src={item.img} className="w-full h-full object-cover rounded-none" alt={item.title} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-[2]"></div>
        </div>

        <motion.div variants={detailItemVariants} className="mt-[-50px] mx-4 mb-6 bg-white/90 backdrop-blur-[25px] rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative z-[2] border-[1.5px] border-white">
          <h1 className="text-[22px] font-extrabold mb-[15px] leading-[1.3] text-[#111]">{item.title}</h1>
          <div className="flex items-center text-sm text-[#444] mb-2.5">
            <MapPin className="w-4 h-4 mr-2.5 opacity-60" />
            {item.loc}
          </div>
          <div className="flex items-center text-sm text-[#444] mb-2.5">
            <Info className="w-4 h-4 mr-2.5 opacity-60" />
            {item.statusText}：{item.time}
          </div>
          <div className="flex items-center text-sm text-[#444]">
            <Clock className="w-4 h-4 mr-2.5 opacity-60" />
            {item.time}
          </div>
        </motion.div>

        <motion.div variants={detailItemVariants} className="grid grid-cols-2 gap-[15px] px-4 pb-5">
          <div className="bg-white rounded-[20px] p-[18px] flex items-center shadow-[0_5px_15px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-200" onClick={() => handleSC('我的报名')}>
            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mr-3 bg-[#eef2ff] text-[#4f46e5]">
              <Award className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-[#111]">我的报名</span>
          </div>
          <div className="bg-white rounded-[20px] p-[18px] flex items-center shadow-[0_5px_15px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-200" onClick={() => handleSC('人气投票')}>
            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mr-3 bg-[#fff1f2] text-[#e11d48]">
              <Vote className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-[#111]">人气投票</span>
          </div>
          <div className="bg-white rounded-[20px] p-[18px] flex items-center shadow-[0_5px_15px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-200" onClick={() => handleSC('投票榜单')}>
            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mr-3 bg-[#fffbeb] text-[#d97706]">
              <BarChart2 className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-[#111]">投票榜单</span>
          </div>
          <div className="bg-white rounded-[20px] p-[18px] flex items-center shadow-[0_5px_15px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-200" onClick={() => handleSC('比赛结果')}>
            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mr-3 bg-[#f0fdf4] text-[#16a34a]">
              <Trophy className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-[#111]">比赛结果</span>
          </div>
        </motion.div>

        <motion.div variants={detailItemVariants} className="bg-white p-[25px_20px] mb-5">
          <h2 className="text-[18px] font-extrabold mb-3 flex items-center text-[#111]">
            <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2.5"></div>
            详情介绍
          </h2>
          <p className="text-[15px] text-[#444] leading-[1.8]">
            为丰富精神生活，展现风采，本届大赛诚邀广大队伍。人数限10-20人，报名请上传团队风采照。
          </p>
        </motion.div>
      </motion.div>

      <motion.div variants={detailItemVariants} initial="hidden" animate="show" className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-[15px] p-[12px_20px_34px] shadow-[0_-5px_20px_rgba(0,0,0,0.04)] z-[100]">
        <div 
          className={cn(
            "h-[56px] rounded-[28px] text-white flex items-center justify-center text-[17px] font-bold cursor-pointer transition-all duration-200",
            actionProps.className
          )}
          onClick={handleEnroll}
        >
          {actionProps.text}
        </div>
      </motion.div>
    </PageWrapper>
  );
};
