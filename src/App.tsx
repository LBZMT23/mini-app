/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Signup } from './pages/Signup';
import { MyRegistration } from './pages/MyRegistration';
import { PopSubmit } from './pages/PopSubmit';
import { VoteIndex } from './pages/VoteIndex';
import { VoteList } from './pages/VoteList';
import { TeamDetail } from './pages/TeamDetail';
import { Leaderboard } from './pages/Leaderboard';
import { BottomNav } from './components/BottomNav';
import { LoginPopup } from './components/LoginPopup';
import { Toast } from './components/Toast';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="popLayout">
      {/* @ts-ignore - React 19 key typing issue with react-router-dom */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/signup/:id" element={<Signup />} />
        <Route path="/my-registration/:id" element={<MyRegistration />} />
        <Route path="/pop-submit/:id" element={<PopSubmit />} />
        <Route path="/vote" element={<VoteIndex />} />
        <Route path="/vote-list/:id" element={<VoteList />} />
        <Route path="/team-detail/:id" element={<TeamDetail />} />
        <Route path="/leaderboard/:id" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="w-full h-screen bg-[#f0f2f5] relative overflow-hidden font-sans">
          <AnimatedRoutes />
          <BottomNav />
          <LoginPopup />
          <Toast />
        </div>
      </Router>
    </AppProvider>
  );
}
