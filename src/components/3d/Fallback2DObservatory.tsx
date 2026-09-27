import React, { useRef, useEffect, useState } from 'react';

interface Fallback2DObservatoryProps {
  activeRegion: string | null;
  onSelectRegion: (regionId: string) => void;
  timeframe: string;
  mvrvValue?: number;
  lthSupplyValue?: number;
  hashrateValue?: number;
  realizedCapValue?: number;
  nuplValue?: number;
  btcPrice?: number;
}

interface RegionNode {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  color: string;
  metric: string;
  value: string;
}

export const Fallback2DObservatory: React.FC<Fallback2DObservatoryProps> = ({
  activeRegion,
  onSelectRegion,
  mvrvValue = 2.14,
  lthSupplyValue = 69.8,
  hashrateValue = 712,
  realizedCapValue = 825.4,
  nuplValue = 0.53,
  btcPrice = 89400
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle swarm driven by aggregated metrics
    // lthSupplyValue controls relative particle density in inner rings
    const particleCount = Math.round(50 + (lthSupplyValue / 100) * 40);
    const particles: { 
      x: number; 
      y: number; 
      radius: number; 
      color: string; 
      orbitRadius: number; 
      angle: number; 
      speed: number 
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      // High LTH clusters closer to core
      const dist = 60 + Math.random() * (220 - (lthSupplyValue / 100) * 40);
      const isNuplGreen = nuplValue > 0.4 ? Math.random() > 0.2 : Math.random() > 0.6;

      particles.push({
        x: 0,
        y: 0,
        radius: Math.random() * 2 + 1,
        color: isNuplGreen ? '#10b981' : (Math.random() > 0.5 ? '#f7931a' : '#ef4444'),
        orbitRadius: dist,
        angle: angle,
        // Hashrate influences baseline kinetic rotation speed
        speed: (0.003 + (hashrateValue / 1000) * 0.004) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw faint orbital guide rings
      [90, 150, 210, 270].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(247, 147, 26, ${0.05 + idx * 0.02})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Regions coordinates with dynamic values
      const regions: RegionNode[] = [
        { 
          id: 'price', 
          label: '1. Price & Valuation', 
          sublabel: `MVRV ${mvrvValue.toFixed(2)} · BTC $${btcPrice.toLocaleString()}`, 
          x: centerX, 
          y: centerY - 150, 
          color: '#f59e0b', 
          metric: 'MVRV', 
          value: mvrvValue.toFixed(2) 
        },
        { 
          id: 'holders', 
          label: '2. Holders & Inactivity', 
          sublabel: `${lthSupplyValue.toFixed(1)}% LTH Supply`, 
          x: centerX + 180, 
          y: centerY - 45, 
          color: '#10b981', 
          metric: 'LTH', 
          value: `${lthSupplyValue.toFixed(1)}%` 
        },
        { 
          id: 'money', 
          label: '3. Money & Capital', 
          sublabel: `$${realizedCapValue.toFixed(1)}B Realized Cap`, 
          x: centerX + 120, 
          y: centerY + 140, 
          color: '#38bdf8', 
          metric: 'Cap', 
          value: `$${realizedCapValue.toFixed(0)}B` 
        },
        { 
          id: 'network', 
          label: '4. Network & Security', 
          sublabel: `${hashrateValue.toFixed(0)} EH/s Hashrate`, 
          x: centerX - 120, 
          y: centerY + 140, 
          color: '#6366f1', 
          metric: 'Hash', 
          value: `${hashrateValue.toFixed(0)} EH` 
        },
        { 
          id: 'sentiment', 
          label: '5. Sentiment & Profit', 
          sublabel: `NUPL ${nuplValue.toFixed(2)} (${nuplValue > 0.5 ? 'Belief' : nuplValue > 0.25 ? 'Optimism' : 'Capitulation'})`, 
          x: centerX - 180, 
          y: centerY - 45, 
          color: '#ec4899', 
          metric: 'NUPL', 
          value: nuplValue.toFixed(2) 
        },
      ];

      // Draw particle conduits from center to regions
      regions.forEach((reg) => {
        const isSelected = activeRegion === reg.id || hoveredRegion === reg.id;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(reg.x, reg.y);
        ctx.strokeStyle = isSelected ? reg.color : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();
      });

      // Animate orbiting particles
      particles.forEach((p) => {
        p.angle += p.speed;
        p.x = centerX + Math.cos(p.angle) * p.orbitRadius;
        p.y = centerY + Math.sin(p.angle) * p.orbitRadius * 0.75;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.65;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Central Bitcoin Core
      const corePulse = Math.sin(time * 2) * 3;
      const coreRadius = 40 + corePulse;
      
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 80);
      glowGrad.addColorStop(0, 'rgba(247, 147, 26, 0.45)');
      glowGrad.addColorStop(0.5, 'rgba(247, 147, 26, 0.15)');
      glowGrad.addColorStop(1, 'rgba(247, 147, 26, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#141824';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#f7931a';
      ctx.stroke();

      ctx.fillStyle = '#f7931a';
      ctx.font = 'bold 36px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₿', centerX, centerY);

      // Draw Region Nodes
      regions.forEach((reg) => {
        const isSelected = activeRegion === reg.id;
        const isHovered = hoveredRegion === reg.id;
        const rSize = isSelected ? 32 : (isHovered ? 28 : 24);

        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(reg.x, reg.y, rSize + 8, 0, Math.PI * 2);
          ctx.fillStyle = `${reg.color}33`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(reg.x, reg.y, rSize, 0, Math.PI * 2);
        ctx.fillStyle = '#0c101c';
        ctx.fill();
        ctx.strokeStyle = reg.color;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(reg.value, reg.x, reg.y);

        ctx.fillStyle = isSelected ? '#ffffff' : (isHovered ? '#f1f5f9' : '#94a3b8');
        ctx.font = '12px "Plus Jakarta Sans", sans-serif';
        const labelY = reg.y > centerY ? reg.y + 40 : reg.y - 36;
        ctx.fillText(reg.label, reg.x, labelY);

        ctx.fillStyle = isSelected ? reg.color : '#64748b';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(reg.sublabel, reg.x, labelY + 14);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const centerX = width / 2;
      const centerY = height / 2;
      const regionCoords = [
        { id: 'price', x: centerX, y: centerY - 150 },
        { id: 'holders', x: centerX + 180, y: centerY - 45 },
        { id: 'money', x: centerX + 120, y: centerY + 140 },
        { id: 'network', x: centerX - 120, y: centerY + 140 },
        { id: 'sentiment', x: centerX - 180, y: centerY - 45 },
      ];

      for (const reg of regionCoords) {
        const dist = Math.hypot(clickX - reg.x, clickY - reg.y);
        if (dist <= 36) {
          onSelectRegion(reg.id);
          return;
        }
      }
    };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = width / 2;
      const centerY = height / 2;
      const regionCoords = [
        { id: 'price', x: centerX, y: centerY - 150 },
        { id: 'holders', x: centerX + 180, y: centerY - 45 },
        { id: 'money', x: centerX + 120, y: centerY + 140 },
        { id: 'network', x: centerX - 120, y: centerY + 140 },
        { id: 'sentiment', x: centerX - 180, y: centerY - 45 },
      ];

      let found: string | null = null;
      for (const reg of regionCoords) {
        const dist = Math.hypot(mouseX - reg.x, mouseY - reg.y);
        if (dist <= 36) {
          found = reg.id;
          break;
        }
      }
      setHoveredRegion(found);
      canvas.style.cursor = found ? 'pointer' : 'default';
    };

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeRegion, hoveredRegion, onSelectRegion, mvrvValue, lthSupplyValue, hashrateValue, realizedCapValue, nuplValue, btcPrice]);

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden bg-[#07090e] border border-white/[0.06]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500 bg-black/60 px-2 py-0.5 rounded border border-white/5">
        Planar View · Visual representation of aggregated supply & network telemetry
      </div>
    </div>
  );
};
