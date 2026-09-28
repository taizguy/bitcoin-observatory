import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, UserMode, MetricDefinition, GlobalDataMode } from './types';
import { DataAdapter } from './data/adapter';
import { BackgroundVideo } from './components/layout/BackgroundVideo';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ObservatoryView } from './components/observatory/ObservatoryView';
import { CycleView } from './components/cycle/CycleView';
import { HistoryView } from './components/history/HistoryView';
import { ExplorerView } from './components/explorer/ExplorerView';
import { LearnView } from './components/learn/LearnView';
import { DetectiveView } from './components/detective/DetectiveView';
import { DataModeView } from './components/data/DataModeView';
import { MetricDetailModal } from './components/explorer/MetricDetailModal';
import { HealthScoreModal } from './components/observatory/HealthScoreModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { WelcomeModal } from './components/common/WelcomeModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('observatory');
  const [userMode, setUserMode] = useState<UserMode>(() => {
    return (localStorage.getItem('btc_obs_user_mode') as UserMode) || 'beginner';
  });
  const [dataMode, setDataMode] = useState<GlobalDataMode>(() => {
    return (localStorage.getItem('btc_obs_data_mode') as GlobalDataMode) || DataAdapter.getDataMode();
  });

  const [lastUpdatedText, setLastUpdatedText] = useState<string>(DataAdapter.getLastUpdatedTime());
  const [selectedMetricForDetail, setSelectedMetricForDetail] = useState<MetricDefinition | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    return !localStorage.getItem('btc_obs_visited');
  });

  const metrics = DataAdapter.getMetrics();
  const healthScore = DataAdapter.getHealthScore();
  const weather = DataAdapter.getWeather();

  const handleToggleUserMode = useCallback(() => {
    setUserMode((prev) => {
      const next = prev === 'beginner' ? 'advanced' : 'beginner';
      localStorage.setItem('btc_obs_user_mode', next);
      return next;
    });
  }, []);

  const handleSetDataMode = useCallback((mode: GlobalDataMode) => {
    setDataMode(mode);
    DataAdapter.setDataMode(mode);
    localStorage.setItem('btc_obs_data_mode', mode);
  }, []);

  const handleRefreshData = useCallback(() => {
    DataAdapter.refreshData();
    setLastUpdatedText('Updated just now');
  }, []);

  const handleCloseWelcome = useCallback(() => {
    setIsWelcomeOpen(false);
    localStorage.setItem('btc_obs_visited', 'true');
  }, []);

  const handleOpenMetricDetail = useCallback((metricId: string) => {
    const target = metrics.find((m) => m.id === metricId);
    if (target) {
      setSelectedMetricForDetail(target);
    }
  }, [metrics]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* Background High-Fidelity Video (Observe System) */}
      <BackgroundVideo />

      {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        userMode={userMode}
        onToggleUserMode={handleToggleUserMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onRefreshData={handleRefreshData}
        lastUpdatedText={lastUpdatedText}
        dataMode={dataMode}
        onSetDataMode={handleSetDataMode}
      />

      {/* Main Viewport Content - Expansive Desktop Support */}
      <main className="flex-1 w-full">
        {currentView === 'observatory' && (
          <ObservatoryView
            metrics={metrics}
            healthScore={healthScore}
            weather={weather}
            userMode={userMode}
            onNavigate={setCurrentView}
            onSelectMetricDetail={handleOpenMetricDetail}
          />
        )}

        {currentView === 'cycle' && (
          <CycleView onSelectMetricDetail={handleOpenMetricDetail} />
        )}

        {currentView === 'history' && (
          <HistoryView onSelectMetricDetail={handleOpenMetricDetail} />
        )}

        {currentView === 'explorer' && (
          <ExplorerView
            metrics={metrics}
            onSelectMetricDetail={handleOpenMetricDetail}
          />
        )}

        {currentView === 'learn' && <LearnView />}

        {currentView === 'detective' && <DetectiveView />}

        {currentView === 'data' && (
          <DataModeView
            metrics={metrics}
            onSelectMetricDetail={handleOpenMetricDetail}
          />
        )}
      </main>

      {/* Dedicated Global Modals & Drawers */}
      {selectedMetricForDetail && (
        <MetricDetailModal
          metric={selectedMetricForDetail}
          onClose={() => setSelectedMetricForDetail(null)}
          onSelectRelatedMetric={handleOpenMetricDetail}
        />
      )}

      {isMethodologyOpen && (
        <HealthScoreModal
          scoreData={healthScore}
          onClose={() => setIsMethodologyOpen(false)}
          onSelectMetric={handleOpenMetricDetail}
        />
      )}

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMetric={handleOpenMetricDetail}
        onNavigate={(v) => setCurrentView(v as ViewMode)}
      />

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={handleCloseWelcome}
        onSelectPath={(view, metricId) => {
          setCurrentView(view);
          if (metricId) handleOpenMetricDetail(metricId);
        }}
      />

      {/* Universal Footer */}
      <Footer
        lastUpdatedText={lastUpdatedText}
        onRefresh={handleRefreshData}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

    </div>
  );
}
