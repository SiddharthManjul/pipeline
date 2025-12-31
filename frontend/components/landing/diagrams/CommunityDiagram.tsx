'use client';

import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart } from 'lucide-react';

export const CommunityDiagram = () => {
  // Network nodes positioned in a circular pattern
  const centerX = 300;
  const centerY = 200;
  const radius = 120;

  const nodes = [
    { id: 1, angle: 0, size: 'large', label: 'You', type: 'center' },
    { id: 2, angle: 0, size: 'medium', label: 'Dev', type: 'peer' },
    { id: 3, angle: 60, size: 'medium', label: 'Dev', type: 'peer' },
    { id: 4, angle: 120, size: 'medium', label: 'Dev', type: 'peer' },
    { id: 5, angle: 180, size: 'medium', label: 'Dev', type: 'peer' },
    { id: 6, angle: 240, size: 'medium', label: 'Dev', type: 'peer' },
    { id: 7, angle: 300, size: 'medium', label: 'Dev', type: 'peer' },
  ];

  // Position nodes
  const positionedNodes = nodes.map(node => {
    if (node.type === 'center') {
      return { ...node, x: centerX, y: centerY };
    }
    const rad = (node.angle * Math.PI) / 180;
    return {
      ...node,
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  });

  // Create connections from center to all peers
  const connections = positionedNodes
    .filter(n => n.type === 'peer')
    .map(peer => ({
      from: positionedNodes[0],
      to: peer,
    }));

  // Create some peer-to-peer connections
  const peerConnections = [
    { from: positionedNodes[1], to: positionedNodes[2] },
    { from: positionedNodes[2], to: positionedNodes[3] },
    { from: positionedNodes[3], to: positionedNodes[4] },
    { from: positionedNodes[4], to: positionedNodes[5] },
    { from: positionedNodes[5], to: positionedNodes[6] },
    { from: positionedNodes[6], to: positionedNodes[1] },
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
          <h3 className="text-2xl font-bold text-white mb-2">Connected Community</h3>
          <p className="text-sm text-muted-foreground">Build relationships, share knowledge</p>
        </motion.div>

        <svg viewBox="0 0 600 400" className="w-full h-auto">
          {/* Outer ring */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={radius + 40}
            fill="none"
            stroke="rgba(249, 115, 22, 0.1)"
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ opacity: { duration: 0.5 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />

          {/* Peer-to-peer connections (outer ring) */}
          {peerConnections.map((conn, i) => (
            <motion.line
              key={`peer-${i}`}
              x1={conn.from.x}
              y1={conn.from.y}
              x2={conn.to.x}
              y2={conn.to.y}
              stroke="rgba(249, 115, 22, 0.3)"
              strokeWidth="1"
              strokeDasharray="3,3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1 + i * 0.1 }}
            />
          ))}

          {/* Main connections (center to peers) */}
          {connections.map((conn, i) => (
            <motion.g key={i}>
              {/* Glow */}
              <motion.line
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke="#F97316"
                strokeWidth="6"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.15 }}
              />
              {/* Main line */}
              <motion.line
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke="#F97316"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.15 }}
              />
              {/* Animated pulse */}
              <motion.circle
                r="3"
                fill="#F97316"
                initial={{ opacity: 0 }}
                animate={{
                  offsetDistance: ['0%', '100%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 1.5 + i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                style={{
                  offsetPath: `path('M ${conn.from.x} ${conn.from.y} L ${conn.to.x} ${conn.to.y}')`,
                }}
              />
            </motion.g>
          ))}

          {/* Nodes */}
          {positionedNodes.map((node, i) => {
            const nodeRadius = node.type === 'center' ? 35 : 20;
            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
              >
                {/* Pulse ring */}
                {node.type === 'center' && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius + 10}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                {/* Outer glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius + 5}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="1"
                  opacity="0.3"
                />
                {/* Main node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius}
                  fill={node.type === 'center' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.2)'}
                  stroke="#F97316"
                  strokeWidth="2"
                />
                {/* Icon */}
                <foreignObject
                  x={node.x - (node.type === 'center' ? 14 : 10)}
                  y={node.y - (node.type === 'center' ? 14 : 10)}
                  width={node.type === 'center' ? 28 : 20}
                  height={node.type === 'center' ? 28 : 20}
                >
                  <Users className={node.type === 'center' ? 'w-7 h-7 text-primary' : 'w-5 h-5 text-primary'} />
                </foreignObject>
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + nodeRadius + 15}
                  fill="white"
                  fontSize={node.type === 'center' ? '14' : '11'}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex justify-around mt-6"
        >
          {[
            { icon: Users, label: 'Members', value: '1.2K+' },
            { icon: MessageCircle, label: 'Discussions', value: '450+' },
            { icon: Heart, label: 'Vouches', value: '3.5K+' },
          ].map((stat) => (
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
