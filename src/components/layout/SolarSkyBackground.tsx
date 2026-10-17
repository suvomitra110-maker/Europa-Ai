import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export const SolarSkyBackground: React.FC = () => {
  const { sunHour, solarPhase, theme } = useApp();

  // Celestial coordinates calculation based on 24h sun cycle
  // Sunrise at 05:30, Noon at 12:00, Sunset at 18:30, Night 19:00 - 05:00
  const isSunUp = sunHour >= 5.2 && sunHour <= 19.2;

  // Sun path: normalized 0..1 across the daytime arc
  const sunProgress = Math.max(0, Math.min(1, (sunHour - 5.2) / 14));
  // Parabolic trajectory: left to right (10% -> 90%), height (78% -> 12% -> 78%)
  const sunX = 10 + sunProgress * 80;
  const sunY = 78 - Math.sin(sunProgress * Math.PI) * 66;

  // Moon path: normalized 0..1 across nighttime
  const moonProgress = sunHour < 5.2 ? (sunHour + 4.8) / 10 : (sunHour - 19.2) / 10;
  const moonX = 12 + Math.max(0, Math.min(1, moonProgress)) * 76;
  const moonY = 75 - Math.sin(Math.max(0, Math.min(1, moonProgress)) * Math.PI) * 58;

  // Generate dynamic sky gradient based on solarPhase and sunHour
  const skyGradient = useMemo(() => {
    switch (solarPhase) {
      case 'dawn':
        return theme === 'light'
          ? 'linear-gradient(180deg, #fce7f3 0%, #fed7aa 35%, #e0f2fe 75%, #f8fafc 100%)'
          : 'linear-gradient(180deg, #1f1124 0%, #3b1137 30%, #581c87 60%, #831843 85%, #180d24 100%)';
      case 'day':
        return theme === 'light'
          ? 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 25%, #bae6fd 60%, #f0f9ff 100%)'
          : 'linear-gradient(180deg, #0369a1 0%, #0c4a6e 35%, #075985 65%, #082f49 100%)';
      case 'sunset':
        return theme === 'light'
          ? 'linear-gradient(180deg, #fdba74 0%, #f472b6 35%, #c084fc 70%, #ffedd5 100%)'
          : 'linear-gradient(180deg, #1c0b24 0%, #4a044e 30%, #7c2d12 60%, #c2410c 85%, #160820 100%)';
      default: // night
        return theme === 'light'
          ? 'linear-gradient(180deg, #312e81 0%, #1e1b4b 45%, #0f172a 100%)'
          : 'linear-gradient(180deg, #050814 0%, #0a0f29 40%, #0b1120 70%, #020408 100%)';
    }
  }, [solarPhase, theme]);

  // Ambient aura orb colors
  const ambientOrbs = useMemo(() => {
    switch (solarPhase) {
      case 'dawn':
        return {
          orb1: 'rgba(251, 113, 133, 0.35)', // rose
          orb2: 'rgba(253, 224, 71, 0.3)',   // morning yellow
          orb3: 'rgba(192, 132, 252, 0.25)', // lilac
        };
      case 'day':
        return {
          orb1: 'rgba(56, 189, 248, 0.35)', // sky cyan
          orb2: 'rgba(129, 140, 248, 0.3)', // light indigo
          orb3: 'rgba(52, 211, 153, 0.25)', // emerald mint
        };
      case 'sunset':
        return {
          orb1: 'rgba(249, 115, 22, 0.45)', // orange
          orb2: 'rgba(217, 70, 239, 0.35)', // magenta
          orb3: 'rgba(245, 158, 11, 0.35)', // amber
        };
      default:
        return {
          orb1: 'rgba(59, 130, 246, 0.25)', // deep blue
          orb2: 'rgba(139, 92, 246, 0.22)', // violet
          orb3: 'rgba(6, 182, 212, 0.2)',   // starlight cyan
        };
    }
  }, [solarPhase]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000 ease-in-out select-none"
      style={{ background: skyGradient }}
    >
      {/* Dynamic Celestial Sun with Radiant Corona */}
      {isSunUp && (
        <div
          className="absolute transition-all duration-700 ease-out flex items-center justify-center pointer-events-none"
          style={{
            left: `${sunX}%`,
            top: `${sunY}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer Sun Corona Glow */}
          <div
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-40 transition-colors duration-1000"
            style={{
              background:
                solarPhase === 'sunset'
                  ? 'radial-gradient(circle, #ea580c 0%, #f59e0b 40%, transparent 70%)'
                  : solarPhase === 'dawn'
                  ? 'radial-gradient(circle, #f43f5e 0%, #fb923c 45%, transparent 70%)'
                  : 'radial-gradient(circle, #38bdf8 0%, #fef08a 40%, transparent 70%)',
            }}
          />

          {/* Inner Radiant Sun Core */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-2xl transition-all duration-700"
            style={{
              background:
                solarPhase === 'sunset'
                  ? 'radial-gradient(circle, #ffffff 15%, #fed7aa 45%, #f97316 85%)'
                  : solarPhase === 'dawn'
                  ? 'radial-gradient(circle, #ffffff 15%, #fbcfe8 45%, #fb7185 85%)'
                  : 'radial-gradient(circle, #ffffff 25%, #fef08a 60%, #38bdf8 95%)',
              boxShadow:
                solarPhase === 'sunset'
                  ? '0 0 60px 15px rgba(234, 88, 12, 0.7), 0 0 120px 40px rgba(249, 115, 22, 0.4)'
                  : solarPhase === 'dawn'
                  ? '0 0 60px 15px rgba(244, 63, 94, 0.6), 0 0 120px 40px rgba(251, 146, 60, 0.35)'
                  : '0 0 70px 20px rgba(56, 189, 248, 0.7), 0 0 130px 45px rgba(254, 240, 138, 0.45)',
            }}
          />

          {/* Minimalist Solar Flare Rays */}
          <div className="absolute w-44 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 pointer-events-none" />
          <div className="absolute w-44 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent -rotate-45 pointer-events-none" />
        </div>
      )}

      {/* Dynamic Celestial Moon at Night */}
      {!isSunUp && (
        <div
          className="absolute transition-all duration-700 ease-out flex items-center justify-center pointer-events-none"
          style={{
            left: `${moonX}%`,
            top: `${moonY}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Moon Aura */}
          <div className="w-56 h-56 rounded-full blur-2xl bg-cyan-400/20" />
          {/* Moon Body */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-200 via-slate-100 to-white shadow-[0_0_35px_rgba(56,189,248,0.5)] relative overflow-hidden">
            {/* Crater detailing */}
            <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-slate-300/60" />
            <div className="absolute bottom-3 right-4 w-4 h-4 rounded-full bg-slate-300/40" />
            <div className="absolute top-6 right-2 w-2 h-2 rounded-full bg-slate-300/50" />
          </div>
        </div>
      )}

      {/* Night Sky Stars Pattern */}
      {solarPhase === 'night' && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 90px 80px, #38bdf8, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 150px 140px, #e2e8f0, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 220px 60px, #a855f7, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 310px 190px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 420px 120px, #38bdf8, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 530px 220px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 640px 90px, #c084fc, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 780px 170px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 920px 70px, #38bdf8, rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '400px 300px',
          }}
        />
      )}

      {/* Ethereal Floating Glass Ambient Glow Orbs */}
      <div
        className="solar-glow-orb w-[520px] h-[520px] -top-32 -left-32"
        style={{ backgroundColor: ambientOrbs.orb1 }}
      />
      <div
        className="solar-glow-orb w-[600px] h-[600px] top-1/3 -right-48"
        style={{ backgroundColor: ambientOrbs.orb2 }}
      />
      <div
        className="solar-glow-orb w-[480px] h-[480px] -bottom-32 left-1/3"
        style={{ backgroundColor: ambientOrbs.orb3 }}
      />

      {/* Subtle Minimalist Horizon Gradient Fog */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950/20 dark:from-slate-950/40 to-transparent pointer-events-none" />
    </div>
  );
};
