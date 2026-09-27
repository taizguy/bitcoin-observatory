import React from 'react';
import { WeatherCondition } from '../../types';
import { Sun, Cloud, CloudRain, Wind, Gauge, Compass, Radio } from 'lucide-react';

interface AtmosphericWeatherWidgetProps {
  weather: WeatherCondition;
  mvrvValue?: number;
  lthSupplyValue?: number;
  hashrateValue?: number;
}

export const AtmosphericWeatherWidget: React.FC<AtmosphericWeatherWidgetProps> = ({
  weather,
  mvrvValue = 2.14,
  lthSupplyValue = 69.8,
  hashrateValue = 712,
}) => {
  const conditionName = weather.condition || weather.name || 'Warm Sunlit Stratosphere';
  const temperatureScore = weather.temperatureScore || 68;

  // Environmental state calculation
  const isHealthy = conditionName.toLowerCase().includes('sun') || temperatureScore > 65;
  const isStorm = conditionName.toLowerCase().includes('storm') || conditionName.toLowerCase().includes('rain');

  // Atmospheric telemetry variables
  const barometricPressure = Math.round(1013 + (lthSupplyValue - 65) * 2.8);
  const thermodynamicWind = `${hashrateValue} EH/s`;
  const visibility = isHealthy ? 'Unrestricted (10+ miles)' : 'Moderate Haze (4 miles)';

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden h-full">
      
      {/* Precision Reticle Corner Accents */}
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

      {/* Subtle Atmospheric Sky Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              METEOROLOGY STATION
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] font-mono text-slate-400">ALTITUDE 2,870M</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            STATION ID: #OBS-01
          </span>
        </div>

        {/* Climate Visual Presentation */}
        <div className="mt-6 flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/15 to-transparent border border-amber-500/30 text-amber-400 shrink-0 shadow-lg">
            {isHealthy ? (
              <Sun className="h-8 w-8 text-amber-400" />
            ) : isStorm ? (
              <CloudRain className="h-8 w-8 text-rose-400" />
            ) : (
              <Cloud className="h-8 w-8 text-cyan-400" />
            )}
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-celestial text-2xl font-bold text-white tracking-wide">
                {conditionName}
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {temperatureScore}°F
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {weather.description}
            </p>
          </div>
        </div>

        {/* Environmental Telemetry Matrix */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          
          <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase">
              <Gauge className="h-3.5 w-3.5 text-amber-400" />
              <span>BAROMETER</span>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              {barometricPressure} hPa
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">High Accumulation</div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase">
              <Wind className="h-3.5 w-3.5 text-cyan-400" />
              <span>SOLAR WIND</span>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              {thermodynamicWind}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Computational Defense</div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase">
              <Compass className="h-3.5 w-3.5 text-purple-400" />
              <span>VISIBILITY</span>
            </div>
            <div className="font-mono text-xs font-semibold text-white mt-1 truncate">
              {visibility}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Low On-Chain Haze</div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase">
              <Radio className="h-3.5 w-3.5 text-emerald-400" />
              <span>CONVICTION FLUX</span>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              {lthSupplyValue.toFixed(1)}% LTH
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Dormant Vault Retention</div>
          </div>

        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>Atmospheric Metaphor Framework</span>
        <span className="text-amber-400/80">Continuous Scanning</span>
      </div>

    </div>
  );
};
