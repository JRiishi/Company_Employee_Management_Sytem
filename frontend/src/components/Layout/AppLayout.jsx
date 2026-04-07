import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MainContainer from './MainContainer';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 font-[Inter,sans-serif] flex overflow-hidden">
      <Sidebar />
      <Navbar userName="Employee" />
      <MainContainer>
        <Outlet />
      </MainContainer>
    </div>
  );
};
export default AppLayout;
