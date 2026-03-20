import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../utils/cn';
import { X, ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginPopup = () => {
  const { isLoginOpen, setIsLoginOpen, setIsLoggedIn, showToast } = useAppContext();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const doLogin = () => {
    if (phone.length !== 11) return showToast('请输入正确的手机号');
    if (code.length !== 6) return showToast('请输入6位验证码');
    showToast('登录成功');
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[1000] bg-gradient-to-b from-[#ffcdb2] to-[#f4f5f7] flex flex-col"
        >
          <div className="p-[60px_30px] flex-1">
            <div 
              className="w-11 h-11 bg-white/50 rounded-full flex items-center justify-center mb-[30px] cursor-pointer"
              onClick={() => setIsLoginOpen(false)}
            >
              <X className="w-5 h-5 text-[#333]" strokeWidth={2.5} />
            </div>
            <h1 className="text-[34px] font-extrabold mb-2.5">欢迎登录</h1>
            <p className="text-[15px] text-[#666] mb-10">请使用手机号登录以继续操作</p>
            
            <div className="mb-[25px]">
              <label className="text-sm font-semibold mb-2.5 block">手机号</label>
              <div className="h-[60px] bg-white rounded-[20px] flex items-center px-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                <input 
                  className="flex-1 border-none outline-none text-base bg-transparent min-w-0" 
                  type="tel" 
                  maxLength={11} 
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-[25px]">
              <label className="text-sm font-semibold mb-2.5 block">验证码</label>
              <div className="h-[60px] bg-white rounded-[20px] flex items-center px-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                <input 
                  className="flex-1 border-none outline-none text-base bg-transparent min-w-0" 
                  type="tel" 
                  maxLength={6} 
                  placeholder="验证码"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <div className="text-[#ff5e00] text-sm font-semibold pl-[15px] border-l border-[#eee] ml-[15px] cursor-pointer whitespace-nowrap">获取验证码</div>
              </div>
            </div>

            <div 
              className="h-[64px] bg-gradient-to-r from-[#ff9a44] to-[#ff5e00] rounded-[32px] flex items-center justify-between px-2.5 pr-6 text-white cursor-pointer transition-all mt-10 shadow-[0_8px_25px_rgba(255,94,0,0.3)]"
              onClick={doLogin}
            >
              <div className="w-11 h-11 rounded-full bg-white/40 flex items-center justify-center border border-white/50 ml-1.5">
                <ArrowRight className="w-[22px] h-[22px]" strokeWidth={2.5} />
              </div>
              <span className="text-[18px] font-extrabold tracking-[1px]">登录</span>
              <ChevronRight className="w-6 h-6 mr-1" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
