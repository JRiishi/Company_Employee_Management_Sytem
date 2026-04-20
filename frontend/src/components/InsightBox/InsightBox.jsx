// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: AI-generated insight display component

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const InsightBox = ({ 
  title = "AI Insight", 
  insight, 
  confidence,
  actionText,
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full bg-gradient-to-br from-accent-subtle/80 to-bg-surface border border-accent/20 rounded-[10px] p-5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-5 h-5 text-accent flex-shrink-0 mt-0.5">
          <Sparkles className="w-full h-full" />
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent-text">
            AI Insight
          </h4>
        </div>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed mb-3">
        {insight}
      </p>

      {confidence && (
        <div className="pt-2 border-t border-border-subtle">
          <p className="text-xs text-text-muted mb-1">Confidence: {confidence}%</p>
          <div className="w-full h-[3px] bg-border-subtle rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent/50 rounded-full transition-all duration-300"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}

      {actionText && (
        <button 
          onClick={onAction}
          className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-accent hover:text-accent-hover transition-colors duration-150 py-1.5 px-2.5 hover:bg-accent-subtle rounded-[5px]"
        >
          {actionText} <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
};

export default InsightBox;
