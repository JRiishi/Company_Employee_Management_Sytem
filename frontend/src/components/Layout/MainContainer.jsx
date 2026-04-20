// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Main scrollable content area below navbar

import React from 'react';

const MainContainer = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto bg-bg-base">
      <div className="px-6 py-6 space-y-6">
        {children}
      </div>
    </main>
  );
};

export default MainContainer;
