// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: KPI statistics card component for dashboards

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../Card/Card';

const StatsCard = ({ title, value, icon: Icon, trend, trendDirection = 'up' }) => {
  const getTrendColor = () => {
    if (!trendDirection) return 'text-text-muted';
    return trendDirection === 'up' ? 'text-success' : 'text-danger';
  };

  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown;

  return (
    <Card className="p-5 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">
            {title}
          </p>
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-[8px] bg-accent/15 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4.5 h-4.5 text-accent" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-text-primary leading-none">
          {value}
        </span>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${getTrendColor()}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
