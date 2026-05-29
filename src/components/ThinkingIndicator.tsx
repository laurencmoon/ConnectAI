import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ConnectAILogo, MomaLogo, GoogleLogo } from './Icons';
import { generateThinkingSteps, ThinkingStep } from '../services/gemini';

export function ThinkingIndicator({ prompt, thinking, isMoma, isGenerating, sourcesCount }: { prompt: string, thinking: string, isMoma: boolean, isGenerating?: boolean, sourcesCount?: number }) {
  const [expanded, setExpanded] = useState(false);
  const [steps, setSteps] = useState<ThinkingStep[]>([{ text: isMoma ? 'Incorporating MOMA data...' : 'Including meeting intelligence data...', logo: isMoma ? 'MOMA' : 'ConnectAI' }]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    generateThinkingSteps(prompt, isMoma).then(generatedSteps => {
      if (isMounted && generatedSteps && generatedSteps.length > 0) {
        setSteps(generatedSteps);
      }
    });
    return () => { isMounted = false; };
  }, [prompt, isMoma]);

  useEffect(() => {
    if (steps.length <= 1 || !isGenerating) return;
    
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= steps.length * 4) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [steps, isGenerating]);

  const currentStep = steps[currentStepIndex % steps.length];
  const displayText = isGenerating ? currentStep.text : `Show thinking (${sourcesCount || 0} sources)...`;
  const currentLogo = currentStep.logo;

  return (
    <div className="flex flex-col gap-2 my-4">
      <div 
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative flex items-center justify-center">
          {(!isGenerating) ? (
            <ConnectAILogo className={`w-6 h-6`} />
          ) : (
            currentLogo === 'MOMA' ? (
              <div className={`flex items-center gap-2 bg-white border border-blue-200 rounded-full px-2 py-1 shadow-sm ${isGenerating ? 'animate-pulse' : ''}`}>
                <ConnectAILogo className="w-5 h-5" />
                <MomaLogo />
              </div>
            ) : currentLogo === 'Google' ? (
              <div className={`flex items-center gap-2 bg-white rounded-full p-1 ${isGenerating ? 'animate-pulse' : ''}`}>
                <GoogleLogo className="w-6 h-6" />
              </div>
            ) : currentLogo === 'ConnectSales' ? (
              <div className={`flex items-center w-[22px] h-[22px] overflow-hidden ${isGenerating ? 'animate-pulse' : ''}`}>
                <img src="https://static.corp.google.com/greentea/images/rebrand/lockup_sales_prod.svg" className="h-[22px] max-w-none object-left object-cover" alt="Connect Sales" />
              </div>
            ) : currentLogo === 'Gmail' ? (
              <div className={`flex items-center w-[22px] h-[22px] ${isGenerating ? 'animate-pulse' : ''}`}>
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.33398 26.2569H8.00065V15.0979L1.33398 10.1748V24.2876C1.33398 25.3756 2.22898 26.2569 3.33398 26.2569Z" fill="#4285F4"/>
                  <path d="M24 26.2569H28.6667C29.7717 26.2569 30.6667 25.3756 30.6667 24.2876V10.1748L24 15.0979V26.2569Z" fill="#34A853"/>
                  <path d="M16 12.4721V21.0055L24 15.0978V6.56445L16 12.4721Z" fill="#EA4335"/>
                  <path d="M24 6.56438V15.0977L30.6667 10.1746V7.549C30.6667 5.11536 27.845 3.72541 25.8667 5.18592L24 6.56438Z" fill="#FBBC04"/>
                  <path d="M8 6.56445V15.0978L16 21.0055V12.4721L8 6.56445Z" fill="#EA4335"/>
                  <path d="M1.33398 7.549V10.1746L8.00065 15.0977V6.56438L6.13398 5.18592C4.15565 3.72541 1.33398 5.11536 1.33398 7.549Z" fill="#C5221E"/>
                </svg>
              </div>
            ) : (
              <ConnectAILogo className={`w-6 h-6 ${isGenerating ? 'animate-pulse' : ''}`} />
            )
          )}
        </div>
        <span className="text-gray-800 font-medium text-[15px] transition-opacity duration-300">
          {displayText}
        </span>
        <i className="google-symbols font-medium text-[24px] text-[#1F1F1F]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>{expanded ? 'expand_less' : 'expand_more'}</i>
      </div>
      
      {expanded && thinking && (
        <div className="ml-1 pl-4 border-l-2 border-[#E8EAED] text-[#4C4D50] text-[13px] font-mono leading-[24px] whitespace-pre-wrap w-[90%]">
          {thinking}
        </div>
      )}
    </div>
  );
}
