  useEffect(() => { soundEngine.isMuted = !profile.soundEnabled; }, [profile.soundEnabled]);
  const toggleSound = () => setProfile(p => ({ ...p, soundEnabled: !p.soundEnabled }));

  // AI Intelligence Layer Initialization
  const [aiDailyBriefing, setAiDailyBriefing] = useState<AIReasoningResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const aiProvider = createAIProviderFromEnv();
  const aiIntelligence = aiProvider ? new AUCTUSIntelligence(aiProvider) : null;

  const refreshAiBriefing = useCallback(async () => {
    if (!aiIntelligence) {
      setAiError('AI provider not configured');
      return;
    }
    
    setIsAiLoading(true);
    setAiError(null);
    
    try {
      const context = buildAIContext(
        quests, habits, effortLogs, campaigns, achievements, profile, 
        transactions, weeklyReviews, activeTab, focusSession.isActive
      );
      
      const briefing = await aiIntelligence.generateDailyBriefing(context);
      setAiDailyBriefing(briefing);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Unknown AI error');
      console.error('AI briefing failed:', error);
    } finally {
      setIsAiLoading(false);
    }
  }, [aiIntelligence, quests, habits, effortLogs, campaigns, achievements, profile, transactions, weeklyReviews, activeTab, focusSession.isActive]);

  // Auto-refresh briefing when key data changes or daily
  useEffect(() => {
    if (aiIntelligence) {
      refreshAiBriefing();
      
      // Also set up daily refresh (at midnight)
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      
      const timer = setTimeout(() => {
        refreshAiBriefing();
        // Repeat every 24 hours
        setInterval(refreshAiBriefing, 24 * 60 * 60 * 1000);
      }, msUntilMidnight);
      
      return () => clearTimeout(timer);
    }
  }, [aiIntelligence, refreshAiBriefing]);

  const openClaimModal = useCallback((data: Partial<ClaimModalData>) => {