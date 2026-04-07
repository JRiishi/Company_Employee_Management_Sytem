import React from 'react';

const MainContainer = ({ children }) => {
  return (
    <main className="ml-[260px] pt-[72px] min-h-screen pb-12 bg-[#F9FAFB]">
      <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-8 flex flex-col">
        {children}
      </div>
    </main>
  );
};
export default MainContainer;
