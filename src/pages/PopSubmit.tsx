import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

export const PopSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'edit';
  const { myRegistrations, setMyRegistrations, showToast } = useAppContext();
  
  const regData = myRegistrations[Number(id)];
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (regData && regData.popImages) {
      setImages([...regData.popImages]);
    }
  }, [regData]);

  if (!regData) return null;

  const handleAddImage = () => {
    if (images.length >= 9) return showToast('最多只能上传 9 张图片');
    showToast('模拟上传中...');
    setTimeout(() => {
      const randomIds = ['1534528741775-53994a69daeb', '1524504388940-b1c1722653e1', '1506863530036-1ef2d1f0b568'];
      const img = `https://images.unsplash.com/photo-${randomIds[images.length % 3]}?auto=format&fit=crop&w=300&q=80`;
      setImages([...images, img]);
    }, 500);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      return showToast('请至少上传 1 张展示图片');
    }
    
    const loadingEl = document.createElement('div');
    loadingEl.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-xl text-sm z-[10000]';
    loadingEl.textContent = '提交审核中...';
    document.body.appendChild(loadingEl);

    setTimeout(() => {
      loadingEl.remove();
      showToast('提交成功！请等待后台审核。');
      
      setMyRegistrations(prev => ({
        ...prev,
        [Number(id)]: {
          ...prev[Number(id)],
          popStatus: 'pending',
          popImages: [...images]
        }
      }));
      
      setTimeout(() => {
        navigate(`/my-registration/${id}`, { replace: true });
      }, 1000);
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.5 } }
  };

  return (
    <PageWrapper type="slide">
      <div className="fixed top-0 left-0 w-full h-[88px] bg-white/85 backdrop-blur-[20px] flex items-end justify-center pb-3 z-[100] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
        <div className="absolute left-5 bottom-3 w-8 h-8 flex items-center justify-center cursor-pointer" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-[#111]" strokeWidth={2.5} />
        </div>
        <div className="text-[17px] font-bold text-[#111]">人气风采照片</div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[88px] pb-[120px] scrollbar-hide" style={{ paddingBottom: mode === 'view' ? '40px' : '120px' }}>
        <div className="m-5 bg-white/70 backdrop-blur-[20px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
          <h2 className="text-[18px] font-extrabold mb-5 flex items-center text-[#111]">
            <div className="w-1 h-4 bg-[#ff5e00] rounded-sm mr-2"></div>上传展示照片
          </h2>
          <div className="text-[13px] text-[#888] leading-[1.6] p-[12px_16px] bg-black/5 rounded-xl mb-5">
            {mode === 'view' 
              ? '当前队伍人气风采照片已通过审核进入展示状态，不可修改。' 
              : '请上传队伍的精美照片用于人气投票展示。支持 jpg/png 格式，每张不超过 5MB，最多允许上传 9 张。'}
          </div>
          
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-3 gap-3 mt-4">
            {images.map((src, index) => (
              <motion.div variants={itemVariants} key={index} className="relative pt-[100%] rounded-xl overflow-hidden bg-[#eee] shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
                <img src={src} className="absolute top-0 left-0 w-full h-full object-cover" alt="pop" />
                {mode === 'edit' && (
                  <div 
                    className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-sm z-[2] cursor-pointer backdrop-blur-sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            ))}
            {mode === 'edit' && images.length < 9 && (
              <motion.div 
                variants={itemVariants}
                className="relative pt-[100%] border-2 border-dashed border-[#ddd] rounded-xl bg-[#fafafa] cursor-pointer transition-all duration-200 active:bg-[#f0f0f0]"
                onClick={handleAddImage}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#999]">
                  <Plus className="w-7 h-7 mb-1" strokeWidth={2.5} />
                  <span className="text-xs">添加图片</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {mode === 'edit' && (
        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-[15px] p-[16px_20px_34px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-[100]">
          <div className="h-[56px] bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] text-white rounded-[28px] flex items-center justify-center text-[17px] font-extrabold cursor-pointer shadow-[0_8px_20px_rgba(255,94,0,0.2)]" onClick={handleSubmit}>
            提交审核
          </div>
        </div>
      )}
    </PageWrapper>
  );
};
