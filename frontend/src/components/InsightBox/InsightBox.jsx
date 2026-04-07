import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const InsightBox = ({ title = "AI Performance Insight", insight, actionText = "Review Status", onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
      className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex flex-col sm:flex-row items-start gap-4 font-sans shadow-sm w-full"
    >
      <div className="bg-blue-600 p-2.5 rounded-xl shadow-sm shrink-0">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="text-[14px] font-bold text-gray-900 mb-1 flex items-center gap-2 tracking-tight">
          {title}
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Generated</span>
        </h4>
        <p className="text-[14px] text-gray-600 leading-relaxed max-w-3xl">
          {insight}
        </p>
      </div>
      {actionText && (
        <button 
          onClick={onAction}
          className="hidden sm:flex mt-2 sm:mt-0 shrink-0 text-[13px] font-medium text-blue-600 items-center gap-1 hover:text-blue-800 transition-colors duration-200 py-2 px-3 bg-white rounded-lg border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-gray-50 cursor-pointer"
        >
          {actionText} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};
export default InsightBox;
