import React from 'react';

const MainContainer = ({ children }) => {
  return (
    <main className="ml-[260px] pt-[72px] min-h-screen pb-12 bg-[#F9FAFB] flex flex-col relative w-[calc(100%-260px)]">
      <div className="px-8 py-8 w-full space-y-8 flex flex-col flex-1">
        {children}
      </div>
    </main>
  );
};
export default MainContainer;
