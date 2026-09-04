import React, { useEffect, useRef } from 'react';
import { getRankConfig } from '../themesConfig.js';

export function ObsidianThemeCanvas({ currentRank = 1 }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const rankConfig = getRankConfig(currentRank);
    const accentHex = rankConfig.accentHex;
    const veinColor = rankConfig.veinColor;
    const effect = rankConfig.effect;
    const veinWidth = rankConfig.veinWidth || 2;

    // Generate static procedural crack/vein networks based on seed
    const generateVeinBranches = (w, h, seedRank) => {
      const branches = [];
      const numRootCracks = 6 + (seedRank % 4);
      
      for (let i = 0; i < numRootCracks; i++) {
        let x = (0.15 + (i * 0.14) + Math.sin(i * 1.7) * 0.08) * w;
        let y = (0.2 + (i % 3) * 0.3) * h;
        
        let angle = (i * 0.9) % (Math.PI * 2);
        const segments = [];
        let length = 120 + (i % 3) * 80;

        for (let s = 0; s < 7; s++) {
          const nx = x + Math.cos(angle) * (length / 7);
          const ny = y + Math.sin(angle) * (length / 7);
          segments.push({ x1: x, y1: y, x2: nx, y2: ny });
          
          // Sub-branches
          if (s > 1 && s % 2 === 0) {
            const subAngle = angle + (s % 2 === 0 ? 0.7 : -0.7);
            const subLx = nx + Math.cos(subAngle) * 45;
            const subLy = ny + Math.sin(subAngle) * 45;
            segments.push({ x1: nx, y1: ny, x2: subLx, y2: subLy, isSub: true });
          }

          x = nx;
          y = ny;
          angle += (Math.sin(s + i) * 0.4);
        }
        branches.push(segments);
      }
      return branches;
    };

    let veinBranches = generateVeinBranches(width, height, currentRank);

    // Particle instances for rich effects
    const particles = [];
    const numParticles = effect === 'stealth_dark' ? 5 : (effect === 'starfield_nebula' ? 90 : 35);
    
    for (let p = 0; p < numParticles; p++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.8 - (effect === 'ember_sparks' ? 0.8 : 0),
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }

    let frameCount = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      veinBranches = generateVeinBranches(width, height, currentRank);
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Obsidian Texture Base
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 3, 50,
        width / 2, height / 2, Math.max(width, height)
      );

      if (currentRank === 15) {
        // Cosmic Primordial Base
        bgGrad.addColorStop(0, '#2b0847');
        bgGrad.addColorStop(0.5, '#0e021a');
        bgGrad.addColorStop(1, '#000000');
      } else if (currentRank === 14) {
        // Overlord Stealth Base
        bgGrad.addColorStop(0, '#121212');
        bgGrad.addColorStop(0.7, '#080808');
        bgGrad.addColorStop(1, '#000000');
      } else {
        bgGrad.addColorStop(0, rankConfig.bgGradient.match(/#[a-fA-F0-9]{6}/g)?.[0] || '#050c18');
        bgGrad.addColorStop(0.6, rankConfig.bgGradient.match(/#[a-fA-F0-9]{6}/g)?.[1] || '#02050c');
        bgGrad.addColorStop(1, '#000000');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Obsidian Cracked Veins with Glowing Strokes
      const pulseGlow = Math.sin(frameCount * 0.03) * 0.25 + 0.75;
      
      // Lightning flicker check for Ascendant rank
      let flickerMultiplier = 1.0;
      if (effect === 'lightning_flicker' && Math.random() > 0.94) {
        flickerMultiplier = 1.8 + Math.random() * 0.5;
      }

      ctx.save();
      ctx.shadowColor = veinColor;
      ctx.shadowBlur = (currentRank === 14 ? 3 : 14 * pulseGlow * flickerMultiplier);
      ctx.strokeStyle = veinColor;
      ctx.lineWidth = veinWidth * (currentRank === 14 ? 0.7 : 1);
      ctx.globalAlpha = (currentRank === 14 ? 0.25 : 0.8 * pulseGlow);

      veinBranches.forEach(branch => {
        ctx.beginPath();
        branch.forEach(seg => {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();
      });
      ctx.restore();

      // 3. Render Specific Rank Ambient Particles / Light Effects
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = Math.abs(Math.sin(p.phase)) * p.alpha * (currentRank === 14 ? 0.2 : 1);

        ctx.save();
        ctx.globalAlpha = currentAlpha;

        if (effect === 'diamond_glint') {
          // Diamond glints (4-pointed star)
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'crystal_facets') {
          // Purple Crystal Hexagons
          ctx.strokeStyle = '#D8B4FE';
          ctx.strokeRect(p.x, p.y, p.size * 2, p.size * 2);
        } else if (effect === 'floral_particles') {
          // Soft Violet Petals
          ctx.fillStyle = '#C084FC';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.8, p.phase, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'ember_sparks') {
          // Burnt Orange Embers
          ctx.fillStyle = '#FF7700';
          ctx.shadowColor = '#FF4500';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'starfield_nebula') {
          // Twinkling stars
          ctx.fillStyle = p.phase % 2 > 1 ? '#C084FC' : '#FFFFFF';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Default ambient glowing particles
          ctx.fillStyle = accentHex;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 4. Shimmer Sweep Effect (Rank 12 Immortal)
      if (effect === 'shimmer_sweep') {
        const sweepX = ((frameCount * 3) % (width + 400)) - 200;
        const shimmerGrad = ctx.createLinearGradient(sweepX, 0, sweepX + 150, height);
        shimmerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        shimmerGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
        shimmerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = shimmerGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 5. Light Rays Effect (Rank 13 Deity)
      if (effect === 'light_rays') {
        ctx.save();
        ctx.globalAlpha = 0.08 + Math.sin(frameCount * 0.02) * 0.04;
        const rayGrad = ctx.createRadialGradient(width / 2, 0, 10, width / 2, height / 2, width);
        rayGrad.addColorStop(0, '#FFD700');
        rayGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = rayGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentRank]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
}
