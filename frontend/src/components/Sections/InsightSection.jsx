// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Section wrapper for AI insight box

import React from 'react';
import InsightBox from '../InsightBox/InsightBox';

const InsightSection = ({ insight, loading, confidence, actionText, onAction }) => {
  if (loading) return null;
  
  return (
    <section className="w-full">
      <InsightBox 
        insight={insight} 
        confidence={confidence}
        actionText={actionText}
        onAction={onAction}
      />
    </section>
  );
};

export default InsightSection;
