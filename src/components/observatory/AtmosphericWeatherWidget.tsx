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
  const conditionName = weather.condition || weather.name || 'Clear Expansion Stratosphere';
  const temperatureScore = weather.temperatureScore || 68;

  const isHealthy = conditionName.toLowerCase().includes('sun') || temperatureScore > 65;
  const isStorm = conditionName.toLowerCase().includes('storm') || conditionName.toLowerCase().includes('rain');

  const barometricPressure = Math.round(1013 + (lthSupplyValue - 65) * 2.8);
  const thermodynamicWind = `${hashrateValue} EH/s`;
  const visibility = isHealthy ? 'Unrestricted (10+ mi)' : 'Moderate Haze (4 mi)';

  return (
    <div className="liquid-glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/70 tracking-wider uppercase">
              METEOROLOGY STATION
            </span>
            <span className="text-white/30">·</span>
            <span className="text-[11px] font-mono text-white/50">ACTIVE TELEMETRY</span>
          </div>
          <span className="text-xs font-mono text-white/60">
            STATUS: NOMINAL
          </span>
        </div>

        {/* Climate Visual Presentation */}
        <div className="mt-5 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/15 text-white shrink-0">
            {isHealthy ? (
              <Sun className="h-7 w-7 text-white" />
            ) : isStorm ? (
              <CloudRain className="h-7 w-7 text-white/70" />
            ) : (
              <Cloud className="h-7 w-7 text-white/90" />
            )}
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif-instrument text-2xl font-bold text-white tracking-tight">
                {conditionName}
              </h3>
              <span className="text-xs font-mono text-white font-bold">
                {temperatureScore}°
              </span>
            </div>
            <p className="mt-1 text-xs text-white/70 leading-relaxed font-sans">
              {weather.description}
            </p>
          </div>
        </div>

        {/* Environmental Telemetry Matrix */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60 uppercase">
              <Gauge className="h-3.5 w-3.5 text-white" />
              <span>BAROMETER</span>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              {barometricPressure} hPa
            </div>
            <div className="text-[10px] text-white/50 font-mono mt-0.5">High Accumulation</div>
          </div>

          <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60 uppercase">
              <Wind className="h-3.5 w-3.5 text-white" />
              <span>COMPUTING FLUX</span>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              {thermodynamicWind}
            </div>
            <div className="text-[10px] text-white/50 font-mono mt-0.5">Hashrate Defense</div>
          </div>

          <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60 uppercase">
              <Compass className="h-3.5 w-3.5 text-white" />
              <span>VISIBILITY</span>
            </div>
            <div className="font-mono text-xs font-semibold text-white mt-1 truncate">
              {visibility}
            </div>
            <div className="text-[10px] text-white/50 font-mono mt-0.5">Low On-Chain Haze</div>
          </div>

          <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60 uppercase">
              <Radio className="h-3.5 w-3.5 text-white" />
              <span>CONVICTION</span>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              {lthSupplyValue.toFixed(1)}% LTH
            </div>
            <div className="text-[10px] text-white/50 font-mono mt-0.5">Dormant Vaults</div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-white/10 text-[11px] font-mono text-white/50 flex items-center justify-between">
        <span>Atmospheric Metaphor</span>
        <span className="text-white/80">Continuous Monitoring</span>
      </div>

    </div>
  );
};
