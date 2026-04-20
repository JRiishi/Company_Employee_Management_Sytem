// 🌌 UNIVERSE UI APPLIED — Logic unchanged. Visual layer only.
// Changes: Transparent background to show universe through main content area.

import React from 'react';

const MainContainer = ({ children }) => {
  return (
    <main 
      className="flex-1 overflow-y-auto"
      style={{ background: 'transparent' }}
    >
      <div className="px-6 py-6 space-y-6">
        {children}
      </div>
    </main>
  );
};

export default MainContainer;
