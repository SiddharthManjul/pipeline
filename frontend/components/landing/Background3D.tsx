'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Background3D = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x000000); // Keep transparent to use CSS background or set dark
        // Better: transparent so it overlays on the existing dark theme background
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Particle System for "Web3 network" feel
        const geometry = new THREE.BufferGeometry();
        const count = 300; // Number of particles
        const positions = new Float32Array(count * 3);
        
        for(let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20; // Spread in cube -10 to 10
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x88CCFF, // Light blue-ish
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        camera.position.z = 5;

        // Animation Loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            
            // Rotate the entire system slowly
            points.rotation.y += 0.001;
            points.rotation.x += 0.0005;

            renderer.render(scene, camera);
        };
        
        animate();

        // Handle Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mountRef.current) {
                if (mountRef.current.contains(renderer.domElement)) {
                    mountRef.current.removeChild(renderer.domElement);
                }
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={mountRef} 
            className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" 
            style={{ 
                opacity: 0.4 // subtle 
            }}
        />
    );
};
