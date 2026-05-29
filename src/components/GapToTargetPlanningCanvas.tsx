import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CitationBadge, Source } from './CitationBadge';
import { RefinedSectionResult } from '../services/gemini';

export const GapToTargetPlanningCanvas = ({ 
  onClose,
  onPromptClick,
  focusedSection,
  onRefineClick,
  onAskConnectAI,
  sectionLoading,
  companyName = 'Acme Corp',
  customSectionContents
}: { 
  onClose: () => void,
  onPromptClick?: (text: string) => void,
  focusedSection?: { id: string; title: string } | null,
  onRefineClick?: (id: string, title: string) => void,
  onAskConnectAI?: (text: string) => void,
  sectionLoading?: string | null,
  companyName?: string,
  customSectionContents?: Record<string, RefinedSectionResult>
}) => {
  const mockSource1: Source = {
    id: '1',
    type: 'link',
    title: 'Sales Target Analysis',
    url: 'https://example.com/target'
  };

  const mockSource2: Source = {
    id: '2',
    type: 'transcript',
    title: 'Q3 Planning Session',
    date: '2026-03-01',
    participants: ['Charlie Black', 'Diana White'],
    transcriptSnippet: 'Charlie: We need to focus on unblocking Acme Corp revenue.\nDiana: Agreed, that is our highest priority.'
  };

  const mockSource3: Source = {
    id: '3',
    type: 'docs',
    title: 'Gap Analysis & Recovery Brief',
    url: 'https://example.com/docs',
    lastUpdated: 'Feb 18, 2026'
  };

  const mockSource4: Source = {
    id: '4',
    type: 'slides',
    title: 'Q3 Recovery Plan Pitch',
    url: 'https://example.com/slides',
    lastUpdated: 'Mar 02, 2026'
  };
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [refinedSections, setRefinedSections] = useState<Record<string, boolean>>({});
  const [selectionPopup, setSelectionPopup] = useState<{ x: number, y: number, text: string } | null>(null);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectionPopup({
            x: rect.left + (rect.width / 2),
            y: rect.top - 10,
            text: selection.toString().trim()
          });
        }
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#selection-popup')) {
        setSelectionPopup(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (sectionLoading) {
      setRefinedSections(prev => ({ ...prev, [sectionLoading]: false }));
    }
  }, [sectionLoading]);

  const prevSectionLoading = useRef<string | null>(null);
  useEffect(() => {
    if (prevSectionLoading.current && !sectionLoading) {
      setRefinedSections(prev => ({ ...prev, [prevSectionLoading.current!]: true }));
    }
    prevSectionLoading.current = sectionLoading || null;
  }, [sectionLoading]);

  const getSectionStyle = (id: string, defaultBg: string = "bg-[#4E8FF8]/[0.08]") => {
    const isFocused = focusedSection?.id === id;
    const isLoading = sectionLoading === id;
    
    if (isLoading) {
      return {
        className: "flex flex-col items-start p-0 w-full rounded-[16px] border-2 border-transparent bg-[#E8F0FE] relative transition-all duration-300",
        style: {
          background: 'linear-gradient(white, white) padding-box, linear-gradient(86deg, #217BFE 0%, #7621FE 100%) border-box',
          border: '2px solid transparent'
        }
      };
    }
    
    if (isFocused) {
      return {
        className: "flex flex-col items-start p-0 w-full rounded-[16px] border-2 border-[#1A73E8] bg-[#E8F0FE] relative transition-all duration-300",
        style: {}
      };
    }
    return {
      className: `flex flex-col items-start p-0 w-full ${defaultBg} rounded-[16px] transition-all duration-300 border-2 border-transparent`,
      style: {}
    };
  };

  const renderFooterActions = (id: string, title: string, prompts: string[]) => (
    <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full">
      <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
        {prompts.map((prompt, idx) => (
          <div 
            key={idx}
            className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
            onClick={() => onPromptClick?.(prompt)}
          >
            <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
              <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
              <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                {prompt}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center p-0 gap-[16px] h-[32px]">
        <div className="flex flex-row items-center p-0 gap-[4px] h-[20px] cursor-pointer group">
          <div className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1A73E8] group-hover:underline">
            Sources
          </div>
          <i className="google-symbols text-[18px] leading-none text-[#1A73E8]">arrow_drop_down</i>
        </div>
        {focusedSection?.id === id ? (
          <button 
            className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
            onClick={() => onRefineClick?.('', '')}
          >
            Cancel refining
          </button>
        ) : (
          <div 
            className="flex flex-row items-center p-0 gap-[8px] h-[20px] cursor-pointer group"
            onClick={() => onRefineClick?.(id, title)}
          >
            <i className="google-symbols text-[18px] leading-none text-[#1A73E8]">pen_spark_io25</i>
            <div className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1A73E8] group-hover:underline">
              Refine
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
    <div className="fixed right-0 left-[420px] top-0 bottom-0 z-[60] bg-white flex flex-col border-l border-[#E8EAED] shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out">
      <style>{`
        @keyframes callout-rotate {
          0% { transform: rotate(135deg); }
          100% { transform: rotate(565deg); }
        }
        @keyframes callout-fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .callout-shimmer {
          animation: callout-rotate 8s cubic-bezier(0.20, 0.00, 0.00, 1.00), callout-fadeOut 1s cubic-bezier(0.40, 0.00, 0.20, 1.00) 4s;
          animation-fill-mode: forwards;
        }
        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(86.04deg, #217BFE 0%, #078EFB 6.25%, #A190FF 12.5%, #AF95FF 18.75%, #FFFFFF 25%, #AF95FF 31.25%, #A190FF 37.5%, #078EFB 43.75%, #217BFE 50%, #078EFB 56.25%, #A190FF 62.5%, #AF95FF 68.75%, #FFFFFF 75%, #AF95FF 81.25%, #A190FF 87.5%, #078EFB 93.75%, #217BFE 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          opacity: 0.1;
          border-radius: 16px;
        }
      `}</style>
      
      <div className="flex flex-col items-start p-0 isolate w-[calc(100%-48px)] max-w-[1680px] mx-auto shrink-0 bg-[linear-gradient(266.54deg,#E7F2FF_0%,#F7ECFE_100%)] border-b border-l border-r border-[#DADCE0] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.04)] rounded-b-[20px] relative z-10">
        <div className="box-border flex flex-col items-start p-[8px_8px_16px_24px] w-full h-[88px] border-b border-[#DADCE0] z-[2]">
          <div className="flex flex-row items-center pt-[8px] gap-[24px] w-full h-[48px]">
            <div className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#000000] flex-1 truncate">
              Gap to Target for {companyName}
            </div>
            <div className="flex flex-row justify-end items-center p-0 w-[96px] h-[48px]">
              <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                <i className="google-symbols text-[24px] leading-none text-[#5F6368]">ios_share</i>
              </button>
              <button onClick={onClose} className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                <i className="google-symbols text-[24px] leading-none text-[#5F6368]">close</i>
              </button>
            </div>
          </div>
          <div className="flex flex-row items-start p-0 gap-[8px] w-full h-[16px]">
            <div className="flex flex-row items-center p-0 h-[16px]">
              <div className="font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase bg-[linear-gradient(86.54deg,#00BBDF_0%,#3271EA_50.48%,#C597FF_100%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap">
                Canvas mode
              </div>
            </div>
            <div className="font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase text-[#919191] whitespace-nowrap">
              V1.001.A
            </div>
          </div>
        </div>
        
        <div className="flex flex-row items-center p-[6px_24px] gap-[8px] w-full h-[44px] z-[1]">
          <div className="font-['Roboto'] font-medium text-[11px] leading-[16px] flex items-center tracking-[0.8px] uppercase text-[#919191] whitespace-nowrap">
            Scope
          </div>
          <div className="box-border flex flex-row items-center p-0 h-[32px] bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]">
            <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
              <i className="google-symbols text-[18px] leading-none text-[#3C4043] flex items-center text-center">calendar_today</i>
              <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043] whitespace-nowrap">
                Jan 1 - Apr 31, 2026
              </div>
              <div className="flex flex-row items-center p-0 gap-[8px] w-[12px] h-[18px]">
                <i className="google-symbols text-[18px] leading-none text-[#3C4043] flex items-center text-center">arrow_drop_down</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-[#ffffff] flex flex-col items-center relative">
        {focusedSection && (
          <div className="fixed bottom-[24px] left-1/2 transform -translate-x-1/2 z-[100] flex flex-col items-start p-[24px_12px_12px] gap-[23px] w-[634px] bg-[#303030] shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.30)] rounded-[8px]">
            <div className="flex flex-row items-end p-0 gap-[5px] h-[23px]">
              <div className="w-[41px] h-[20px] font-['Roboto'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#F2F2F2]">
                Editing
              </div>
              <div className="flex flex-row justify-center items-center p-[1px_8px_0px] gap-[10px] h-[23px] bg-[#474747] rounded-[4px]">
                <div className="h-[20px] font-['Roboto'] font-medium text-[14px] leading-[20px] tracking-[0.2px] text-[#F2F2F2]">
                  {focusedSection.title}
                </div>
              </div>
            </div>
            
            <div className="relative flex flex-row items-start p-[24px_16px_136px] gap-[10px] w-full h-[180px] bg-[#474747] rounded-[8px]">
              <textarea 
                className="w-full h-full bg-transparent border-none outline-none font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#F2F2F2] placeholder-[#C7C7C7] resize-none"
                placeholder="Type a prompt to refine and edit this section..."
                autoFocus
              />
              
              <div className="absolute left-[16px] bottom-[16px] flex flex-row items-center p-0 gap-[12px]">
                <button className="box-border flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px] border border-[#ABABAB] rounded-[8px] bg-transparent cursor-pointer hover:bg-white/5">
                  <div className="h-[20px] font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#C7C7C7]">
                    Expand content
                  </div>
                </button>
                <button className="box-border flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px] border border-[#ABABAB] rounded-[8px] bg-transparent cursor-pointer hover:bg-white/5">
                  <div className="h-[20px] font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#C7C7C7]">
                    Add data table
                  </div>
                </button>
                <button className="box-border flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px] border border-[#ABABAB] rounded-[8px] bg-transparent cursor-pointer hover:bg-white/5">
                  <div className="h-[20px] font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#C7C7C7]">
                    Include customer sentiment
                  </div>
                </button>
              </div>

              <button 
                className="absolute right-[12px] bottom-[12px] flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent hover:bg-white/10 cursor-pointer"
                onClick={() => {
                  onPromptClick?.("Refinement submitted");
                }}
              >
                <i className="google-symbols text-[24px] leading-[50px] flex items-center text-center text-[#F9F9F9]">send</i>
              </button>
            </div>

            <button 
              className="absolute right-[13px] top-[13px] flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-white/10 z-[3]"
              onClick={() => onRefineClick?.('', '')}
            >
              <i className="google-symbols text-[24px] leading-[50px] flex items-center text-center text-[#F9F9F9]">close</i>
            </button>
          </div>
        )}
        <div className="w-full max-w-[1680px] flex flex-col gap-6">
        
          {/* Card 1: Current Attainment & Gap Summary */}
          <div {...getSectionStyle('attainment-summary', 'bg-[#E7F2FF]/[0.6]')}>
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'attainment-summary' ? 'opacity-30' : ''}`}>

                {/* [Header] */}
                <div className="flex flex-row items-center p-[12px_0px] w-full h-[72px]">
                  {/* [Primary section] */}
                  <div className="flex flex-row items-center p-[0px_24px] gap-[8px] flex-1 h-[48px]">
                    <div className="relative w-[36px] h-[36px]">
                       <i className="google-symbols absolute inset-0 flex items-center justify-center text-[36px] leading-[50px] text-transparent bg-clip-text bg-[linear-gradient(60.06deg,#3271EA_19.36%,#4E8FF8_39.03%,#C597FF_69.85%)]">target</i>
                    </div>
                    <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                      Current Attainment & Gap Summary
                    </div>
                  </div>
                  {/* [Header actions slot] */}
                  <div className="flex flex-row justify-end items-center p-[0px_8px_0px_0px] gap-[8px] w-[56px] h-[48px]">
                    <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                      <i className="google-symbols text-[24px] leading-none text-[#5F6368]">more_vert</i>
                    </button>
                  </div>
                </div>

                {/* [Content slot] */}
                <div className="flex flex-col items-start p-[8px_24px] gap-[24px] w-full">
                  {/* Overview Text */}
                  <div className="flex flex-col gap-[8px] w-full">
                    <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                      Overview
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                      {customSectionContents && customSectionContents['attainment-summary'] ? (
                        <div className="whitespace-pre-wrap">{customSectionContents['attainment-summary'].text}</div>
                      ) : (
                        <>
                          {`You are currently pacing slightly behind your primary revenue target while tracking short on both Points and UAAs for the quarter. The action plan below focuses on unblocking suspended revenue for Acme Corp while pushing quick-win product offerings to secure your remaining UAA requirements.`}
                          <CitationBadge sources={[mockSource1, mockSource2, mockSource3, mockSource4]} />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Scorecards */}
                  <div className="flex flex-row items-center p-0 gap-[134px] w-[736px] h-[151px]">
                    
                    {/* Revenue Scorecard */}
                    <div className="box-border flex flex-col items-start p-[16px] gap-[12px] w-[156px] h-[151px] rounded-[8px]">
                      <div className="flex flex-col items-start p-0 w-[124px] min-w-[124px] h-[76px]">
                        <div className="flex flex-row items-start p-0 gap-[4px] w-[47px] h-[16px]">
                          <div className="font-['Google_Sans_Text'] font-bold text-[11px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                            Revenue
                          </div>
                        </div>
                        <div className="flex flex-row items-end p-0 gap-[4px] w-[98px] h-[40px]">
                          <div className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] flex items-center text-[#000000]">
                            $450K
                          </div>
                        </div>
                        <div className="flex flex-row items-center p-[4px_0px_0px] gap-[4px] w-[77px] h-[20px]">
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[14px] h-[16px]">
                             <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Vs</div>
                          </div>
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[39px] h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                              $500K
                            </div>
                          </div>
                          <div className="flex flex-row justify-center items-center p-0 gap-[8px] w-[16px] h-[16px] rounded-[0px]">
                            <i className="google-symbols text-[16px] leading-[50px] flex items-center text-center text-[#FCBD00] font-variation-settings-['FILL'_1,'GRAD'_0,'ROND'_50]">warning</i>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start p-0 gap-[8px] w-[124px] h-[31px]">
                        <div className="flex flex-col items-start p-[0px_32px_0px_0px] gap-[10px] w-[124px] h-[7px] bg-[#E3E3E3] rounded-[100px]">
                          <div className="w-[92px] h-[7px] bg-[#4E8FF8] rounded-[100px]"></div>
                        </div>
                        <div className="w-[124px] h-[16px] font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#D93025]">
                          Gap: $50K
                        </div>
                      </div>
                    </div>

                    {/* Points Scorecard */}
                    <div className="box-border flex flex-col items-start p-[16px] gap-[12px] w-[156px] h-[151px] rounded-[8px]">
                      <div className="flex flex-col items-start p-0 w-[124px] min-w-[124px] h-[76px]">
                        <div className="flex flex-row items-start p-0 gap-[4px] w-[34px] h-[16px]">
                          <div className="font-['Google_Sans_Text'] font-bold text-[11px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                            Points
                          </div>
                        </div>
                        <div className="flex flex-row items-end p-0 gap-[4px] w-[40px] h-[40px]">
                          <div className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] flex items-center text-[#000000]">
                            60
                          </div>
                        </div>
                        <div className="flex flex-row items-center p-[4px_0px_0px] gap-[4px] w-[98px] h-[20px]">
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[14px] h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Vs</div>
                          </div>
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[60px] h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                              100 target
                            </div>
                          </div>
                          <div className="flex flex-row justify-center items-center p-0 gap-[8px] w-[16px] h-[16px] rounded-[0px]">
                            <i className="google-symbols text-[16px] leading-[50px] flex items-center text-center text-[#FCBD00] font-variation-settings-['FILL'_1,'GRAD'_0,'ROND'_50]">warning</i>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start p-0 gap-[8px] w-[124px] h-[31px]">
                        <div className="flex flex-col items-start p-[0px_25px_0px_0px] gap-[10px] w-[124px] h-[7px] bg-[#E3E3E3] rounded-[100px]">
                          <div className="w-[99px] h-[7px] bg-[#4E8FF8] rounded-[100px]"></div>
                        </div>
                        <div className="w-[124px] h-[16px] font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#D93025]">
                          Gap: 40 points
                        </div>
                      </div>
                    </div>

                    {/* UAAs Scorecard */}
                    <div className="box-border flex flex-col items-start p-[16px] gap-[12px] w-[156px] h-[151px] rounded-[8px]">
                      <div className="flex flex-col items-start p-0 w-[124px] min-w-[124px] h-[76px]">
                        <div className="flex flex-row items-start p-0 gap-[4px] w-[34px] h-[16px]">
                          <div className="font-['Google_Sans_Text'] font-bold text-[11px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                            Points
                          </div>
                        </div>
                        <div className="flex flex-row items-end p-0 gap-[4px] w-[32px] h-[40px]">
                          <div className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] flex items-center text-[#000000]">
                            12
                          </div>
                        </div>
                        <div className="flex flex-row items-center p-[4px_0px_0px] gap-[4px] w-[89px] h-[20px]">
                           <div className="flex flex-row items-center p-0 gap-[8px] w-[14px] h-[16px]">
                             <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Vs</div>
                           </div>
                           <div className="flex flex-row items-center p-0 gap-[8px] w-[51px] h-[16px]">
                             <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                               15 target
                             </div>
                           </div>
                           <div className="flex flex-row justify-center items-center p-0 gap-[8px] w-[16px] h-[16px] rounded-[0px]">
                             <i className="google-symbols text-[16px] leading-[50px] flex items-center text-center text-[#FCBD00] font-variation-settings-['FILL'_1,'GRAD'_0,'ROND'_50]">warning</i>
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start p-0 gap-[8px] w-[124px] h-[31px]">
                        <div className="flex flex-col items-start p-[0px_21px_0px_0px] gap-[10px] w-[124px] h-[7px] bg-[#E3E3E3] rounded-[100px]">
                          <div className="w-[103px] h-[7px] bg-[#4E8FF8] rounded-[100px]"></div>
                        </div>
                        <div className="w-[124px] h-[16px] font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#D93025]">
                          Gap: 3 UAAs
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {renderFooterActions('attainment-summary', 'Current Attainment & Gap Summary', [
                  'Prompt chip',
                  'Prompt chip'
                ])}
          </div>
          {sectionLoading === 'attainment-summary' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

          {/* Card 2: Root Cause Analysis */}
          <div id="root-cause" {...getSectionStyle('root-cause', 'bg-[#E7F2FF]/[0.6]')}>
            <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'root-cause' ? 'opacity-30' : ''}`}>

                {/* [Header] */}
                <div className="flex flex-row items-center p-[12px_0px] w-full h-[72px]">
                  {/* [Primary section] */}
                  <div className="flex flex-row items-center p-[0px_24px] gap-[8px] flex-1 h-[48px]">
                    <div className="relative w-[36px] h-[36px]">
                       <i className="google-symbols absolute inset-0 flex items-center justify-center text-[36px] leading-[50px] text-transparent bg-clip-text bg-[linear-gradient(60.06deg,#3271EA_19.36%,#4E8FF8_39.03%,#C597FF_69.85%)]">article</i>
                    </div>
                    <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                      Root cause analysis
                    </div>
                  </div>
                  {/* [Header actions slot] */}
                  <div className="flex flex-row justify-end items-center p-[0px_8px_0px_0px] gap-[8px] w-[56px] h-[48px]">
                    <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                      <i className="google-symbols text-[24px] leading-none text-[#5F6368]">more_vert</i>
                    </button>
                  </div>
                </div>

                {/* [Content slot] */}
                <div className="flex flex-col items-start p-[8px_24px] gap-[16px] w-full">
                  <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                    {customSectionContents && customSectionContents['root-cause'] ? (
                      <div className="whitespace-pre-wrap">{customSectionContents['root-cause'].text}</div>
                    ) : (
                      `Analyze your portfolio's performance trends to pinpoint exactly where revenue is leaking and why. This view identifies that the majority of your $50K deficit is concentrated within Acme Corp due to specific account-level blockers. By cross-referencing policy health and conversational intelligence, you can see that ad disapprovals are the primary driver behind the recent spend drop. Use these insights to prioritize your outreach and resolve high-impact suspensions to get your quarterly pacing back on track.`
                    )}
                  </div>

                  <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[24px] w-full">
                    {/* Basic child module (all-in-one) */}
                    <div className="flex flex-col items-start p-0 gap-[8px] flex-1 min-w-[380px]">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#000000] w-full">
                        Portfolio view
                      </div>

                      <div className="flex flex-col items-start p-[24px_0_0_24px] gap-[10px] w-[385px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#000000]">
                          The $50K revenue gap is heavily driven by Acme Corp, which is pacing $30K behind expectations.
                        </div>

                        {/* Bar graph (Manual reconstruction based on image logic) */}
                        <div className="relative w-[361px] h-[183px] mt-[10px]">
                           {/* StageNames bottom */}
                           <div className="absolute left-[80.76px] top-[155px] w-[80px] text-center font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">Acme Corp</div>
                           <div className="absolute left-[192.86px] top-[155px] w-[105px] text-center font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">Other accounts</div>
                           
                           {/* Custom Axis labels */}
                           <div className="absolute left-[0px] top-[135px] w-[40px] text-right font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] text-[#3C4043]">0</div>
                           <div className="absolute left-[0px] top-[90px] w-[40px] text-right font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] text-[#3C4043]">15</div>
                           <div className="absolute left-[0px] top-[45px] w-[40px] text-right font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] text-[#3C4043]">30</div>
                           <div className="absolute left-[0px] top-[0px] w-[40px] text-right font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] text-[#3C4043]">45</div>
                           {/* y-axis label */}
                           <div className="absolute left-[-50px] top-[90px] w-[145px] text-right font-['Google_Sans_Text'] font-medium text-[11px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] rotate-[-90deg] origin-center whitespace-nowrap">Revenue gap ($ thousands)</div>
                           
                           {/* Bar lines */}
                           <div className="absolute left-[53px] top-[1px] w-[308px] h-[0px] border-l border-[#919191]"></div>
                           <div className="absolute left-[53px] top-[146px] w-[308px] h-[0px] border-t border-[#919191]"></div>
                           <div className="absolute left-[141px] top-[145px] w-[8px] h-[0px] border-l border-[#919191]"></div>
                           <div className="absolute left-[45px] top-[145px] w-[8px] h-[0px] border-r border-[#919191]"></div>
                           <div className="absolute left-[45px] top-[100px] w-[8px] h-[0px] border-r border-[#919191]"></div>
                           <div className="absolute left-[45px] top-[55px] w-[8px] h-[0px] border-r border-[#919191]"></div>
                           <div className="absolute left-[45px] top-[10px] w-[8px] h-[0px] border-r border-[#919191]"></div>
                           <div className="absolute left-[265px] top-[145px] w-[8px] h-[0px] border-l border-[#919191]"></div>
                           
                           {/* Bars */}
                           <div className="absolute left-[88.39px] bottom-[37px] flex flex-col items-center gap-[12px] h-[124px]">
                              <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">30</div>
                              <div className="w-[80px] h-[96px] bg-[#1A73E8]"></div>
                           </div>
                           <div className="absolute left-[212.86px] bottom-[37px] flex flex-col items-center gap-[12px] h-[76px]">
                              <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">20</div>
                              <div className="w-[80px] h-[48px] bg-[#C7C7C7]"></div>
                           </div>
                        </div>

                      </div>
                    </div>

                    {/* Basic child module (all-in-one) 2 */}
                    <div className="flex flex-col items-start p-0 gap-[8px] flex-1 min-w-[380px]">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124] w-full">
                        Customer deep dive
                      </div>
                      <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full">
                        Spend has dropped significantly. Conversational Intelligence notes and Policy Health data indicate active ad disapprovals are halting spend in 3 key campaigns.
                      </div>
                      
                      <div className="flex flex-col items-start p-[16px_8px] gap-[10px] w-[359px] h-[248px] rounded-[8px] bg-transparent mt-[10px]">
                        <div className="relative w-[343px] h-[158px]">
                           {/* Y Labels Left */}
                           <div className="absolute left-[0px] right-[51px] top-[8px] h-[16px] flex flex-row items-center gap-[8px]">
                             <div className="w-[43px] text-right font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] text-[#3C4043] uppercase">$200K</div>
                             <div className="flex-1 h-[0px] border-t border-[#DADCE0]"></div>
                           </div>
                           <div className="absolute left-[0px] right-[51px] top-[65px] h-[16px] flex flex-row items-center gap-[8px]">
                             <div className="w-[43px] text-right font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] text-[#3C4043] uppercase">$100K</div>
                             <div className="flex-1 h-[0px] border-t border-[#DADCE0]"></div>
                           </div>
                           <div className="absolute left-[0px] right-[51px] top-[118px] h-[16px] flex flex-row items-center gap-[8px]">
                             <div className="w-[43px] text-right font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] text-[#3C4043] uppercase">$0</div>
                             <div className="flex-1 h-[0px] border-t border-[#3C4043]"></div>
                           </div>
                           
                           {/* Y Labels Right */}
                           <div className="absolute left-[308px] top-[8px] w-[43px] h-[16px] text-[#3271EA] font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase">$60K</div>
                           <div className="absolute left-[308px] top-[65px] w-[43px] h-[16px] text-[#3271EA] font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase">$30K</div>
                           <div className="absolute left-[308px] top-[118px] w-[43px] h-[16px] text-[#3271EA] font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase">$0K</div>

                           {/* Line chart svg block */}
                           <div className="absolute left-[51px] top-[8px] w-[242px] h-[110px]">
                               <svg width="242" height="110" viewBox="0 0 242 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   {/* Gray line - Account spend */}
                                   <path d="M0 20 L23 40 L45 53 L70 60 L95 62 L120 60 L145 66 L170 58 L200 68 L242 80" stroke="#ABABAB" strokeWidth="2" strokeLinejoin="round"/>
                                   {/* Blue line - Account budget */}
                                   <path d="M0 5 L17 45 L40 65 L65 74 L90 74 L115 78 L140 82 L170 90 L205 95 L242 98" stroke="#1A73E8" strokeWidth="2" strokeLinejoin="round"/>
                               </svg>
                           </div>

                           {/* X Axis */}
                           <div className="absolute left-[51px] w-[242px] bottom-[0px] h-[16px] flex flex-row justify-between items-start">
                             <div className="w-[48px] text-center font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">Apr 4</div>
                             <div className="w-[48px] text-center font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">Apr 17</div>
                           </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col items-start gap-[4px] mt-[16px] pl-[40px]">
                           <div className="flex flex-row items-center gap-[8px]">
                               <div className="w-[12px] h-[2px] bg-[#1A73E8]"></div>
                               <div className="font-['Roboto'] font-medium text-[14px] leading-[20px] tracking-[0.2px] text-[#303030]">Account budget</div>
                           </div>
                           <div className="flex flex-row items-center gap-[8px]">
                               <div className="w-[12px] h-[2px] bg-[#ABABAB]"></div>
                               <div className="font-['Roboto'] font-medium text-[14px] leading-[20px] tracking-[0.2px] text-[#303030]">Account spend</div>
                           </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {renderFooterActions('root-cause', 'Root Cause Analysis', [
                  'View policy details for Acme',
                  'Identify other declining accounts'
                ])}
          </div>
          {sectionLoading === 'root-cause' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

          {/* Card 3: Action Plan */}
          <div id="action-plan" {...getSectionStyle('action-plan', 'bg-[#E7F2FF]/[0.6]')}>
            <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'action-plan' ? 'opacity-30' : ''}`}>

                {/* [Header] */}
                <div className="flex flex-row items-center p-[12px_24px] w-full h-[72px]">
                  {/* [Primary section] */}
                  <div className="flex flex-row items-center gap-[8px] flex-1 h-[48px]">
                    <div className="relative w-[36px] h-[36px]">
                       <i className="google-symbols absolute inset-0 flex items-center justify-center text-[36px] leading-[50px] text-transparent bg-clip-text bg-[linear-gradient(60.06deg,#3271EA_19.36%,#4E8FF8_39.03%,#C597FF_69.85%)]">add_chart</i>
                    </div>
                    <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                      Close-the-Gap plan
                    </div>
                  </div>
                  {/* [Header actions slot] */}
                  <div className="flex flex-row justify-end items-center gap-[8px]">
                    <button className="flex flex-col justify-center items-center w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                      <i className="google-symbols text-[24px] leading-none text-[#5F6368]">more_vert</i>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-start p-[8px_24px] gap-[24px] w-full">
                  {/* Child 1: Rev Recovery */}
                  <div className="flex flex-col items-start p-[0_0_8px] gap-[0] w-full bg-[#FFFFFF] rounded-[8px_8px_4px_4px]">
                    {/* Actionable Row */}
                    <div className="flex flex-row items-center p-[8px_8px_8px_24px] gap-[24px] w-full h-[64px] rounded-[8px]">
                      <div className="flex flex-col justify-center items-start p-0">
                        <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                          Revenue recovery: Resolve Acme Corp policy suspensions
                        </div>
                      </div>
                      <div className="flex-1 border-t border-[#DADCE0]"></div>
                      <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                         <i className="google-symbols text-[24px] leading-none text-[#5F6368]">expand_less</i>
                      </button>
                    </div>

                    {/* Content Slot */}
                    <div className="flex flex-col items-start p-[8px_24px] gap-[16px] w-full">
                        <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#000000] max-w-[800px]">
                           <span className="font-bold">Insight:</span> Acme Corp’s revenue is blocked by 2 active policy suspensions.<br/>
                           <span className="font-bold">Recommendation:</span> Resolve policy disapprovals immediately to unblock pacings.
                        </div>
                        <div className="flex flex-col items-start p-0 gap-[16px] w-full">
                           {/* Violation 1 */}
                           <div className="box-border flex flex-col items-start p-[12px_24px] gap-[16px] w-full min-w-[380px] bg-[#FFFFFF] rounded-[12px]">
                              {/* Title Row */}
                              <div className="flex flex-row items-center w-full min-h-[32px] gap-[8px]">
                                 <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#202124]">
                                    Ads policy violation for
                                 </div>
                                 <div className="flex flex-row items-center gap-[8px] flex-1">
                                    <div className="w-[24px] h-[16px] bg-[#5F6368] text-white text-[10px] font-bold flex items-center justify-center rounded-[2px] tracking-[0.3px]">
                                      <span className="mb-[1px]">GA</span>
                                    </div>
                                    <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">1587456845</div>
                                 </div>
                                 <div className="flex flex-row items-center pl-[24px] gap-[8px]">
                                    <span className="bg-[#F8F9FA] rounded-[2px] px-[8px] py-[4px] text-[12px] font-medium text-[#3C4043] font-['Roboto'] tracking-[0.3px]">Search</span>
                                    <span className="bg-[#F8F9FA] rounded-[2px] px-[8px] py-[4px] text-[12px] font-medium text-[#3C4043] font-['Roboto'] tracking-[0.3px]">PMax+</span>
                                    <span className="bg-[#FFFFFF] border border-[#3C4043] rounded-[2px] px-[8px] py-[4px] text-[12px] font-medium text-[#3C4043] font-['Roboto'] tracking-[0.3px]">EMEA</span>
                                 </div>
                              </div>

                              {/* Two columns */}
                              <div className="flex flex-row flex-wrap items-start content-start gap-[24px] w-full min-h-[132px]">
                                 {/* Left Column: Root Cause */}
                                 <div className="flex flex-col gap-[8px] flex-1 min-w-[380px] min-h-[132px]">
                                    <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124] min-h-[28px]">Diagnosed root cause</div>
                                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] min-h-[48px]">
                                       3 top-performing campaigns stalled. Vertical video assets disapproved due to a policy violation.
                                    </div>
                                    <div className="flex flex-row items-center py-[8px] min-h-[40px]">
                                       <div className="bg-[#FCE8E6] text-[#C5221F] text-[12px] font-medium px-[4px] py-[2px] rounded-[2px] inline-flex items-center tracking-[0.3px]">
                                          Revenue impact: -$1.5 QTD pacing
                                       </div>
                                    </div>
                                 </div>

                                 {/* Right Column: Recommendation */}
                                 <div className="flex flex-col gap-[8px] flex-1 min-w-[380px] min-h-[132px]">
                                    <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124] min-h-[28px]">Recommendation</div>
                                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] min-h-[48px]">
                                       Escalate to support. File a support case and ask support to clearly identify why the ad is in breach and which specific creative is being flagged.
                                    </div>
                                    <div className="flex flex-row items-center py-[8px] min-h-[40px]">
                                       <div className="bg-[#E6F4EA] text-[#137333] text-[12px] font-medium px-[4px] py-[2px] rounded-[2px] inline-flex items-center tracking-[0.3px]">
                                          Potential impact: $1.5k w/w revenue
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Full-width footer */}
                              <div className="flex flex-row justify-end items-center gap-[16px] w-full min-h-[52px] py-[8px]">
                                <button className="flex flex-row justify-center items-center py-[0px] px-[8px] gap-[4px] w-auto h-[36px] bg-transparent border-none cursor-pointer hover:bg-black/5 rounded-[4px]">
                                   <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">Open gTech support case</span>
                                   <i className="google-symbols text-[20px] text-[#1A73E8] flex justify-center items-center h-[20px] w-[20px]">arrow_forward</i>
                                </button>
                              </div>
                           </div>

                           <div className="w-full border-t border-[#DADCE0]"></div>

                           {/* Violation 2 */}
                           <div className="box-border flex flex-col items-start p-[12px_24px] gap-[16px] w-full min-w-[380px] bg-[#FFFFFF] rounded-[12px]">
                              {/* Title Row */}
                              <div className="flex flex-row items-center w-full min-h-[32px] gap-[8px]">
                                 <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#202124]">
                                    Ads policy violation for
                                 </div>
                                 <div className="flex flex-row items-center gap-[8px] flex-1">
                                    <div className="w-[24px] h-[16px] bg-[#5F6368] text-white text-[10px] font-bold flex items-center justify-center rounded-[2px] tracking-[0.3px]">
                                      <span className="mb-[1px]">GA</span>
                                    </div>
                                    <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">1587456845</div>
                                 </div>
                                 <div className="flex flex-row items-center pl-[24px] gap-[8px]">
                                    <span className="bg-[#F8F9FA] rounded-[2px] px-[8px] py-[4px] text-[12px] font-medium text-[#3C4043] font-['Roboto'] tracking-[0.3px]">Search</span>
                                    <span className="bg-[#F8F9FA] rounded-[2px] px-[8px] py-[4px] text-[12px] font-medium text-[#3C4043] font-['Roboto'] tracking-[0.3px]">PMax+</span>
                                    <span className="bg-[#FFFFFF] border border-[#3C4043] rounded-[2px] px-[8px] py-[4px] text-[12px] font-medium text-[#3C4043] font-['Roboto'] tracking-[0.3px]">EMEA</span>
                                 </div>
                              </div>

                              {/* Two columns */}
                              <div className="flex flex-row flex-wrap items-start content-start gap-[24px] w-full min-h-[132px]">
                                 {/* Left Column: Root Cause */}
                                 <div className="flex flex-col gap-[8px] flex-1 min-w-[380px] min-h-[132px]">
                                    <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124] min-h-[28px]">Diagnosed root cause</div>
                                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] min-h-[48px]">
                                       3 top-performing campaigns stalled. Vertical video assets disapproved due to a policy violation.
                                    </div>
                                    <div className="flex flex-row items-center py-[8px] min-h-[40px]">
                                       <div className="bg-[#FCE8E6] text-[#C5221F] text-[12px] font-medium px-[4px] py-[2px] rounded-[2px] inline-flex items-center tracking-[0.3px]">
                                          Revenue impact: -$1.5 QTD pacing
                                       </div>
                                    </div>
                                 </div>

                                 {/* Right Column: Recommendation */}
                                 <div className="flex flex-col gap-[8px] flex-1 min-w-[380px] min-h-[132px]">
                                    <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124] min-h-[28px]">Recommendation</div>
                                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] min-h-[48px]">
                                       Escalate to support. File a support case and ask support to clearly identify why the ad is in breach and which specific creative is being flagged.
                                    </div>
                                    <div className="flex flex-row items-center py-[8px] min-h-[40px]">
                                       <div className="bg-[#E6F4EA] text-[#137333] text-[12px] font-medium px-[4px] py-[2px] rounded-[2px] inline-flex items-center tracking-[0.3px]">
                                          Potential impact: $1.5k w/w revenue
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Full-width footer */}
                              <div className="flex flex-row justify-end items-center gap-[16px] w-full min-h-[52px] py-[8px]">
                                <button className="flex flex-row justify-center items-center py-[0px] px-[8px] gap-[4px] w-auto h-[36px] bg-transparent border-none cursor-pointer hover:bg-black/5 rounded-[4px]">
                                   <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">Draft customer email</span>
                                   <i className="google-symbols text-[20px] text-[#1A73E8] flex justify-center items-center h-[20px] w-[20px]">arrow_forward</i>
                                </button>
                              </div>
                           </div>
                        </div>  </div>
                    </div>

                  {/* Child 2: Bridge the Gap */}
                  <div className="flex flex-col items-start p-[0_0_8px] gap-[0] w-full bg-[#FFFFFF] rounded-[8px_8px_4px_4px]">
                    {/* Actionable Row */}
                    <div className="flex flex-row items-center p-[8px_8px_8px_24px] gap-[24px] w-full h-[64px] rounded-[8px]">
                      <div className="flex flex-col justify-center items-start p-0">
                        <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                          Bridge the gap: Leveraging VBB recommendations to hit UAA targets
                        </div>
                      </div>
                      <div className="flex-1 border-t border-[#DADCE0]"></div>
                      <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                         <i className="google-symbols text-[24px] leading-none text-[#5F6368]">expand_less</i>
                      </button>
                    </div>

                    {/* Content Slot */}
                    <div className="flex flex-col items-start p-[8px_24px_24px_24px] gap-[16px] w-full">
                       <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#000000] w-full max-w-[1200px]">
                          <span className="font-bold">Insight:</span> You are 3 UAAs short of target, but have 5 active 'Recommended' offerings for Value-Based Bidding in your portfolio.<br/>
                          <span className="font-bold">Recommendation:</span> Pitch VBB to the 3 highest-headroom accounts to secure remaining UAAs and points.
                          <br/><br/>
                          
                          <span className="font-bold text-[#202124]">What to pitch:</span>
                          <ul className="list-disc pl-5 mt-2 space-y-2 mb-4">
                             <li><span className="font-bold">Top eligible campaign:</span> Search_Shoes_3/14<span className="text-[#1A73E8] inline-flex items-center ml-1"><i className="google-symbols text-[16px]">open_in_new</i></span>. 6% of advertiser’s 30-day spend as of 12/5, utilizes 85% of its budget, but does not use AI Max.<br/><span className="text-[#1A73E8] cursor-pointer hover:underline inline-flex items-center mt-1">Expand campaign performance details <i className="google-symbols text-[18px]">expand_more</i></span></li>
                             <li><span className="font-bold">Action: Upgrade to AI Max, to double down on the positive momentum</span> in reaching more potential customers at the same or higher ROAS. Activate now to be fully ready to capture new demand from MLK Sales Promotion event.</li>
                             <li><span className="font-bold">Benefit:</span> <span className="bg-[#E6F4EA] text-[#137333] px-1 rounded-[2px] font-medium text-[12px] inline">An estimated $450 daily conversion value is estimated as advertisers that activate AI Max in Search campaigns will typically see 14% uplift</span><br/><span className="text-[#1A73E8] cursor-pointer hover:underline inline-flex items-center mt-1 mr-4">Show all campaigns without AI Max</span><span className="text-[#1A73E8] cursor-pointer hover:underline inline-flex items-center mt-1">See Optiscore <i className="google-symbols text-[18px] ml-1">open_in_new</i></span></li>
                          </ul>

                          <span className="font-bold text-[#202124] mt-4">How to pitch:</span>
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                             <li><span className="font-bold">Peer adoption:</span> <span className="bg-[#E6F4EA] text-[#137333] px-1 rounded-[2px] font-medium text-[12px] inline">Over 60% customers in fashion vertical have AI Max turned on. Advertisers that activate AI Max in Search campaigns will typically see 14% more conversions or conversion value at a similar CPA/ROAS.</span> For campaigns that are still mostly using exact and phrase keywords, the typical uplift is even higher at 27%</li>
                             <li><span className="font-bold">Past adoption:</span> Campaign Search_Hat_6/14<span className="text-[#1A73E8] inline-flex items-center ml-1"><i className="google-symbols text-[16px]">open_in_new</i></span> adopted AI Max on 8/15, and observed a 15% increase in conversions in the 30 days after adoption. Targeting change was a likely contributor to the performance uplift based on <span className="text-[#3C4043] underline cursor-pointer hover:text-[#1A73E8]">Ads Explanation data</span></li>
                             <li><span className="font-bold">Asset Readiness:</span> Customer already has 2 image assets that can be used for the campaign. To create required video assets, leverage free <span className="text-[#3C4043] underline cursor-pointer hover:text-[#1A73E8] mr-1">gTech Service</span><span className="text-[#1A73E8] inline-flex items-center relative top-[2px]"><i className="google-symbols text-[16px]">open_in_new</i></span>, <span className="text-[#3C4043] underline cursor-pointer hover:text-[#1A73E8]">Brand Studio <span className="text-[#1A73E8] no-underline inline-flex items-center relative top-[2px] ml-[2px]"><i className="google-symbols text-[16px]">open_in_new</i></span></span> in Google Ads.</li>
                          </ul>
                       </div>

                       {/* Action Button */}
                       <div className="flex flex-row justify-end w-full py-[8px]">
                          <button 
                            onClick={() => onPromptClick?.('Generate a pitch deck for ' + companyName)}
                            className="flex flex-row justify-center items-center py-0 px-[8px] gap-[8px] h-[36px] bg-transparent border-none cursor-pointer hover:bg-black/5 rounded-[100px]"
                          >
                             <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">Create pitch deck</span>
                             <i className="google-symbols text-[20px] text-[#1A73E8]">arrow_forward</i>
                          </button>
                       </div>

                       {/* Footer Feedback */}
                       <div className="flex flex-row justify-between items-center px-[16px] py-[0px] w-full h-[36px] bg-[rgba(0,53,73,0.04)] rounded-[100px] mt-2">
                           <div className="flex flex-row items-center p-0 mx-auto h-[36px]">
                              <div className="w-[249px] font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-center text-[#3C4043]">
                                 How do you like this pitch recommendation?
                              </div>
                              <button className="flex flex-col items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-black/5 border-none bg-transparent cursor-pointer">
                                 <i className="google-symbols text-[20px] text-[#5F6368]">thumb_up</i>
                              </button>
                              <button className="flex flex-col items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-black/5 border-none bg-transparent cursor-pointer">
                                 <i className="google-symbols text-[20px] text-[#5F6368]">thumb_down</i>
                              </button>
                           </div>
                           <div className="flex flex-row items-center justify-end gap-[8px] h-[20px] min-w-[200px]">
                              <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] underline text-[#202124] cursor-pointer hover:text-[#1A73E8]">Key talking point</div>
                              <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#202124]">•</div>
                              <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#202124]">Generated 8s ago</div>
                           </div>
                       </div>
                    </div>
                  </div>

                </div>

                <div className="pb-[24px]">
                  {renderFooterActions('action-plan', 'Close-the-Gap plan', [
                     'Draft an email sequence for VBB pitch',
                     'Show more insights on Acme Corp'
                  ])}
                </div>
          </div>
          {sectionLoading === 'action-plan' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

          <div className="flex flex-col items-start p-0 w-full max-w-[1452px] min-w-[380px] bg-[#e7f2ff80] rounded-[16px] z-[1] pb-[20px]">
             {/* Header */}
             <div className="flex flex-row items-center py-[12px] px-0 w-full h-[56px]">
                {/* Primary section */}
                <div className="flex flex-row items-center px-[24px] py-0 gap-[8px] w-full h-[32px]">
                   <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1F1F1F]">
                     What else would you like to add?
                   </div>
                </div>
             </div>

             {/* Content slot */}
             <div className="flex flex-col items-start px-[24px] py-[8px] gap-[24px] w-full">
               {/* Basic child module */}
               <div className="flex flex-col items-start p-0 gap-[8px] w-full">
                 <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                    Click on a chip below to add additional helpful content to the canvas that will help you with your diagnosis. You can also ask Connect AI to add content to the canvas. <a href="#" className="text-[#1A73E8] no-underline">Learn more</a>
                 </div>
               </div>
             </div>

             {/* Prompts slot */}
             <div className="flex flex-row flex-wrap items-center content-start px-[24px] py-0 gap-[8px] w-full mt-[8px]">
               {/* Chip 1 */}
               <button className="box-border flex flex-row items-center p-0 h-[32px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-black/5">
                 <div className="flex flex-row items-center px-[12px] py-0 gap-[4px] h-full">
                   <i className="google-symbols text-[18px] text-[#1A73E8]">add_box</i>
                   <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#3C4043]">
                     Pipeline summary
                   </div>
                 </div>
               </button>

               {/* Chip 2 */}
               <button className="box-border flex flex-row items-center p-0 h-[32px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-black/5">
                 <div className="flex flex-row items-center px-[12px] py-0 gap-[4px] h-full">
                   <i className="google-symbols text-[18px] text-[#1A73E8]">add_box</i>
                   <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#3C4043]">
                     Multi-quarter plan summary
                   </div>
                 </div>
               </button>

               {/* Chip 3 */}
               <button className="box-border flex flex-row items-center p-0 h-[32px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-black/5">
                 <div className="flex flex-row items-center px-[12px] py-0 gap-[4px] h-full">
                   <i className="google-symbols text-[18px] text-[#1A73E8]">add_box</i>
                   <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#3C4043]">
                     Neary Brands Stakeholder summary
                   </div>
                 </div>
               </button>

               {/* Chip 4 */}
               <button className="box-border flex flex-row items-center p-0 h-[32px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-black/5">
                 <div className="flex flex-row items-center px-[12px] py-0 gap-[4px] h-full">
                   <i className="google-symbols text-[18px] text-[#1A73E8]">add_box</i>
                   <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#3C4043]">
                     Share of traffic summary
                   </div>
                 </div>
               </button>
             </div>
          </div>

        </div>
        
        {selectionPopup && (
          <div 
            id="selection-popup"
            className="fixed z-[100] transform -translate-x-1/2 -translate-y-[100%] bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-2 items-center"
            style={{ left: selectionPopup.x, top: selectionPopup.y - 10 }}
          >
            <button 
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap flex items-center gap-1"
              onClick={() => onAskConnectAI?.(`Explain: "${selectionPopup.text}"`)}
            >
              <i className="google-symbols text-[18px]">temp_preferences_custom</i>
              Ask Connect AI
            </button>
            <button 
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap flex items-center gap-1"
              onClick={() => {
                navigator.clipboard.writeText(selectionPopup.text);
                setSelectionPopup(null);
              }}
            >
              <i className="google-symbols text-[18px]">content_copy</i>
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
