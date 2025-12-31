'use client';

import { motion } from 'framer-motion';
import { Code2, Briefcase, Zap } from 'lucide-react';

export const MatchingDiagram = () => {
  const developers = [
    { id: 1, x: 100, y: 80, name: 'Dev A', skills: 'React, Node' },
    { id: 2, x: 100, y: 200, name: 'Dev B', skills: 'Python, ML' },
    { id: 3, x: 100, y: 320, name: 'Dev C', skills: 'Solidity, Web3' },
  ];

  const jobs = [
    { id: 1, x: 500, y: 80, company: 'Startup A', role: 'Frontend Dev' },
    { id: 2, x: 500, y: 200, company: 'Startup B', role: 'AI Engineer' },
    { id: 3, x: 500, y: 320, company: 'Startup C', role: 'Blockchain Dev' },
  ];

  const connections = [
    { from: developers[0], to: jobs[0], strength: 95 },
    { from: developers[1], to: jobs[1], strength: 88 },
    { from: developers[2], to: jobs[2], strength: 92 },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="relative w-full max-w-3xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Smart Matching Algorithm</h3>
          <p className="text-sm text-muted-foreground">Connecting talent with opportunity</p>
        </motion.div>

        <svg viewBox="0 0 600 400" className="w-full h-auto">
          {/* Connection lines */}
          {connections.map((conn, i) => (
            <motion.g key={i}>
              {/* Glow effect */}
              <motion.line
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke="#F97316"
                strokeWidth="8"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 + i * 0.3 }}
              />
              {/* Main line */}
              <motion.line
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke="#F97316"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 + i * 0.3 }}
              />
              {/* Animated particles along the line */}
              <motion.circle
                r="4"
                fill="#F97316"
                initial={{ opacity: 0 }}
                animate={{
                  offsetDistance: ['0%', '100%'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 1 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                style={{
                  offsetPath: `path('M ${conn.from.x} ${conn.from.y} L ${conn.to.x} ${conn.to.y}')`,
                }}
              />
              {/* Match percentage */}
              <motion.text
                x={(conn.from.x + conn.to.x) / 2}
                y={(conn.from.y + conn.to.y) / 2 - 10}
                fill="#F97316"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.3, type: 'spring' }}
              >
                {conn.strength}%
              </motion.text>
            </motion.g>
          ))}

          {/* Developer nodes (left side) */}
          {developers.map((dev, i) => (
            <motion.g
              key={`dev-${dev.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
            >
              {/* Outer glow circle */}
              <circle
                cx={dev.x}
                cy={dev.y}
                r="35"
                fill="none"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.3"
              />
              {/* Main circle */}
              <circle
                cx={dev.x}
                cy={dev.y}
                r="25"
                fill="rgba(249, 115, 22, 0.2)"
                stroke="#F97316"
                strokeWidth="2"
              />
              {/* Icon */}
              <foreignObject x={dev.x - 12} y={dev.y - 12} width="24" height="24">
                <Code2 className="w-6 h-6 text-primary" />
              </foreignObject>
              {/* Label */}
              <text
                x={dev.x}
                y={dev.y + 45}
                fill="white"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                {dev.name}
              </text>
              <text
                x={dev.x}
                y={dev.y + 60}
                fill="rgba(249, 115, 22, 0.6)"
                fontSize="10"
                textAnchor="middle"
              >
                {dev.skills}
              </text>
            </motion.g>
          ))}

          {/* Job nodes (right side) */}
          {jobs.map((job, i) => (
            <motion.g
              key={`job-${job.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
            >
              {/* Outer glow circle */}
              <circle
                cx={job.x}
                cy={job.y}
                r="35"
                fill="none"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.3"
              />
              {/* Main circle */}
              <circle
                cx={job.x}
                cy={job.y}
                r="25"
                fill="rgba(249, 115, 22, 0.2)"
                stroke="#F97316"
                strokeWidth="2"
              />
              {/* Icon */}
              <foreignObject x={job.x - 12} y={job.y - 12} width="24" height="24">
                <Briefcase className="w-6 h-6 text-primary" />
              </foreignObject>
              {/* Label */}
              <text
                x={job.x}
                y={job.y + 45}
                fill="white"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                {job.company}
              </text>
              <text
                x={job.x}
                y={job.y + 60}
                fill="rgba(249, 115, 22, 0.6)"
                fontSize="10"
                textAnchor="middle"
              >
                {job.role}
              </text>
            </motion.g>
          ))}

          {/* Center algorithm indicator */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <circle
              cx="300"
              cy="200"
              r="30"
              fill="rgba(249, 115, 22, 0.3)"
              stroke="#F97316"
              strokeWidth="2"
            />
            <foreignObject x="288" y="188" width="24" height="24">
              <Zap className="w-6 h-6 text-primary" />
            </foreignObject>
            <motion.circle
              cx="300"
              cy="200"
              r="35"
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>
        </svg>
      </div>
    </div>
  );
};
