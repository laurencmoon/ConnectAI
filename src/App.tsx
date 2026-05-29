import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AppBar } from './components/AppBar';
import { MainContent } from './components/MainContent';
import { RightPanel } from './components/RightPanel';
import { CompanyDiagnosisCanvas } from './components/CompanyDiagnosisCanvas';
import { MeetingPrepCanvas } from './components/MeetingPrepCanvas';
import { GapToTargetPlanningCanvas } from './components/GapToTargetPlanningCanvas';
import { SalesOutlookCanvas } from './components/SalesOutlookCanvas';
import { SlideDeckCanvas } from './components/SlideDeckCanvas';
import { CanvasLoadingState } from './components/CanvasLoadingState';
import { GrowthPlannerCanvas } from './components/GrowthPlannerCanvas';
import { GlobalStyles } from './components/GlobalStyles';
import { refineCanvasSection, RefinedSectionResult } from './services/gemini';

export type ExternalMessage = {
  type: string;
  text?: string;
  company?: string;
};

export default function App() {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isCanvasLoading, setIsCanvasLoading] = useState(false);
  const [canvasType, setCanvasType] = useState<'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides'>('diagnose');
  const [canvasCompany, setCanvasCompany] = useState<string>('');
  const [externalMessage, setExternalMessage] = useState<ExternalMessage | undefined>(undefined);
  const [refiningCard, setRefiningCard] = useState<{ id: string, title: string } | null>(null);
  const [sectionLoading, setSectionLoading] = useState<string | null>(null);
  const [customSectionContents, setCustomSectionContents] = useState<Record<string, RefinedSectionResult>>({});
  const [selectedDateRange, setSelectedDateRange] = useState('Jan 1 - today');
  const [focusedText, setFocusedText] = useState<string | null>(null);
  const [highlightOriginSectionId, setHighlightOriginSectionId] = useState<string | null>(null);

  const handleGenerateCanvasStart = (type?: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides', company?: string) => {
    setIsCanvasLoading(true);
    if (type) setCanvasType(type);
    if (company) setCanvasCompany(company);
    setIsCanvasOpen(true);
  };

  const handleGenerateCanvasComplete = () => {
    setIsCanvasLoading(false);
  };

  const handlePromptClick = (text: string) => {
    setExternalMessage({ type: 'prompt', text });
  };

  const handleOpenCanvas = (type?: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides', company?: string) => {
    if (type) setCanvasType(type);
    if (company) setCanvasCompany(company);
    setIsCanvasOpen(true);
  };

  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
  };

  const handleDiagnose = (company: string) => {
    setExternalMessage({
      type: 'diagnose',
      text: `Diagnose ${company}`,
      company: company
    });
  };

  const handlePrepare = (company: string) => {
    setExternalMessage({
      type: 'prepare',
      text: `Help me prepare for ${company}`,
      company: company
    });
  };

  return (
    <>
      <GlobalStyles />
      <div className="flex bg-[#f0f4f9] min-h-screen font-['Google_Sans_Text']">
        <Sidebar onNavClick={() => {}} />
        <div className="flex-1 flex flex-col ml-[94px]">
          <AppBar />


          <MainContent onDiagnose={handleDiagnose} onPrepare={handlePrepare} />
        </div>
        
        {isCanvasOpen && isCanvasLoading && (
          <CanvasLoadingState type={canvasType} />
        )}
        
        {isCanvasOpen && !isCanvasLoading && canvasType === 'diagnose' && (
          <CompanyDiagnosisCanvas 
            onAskConnectAI={(text, sectionId) => {
              setFocusedText(text);
              setHighlightOriginSectionId(sectionId);
              setRefiningCard(null); // clear section so it targets highlights
            }}
            onClose={handleCloseCanvas} 
            companyName={canvasCompany} 
            focusedSection={refiningCard}
            onRefineClick={(id, title) => {
              setRefiningCard({ id, title });
              setFocusedText(null); // clear highlights so it targets card
            }}
            sectionLoading={sectionLoading}
            onPromptClick={handlePromptClick}
            customSectionContents={customSectionContents}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={(newRange) => {
              setSelectedDateRange(newRange);
              setIsCanvasLoading(true);
              setExternalMessage({
                type: 'date_update',
                text: newRange,
                company: canvasCompany || 'Acme Corp'
              });
              setTimeout(() => {
                setIsCanvasLoading(false);
              }, 1500);
            }}
          />
        )}
        
        {isCanvasOpen && !isCanvasLoading && canvasType === 'prepare' && (
          <MeetingPrepCanvas 
            onClose={handleCloseCanvas} 
            companyName={canvasCompany || 'Acme Corp'} 
            focusedSection={refiningCard}
            onRefineClick={(id, title) => setRefiningCard({ id, title })}
            sectionLoading={sectionLoading}
            onPromptClick={handlePromptClick}
            customSectionContents={customSectionContents}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={(newRange) => {
              setSelectedDateRange(newRange);
              setIsCanvasLoading(true);
              setExternalMessage({
                type: 'date_update',
                text: newRange,
                company: canvasCompany || 'Acme Corp'
              });
              setTimeout(() => {
                setIsCanvasLoading(false);
              }, 1500);
            }}
          />
        )}

        {isCanvasOpen && !isCanvasLoading && canvasType === 'gap' && (
          <GrowthPlannerCanvas 
            onClose={handleCloseCanvas} 
            companyName={canvasCompany || 'Acme Corp'} 
          />
        )}

        {isCanvasOpen && !isCanvasLoading && canvasType === 'sales' && (
          <SalesOutlookCanvas 
            onClose={handleCloseCanvas} 
            companyName={canvasCompany || 'Acme Corp'} 
            refiningCard={refiningCard}
            onRefineClick={(id, title) => setRefiningCard({ id, title })}
            sectionLoading={sectionLoading}
            customSectionContents={customSectionContents}
          />
        )}

        {isCanvasOpen && !isCanvasLoading && canvasType === 'slides' && (
          <SlideDeckCanvas 
            onClose={handleCloseCanvas} 
            companyName={canvasCompany || 'Acme Corp'} 
            focusedSection={refiningCard}
            onRefineClick={(id, title) => setRefiningCard({ id, title })}
            sectionLoading={sectionLoading}
            customSectionContents={customSectionContents}
            onPromptClick={handlePromptClick}
          />
        )}
        <RightPanel 
          isCanvasOpen={isCanvasOpen} 
          onGenerateCanvasStart={handleGenerateCanvasStart} 
          onGenerateCanvasComplete={handleGenerateCanvasComplete} 
          onOpenCanvas={handleOpenCanvas}
          externalMessage={externalMessage} 
          onExternalMessageHandled={() => setExternalMessage(undefined)}
          focusedSection={refiningCard}
          focusedText={focusedText}
          onClearFocus={() => {
            setRefiningCard(null);
            setFocusedText(null);
          }}
          onSubmitRefinement={async (prompt) => {
            if (refiningCard) {
              const cardId = refiningCard.id;
              const cardTitle = refiningCard.title;
              setSectionLoading(cardId);
              try {
                const result = await refineCanvasSection(canvasType, cardId, cardTitle, prompt, canvasCompany || 'Acme Corp');
                if (result) {
                  setCustomSectionContents(prev => ({
                    ...prev,
                    [cardId]: result
                  }));
                }
              } catch (e) {
                console.error("Failed to refine section", e);
              } finally {
                setSectionLoading(null);
              }
            } else if (focusedText) {
              // Dynamic highlight refinement update
              // Resolve the target section ID dynamically from highlighted origin
              const rawCardId = highlightOriginSectionId || 'growth-opportunities';
              // Strip section suffix if any to align with section styles (e.g., 'growth-opportunities-section' -> 'growth-opportunities')
              const cardId = rawCardId.replace('-section', '');
              const cardTitle = cardId === 'growth-opportunities' ? 'Growth opportunities' : cardId;
              
              setSectionLoading(cardId);
              try {
                const result = await refineCanvasSection(canvasType, cardId, cardTitle, prompt + " [Context: " + focusedText + "]", canvasCompany || 'Acme Corp');
                if (result) {
                  setCustomSectionContents(prev => ({
                    ...prev,
                    [cardId]: result
                  }));
                }
              } catch (e) {
                console.error("Failed to refine highlighted section", e);
              } finally {
                setSectionLoading(null);
                setFocusedText(null);
                setHighlightOriginSectionId(null);
              }
            }
          }}
        />
      </div>
    </>
  );
}
