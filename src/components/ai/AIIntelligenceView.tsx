import React, { useState, useEffect, useCallback } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { AIReasoningResponse } from '../../services/intelligenceLayer';
import { soundEngine } from '../../utils/audioSynthesizer';

export const AIIntelligenceView: React.FC = () => {
  const { 
    aiDailyBriefing, 
    isAiLoading, 
    aiError, 
    refreshAiBriefing, 
    askAi, 
    getNextAiAction,
    startFocusSession,
    completeQuest,
    updateQuest,
    setActiveTab,
    showApiKeyModal,
    setShowApiKeyModal,
    handleApiKeySet,
    handleApiKeyClear
  } = useGameState();

  const [question, setQuestion] = useState('');
  const [askResponse, setAskAiResponse] = useState<AIReasoningResponse | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [activeView, setActiveTabLocal] = useState<'briefing' | 'ask' | 'recommendations'>('briefing');

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsAsking(true);
    soundEngine.playClick();
    try {
      const response = await askAi(question);
      setAskAiResponse(response);
    } catch (err) {
      console.error('Ask AI failed:', err);
    } finally {
      setIsAsking(false);
    }
  };

  const executeAction = (action: any) => {
    if (!action) return;
    soundEngine.playSuccess();
    
    switch (action.type) {
      case 'startFocus':
        startFocusSession(action.payload.duration || 25, action.payload.questId, action.payload.questTitle);
        setActiveTab('focus');
        break;
      case 'rescheduleQuest':
        updateQuest(action.payload.questId, { dueDate: action.payload.newDate });
        break;
      // Add other actions as needed
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn select-none container-responsive">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#10b981] via-[#059669] to-[#064e3b] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-white/10 backdrop-blur">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 pointer-events-none select-none blur-[1px]">🧠</div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
              <span>🤖 AUCTUS Intelligence Layer</span>
            </div>
            <h1 className="font-['Feather_Bold'] text-2xl sm:text-3xl md:text-4xl tracking-wide text-white drop-shadow-sm">CITADEL ORACLE</h1>
            <p className="text-white/95 font-bold text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Evidence-based insights, daily briefings, and high-level productivity reasoning.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { soundEngine.playClick(); refreshAiBriefing(); }}
              disabled={isAiLoading}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-black text-xs transition-all backdrop-blur-sm border border-white/20 disabled:opacity-50"
            >
              {isAiLoading ? 'REFRESHING...' : '🔄 REFRESH'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-[#f0f0f0] rounded-2xl border-2 border-[#e5e5e5] w-fit">
        {[
          { id: 'briefing', label: 'DAILY BRIEFING', icon: '📜' },
          { id: 'ask', label: 'ASK ORACLE', icon: '💬' },
          { id: 'recommendations', label: 'NEXT ACTION', icon: '🎯' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { soundEngine.playClick(); setActiveTabLocal(tab.id as any); }}
            className={`px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center gap-2 ${
              activeView === tab.id 
                ? 'bg-white text-[var(--dark-blue)] shadow-sm' 
                : 'text-[var(--gray-light)] hover:text-[var(--gray-text)]'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        {activeView === 'briefing' && (
          <div className="space-y-6">
            {aiError && (
              <div className="bg-red-50 border-2 border-red-100 text-red-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p>Oracle Connection Failed</p>
                  <p className="opacity-70 text-[10px]">{aiError}</p>
                </div>
              </div>
            )}

            {isAiLoading && !aiDailyBriefing ? (
              <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[var(--green)] border-t-transparent rounded-full animate-spin"></div>
                <div className="font-['Feather_Bold'] text-[var(--gray-light)] animate-pulse">CONSULTING THE ARCHIVES...</div>
              </div>
            ) : aiDailyBriefing ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
                  <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] mb-3 flex items-center gap-2">📜 Strategy Overview</h3>
                  <p className="text-sm font-bold text-[var(--gray-text)] leading-relaxed italic border-l-4 border-[var(--green)] pl-4 py-1">
                    "{aiDailyBriefing.summary}"
                  </p>
                </div>

                {/* Insights & Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
                    <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] mb-4 flex items-center gap-2">💡 Core Insights</h3>
                    <ul className="space-y-3">
                      {aiDailyBriefing.insights.map((insight, i) => (
                        <li key={i} className="text-xs font-bold text-[var(--gray-text)] flex gap-3 p-3 rounded-2xl bg-[#f9fafb] border border-[#f0f0f0]">
                          <span className="text-[var(--green)] flex-shrink-0">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
                    <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] mb-4 flex items-center gap-2">📊 Data Evidence</h3>
                    <ul className="space-y-2">
                      {aiDailyBriefing.evidence.map((ev, i) => (
                        <li key={i} className="text-[10px] font-black uppercase text-[var(--gray-light)] flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[var(--gray-light)] opacity-50"></span>
                          {ev}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] px-2">🎯 Tactical Recommendations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {aiDailyBriefing.recommendations.map((rec, i) => (
                      <div key={i} className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 shadow-xs hover:border-[var(--green)] transition-all flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)]">{rec.title}</div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[var(--green)] border border-[#dcfce7]">ACTION</span>
                        </div>
                        <p className="text-xs font-bold text-[var(--gray-text)] mb-2 flex-grow">{rec.description}</p>
                        <p className="text-[10px] font-extrabold text-[var(--gray-light)] mb-4 bg-[#f8fafc] p-2 rounded-xl italic">"Reason: {rec.reason}"</p>
                        {rec.action && (
                          <button 
                            onClick={() => executeAction(rec.action)}
                            className="w-full py-2.5 rounded-xl bg-[var(--green)] hover:bg-[#46a302] text-white font-black text-xs transition-all border-b-4 border-[#3a8a02] active:translate-y-1 active:border-b-0"
                          >
                            {rec.action.type === 'startFocus' ? '⚡ START FOCUS' : 'EXECUTE ACTION'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-12 text-center space-y-4">
                <span className="text-5xl">🔮</span>
                <p className="font-['Feather_Bold'] text-[var(--gray-light)]">The Oracle is silent. Consult the archives to begin.</p>
                <button 
                  onClick={refreshAiBriefing}
                  className="px-6 py-3 rounded-2xl bg-[var(--dark-blue)] text-white font-black text-sm"
                >
                  INITIALIZE BRIEFING
                </button>
              </div>
            )}
          </div>
        )}

        {activeView === 'ask' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-5 sm:p-6 shadow-xs">
              <h3 className="font-['Feather_Bold'] text-sm text-[var(--dark-blue)] mb-4">Consult the Oracle</h3>
              <form onSubmit={handleAsk} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Why am I falling behind on my Coding quests? OR What should I focus on this afternoon?"
                    className="w-full bg-[#f9fafb] border-2 border-[#e5e5e5] rounded-2xl p-4 text-sm font-bold focus:border-[var(--green)] outline-none min-h-[100px] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] font-black text-[var(--gray-light)] uppercase tracking-widest opacity-50">
                    Auctus v1.0
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isAsking || !question.trim()}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[var(--dark-blue)] hover:bg-[#1a2b4b] disabled:opacity-50 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isAsking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>CONSULTING...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ ASK ORACLE</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {askResponse && (
              <div className="animate-fadeIn space-y-6">
                <div className="bg-white rounded-3xl border-2 border-[var(--green)] p-5 sm:p-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-2xl opacity-10">✨</div>
                  <h3 className="font-['Feather_Bold'] text-xs text-[var(--green)] uppercase mb-3 tracking-widest">Oracle Response</h3>
                  <p className="text-sm font-bold text-[var(--dark-blue)] leading-relaxed mb-6">
                    {askResponse.summary}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-[var(--gray-light)] uppercase">Findings</h4>
                      <ul className="space-y-2">
                        {askResponse.insights.map((insight, i) => (
                          <li key={i} className="text-xs font-bold text-[var(--gray-text)] pl-3 border-l-2 border-[var(--green)]">
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-[var(--gray-light)] uppercase">Evidence</h4>
                      <ul className="space-y-2">
                        {askResponse.evidence.map((ev, i) => (
                          <li key={i} className="text-[10px] font-black text-[var(--gray-light)] pl-3 border-l-2 border-[#e5e5e5]">
                            {ev}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {askResponse.recommendations.length > 0 && (
                    <div className="mt-6 pt-6 border-t-2 border-[#f0f0f0]">
                      <div className="grid grid-cols-1 gap-3">
                        {askResponse.recommendations.slice(0, 1).map((rec, i) => (
                          <div key={i} className="bg-[#f0fdf4] rounded-2xl p-4 border border-[#bbf7d0] flex items-center justify-between gap-4">
                            <div>
                              <div className="text-xs font-black text-[var(--dark-blue)] mb-1">{rec.title}</div>
                              <p className="text-[10px] font-bold text-[var(--gray-text)]">{rec.description}</p>
                            </div>
                            {rec.action && (
                              <button 
                                onClick={() => executeAction(rec.action)}
                                className="bg-[var(--green)] text-white px-4 py-2 rounded-xl text-[10px] font-black border-b-2 border-[#3a8a02]"
                              >
                                EXECUTE
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'recommendations' && (
          <div className="space-y-6">
            {/* Implementation for next action recommendation */}
            <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-12 text-center space-y-4">
              <span className="text-5xl">🎯</span>
              <p className="font-['Feather_Bold'] text-[var(--gray-light)] uppercase tracking-wider">Dynamic Recommendation Engine</p>
              <p className="text-sm font-bold text-[var(--gray-text)] max-w-md mx-auto">
                Consult the Oracle for real-time tactical prioritization based on deadline, importance, and historical performance.
              </p>
              <button 
                onClick={async () => {
                  setIsAsking(true);
                  try {
                    const res = await getNextAiAction();
                    setAskAiResponse(res);
                    setActiveTabLocal('ask');
                  } finally {
                    setIsAsking(false);
                  }
                }}
                disabled={isAsking}
                className="px-8 py-3 rounded-2xl bg-[var(--green)] hover:bg-[#46a302] text-white font-black text-sm transition-all border-b-4 border-[#3a8a02]"
              >
                {isAsking ? 'CALCULATING...' : '⚡ FIND NEXT ACTION'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center pb-4">
        <p className="text-[10px] font-black text-[var(--gray-light)] uppercase tracking-[0.2em]">
          🔒 Intelligence Layer • Local-First Reasoning • FreeLLM Integration
        </p>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-[#e5e5e5] p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center text-3xl">
                🔑
              </div>
              <h3 className="font-['Feather_Bold'] text-xl text-[var(--dark-blue)]">Configure AI Provider</h3>
              <p className="text-sm text-[var(--gray-text)] mt-2">
                Enter your FreeLLM API key to unlock the Oracle's intelligence.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[var(--gray-light)] uppercase tracking-wider mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="freellmapi-xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-[#f9fafb] border-2 border-[#e5e5e5] rounded-2xl px-4 py-3 text-sm font-bold focus:border-[var(--green)] outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleApiKeySet((e.target as HTMLInputElement).value)}
                />
              </div>
              
              <p className="text-[10px] font-bold text-[var(--gray-light)] text-center">
                Your key is stored locally in your browser only. Never sent to our servers.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleApiKeyClear}
                  className="flex-1 py-3 rounded-2xl bg-[#fee2e2] hover:bg-[#fecaca] text-red-700 font-black text-sm transition-all border border-red-200"
                >
                  Clear Key
                </button>
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-[var(--gray-light)] hover:bg-[var(--gray-text)] text-white font-black text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
              
              <button
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  if (input?.value) handleApiKeySet(input.value);
                }}
                className="w-full py-3 rounded-2xl bg-[var(--green)] hover:bg-[#46a302] text-white font-black text-sm transition-all border-b-4 border-[#3a8a02] active:translate-y-1 active:border-b-0"
              >
                Save & Enable Oracle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};