import React from 'react';
import InsightBox from '../InsightBox/InsightBox';

const InsightSection = ({ insight, loading }) => {
  if (loading) return null;
  return (
    <section className="w-full block relative z-10">
      <InsightBox insight={insight} />
    </section>
  );
};
export default InsightSection;
