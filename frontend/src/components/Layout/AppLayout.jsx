// 🌌 UNIVERSE UI APPLIED — Logic unchanged. Visual layer only.
// Changes: Added universe background, role gradient overlay, cursor glow effect. Made shell glass morphism.

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UniverseBackground, RoleGradientOverlay, CursorGlow } from '../Effects';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MainContainer from './MainContainer';
import { AgentChat } from '../AgentChat';

const AppLayout = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  return (
    <>
      {/* Layer 0: Universe starfield canvas */}
      <UniverseBackground role={role} />

      {/* Layer 1: Role-specific gradient overlay + cursor glow */}
      <RoleGradientOverlay role={role} />
      <CursorGlow role={role} />

      {/* Layer 2: App shell with glass morphism */}
      <div 
        className="flex h-screen text-text-primary overflow-hidden"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Navbar />
          <MainContainer>
            <Outlet />
          </MainContainer>
        </div>
      </div>
      <AgentChat />
    </>
  );
};

export default AppLayout;
