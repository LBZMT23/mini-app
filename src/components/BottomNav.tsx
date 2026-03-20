import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Home, Vote, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useAppContext();

  const isVisible = ['/', '/vote', '/user'].includes(location.pathname);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 120, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 120, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-[30px] left-1/2 w-[88%] max-w-[400px] h-[72px] bg-[#f0f0f0]/70 backdrop-blur-[20px] rounded-[36px] flex items-center justify-between px-2 z-[100]"
        >
          <div 
            className={cn("flex-1 flex flex-col items-center cursor-pointer transition-all duration-200 text-[#666]", location.pathname === '/' && "text-black bg-black/10 rounded-[30px] py-2")}
            onClick={() => navigate('/')}
          >
            <Home className="w-[22px] h-[22px]" />
            <span className="text-[11px] font-bold mt-0.5">首页</span>
          </div>
          <div 
            className={cn("flex-1 flex flex-col items-center cursor-pointer transition-all duration-200 text-[#666]", location.pathname === '/vote' && "text-black bg-black/10 rounded-[30px] py-2")}
            onClick={() => navigate('/vote')}
          >
            <Vote className="w-[22px] h-[22px]" />
            <span className="text-[11px] font-bold mt-0.5">投票</span>
          </div>
          <div 
            className={cn("flex-1 flex flex-col items-center cursor-pointer transition-all duration-200 text-[#666]", location.pathname === '/user' && "text-black bg-black/10 rounded-[30px] py-2")}
            onClick={() => showToast('个人中心开发中')}
          >
            <User className="w-[22px] h-[22px]" />
            <span className="text-[11px] font-bold mt-0.5">我的</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
