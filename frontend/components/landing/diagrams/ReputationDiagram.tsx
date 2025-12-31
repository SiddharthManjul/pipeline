'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp, Award } from 'lucide-react';

export const ReputationDiagram = () => {
  const data = [
    { month: 'Jan', score: 20 },
    { month: 'Feb', score: 35 },
    { month: 'Mar', score: 45 },
    { month: 'Apr', score: 60 },
    { month: 'May', score: 75 },
    { month: 'Jun', score: 85 },
  ];

  const maxScore = 100;
  const chartHeight = 300;
  const chartWidth = 500;
  const padding = 40;

  // Calculate points for the line
  const points = data.map((d, i) => ({
    x: padding + (i * (chartWidth - 2 * padding)) / (data.length - 1),
    y: chartHeight - padding - (d.score / maxScore) * (chartHeight - 2 * padding),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="relative w-full max-w-2xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Reputation Growth</h3>
          <p className="text-sm text-muted-foreground">Track your journey to excellence</p>
        </motion.div>

        {/* Chart */}
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
        >
          {/* Y-axis labels (without grid lines) */}
          {[0, 25, 50, 75, 100].map((value, i) => {
            const y = chartHeight - padding - (value / maxScore) * (chartHeight - 2 * padding);
            return (
              <motion.text
                key={value}
                x={padding - 10}
                y={y + 5}
                fill="rgba(249, 115, 22, 0.6)"
                fontSize="12"
                textAnchor="end"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {value}
              </motion.text>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <motion.text
              key={d.month}
              x={points[i].x}
              y={chartHeight - padding + 20}
              fill="rgba(249, 115, 22, 0.6)"
              fontSize="12"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {d.month}
            </motion.text>
          ))}

          {/* Animated line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#F97316"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Animated gradient fill */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={`${pathD} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1 }}
          />

          {/* Animated points */}
          {points.map((point, i) => (
            <motion.g key={i}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#F97316"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.15, type: 'spring' }}
              />
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="none"
                stroke="#F97316"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.15 + 0.2, duration: 0.5 }}
              />
            </motion.g>
          ))}
        </svg>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 2 }}
          className="flex justify-around mt-6"
        >
          {[
            { icon: Star, label: 'Projects', value: '24' },
            { icon: TrendingUp, label: 'Growth', value: '+65%' },
            { icon: Award, label: 'Tier', value: '2' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
