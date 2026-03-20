import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { cn } from '../utils/cn';

export const MyRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, myRegistrations, showToast } = useAppContext();
  
  const actData = activities.find(a => a.id === Number(id));
  const regData = myRegistrations[Number(id)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!actData || !regData) return null;

  const getStatusInfo = () => {
    switch (regData.auditStatus) {
      case 'pending': return { icon: <Clock className="w-8 h-8 text-[#f59e0b]" />, title: '报名审核中', desc: '您的资料已提交，工作人员将尽快审核，请耐心等待。', bg: 'from-white/80 to-[#fef3c7]/70' };
      case 'approved': return { icon: <CheckCircle className="w-8 h-8 text-[#10b981]" />, title: '报名成功', desc: '恭喜您的队伍通过审核，请关注后续比赛通知！', bg: 'from-white/80 to-[#d1fae5]/70' };
      case 'rejected': return { icon: <XCircle className="w-8 h-8 text-[#ef4444]" />, title: '审核已被驳回', desc: '请检查资料是否符合要求，点击返回修改并重新提交。', bg: 'from-white/80 to-[#fee2e2]/70' };
      default: return { icon: null, title: '', desc: '', bg: '' };
    }
  };

  const statusInfo = getStatusInfo();

  const getPopStatusBadge = () => {
    switch (regData.popStatus) {
      case 'none': return <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-semibold ml-2 bg-[#f3f4f6] text-[#6b7280]">未参加</span>;
      case 'pending': return <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-semibold ml-2 bg-[#fef3c7] text-[#d97706]">图片审核中</span>;
      case 'approved': return <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-semibold ml-2 bg-[#d1fae5] text-[#059669]">审核通过</span>;
      case 'rejected': return <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-semibold ml-2 bg-[#fee2e2] text-[#e11d48]">已驳回</span>;
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
    <PageWrapper type="slide">
      <div className="fixed top-0 left-0 w-full h-[88px] bg-white/85 backdrop-blur-[20px] flex items-end justify-center pb-3 z-[100] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
        <div className="absolute left-5 bottom-3 w-8 h-8 flex items-center justify-center cursor-pointer" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-[#111]" strokeWidth={2.5} />
        </div>
        <div className="text-[17px] font-bold text-[#111]">报名详情</div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[88px] pb-[120px] scrollbar-hide">
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className={cn("m-5 p-[30px_20px] bg-gradient-to-br backdrop-blur-[25px] rounded-[32px] border-[1.5px] border-white text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)]", statusInfo.bg)}>
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
              {statusInfo.icon}
            </div>
            <h2 className="text-[22px] font-extrabold text-[#111] mb-2">{statusInfo.title}</h2>
            <p className="text-sm text-[#666]">{statusInfo.desc}</p>
            
            <div className="flex items-center bg-white/50 rounded-[16px] p-3 mt-5 cursor-pointer border border-white/80" onClick={() => navigate(`/detail/${id}`)}>
              <motion.img layoutId={`hero-img-${id}`} src={actData.img} className="w-14 h-14 rounded-[10px] object-cover mr-3" alt="cover" />
              <div className="flex-1 text-left">
                <div className="text-sm font-bold text-[#111] mb-1 line-clamp-1">{actData.title}</div>
                <div className="text-xs text-[#666]">{actData.time}</div>
              </div>
            </div>
          </motion.div>

          {regData.auditStatus === 'approved' && (
            <motion.div variants={itemVariants} className="m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
              <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
                <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>人气奖展示状态
              </h2>
              <div className="flex justify-between items-center mb-0 text-[15px] leading-[1.5]">
                <span className="text-[#666] shrink-0 mr-4">当前状态</span>
                {getPopStatusBadge()}
              </div>
              <div className="mt-5">
                {regData.popStatus === 'none' && (
                  <div className="w-full h-[50px] border-[1.5px] border-dashed border-[#ff5e00] rounded-[16px] text-[#ff5e00] flex items-center justify-center text-[15px] font-bold cursor-pointer bg-[#fff0e6] active:scale-[0.98] transition-transform" onClick={() => navigate(`/pop-submit/${id}?mode=edit`)}>
                    参加人气风采展示
                  </div>
                )}
                {regData.popStatus === 'pending' && (
                  <div className="w-full h-[50px] border-[1.5px] border-dashed border-[#ff5e00] rounded-[16px] text-[#ff5e00] flex items-center justify-center text-[15px] font-bold cursor-pointer bg-[#fff0e6] active:scale-[0.98] transition-transform" onClick={() => navigate(`/pop-submit/${id}?mode=edit`)}>
                    查看并修改图片 (待审核)
                  </div>
                )}
                {regData.popStatus === 'rejected' && (
                  <div className="w-full h-[50px] border-[1.5px] border-dashed border-[#ff5e00] rounded-[16px] text-[#ff5e00] flex items-center justify-center text-[15px] font-bold cursor-pointer bg-[#fff0e6] active:scale-[0.98] transition-transform" onClick={() => navigate(`/pop-submit/${id}?mode=edit`)}>
                    修改并重新提交 (已驳回)
                  </div>
                )}
                {regData.popStatus === 'approved' && (
                  <>
                    <div className="w-full h-[50px] border-[1.5px] border-dashed border-[#ff5e00] rounded-[16px] text-[#ff5e00] flex items-center justify-center text-[15px] font-bold cursor-pointer bg-[#fff0e6] active:scale-[0.98] transition-transform" onClick={() => navigate(`/pop-submit/${id}?mode=view`)}>
                      查看已提交展示照片
                    </div>
                    <div className="w-full h-[50px] border border-[#ff5e00] rounded-[16px] text-[#ff5e00] flex items-center justify-center text-[15px] font-bold cursor-pointer bg-transparent active:scale-[0.98] transition-transform mt-2.5" onClick={() => showToast('正在前往投票详情页...')}>
                      进入拉票
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
            <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
              <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>队伍资料
            </h2>
            <div className="flex justify-between mb-3.5 text-[15px] leading-[1.5]">
              <span className="text-[#666] shrink-0 mr-4">队伍名称</span>
              <span className="text-[#111] font-semibold text-right break-all">{regData.teamName}</span>
            </div>
            <div className="flex justify-between mb-3.5 text-[15px] leading-[1.5]">
              <span className="text-[#666] shrink-0 mr-4">参赛口号</span>
              <span className="text-[#111] font-semibold text-right break-all">{regData.slogan || '--'}</span>
            </div>
            <div className="flex flex-col mb-0 text-[15px] leading-[1.5]">
              <span className="text-[#666] shrink-0 mr-4">风采照片</span>
              <img className="w-full h-[160px] rounded-xl object-cover mt-3 border border-[#eee]" src={regData.teamImg} alt="team" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
            <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
              <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>负责人信息
            </h2>
            <div className="flex justify-between mb-3.5 text-[15px] leading-[1.5]">
              <span className="text-[#666] shrink-0 mr-4">队长姓名</span>
              <span className="text-[#111] font-semibold text-right break-all">{regData.capName}</span>
            </div>
            <div className="flex justify-between mb-3.5 text-[15px] leading-[1.5]">
              <span className="text-[#666] shrink-0 mr-4">联系电话</span>
              <span className="text-[#111] font-semibold text-right break-all">{regData.capPhone}</span>
            </div>
            <div className="flex justify-between mb-0 text-[15px] leading-[1.5]">
              <span className="text-[#666] shrink-0 mr-4">所在城市</span>
              <span className="text-[#111] font-semibold text-right break-all">{regData.city}</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
            <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
              <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>队员名单 <span className="text-sm font-normal text-[#999] ml-2">(共{regData.members.length}人)</span>
            </h2>
            <div className="mt-3">
              {regData.members.map(m => (
                <div key={m.id} className="flex items-center py-3 border-b border-dashed border-[#eee] last:border-b-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-[#fff0e6] text-[#ff5e00] flex items-center justify-center text-sm font-bold mr-3">
                    {m.name.charAt(0) || '匿'}
                  </div>
                  <div className="flex-1">
                    <span className="text-[15px] font-semibold text-[#111] mb-0.5 block">{m.name}</span>
                    <span className="text-[13px] text-[#666]">{m.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};
