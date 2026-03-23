import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Activity, Registration } from '../types';

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  myRegistrations: Record<number, Registration>;
  setMyRegistrations: React.Dispatch<React.SetStateAction<Record<number, Registration>>>;
  activities: Activity[];
  showToast: (msg: string) => void;
  toastMsg: string;
  isLoginOpen: boolean;
  setIsLoginOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const [myRegistrations, setMyRegistrations] = useState<Record<number, Registration>>({
    1: { auditStatus: 'approved', popStatus: 'approved', popImages: ['https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400'], teamName: '滨江活力舞蹈队', slogan: '活力四射，舞出自我！', teamImg: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400', capName: '王大妈', capPhone: '13800138000', city: '上海', members: [{id:1, name:'李阿姨', phone:'13900139000'}, {id:2, name:'张大爷', phone:'13700137000'}] },
    2: { auditStatus: 'approved', popStatus: 'approved', popImages: ['https://images.unsplash.com/photo-1552084117-56a98a96e1b7?w=400'], teamName: '朝阳太极之光', slogan: '太极生两仪', teamImg: 'https://images.unsplash.com/photo-1552084117-56a98a96e1b7?w=400', capName: '赵大爷', capPhone: '13600136000', city: '北京', members: [{id:1, name:'孙阿姨', phone:'13500135000'}] },
    3: { auditStatus: 'approved', popStatus: 'approved', popImages: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'], teamName: '老干部合唱团', slogan: '唱响夕阳红', teamImg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', capName: '刘女士', capPhone: '13300133000', city: '广州', members: [{id:1, name:'陈姐', phone:'13200132000'}] },
    4: { auditStatus: 'approved', popStatus: 'approved', popImages: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400'], teamName: '深圳银发模特队', slogan: '走出自信风采', teamImg: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400', capName: '李队长', capPhone: '13100131000', city: '深圳', members: [{id:1, name:'王阿姨', phone:'13000130000'}] }
  });

  const now = new Date().getTime();
  const day = 24 * 60 * 60 * 1000;
  const formatTime = (ms: number) => {
    const d = new Date(ms);
    return `${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  };

  const rawData = [
    { id: 1, title: '2024上海社区广场舞大赛(春季赛)', city: '上海', loc: '徐汇区滨江广场', cur: 12, max: 20, img: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=400', enrollStart: now - 15*day, enrollEnd: now - 5*day, voteStart: now - 2*day, voteEnd: now + 5*day, activityEnd: now + 10*day, voteTeamCount: 12, totalVotes: 1500, matchResultPublished: false, popResultPublished: false }, 
    { id: 2, title: '北京朝阳太极拳表演赛', city: '北京', loc: '朝阳公园东门', cur: 10, max: 30, img: 'https://images.unsplash.com/photo-1552084117-56a98a96e1b7?auto=format&fit=crop&q=80&w=400', enrollStart: now - 20*day, enrollEnd: now - 10*day, voteStart: now - 5*day, voteEnd: now + 5*day, activityEnd: now + 10*day, voteTeamCount: 25, totalVotes: 12450, matchResultPublished: false, popResultPublished: false }, 
    { id: 3, title: '广州老干部合唱节', city: '广州', loc: '越秀区文化馆', cur: 12, max: 15, img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400', enrollStart: now - 30*day, enrollEnd: now - 20*day, voteStart: now - 15*day, voteEnd: now - 5*day, activityEnd: now - 1*day, voteTeamCount: 15, totalVotes: 8900, matchResultPublished: true, popResultPublished: true }, 
    { id: 4, title: '2024深圳银发模特走秀大赛', city: '深圳', loc: '深圳市民中心', cur: 8, max: 15, img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400', enrollStart: now - 1*day, enrollEnd: now + 10*day, voteStart: now + 15*day, voteEnd: now + 20*day, activityEnd: now + 25*day, voteTeamCount: 0, totalVotes: 0, matchResultPublished: false, popResultPublished: false }, 
    { id: 5, title: '成都青羊区书法交流展', city: '成都', loc: '青羊区文化宫', cur: 0, max: 50, img: 'https://images.unsplash.com/photo-1544626129-8472f8837eec?auto=format&fit=crop&q=80&w=400', enrollStart: now + 5*day, enrollEnd: now + 15*day, voteStart: now + 20*day, voteEnd: now + 25*day, activityEnd: now + 30*day, voteTeamCount: 0, totalVotes: 0, matchResultPublished: false, popResultPublished: false }, 
    { id: 6, title: '上海浦东新区象棋大赛', city: '上海', loc: '浦东图书馆', cur: 50, max: 50, img: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=400', enrollStart: now - 25*day, enrollEnd: now - 10*day, voteStart: now - 5*day, voteEnd: now + 10*day, activityEnd: now + 15*day, voteTeamCount: 48, totalVotes: 5600, matchResultPublished: false, popResultPublished: true } 
  ];

  const activities = rawData.map(item => {
    const timeNow = new Date().getTime();
    let status = '';
    let statusText = '';
    
    if (timeNow > item.activityEnd) {
        status = 'ended'; statusText = '已结束';
    } else if (timeNow >= item.voteStart && timeNow <= item.voteEnd) {
        status = 'voting'; statusText = '投票中';
    } else if ((timeNow > item.enrollEnd && timeNow < item.voteStart) || item.cur >= item.max) {
        if (timeNow < item.enrollStart) {
            status = 'upcoming'; statusText = '未开始';
        } else {
            status = 'signend'; statusText = '报名已截止';
        }
    } else if (timeNow >= item.enrollStart && timeNow <= item.enrollEnd && item.cur < item.max) {
        status = 'signup'; statusText = '报名中';
    } else if (timeNow < item.enrollStart) {
        status = 'upcoming'; statusText = '未开始';
    } else {
        status = 'ended'; statusText = '已结束'; 
    }

    return {
        ...item,
        status,
        statusText,
        time: `${formatTime(item.enrollStart)}-${formatTime(item.enrollEnd)}`,
        voteTimeStr: `${formatTime(item.voteStart)} - ${formatTime(item.voteEnd)}`
    };
  });

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, myRegistrations, setMyRegistrations, activities, showToast, toastMsg, isLoginOpen, setIsLoginOpen }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
