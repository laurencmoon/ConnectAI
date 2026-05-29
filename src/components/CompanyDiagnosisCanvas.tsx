import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CitationBadge, Source } from './CitationBadge';
import { RefinedSectionResult } from '../services/gemini';

export const CompanyDiagnosisCanvas = ({ 
  onClose, 
  onPromptClick,
  focusedSection,
  onRefineClick,
  onAskConnectAI,
  sectionLoading,
  companyName = 'Acme Corp',
  customSectionContents,
  selectedDateRange = 'Jan 1 - today',
  onDateRangeChange
}: { 
  onClose: () => void, 
  onPromptClick?: (text: string) => void,
  focusedSection?: { id: string; title: string } | null,
  onRefineClick?: (id: string, title: string) => void,
  onAskConnectAI?: (text: string, sectionId: string | null) => void,
  sectionLoading?: string | null,
  companyName?: string,
  customSectionContents?: Record<string, RefinedSectionResult>,
  selectedDateRange?: string,
  onDateRangeChange?: (newRange: string) => void
}) => {
  const mockSource1: Source = {
    id: '1',
    type: 'link',
    title: 'Q1 Financial Report',
    url: 'https://example.com/report'
  };

  const mockSource2: Source = {
    id: '2',
    type: 'transcript',
    title: 'Q1 Strategy Meeting',
    date: '2026-04-15',
    participants: ['John Doe', 'Jane Smith'],
    transcriptSnippet: 'John: We are seeing a 15% increase in conversion rates with PMax campaigns.\nJane: That is great news! Let us scale that.\nJohn: Yes, search remains our primary revenue driver at $188.6k QTD, with PMax taking up 57% of our last 30 days spend.\nJane: Excellent. What about YouTube? Are we seeing traction there?\nJohn: Absolutely. YouTube expansion is pacing at $55.4k QTD. The "Boots Season" campaigns drove brand searches up 80% YoY.\nJane: That is fantastic. And regional performance?\nJohn: Australia is leading at $139.1k QTD spend, but search growth is hitting some saturation at +23% YoY.\nJane: Understood. We need to start focusing on driving domestic market share there. What about USA and New Zealand?\nJohn: USA is scaling fast toward the $18M annual target, sitting at $85.5k QTD. New Zealand is still a constant battle at $19.4k QTD spend due to local economic headwinds.\nJane: Got it. Let us keep a close eye on that policy violation in EMEA as well to ensure we don\'t stall USA/NZ momentum.'
  };

  const mockSource3: Source = {
    id: '3',
    type: 'slides',
    title: 'YouTube Growth Strategy Deck',
    url: 'https://example.com/slides',
    lastUpdated: 'Mar 12, 2026'
  };

  const mockSource4: Source = {
    id: '4',
    type: 'sheets',
    title: 'Regional Spend Breakdown',
    url: 'https://example.com/sheets'
  };

  const mockSource5: Source = {
    id: '5',
    type: 'link',
    title: 'Boots Season Campaign Analysis',
    url: 'https://example.com/analysis'
  };

  const mockSource6: Source = {
    id: '6',
    type: 'docs',
    title: 'AI Max Comm Doc',
    url: 'https://example.com/docs',
    lastUpdated: 'Mar 12, 2026'
  };


  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [openDatePickerCardId, setOpenDatePickerCardId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'youtube-tv': true,
    'growth-search': false,
    'growth-dva': false,
    'ontrack-search': false,
    'ontrack-dva': false
  });
  const [refinedSections, setRefinedSections] = useState<Record<string, boolean>>({});
  const [hoveredCitationId, setHoveredCitationId] = useState<string | null>(null);
  const [selectionPopup, setSelectionPopup] = useState<{ x: number, y: number, text: string, sectionId: string | null } | null>(null);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // Small delay to allow selection to complete
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Find closest section ID
          let anchor = selection.anchorNode;
          let containerEl = anchor && anchor.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor as HTMLElement;
          let sectionEl = containerEl?.closest('div[id]');
          let matchedSectionId = sectionEl?.id || null;

          setSelectionPopup({
            x: rect.left + (rect.width / 2),
            y: rect.top - 10,
            text: selection.toString().trim(),
            sectionId: matchedSectionId
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

  // When sectionLoading transitions from true to false for a section, mark it as refined
  useEffect(() => {
    if (sectionLoading) {
      // Clear the refined state while loading
      setRefinedSections(prev => ({ ...prev, [sectionLoading]: false }));
    }
  }, [sectionLoading]);

  // We need a way to know when loading finishes. 
  // Since sectionLoading becomes null, we can track the previous value.
  const prevSectionLoading = useRef<string | null>(null);
  useEffect(() => {
    if (prevSectionLoading.current && !sectionLoading) {
      setRefinedSections(prev => ({ ...prev, [prevSectionLoading.current!]: true }));
    }
    prevSectionLoading.current = sectionLoading || null;
  }, [sectionLoading]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  const youtubeTvData = [
    { month: 'Nov', customer_yt: 28, peerset_yt: 40, customer_tv: 50, peerset_tv: 45 },
    { month: 'Dec', customer_yt: 30, peerset_yt: 42, customer_tv: 48, peerset_tv: 42 },
    { month: 'Jan', customer_yt: 32, peerset_yt: 43, customer_tv: 45, peerset_tv: 40 },
    { month: 'Feb', customer_yt: 33, peerset_yt: 44, customer_tv: 42, peerset_tv: 38 },
    { month: 'Mar', customer_yt: 34, peerset_yt: 44, customer_tv: 40, peerset_tv: 35 },
  ];

  const searchIsData = [
    { week: 'W1', search_is: 42, peer_is: 58, lost_is_budget: 15, lost_is_rank: 43 },
    { week: 'W2', search_is: 43, peer_is: 59, lost_is_budget: 14, lost_is_rank: 43 },
    { week: 'W3', search_is: 44, peer_is: 60, lost_is_budget: 16, lost_is_rank: 40 },
    { week: 'W4', search_is: 45, peer_is: 60, lost_is_budget: 15, lost_is_rank: 40 },
  ];

  const internalSummaryData = [
    { name: 'Jan 1', revenue: 7.8, outlook: 0, target: 8.5, lastYear: 9.1 },
    { name: 'W2', revenue: 7.6, outlook: 0, target: 8.0, lastYear: 8.9 },
    { name: 'W3', revenue: 0, outlook: 7.0, target: 7.5, lastYear: 8.1 },
    { name: 'W4', revenue: 0, outlook: 7.6, target: 8.3, lastYear: 6.0 },
    { name: 'W5', revenue: 0, outlook: 7.0, target: 7.5, lastYear: 7.3 },
    { name: 'W6', revenue: 0, outlook: 8.0, target: 7.7, lastYear: 6.2 },
    { name: 'W7', revenue: 0, outlook: 7.8, target: 8.7, lastYear: 8.4 },
    { name: 'Mar 30', revenue: 0, outlook: 7.0, target: 7.6, lastYear: 6.1 }
  ];


  return (
    <div className="fixed right-0 left-[420px] top-0 bottom-0 z-[60] bg-white flex flex-col border-l border-[#E8EAED] shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out">
      <style>{`
        @keyframes callout-rotate {
          0% {
            transform: rotate(135deg);
          }
          100% {
            transform: rotate(565deg);
          }
        }
        @keyframes callout-fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .callout-shimmer {
          animation: callout-rotate 8s cubic-bezier(0.20, 0.00, 0.00, 1.00), callout-fadeOut 1s cubic-bezier(0.40, 0.00, 0.20, 1.00) 4s;
          animation-fill-mode: forwards;
        }
        @keyframes shimmer {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
        .shimmer-bg {
          background: linear-gradient(86.04deg, 
            #217BFE 0%, 
            #078EFB 6.25%, 
            #A190FF 12.5%, 
            #AF95FF 18.75%, 
            #FFFFFF 25%, 
            #AF95FF 31.25%, 
            #A190FF 37.5%, 
            #078EFB 43.75%, 
            #217BFE 50%, 
            #078EFB 56.25%, 
            #A190FF 62.5%, 
            #AF95FF 68.75%, 
            #FFFFFF 75%, 
            #AF95FF 81.25%, 
            #A190FF 87.5%, 
            #078EFB 93.75%, 
            #217BFE 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          opacity: 0.1;
          border-radius: 16px;
        }
        .citation-highlight {
          transition: all 0.2s ease-in-out;
          border-bottom: 2px solid transparent;
          border-radius: 2px;
        }
        .citation-highlight.active {
          background-color: rgba(26, 115, 232, 0.08);
          border-bottom-color: rgba(26, 115, 232, 0.4);
          padding-left: 2px;
          padding-right: 2px;
        }
      `}</style>
      <div className="flex flex-col items-start p-0 isolate w-[calc(100%-48px)] max-w-[1680px] mx-auto shrink-0 bg-[linear-gradient(266.54deg,#E7F2FF_0%,#F7ECFE_100%)] border-b border-l border-r border-[#DADCE0] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.04)] rounded-b-[20px] relative z-10">
        {/* [Primary row] */}
        <div className="box-border flex flex-col items-start p-[8px_8px_16px_24px] w-full h-[88px] border-b border-[#DADCE0] z-[2]">
          {/* [row] */}
          <div className="flex flex-row items-center pt-[8px] gap-[24px] w-full h-[48px]">
            <div className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#000000] flex-1 truncate">
              {companyName} Diagnosis canvas
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
          {/* Frame 2134538695 */}
          <div className="flex flex-row items-start p-0 gap-[8px] w-full h-[16px]">
            <div className="flex flex-row items-center p-0 h-[16px]">
              <div className="font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase bg-[linear-gradient(86.54deg,#00BBDF_0%,#3271EA_50.48%,#C597FF_100%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap">
                Canvas mode
              </div>
            </div>
            <div className="font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase text-[#919191] whitespace-nowrap">
              v1.001.a
            </div>
          </div>
        </div>
        
        {/* [Secondary row] */}
        <div className="flex flex-row items-center p-[6px_24px] gap-[8px] w-full h-[44px] z-[1]">
          <div className="font-['Roboto'] font-medium text-[11px] leading-[16px] flex items-center tracking-[0.8px] uppercase text-[#919191] whitespace-nowrap">
            Scope
          </div>
          <div className="relative" ref={datePickerRef}>
            <button 
              className="box-border flex flex-row items-center p-0 h-[32px] bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            >
              <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                <i className="google-symbols text-[18px] leading-none text-[#3C4043] flex items-center text-center">calendar_today</i>
                <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043] whitespace-nowrap">
                  {selectedDateRange}
                </div>
                <i className="google-symbols text-[18px] leading-none text-[#3C4043] flex items-center text-center">arrow_drop_down</i>
              </div>
            </button>
            {isDatePickerOpen && (
              <div className="absolute top-full left-0 mt-1 w-[180px] bg-white border border-[#DADCE0] rounded-[8px] shadow-lg z-[100] py-1">
                {['QTD (Jan 1 - today)', 'Last 7 days', 'Last 30 days', 'Custom dates...'].map((option) => (
                  <button
                    key={option}
                    className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#3C4043] hover:bg-[#F8F9FA] border-none bg-transparent cursor-pointer"
                    onClick={() => {
                      const newRange = option === 'QTD (Jan 1 - today)' ? 'Jan 1 - today' : option;
                      setIsDatePickerOpen(false);
                      onDateRangeChange?.(newRange);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-[#ffffff] flex flex-col items-center">
        <div className="w-full max-w-[1680px] flex flex-col gap-6">
        
        {/* Card 1: Q1 2026 Performance */}
        <div id="q1-2026-performance-section" {...getSectionStyle('q1-2026-performance')}>
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'q1-2026-performance' ? 'opacity-30' : ''}`}>

              {/* [Header] */}
              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                {/* [Primary section] */}
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] flex-1 h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#202124]">bar_chart</i>
                  <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#202124]">
                    Q1 2026 Performance
                  </div>
                </div>
                {/* [Header actions] */}
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5F6368]">more_vert</i>
                  </button>
                </div>
              </div>

          {/* [Content] */}
          <div className="block p-[16px_24px] w-full overflow-auto">
            {/* Priority actions widget (floated right) */}
            <div className="float-right box-border flex flex-col items-start p-[24px] gap-[16px] w-[380px] min-w-[380px] bg-[#FFFFFF] rounded-[8px] shadow-sm border border-[#E8EAED] ml-6 mb-6">
              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C] w-full">
                Priority actions
              </div>
              
              {/* Action 1 */}
              <div 
                className="flex flex-row items-start p-2 -m-2 gap-[8px] w-full cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => document.getElementById('critical-actions-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex flex-col justify-center items-center p-[8px] gap-[8px] w-[36px] h-[36px] bg-[#B3251E]/[0.08] rounded-[4px]">
                  <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-center text-[#B3251E]">
                    2
                  </div>
                </div>
                <div className="flex flex-col items-start p-0 flex-1">
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#202124]">
                    Potential blockers
                  </div>
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] flex items-center tracking-[0.3px] text-[#3C4043]">
                    The following issues require your attention
                  </div>
                </div>
              </div>

              {/* Action 2 */}
              <div 
                className="flex flex-row items-start p-2 -m-2 gap-[8px] w-full cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => document.getElementById('growth-opportunities-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex flex-col justify-center items-center p-[8px] gap-[8px] w-[36px] h-[36px] bg-[#006C35]/[0.08] rounded-[4px]">
                  <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-center text-[#006C35]">
                    3
                  </div>
                </div>
                <div className="flex flex-col items-start p-0 flex-1">
                  <div className="font-['Roboto'] font-medium text-[14px] leading-[20px] flex items-center tracking-[0.2px] text-[#202124]">
                    Growth opportunities
                  </div>
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] flex items-center tracking-[0.3px] text-[#474747]">
                    $11.2M in agreed pipeline
                  </div>
                </div>
              </div>
            </div>

            {/* Scoreboard 3x */}
            <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[32px] mb-6">
              {/* Scorecard 1 */}
              <div className="flex flex-col items-start p-0 flex-1 min-w-[140px]">
                <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                  QTD Revenue
                </div>
                <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#202124]">
                  $23.7M
                </div>
                <div className="flex flex-row items-center p-[4px_0px_0px] gap-[4px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    60% of target $39.6M
                  </div>
                </div>
              </div>

              {/* Scorecard 2 */}
              <div className="flex flex-col items-start p-0 flex-1 min-w-[140px]">
                <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                  QTD spend w/w
                </div>
                <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#202124]">
                  13.5%
                </div>
                <div className="flex flex-row items-center p-[4px_0px_0px] gap-[4px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    +$92.7k
                  </div>
                  <div className="flex flex-row items-center p-0 gap-[8px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#188038] flex items-center">
                      <i className="google-symbols text-[16px] leading-none">arrow_drop_up</i> 12pt
                    </div>
                  </div>
                </div>
              </div>

              {/* Scorecard 3 */}
              <div className="flex flex-col items-start p-0 flex-1 min-w-[140px]">
                <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                  7d change
                </div>
                <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#202124]">
                  -$27.8K
                </div>
                <div className="flex flex-row items-center p-[4px_0px_0px] gap-[4px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    $106.9M
                  </div>
                  <div className="flex flex-row items-center p-0 gap-[8px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#188038] flex items-center">
                      <i className="google-symbols text-[16px] leading-none">arrow_drop_up</i> 12pt
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive summary */}
            <div className="block pt-2">
              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124] mb-4">
                Executive summary
              </div>
              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                {customSectionContents && customSectionContents['q1-2026-performance'] ? (
                  <div 
                    className="whitespace-pre-wrap mb-4"
                    dangerouslySetInnerHTML={{ __html: customSectionContents['q1-2026-performance'].text }}
                  />
                ) : (
                  <>
                    <p className="mb-4">
                      <span className={`citation-highlight ${hoveredCitationId === 'q1-performance' ? 'active' : ''}`}>
                        {`${companyName}'s performance this quarter is defined by exceptional year-over-year revenue growth of 72.1% and a very strong finance outlook that places the company at 130.7% of its end-of-quarter target. While we have seen a recent week-over-week revenue dip of 14.7% due to certain campaigns reaching their end dates, the overall momentum remains high as we move into the second half of the quarter.`}
                      </span>
                      <CitationBadge 
                        sources={[mockSource2]} 
                        onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'q1-performance' : null)}
                      />
                    </p>
                    <p className="mb-4">
                      <strong>Revenue & Market Performance</strong><br />
                      {`Our current QTD revenue stands at $244.0k, representing 59.6% attainment of our quarterly goal.`}
                    </p>
                    <p className="mb-4">
                      <strong>Search+ Leadership:</strong>{' '}
                      <span className={`citation-highlight ${hoveredCitationId === 'search-leadership' ? 'active' : ''}`}>
                        {`Search remains our primary revenue driver at $188.6k QTD. Performance Max is particularly dominant, making up 57% of our spend over the last 30 days.`}
                      </span>
                      <CitationBadge 
                        sources={[mockSource2]} 
                        onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'search-leadership' : null)}
                      />
                    </p>
                    <p className="mb-4">
                      <strong>YouTube Expansion:</strong>{' '}
                      <span className={`citation-highlight ${hoveredCitationId === 'youtube-expansion' ? 'active' : ''}`}>
                        {`We are seeing explosive growth in YouTube+, with $55.4k QTD revenue. Recent high-intent campaigns for "Boots Season" have driven brand-related searches 80% higher than any year in the last five.`}
                      </span>
                      <CitationBadge 
                        sources={[mockSource3, mockSource5]} 
                        onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'youtube-expansion' : null)}
                      />
                    </p>
                    <p className="mb-4">
                      <strong>Regional Dynamics:</strong>
                    </p>
                    <ul className="m-0 pl-5 flex flex-col gap-1 mb-4">
                      <li>
                        <strong>Australia:</strong> Remains our largest market by spend ($139.1k QTD), though recent search growth for the brand (+23% YoY) indicates we are hitting saturation and need to focus on domestic market share.
                      </li>
                      <li>
                        <strong>USA:</strong> Rapidly scaling with an $18M annual target, currently at $85.5k QTD.
                      </li>
                      <li>
                        <strong>New Zealand:</strong>{' '}
                        <span className={`citation-highlight ${hoveredCitationId === 'new-zealand' ? 'active' : ''}`}>
                          {`Economic headwinds continue to make this a "constant battle," with spend currently at $19.4k QTD.`}
                        </span>
                        <CitationBadge 
                          sources={[mockSource2, mockSource5]} 
                          onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'new-zealand' : null)}
                        />
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* [Footer actions] */}
          <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full">
            {/* [Prompts] */}
            <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Analyze key metrics')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Analyze key metrics
                  </div>
                </div>
              </div>
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.(`Generate email to ${companyName}`)}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Generate email to {companyName}
                  </div>
                </div>
              </div>
            </div>

            {/* [Actions] */}
            <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
              {focusedSection?.id === 'q1-2026-performance' ? (
                <button 
                  className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                  onClick={() => onRefineClick?.('', '')}
                >
                  Cancel refining
                </button>
              ) : (
                <>
                  <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Sources
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_drop_down</i>
                      </div>
                    </div>
                  </button>
                  <button 
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                    onClick={() => onRefineClick?.('q1-2026-performance', 'Q1 2026 Performance')}
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">pen_spark_io25</i>
                      </div>
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Refine
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
          {sectionLoading === 'q1-2026-performance' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Card 2: Critical actions */}
        <div id="critical-actions-section" {...getSectionStyle('critical-actions', 'bg-[rgba(78,143,248,0.08)]')}>
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'critical-actions' ? 'opacity-30' : ''}`}>

              {/* [Header] */}
              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                {/* [Primary section] */}
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] flex-1 h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#202124]">crisis_alert</i>
                  <div className="flex flex-col items-start">
                    <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#202124]">
                      Potential blockers
                    </div>
                    <div className="font-['Roboto'] font-normal text-[14px] leading-[20px] text-[#5F6368]">
                      The following issues require your attention
                    </div>
                  </div>
                </div>
                {/* [Header actions] */}
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5F6368]">more_vert</i>
                  </button>
                </div>
              </div>

          {/* [Content] */}
          <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full h-auto">
            {/* Action 1 */}
            <div className="box-border flex flex-col items-start p-[24px] gap-[24px] w-full min-w-[380px] bg-[#FFFFFF] rounded-[12px]">
              {/* Section title module */}
              <div className="flex flex-row items-center p-0 gap-[8px] w-full min-h-[36px] h-auto">
                <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C]">
                  Ads policy violation for
                </div>
                <div className="flex flex-row items-center p-0 gap-[16px] flex-1 h-[24px]">
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[24px]">
                    <div className="flex flex-row items-center p-0 gap-[8px] h-[24px]">
                      <div className="relative w-[24px] h-[24px] flex items-center justify-center">
                        <div className="flex items-center justify-center w-[24px] h-[16px] bg-[#5F6368] rounded-[1px]">
                          <span className="text-white text-[10px] font-bold leading-none">GA</span>
                        </div>
                      </div>
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        1587456845
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[24px] flex-1">
                    <div className="flex flex-row items-center p-[4px_8px] gap-[2px] h-[24px] bg-[#F1F3F4] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">
                        Search
                      </div>
                    </div>
                    <div className="flex flex-row items-center p-[4px_8px] gap-[2px] h-[24px] bg-[#F1F3F4] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">
                        PMax+
                      </div>
                    </div>
                    <div className="box-border flex flex-row items-center p-[4px_8px] gap-[2px] h-[24px] bg-[#FFFFFF] border border-[#70757A] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">
                        EMEA
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame 2134538680 */}
              <div className="flex flex-row items-start p-0 gap-[24px] w-full">
                {/* Scorecard */}
                <div className="flex flex-col items-start p-[16px] w-[140px] bg-[#FFF8F8] rounded-[12px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    Spend change w/w
                  </div>
                  <div className="flex flex-row items-end p-[4px_0px_0px] gap-[4px]">
                    <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#C5221F]">
                      -56%
                    </div>
                  </div>
                  <div className="flex flex-row items-center p-[4px_0px_0px] gap-[4px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#C5221F]">
                      23% of target
                    </div>
                  </div>
                </div>

                {/* Simple content widget 1 */}
                <div className="flex flex-col items-start p-0 gap-[12px] flex-1">
                  <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                    Diagnosed root cause
                  </div>
                  <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                    {customSectionContents && customSectionContents['critical-actions'] ? (
                      <div className="whitespace-pre-wrap">{customSectionContents['critical-actions'].text}</div>
                    ) : refinedSections['critical-actions'] ? (
                      <>
                        {`3 top-performing campaigns stalled. Vertical video assets disapproved due to a policy violation.`}
                        <CitationBadge sources={[mockSource2]} />
                        {` The specific violation relates to unverified claims in the video content. A revised video asset has been submitted for review.`}
                      </>
                    ) : (
                      <>
                        {`3 top-performing campaigns stalled. Vertical video assets disapproved due to a policy violation.`}
                        <CitationBadge sources={[mockSource2]} />
                      </>
                    )}
                  </div>
                  <div className="flex flex-row items-center p-[4px_0px_0px] gap-[8px]">
                    <div className="flex flex-row items-center p-[4px_8px] gap-[2px] bg-[#FCE8E6] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#C5221F]">
                        Revenue impact: -$1.5 QTD pacing
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simple content widget 2 */}
                <div className="flex flex-col items-start p-0 gap-[12px] flex-1">
                  <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                    Recommendation
                  </div>
                  <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                    Escalate to support. File a support case and ask support to clearly identify why the ad is in breach and which specific creative is being flagged.
                  </div>
                  <div className="flex flex-row items-center p-[4px_0px_0px] gap-[8px]">
                    <div className="flex flex-row items-center p-[4px_8px] gap-[2px] bg-[#E6F4EA] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#137333]">
                        Potential impact: $1.5k w/w revenue
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame 2134538679 */}
              <div className="flex flex-row justify-between items-center p-0 w-full mt-2 pt-4 border-t border-[#E8EAED]">
                <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
                  Last updated: Sat, Mar 10, 2026
                </div>
                <button 
                  onClick={() => onPromptClick?.(`Draft a follow-up email to ${companyName} regarding account 1587456845. Context: Spend change is -24% w/w, root cause is Ads Policy Violation due to custom conversion mismatches in GA4 Search/PMax campaigns in the EMEA region.`)}
                  className="flex flex-row justify-center items-center p-[8px_16px] gap-[8px] bg-transparent rounded-[4px] border-none cursor-pointer hover:bg-black/5"
                >
                  <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#1A73E8]">
                    Draft follow up email
                  </div>
                  <i className="google-symbols text-[20px] leading-none text-[#1A73E8]">arrow_forward</i>
                </button>
              </div>
            </div>

            {/* Action 2 */}
            <div className="box-border flex flex-col items-start p-[24px] gap-[24px] w-full min-w-[380px] bg-[#FFFFFF] rounded-[12px]">
              {/* Section title module */}
              <div className="flex flex-row items-center p-0 gap-[8px] w-full min-h-[36px] h-auto">
                <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C]">
                  Ads policy violation for
                </div>
                <div className="flex flex-row items-center p-0 gap-[16px] flex-1 h-[24px]">
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[24px]">
                    <div className="flex flex-row items-center p-0 gap-[8px] h-[24px]">
                      <div className="relative w-[24px] h-[24px] flex items-center justify-center">
                        <div className="flex items-center justify-center w-[24px] h-[16px] bg-[#5F6368] rounded-[1px]">
                          <span className="text-white text-[10px] font-bold leading-none">GA</span>
                        </div>
                      </div>
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        1587456845
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[24px] flex-1">
                    <div className="flex flex-row items-center p-[4px_8px] gap-[2px] h-[24px] bg-[#F1F3F4] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">
                        Search
                      </div>
                    </div>
                    <div className="flex flex-row items-center p-[4px_8px] gap-[2px] h-[24px] bg-[#F1F3F4] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">
                        PMax+
                      </div>
                    </div>
                    <div className="box-border flex flex-row items-center p-[4px_8px] gap-[2px] h-[24px] bg-[#FFFFFF] border border-[#70757A] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#3C4043]">
                        EMEA
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame 2134538680 */}
              <div className="flex flex-row items-start p-0 gap-[24px] w-full">
                {/* Scorecard */}
                <div className="flex flex-col items-start p-[16px] w-[140px] bg-[#FFF8F8] rounded-[12px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    Spend change w/w
                  </div>
                  <div className="flex flex-row items-end p-[4px_0px_0px] gap-[4px]">
                    <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#C5221F]">
                      -24%
                    </div>
                  </div>
                </div>

                {/* Simple content widget 1 */}
                <div className="flex flex-col items-start p-0 gap-[12px] flex-1">
                  <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                    Diagnosed root cause
                  </div>
                  <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                    {companyName} targeting spend dropped below expected spend level. 1 campaign performed worse due to spending drop.
                  </div>
                  <div className="flex flex-row items-center p-[4px_0px_0px] gap-[8px]">
                    <div className="flex flex-row items-center p-[4px_8px] gap-[2px] bg-[#FCE8E6] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#C5221F]">
                        Revenue impact: -$5.6 QTD pacing
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simple content widget 2 */}
                <div className="flex flex-col items-start p-0 gap-[12px] flex-1">
                  <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                    Recommendation
                  </div>
                  <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                    Adjust your ROAS targets. Get more conversion value by adjusting your ROAS targets. Draft an email to {companyName} for account 6963738282.
                  </div>
                  <div className="flex flex-row items-center p-[4px_0px_0px] gap-[8px]">
                    <div className="flex flex-row items-center p-[4px_8px] gap-[2px] bg-[#E6F4EA] rounded-[4px]">
                      <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#137333]">
                        Potential impact: +11.9% optimization score
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame 2134538679 */}
              <div className="flex flex-row justify-between items-center p-0 w-full mt-2 pt-4 border-t border-[#E8EAED]">
                <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
                  Last updated: Sat, Mar 10, 2026
                </div>
                <button 
                  onClick={() => onPromptClick?.(`Draft a follow-up email to ${companyName} regarding account 6963738282. Context: recommendation is to adjust ROAS targets to capture more conversion value and gain an estimated +11.9% optimization score lift.`)}
                  className="flex flex-row justify-center items-center p-[8px_16px] gap-[8px] bg-transparent rounded-[4px] border-none cursor-pointer hover:bg-black/5"
                >
                  <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#1A73E8]">
                    Draft follow up email
                  </div>
                  <i className="google-symbols text-[20px] leading-none text-[#1A73E8]">arrow_forward</i>
                </button>
              </div>
            </div>
          </div>

          {/* [Footer actions] */}
          <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full">
            {/* [Prompts] */}
            <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Step by step instructions for YouTube ads policy appeal')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Step by step instructions for YouTube ads policy appeal
                  </div>
                </div>
              </div>
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Understand targeting spend drop reasons')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Understand targeting spend drop reasons
                  </div>
                </div>
              </div>
            </div>

            {/* [Actions] */}
            <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
              {focusedSection?.id === 'critical-actions' ? (
                <button 
                  className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                  onClick={() => onRefineClick?.('', '')}
                >
                  Cancel refining
                </button>
              ) : (
                <>
                  <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Sources
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_drop_down</i>
                      </div>
                    </div>
                  </button>
                  <button 
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                    onClick={() => onRefineClick?.('critical-actions', 'Critical actions')}
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">pen_spark_io25</i>
                      </div>
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Refine
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
          {sectionLoading === 'critical-actions' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Card 3: Growth opportunities */}
        <div id="growth-opportunities-section" {...getSectionStyle('growth-opportunities')}>
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'growth-opportunities' ? 'opacity-30' : ''}`}>

              {/* [Header] */}
              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                {/* [Primary section] */}
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] flex-1 h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#202124]">bar_chart</i>
                  <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#202124]">
                    Growth opportunities
                  </div>
                  <i className="google-symbols text-[16px] leading-[50px] flex items-center text-center text-[#5F6368]">help</i>
                  <div className="flex flex-col items-end p-[0px_4px] gap-[2px] w-[27px] h-[16px] bg-[#E8F0FE] rounded-[2px]">
                    <div className="font-['Roboto'] font-medium text-[8px] leading-[16px] flex items-center tracking-[0.64px] uppercase text-[#1A73E8]">
                      NEW
                    </div>
                  </div>
                </div>
                {/* [Header actions] */}
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5F6368]">more_vert</i>
                  </button>
                </div>
              </div>

          {/* [Content] */}
          <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
            {/* Simple content widget */}
            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                {customSectionContents && customSectionContents['growth-opportunities'] ? (
                  <div 
                    className="whitespace-pre-wrap" 
                    dangerouslySetInnerHTML={{ __html: customSectionContents['growth-opportunities'].text }}
                  />
                ) : refinedSections['growth-opportunities'] ? (
                  <>
                    To drive growth for {companyName} (228199), the strategy should focus on reclaiming market share in under-indexed discovery surfaces, capitalizing on category-specific headroom, and navigating the strategic transition from Lorem ispum direct to {companyName}.com
                    <CitationBadge sources={[mockSource3]} />
                    <br /><br />
                    Reclaiming the "Discovery" Share of Wallet
                    <br /><br />
                    There is a stark contrast between Ferguson's investment in discovery surfaces and that of its competitors.
                    <CitationBadge sources={[mockSource1]} />
                    <br />
                    • The Gap: Ferguson's Share of Wallet for Demand Gen + VAC is currently 1.0%, while industry competitors average 35.1%.
                    <CitationBadge sources={[mockSource2]} />
                    <br />
                    • The Opportunity: In February 2026 alone, Ferguson spent $673.6k on external Social platforms, while Google Demand Gen spend was minimal.
                    <CitationBadge sources={[mockSource4]} />
                    <br />
                    • Video Headroom: Ferguson is lagging behind peers (including Wayfair, Lamps Plus, and Ace Hardware) with $477.2k in Video Spend headroom, representing a missed opportunity of approximately 55M monthly impressions.
                    <CitationBadge sources={[mockSource3, mockSource5]} />
                    <br /><br />
                    <strong>Refined Strategy:</strong> Focus on shifting 15% of external social budget to Google Demand Gen to capture high-intent users earlier in their journey.
                    <CitationBadge sources={[mockSource1, mockSource3, mockSource6]} />
                  </>
                ) : (
                  <>
                    To drive growth for {companyName} (228199), the strategy should focus on reclaiming market share in under-indexed discovery surfaces, capitalizing on category-specific headroom, and navigating the strategic transition from Lorem ispum direct to {companyName}.com
                    <CitationBadge sources={[mockSource3]} />
                    <br /><br />
                    Reclaiming the "Discovery" Share of Wallet
                    <br /><br />
                    There is a stark contrast between Ferguson's investment in discovery surfaces and that of its competitors.
                    <CitationBadge sources={[mockSource1]} />
                    <br />
                    • The Gap: Ferguson's Share of Wallet for Demand Gen + VAC is currently 1.0%, while industry competitors average 35.1%.
                    <CitationBadge sources={[mockSource2]} />
                    <br />
                    • The Opportunity: In February 2026 alone, Ferguson spent $673.6k on external Social platforms, while Google Demand Gen spend was minimal.
                    <CitationBadge sources={[mockSource4]} />
                    <br />
                    • Video Headroom: Ferguson is lagging behind peers (including Wayfair, Lamps Plus, and Ace Hardware) with $477.2k in Video Spend headroom, representing a missed opportunity of approximately 55M monthly impressions.
                    <CitationBadge sources={[mockSource3, mockSource5]} />
                  </>
                )}
              </div>
              <div className="flex flex-row flex-wrap items-start content-start p-[8px_0px] gap-[4px_8px] w-full">
                <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                  <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                    <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                      Explore growth planner
                    </div>
                    <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                      <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_forward</i>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Expansion panel set */}
            <div className="flex flex-col items-start p-0 gap-[4px] w-full">
              {/* First panel */}
              <div className="flex flex-col items-start p-[0px_0px_8px] w-full bg-[#FFFFFF] rounded-[8px_8px_4px_4px]">
                <div 
                  className="flex flex-row items-center p-[8px_0px] gap-[24px] w-full h-[64px] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]"
                  onClick={() => toggleSection('youtube-tv')}
                >
                  <div className="flex flex-row items-center p-[0px_0px_0px_24px] w-[518px] h-[32px]">
                    <div className="flex flex-col justify-center items-start p-0 w-[494px] h-[32px]">
                      <div className="flex flex-row items-center p-0 gap-[8px] w-[494px] h-[32px]">
                        <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C] w-[167px] h-[32px]">
                          YouTube vs. TV
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[8px] w-[319px] h-[24px]">
                          <div className="box-border flex flex-row items-center p-[4px] gap-[2px] w-[42px] h-[24px] bg-[#FFFFFF] border border-[#303030] rounded-[4px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] flex items-center tracking-[0.1px] text-[#303030] w-[34px] h-[16px]">
                              AMER
                            </div>
                          </div>
                          <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-[6px] h-[24px]">
                            (
                          </div>
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[110px] h-[24px]">
                            <div className="relative w-[24px] h-[24px] flex items-center justify-center">
                        <div className="flex items-center justify-center w-[24px] h-[16px] bg-[#5F6368] rounded-[1px]">
                          <span className="text-white text-[10px] font-bold leading-none">GA</span>
                        </div>
                      </div>
                            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA] w-[78px] h-[20px]">
                              1587456845
                            </div>
                          </div>
                          <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-[5px] h-[24px]">
                            ,
                          </div>
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[110px] h-[24px]">
                            <div className="relative w-[24px] h-[24px] flex items-center justify-center">
                        <div className="flex items-center justify-center w-[24px] h-[16px] bg-[#5F6368] rounded-[1px]">
                          <span className="text-white text-[10px] font-bold leading-none">GA</span>
                        </div>
                      </div>
                            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA] w-[78px] h-[20px]">
                              1587456845
                            </div>
                          </div>
                          <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-[6px] h-[24px]">
                            )
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[390px] h-[0px] flex-1" />
                  <div className="flex flex-row justify-end items-center p-[0px_24px_0px_0px] gap-[32px] w-auto h-[44px]">
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          QTD spend
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $12.3M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          Target
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $10.1M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[120px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          7d change
                        </div>
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $3.4k
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[2px]">
                          <i className="google-symbols text-[16px] text-[#188038]">arrow_upward</i>
                          <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#188038]">
                            12%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full">
                      <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">{expandedSections['youtube-tv'] ? 'expand_less' : 'expand_more'}</i>
                    </div>
                  </div>
                </div>

                {expandedSections['youtube-tv'] && (
                  <div className="flex flex-col items-start p-0 w-full">
                    <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                      <div className="flex flex-col items-start p-0 gap-[16px] w-full rounded-[12px]">
                        <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[16px] w-full">
                          <div className="flex flex-col justify-center items-center p-0 gap-[8px] flex-1 min-w-[380px] h-[364px] min-w-0 min-h-0">
                            <div className="flex flex-col justify-between items-start p-0 gap-[8px] w-full h-[340px] relative isolate min-w-0 min-h-0">
                              <ResponsiveContainer width="99%" height="100%">
                                <ComposedChart data={youtubeTvData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} tickFormatter={(value) => `${value}%`} dx={-10} />
                                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                  <Bar dataKey="customer_yt" name="Customer YouTube" fill="#1A73E8" radius={[2, 2, 0, 0]} barSize={20} />
                                  <Line type="monotone" dataKey="peerset_yt" name="Peerset YouTube" stroke="#EA4335" strokeWidth={2} dot={{ r: 4 }} />
                                </ComposedChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="flex flex-col items-start p-0 gap-[16px] flex-1 min-w-[380px]">
                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Explanation
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                Customer spends ~34% of their budget on YouTube, ~10pp lower than the peerset, which spends ~44% of their budget on YouTube
                                <CitationBadge sources={[mockSource3, mockSource4]} />
                              </div>
                              <div className="flex flex-row items-center p-[8px_0px] gap-[8px] w-full h-[40px]">
                                <div className="flex flex-row items-center p-[4px] gap-[2px] h-[24px] bg-[#FCE8E6] rounded-[2px]">
                                  <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#C5221F]">
                                    SOW -10pp lower than the preset in May
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Recommendation
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                Shift budget by ~$500k/mo from TV to YouTube to:
                                <br />
                                • Increase reach by 10pp (+20%) to 65.7%
                                <br />
                                • Lower CPM by $3.77 (-45%) to $5.03
                                <br />
                                • Increase avg. frequency by 1.42 (+32%) to 5.83
                                <CitationBadge sources={[mockSource1, mockSource3]} />
                              </div>
                              <div className="flex flex-row items-center p-[8px_0px] gap-[8px] w-full h-[40px]">
                                <div className="flex flex-row items-center p-[4px] gap-[2px] h-[24px] bg-[#E6F4EA] rounded-[2px]">
                                  <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#137333]">
                                    Increase reach by 10pp, sift budget by ~$500k/mo
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row justify-between items-center p-0 w-full mt-2 pt-4 border-t border-[#E8EAED]">
                                <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
                                  Last updated: Fri Mar 9, 2026
                                </div>
                                <button className="flex flex-row justify-center items-center p-[8px_16px] gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                                  <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                                    View peer group
                                  </div>
                                  <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                                    <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_forward</i>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Second panel */}
              <div className="flex flex-col items-start p-0 gap-[8px] w-full bg-[#FFFFFF] rounded-[4px]">
                <div 
                  className="flex flex-row items-center p-[8px_0px] gap-[24px] w-full h-[64px] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]"
                  onClick={() => toggleSection('growth-search')}
                >
                  <div className="flex flex-row items-center p-[0px_0px_0px_24px] w-[269px] h-[32px]">
                    <div className="flex flex-col justify-center items-start p-0 w-[245px] h-[32px]">
                      <div className="flex flex-row items-center p-0 gap-[8px] w-[245px] h-[32px]">
                        <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C] w-[77px] h-[32px]">
                          Search
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[8px] w-[160px] h-[24px]">
                          <div className="box-border flex flex-row items-center p-[4px] gap-[2px] w-[42px] h-[24px] bg-[#FFFFFF] border border-[#303030] rounded-[4px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] flex items-center tracking-[0.1px] text-[#303030] w-[34px] h-[16px]">
                              AMER
                            </div>
                          </div>
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[110px] h-[24px]">
                            <div className="relative w-[24px] h-[24px] flex items-center justify-center">
                        <div className="flex items-center justify-center w-[24px] h-[16px] bg-[#5F6368] rounded-[1px]">
                          <span className="text-white text-[10px] font-bold leading-none">GA</span>
                        </div>
                      </div>
                            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA] w-[78px] h-[20px]">
                              1587456845
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[639px] h-[0px] flex-1" />
                  <div className="flex flex-row justify-end items-center p-[0px_24px_0px_0px] gap-[32px] w-auto h-[44px]">
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          QTD spend
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $4.1M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          Target
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $8.2M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[120px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          7d change
                        </div>
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $2.1k
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[2px]">
                          <i className="google-symbols text-[16px] text-[#188038]">arrow_upward</i>
                          <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#188038]">
                            8%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full">
                      <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">{expandedSections['growth-search'] ? 'expand_less' : 'expand_more'}</i>
                    </div>
                  </div>
                </div>

                {expandedSections['growth-search'] && (
                  <div className="flex flex-col items-start p-0 w-full">
                    <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                      <div className="flex flex-col items-start p-0 gap-[16px] w-full rounded-[12px]">
                        <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[16px] w-full">
                          <div className="flex flex-col justify-center items-center p-0 gap-[8px] flex-1 min-w-[380px] h-[364px] min-w-0 min-h-0">
                            <div className="flex flex-col justify-between items-start p-0 gap-[8px] w-full h-[340px] relative isolate min-w-0 min-h-0">
                              <ResponsiveContainer width="99%" height="100%">
                                <AreaChart data={searchIsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} tickFormatter={(value) => `${value}%`} dx={-10} />
                                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                  <Area type="monotone" dataKey="peer_is" name="Peer Avg IS" stroke="#34A853" fill="#34A853" fillOpacity={0.1} strokeWidth={2} />
                                  <Area type="monotone" dataKey="search_is" name="Search IS" stroke="#1A73E8" fill="#1A73E8" fillOpacity={0.3} strokeWidth={2} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex flex-row items-center p-0 gap-[16px] h-[16px]">
                            </div>
                          </div>

                          <div className="flex flex-col items-start p-0 gap-[16px] flex-1 min-w-[380px]">
                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Explanation
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                Customer's Search impression share is 45%, which is 15pp lower than the top competitors in the AMER region.
                                <CitationBadge sources={[mockSource4]} />
                              </div>
                              <div className="flex flex-row items-center p-[8px_0px] gap-[8px] w-full h-[40px]">
                                <div className="flex flex-row items-center p-[4px] gap-[2px] h-[24px] bg-[#FCE8E6] rounded-[2px]">
                                  <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#C5221F]">
                                    IS -15pp lower than peers
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Recommendation
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                Increase Search budget by ~$200k/mo to capture lost impression share and drive incremental conversions.
                                <br />
                                • Increase IS by 15pp to match peers
                                <br />
                                • Drive estimated 1,200 incremental conversions
                                <br />
                                • Maintain target CPA of $45
                                <CitationBadge sources={[mockSource1, mockSource4]} />
                              </div>
                              <div className="flex flex-row items-center p-[8px_0px] gap-[8px] w-full h-[40px]">
                                <div className="flex flex-row items-center p-[4px] gap-[2px] h-[24px] bg-[#E6F4EA] rounded-[2px]">
                                  <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#137333]">
                                    Increase budget by ~$200k/mo
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap items-start content-start p-[8px_0px] gap-[4px_8px] w-full">
                                <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                                  <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                                    <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                                      View recommendations
                                    </div>
                                    <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                                      <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_forward</i>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Third panel */}
              <div className="flex flex-col items-start p-0 gap-[8px] w-full bg-[#FFFFFF] rounded-[4px_4px_8px_8px]">
                <div 
                  className="flex flex-row items-center p-[8px_0px] gap-[24px] w-full h-[64px] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]"
                  onClick={() => toggleSection('growth-dva')}
                >
                  <div className="flex flex-row items-center p-[0px_0px_0px_24px] w-[241px] h-[32px]">
                    <div className="flex flex-col justify-center items-start p-0 w-[217px] h-[32px]">
                      <div className="flex flex-row items-center p-0 gap-[8px] w-[217px] h-[32px]">
                        <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C] w-[48px] h-[32px]">
                          DVA
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[8px] w-[161px] h-[24px]">
                          <div className="box-border flex flex-row items-center p-[4px] gap-[2px] w-[42px] h-[24px] bg-[#FFFFFF] border border-[#303030] rounded-[4px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] flex items-center tracking-[0.1px] text-[#303030] w-[34px] h-[16px]">
                              AMER
                            </div>
                          </div>
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[111px] h-[24px]">
                            <div className="relative w-[24px] h-[24px] flex items-center justify-center">
                        <div className="flex items-center justify-center w-[24px] h-[16px] bg-[#5F6368] rounded-[1px]">
                          <span className="text-white text-[10px] font-bold leading-none">GA</span>
                        </div>
                      </div>
                            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA] w-[79px] h-[20px]">
                              1587456850
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[667px] h-[0px] flex-1" />
                  <div className="flex flex-row justify-end items-center p-[0px_24px_0px_0px] gap-[32px] w-auto h-[44px]">
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          QTD spend
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $5.4M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          Target
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $6.5M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[120px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          7d change
                        </div>
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $0.3k
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[2px]">
                          <i className="google-symbols text-[16px] text-[#D93025]">arrow_downward</i>
                          <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#D93025]">
                            2%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full">
                      <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">{expandedSections['growth-dva'] ? 'expand_less' : 'expand_more'}</i>
                    </div>
                  </div>
                </div>

                {expandedSections['growth-dva'] && (
                  <div className="flex flex-col items-start p-0 w-full">
                    <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                      <div className="flex flex-col items-start p-0 gap-[16px] w-full rounded-[12px]">
                        <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[16px] w-full">
                          <div className="flex flex-col justify-center items-center p-0 gap-[8px] flex-1 min-w-[380px] h-[364px] min-w-0 min-h-0">
                            <div className="flex flex-col justify-between items-start p-0 gap-[8px] w-full h-[340px] relative isolate min-w-0 min-h-0">
                              <ResponsiveContainer width="99%" height="100%">
                                <LineChart data={internalSummaryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} tickFormatter={(value) => `${value}%`} dx={-10} />
                                  <Line type="monotone" dataKey="search" stroke="#1A73E8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                  <Line type="monotone" dataKey="projected" stroke="#BDC1C6" strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex flex-row items-center p-0 gap-[16px] h-[16px]">
                              <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                                <div className="w-[8px] h-0 border-[3px] border-solid border-[#1A73E8]" />
                                <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] flex items-center text-center tracking-[0.3px] text-[#3C4043]">
                                  DVA SOW
                                </div>
                              </div>
                              <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                                <div className="w-[8px] h-0 border-[3px] border-solid border-[#BDC1C6]" />
                                <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] flex items-center text-center tracking-[0.3px] text-[#3C4043]">
                                  Peer Avg SOW
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-start p-0 gap-[16px] flex-1 min-w-[380px]">
                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Explanation
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                Customer's DVA adoption is currently at 12%, trailing the industry average of 25%. They are missing out on high-intent video conversions.
                                <CitationBadge sources={[mockSource3, mockSource5]} />
                              </div>
                              <div className="flex flex-row items-center p-[8px_0px] gap-[8px] w-full h-[40px]">
                                <div className="flex flex-row items-center p-[4px] gap-[2px] h-[24px] bg-[#FCE8E6] rounded-[2px]">
                                  <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#C5221F]">
                                    Adoption -13pp lower than peers
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Recommendation
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                Reallocate ~$150k/mo from underperforming display campaigns to DVA to drive efficient conversions.
                                <br />
                                • Increase DVA adoption to 25%
                                <br />
                                • Expected CPA reduction of 12%
                                <br />
                                • Drive estimated 850 incremental conversions
                                <CitationBadge sources={[mockSource2, mockSource3]} />
                              </div>
                              <div className="flex flex-row items-center p-[8px_0px] gap-[8px] w-full h-[40px]">
                                <div className="flex flex-row items-center p-[4px] gap-[2px] h-[24px] bg-[#E6F4EA] rounded-[2px]">
                                  <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#137333]">
                                    Reallocate ~$150k/mo to DVA
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row flex-wrap items-start content-start p-[8px_0px] gap-[4px_8px] w-full">
                                <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                                  <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                                    <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                                      View recommendations
                                    </div>
                                    <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                                      <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_forward</i>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* [Footer actions] */}
          <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full">
            {/* [Prompts] */}
            <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Step by step instructions for YouTube ads policy appeal')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#1F1F1F]">
                    Step by step instructions for YouTube ads policy appeal
                  </div>
                </div>
              </div>
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('What are Acme\'s YoY revenue change by product')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#1F1F1F]">
                    What are Acme's YoY revenue change by product
                  </div>
                </div>
              </div>
            </div>

            {/* [Actions] */}
            <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
              {focusedSection?.id === 'growth-opportunities' ? (
                <button 
                  className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                  onClick={() => onRefineClick?.('', '')}
                >
                  Cancel refining
                </button>
              ) : (
                <>
                  <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Sources
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_drop_down</i>
                      </div>
                    </div>
                  </button>
                  <button 
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                    onClick={() => onRefineClick?.('growth-opportunities', 'Growth opportunities')}
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">pen_spark_io25</i>
                      </div>
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Refine
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
          {sectionLoading === 'growth-opportunities' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Card 4: On track */}
        <div {...getSectionStyle('on-track', 'bg-[rgba(78,143,248,0.08)]')}>
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'on-track' ? 'opacity-30' : ''}`}>

              {/* [Header] */}
              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                {/* [Primary section] */}
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] flex-1 h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#1B1B1C]">check_circle</i>
                  <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#1B1B1C]">
                    On track
                  </div>
                </div>
                {/* [Header actions] */}
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
                  </button>
                </div>
              </div>

          {/* [Content] */}
          <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
            {/* Expansion panel set */}
            <div className="flex flex-col items-start p-0 gap-[4px] w-full">
              {/* First panel */}
              <div className="flex flex-col items-start p-0 gap-[8px] w-full bg-[#FFFFFF] rounded-[8px_8px_4px_4px]">
                <div 
                  className="flex flex-row items-center p-[8px_0px] gap-[24px] w-full h-[64px] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]"
                  onClick={() => toggleSection('ontrack-search')}
                >
                  <div className="flex flex-row items-center p-[0px_0px_0px_24px] w-[269px] h-[32px]">
                    <div className="flex flex-col justify-center items-start p-0 w-[245px] h-[32px]">
                      <div className="flex flex-row items-center p-0 gap-[8px] w-[245px] h-[32px]">
                        <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C] w-[77px] h-[32px]">
                          Search
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[8px] w-[160px] h-[24px]">
                          <div className="box-border flex flex-row items-center p-[4px] gap-[2px] w-[42px] h-[24px] bg-[#FFFFFF] border border-[#303030] rounded-[4px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] flex items-center tracking-[0.1px] text-[#303030] w-[34px] h-[16px]">
                              AMER
                            </div>
                          </div>
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[110px] h-[24px]">
                            <div className="relative w-[24px] h-[24px] flex items-center justify-center">
                        <div className="flex items-center justify-center w-[24px] h-[16px] bg-[#5F6368] rounded-[1px]">
                          <span className="text-white text-[10px] font-bold leading-none">GA</span>
                        </div>
                      </div>
                            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA] w-[78px] h-[20px]">
                              1587456845
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[639px] h-[0px] flex-1" />
                  <div className="flex flex-row justify-end items-center p-[0px_24px_0px_0px] gap-[32px] w-auto h-[44px]">
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          QTD spend
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $4.1M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          Target
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $8.2M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[120px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          7d change
                        </div>
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C] h-[28px]">
                          $1.2k
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[2px]">
                          <i className="google-symbols text-[16px] text-[#188038]">arrow_upward</i>
                          <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#188038]">
                            5%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full">
                      <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">{expandedSections['ontrack-search'] ? 'expand_less' : 'expand_more'}</i>
                    </div>
                  </div>
                </div>

                {expandedSections['ontrack-search'] && (
                  <div className="flex flex-col items-start p-0 w-full">
                    <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                      <div className="flex flex-col items-start p-0 gap-[16px] w-full rounded-[12px]">
                        <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[16px] w-full">
                          <div className="flex flex-col justify-center items-center p-0 gap-[8px] flex-1 min-w-[380px] h-[364px] min-w-0 min-h-0">
                            <div className="flex flex-col justify-between items-start p-0 gap-[8px] w-full h-[340px] relative isolate min-w-0 min-h-0">
                              <ResponsiveContainer width="99%" height="100%">
                                <LineChart data={internalSummaryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} tickFormatter={(value) => `${value}%`} dx={-10} />
                                  <Line type="monotone" dataKey="search" stroke="#1A73E8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                  <Line type="monotone" dataKey="projected" stroke="#BDC1C6" strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex flex-row items-center p-0 gap-[16px] h-[16px]">
                              <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                                <div className="w-[8px] h-0 border-[3px] border-solid border-[#1A73E8]" />
                                <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] flex items-center text-center tracking-[0.3px] text-[#3C4043]">
                                  Search IS
                                </div>
                              </div>
                              <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                                <div className="w-[8px] h-0 border-[3px] border-solid border-[#BDC1C6]" />
                                <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] flex items-center text-center tracking-[0.3px] text-[#3C4043]">
                                  Peer Avg IS
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-start p-0 gap-[16px] flex-1 min-w-[380px]">
                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Status
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                Search campaigns are performing exceptionally well. Impression share is consistently above the peer average, and CPA is 15% below target.
                                <CitationBadge sources={[mockSource1]} />
                              </div>
                              <div className="flex flex-row items-center p-[8px_0px] gap-[8px] w-full h-[40px]">
                                <div className="flex flex-row items-center p-[4px] gap-[2px] h-[24px] bg-[#E6F4EA] rounded-[2px]">
                                  <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#137333]">
                                    IS +5pp higher than peers
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Recommendation
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                No immediate action required. Continue monitoring performance.
                                <CitationBadge sources={[mockSource2]} />
                                <br />
                                • Maintain current budget allocation
                                <CitationBadge sources={[mockSource1]} />
                                <br />
                                • Review performance again at the end of the quarter
                                <CitationBadge sources={[mockSource4]} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Second panel */}
              <div className="flex flex-col items-start p-0 gap-[8px] w-full bg-[#FFFFFF] rounded-[4px_4px_8px_8px]">
                <div 
                  className="flex flex-row items-center p-[8px_0px] gap-[24px] w-full h-[64px] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]"
                  onClick={() => toggleSection('ontrack-dva')}
                >
                  <div className="flex flex-row items-center p-[0px_0px_0px_24px] w-[245px] h-[32px]">
                    <div className="flex flex-col justify-center items-start p-0 w-[221px] h-[32px]">
                      <div className="flex flex-row items-center p-0 gap-[8px] w-[221px] h-[32px]">
                        <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C] w-[48px] h-[32px]">
                          DVA
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[8px] w-[165px] h-[24px]">
                          <div className="box-border flex flex-row items-center p-[4px] gap-[2px] w-[46px] h-[24px] bg-[#FFFFFF] border border-[#303030] rounded-[4px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] flex items-center tracking-[0.1px] text-[#303030] w-[38px] h-[16px]">
                              Global
                            </div>
                          </div>
                          <div className="flex flex-row items-center p-0 gap-[8px] w-[111px] h-[24px]">
                            <div className="relative w-[24px] h-[24px] flex items-center justify-center">
                        <div className="flex items-center justify-center w-[24px] h-[16px] bg-[#5F6368] rounded-[1px]">
                          <span className="text-white text-[10px] font-bold leading-none">GA</span>
                        </div>
                      </div>
                            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA] w-[79px] h-[20px]">
                              1587456850
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[663px] h-[0px] flex-1" />
                  <div className="flex flex-row justify-end items-center p-[0px_24px_0px_0px] gap-[32px] w-auto h-[44px]">
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] h-[16px]">
                          QTD spend
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">
                          $5.4M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                          Target
                        </div>
                      </div>
                      <div className="flex flex-row items-end p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">
                          $6.5M
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start p-0 w-[120px] h-[44px]">
                      <div className="flex flex-row items-start p-0 gap-[4px] h-[16px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                          7d change
                        </div>
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[4px] h-[28px]">
                        <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">
                          $2.3k
                        </div>
                        <div className="flex flex-row items-center p-0 gap-[2px]">
                          <i className="google-symbols text-[16px] text-[#188038]">arrow_upward</i>
                          <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#188038]">
                            10%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full">
                      <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">{expandedSections['ontrack-dva'] ? 'expand_less' : 'expand_more'}</i>
                    </div>
                  </div>
                </div>

                {expandedSections['ontrack-dva'] && (
                  <div className="flex flex-col items-start p-0 w-full">
                    <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                      <div className="flex flex-col items-start p-0 gap-[16px] w-full rounded-[12px]">
                        <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[16px] w-full">
                          <div className="flex flex-col justify-center items-center p-0 gap-[8px] flex-1 min-w-[380px] h-[364px] min-w-0 min-h-0">
                            <div className="flex flex-col justify-between items-start p-0 gap-[8px] w-full h-[340px] relative isolate min-w-0 min-h-0">
                              <ResponsiveContainer width="99%" height="100%">
                                <LineChart data={internalSummaryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#5F6368' }} tickFormatter={(value) => `${value}%`} dx={-10} />
                                  <Line type="monotone" dataKey="dva" stroke="#1A73E8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                  <Line type="monotone" dataKey="projected" stroke="#BDC1C6" strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex flex-row items-center p-0 gap-[16px] h-[16px]">
                              <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                                <div className="w-[8px] h-0 border-[3px] border-solid border-[#1A73E8]" />
                                <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] flex items-center text-center tracking-[0.3px] text-[#3C4043]">
                                  DVA SOW
                                </div>
                              </div>
                              <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                                <div className="w-[8px] h-0 border-[3px] border-solid border-[#BDC1C6]" />
                                <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] flex items-center text-center tracking-[0.3px] text-[#3C4043]">
                                  Peer Avg SOW
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-start p-0 gap-[16px] flex-1 min-w-[380px]">
                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Status
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                DVA campaigns are highly effective and exceeding expectations. Conversion rates are 20% higher than the industry average, driving strong ROI.
                                <CitationBadge sources={[mockSource3]} />
                              </div>
                              <div className="flex flex-row items-center p-[8px_0px] gap-[8px] w-full h-[40px]">
                                <div className="flex flex-row items-center p-[4px] gap-[2px] h-[24px] bg-[#E6F4EA] rounded-[2px]">
                                  <div className="font-['Roboto'] font-medium text-[12px] leading-[16px] tracking-[0.3px] text-[#137333]">
                                    CVR +20% higher than peers
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124]">
                                Recommendation
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                                No immediate action required. The current strategy is yielding excellent results.
                                <CitationBadge sources={[mockSource5]} />
                                <br />
                                • Maintain current budget allocation
                                <CitationBadge sources={[mockSource1]} />
                                <br />
                                • Review performance again at the end of the quarter
                                <CitationBadge sources={[mockSource4]} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* [Footer actions] */}
          <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full">
            {/* [Prompts] */}
            <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.(`Who are ${companyName}'s main video spend competitors`)}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#1F1F1F]">
                    Who are {companyName}'s main video spend competitors
                  </div>
                </div>
              </div>
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Understand targeting spend drop reasons')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#1F1F1F]">
                    Understand targeting spend drop reasons
                  </div>
                </div>
              </div>
            </div>

            {/* [Actions] */}
            <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
              {focusedSection?.id === 'on-track' ? (
                <button 
                  className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                  onClick={() => onRefineClick?.('', '')}
                >
                  Cancel refining
                </button>
              ) : (
                <>
                  <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Sources
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_drop_down</i>
                      </div>
                    </div>
                  </button>
                  <button 
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                    onClick={() => onRefineClick?.('on-track', 'On track')}
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">pen_spark_io25</i>
                      </div>
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Refine
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
          {sectionLoading === 'on-track' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        <div id="top-of-mind-themes-section" {...getSectionStyle('top-of-mind-themes')}>
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'top-of-mind-themes' ? 'opacity-30' : ''}`}>

          {/* [Header] */}
          <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
            {/* [Primary section] */}
            <div className="flex flex-row items-center p-[0px_24px] gap-[8px] flex-1 h-[48px]">
              <i className="google-symbols text-[24px] leading-none text-[#202124]">psychology</i>
              <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#202124]">
                Top of mind themes
              </div>
            </div>
            {/* [Header actions] */}
            <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
              <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                <i className="google-symbols text-[24px] leading-none text-[#5F6368]">more_vert</i>
              </button>
            </div>
          </div>

          {/* [Content] */}
          <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
            {/* CS Callout - AI Accent */}
            <div className="flex flex-row items-start p-0 w-full">
              <div className="relative box-border w-full min-w-[744px] rounded-[16px] overflow-hidden p-[1.5px] [contain:paint]">
                <span className="callout-shimmer absolute inset-0 h-[200px] rounded-[102px] [scale:4_0.8] top-1/2 -translate-y-1/2" style={{ background: 'conic-gradient(rgba(33,123,254,0) 10deg, #217BFE 38.9738deg, #078EFB 62.3678deg, #BD99FE 87.0062deg, #217BFE 107.428deg, rgba(33,123,254,0.5) 150deg, rgba(33,123,254,0) 200deg, rgba(33,123,254,0) 360deg)' }}></span>
                <div className="relative flex flex-row items-start p-[0px_16px] gap-[8px] w-full h-full bg-[#F6FAFF] rounded-[15px]">
                  {/* [Icon container] */}
                  <div className="flex flex-row items-start p-[12px_0px] h-[48px]">
                    <div className="flex flex-row justify-center items-center p-0 gap-[8px] w-[24px] h-[24px]">
                      <i className="google-symbols text-[24px] leading-none bg-[linear-gradient(60.06deg,#217BFE_19.36%,#078EFB_39.03%,#BD99FE_69.85%)] text-transparent bg-clip-text flex items-center text-center">emoji_objects</i>
                    </div>
                  </div>
                  {/* Frame 5 */}
                  <div className="flex flex-row items-start p-0 gap-[16px] flex-1">
                    {/* Frame 4 */}
                    <div className="flex flex-row items-start p-[15px_0px_12px] gap-[8px] flex-1">
                      {/* Frame 3 */}
                      <div className="flex flex-col items-start p-0 gap-[8px] flex-1">
                        <div className="font-['Roboto'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#3C4043] w-full">
                          To effectively support {companyName}, you should focus on several high-priority themes centered around their strategic reorganization, budget constraints, and technical misconceptions
                          <CitationBadge sources={[mockSource1, mockSource2]} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Frame 2134538686 */}
            <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[36px] w-full">
              {/* Simple content widget 1 */}
              <div className="flex flex-col items-start p-0 gap-[8px] w-[444px] min-w-[380px] flex-1">
                <div className="flex flex-row items-start p-0 gap-[8px] w-full">
                  <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124] w-full">
                    Strategic Pivot: Professional Lead Generation
                  </div>
                </div>
                <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full">
                  The primary marketing objective for {companyName} is shifting from purely "front-of-login" e-commerce to a more B2B-focused strategy
                  <CitationBadge sources={[mockSource3]} />
                  <ul className="list-disc pl-5 mt-2 mb-0">
                    <li><strong>Focus Areas:</strong> Emphasize driving account registrations, logins, and lead generation</li>
                  </ul>
                </div>
                <div className="flex flex-row flex-wrap items-start content-start p-[8px_0px] gap-[4px_8px] w-full">
                  <button 
                    onClick={() => onPromptClick?.('Generate a pitch deck for ' + companyName)}
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Create pitch deck
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_forward</i>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Simple content widget 2 */}
              <div className="flex flex-col items-start p-0 gap-[8px] w-[444px] min-w-[380px] flex-1">
                <div className="flex flex-row items-start p-0 gap-[8px] w-full">
                  <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#202124] w-full">
                    Navigating Strategic Reorganization & Migration
                  </div>
                </div>
                <div className="font-['Roboto'] font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#303030] w-full">
                  A primary concern for the client is the sunsetting of <strong>Power Equipment Direct (PED)</strong> domains and the migration of those products to {companyName}
                  <CitationBadge sources={[mockSource2, mockSource5]} />
                  <ul className="list-disc pl-5 mt-2 mb-0">
                    <li><strong>Automation Preservation:</strong> The client is concerned that moving PED campaigns to the {companyName} Home team's manual setups may result in a "step backward" on the AI maturity curve</li>
                  </ul>
                </div>
                <div className="flex flex-row flex-wrap items-start content-start p-[8px_0px] gap-[4px_8px] w-full">
                  <button 
                    onClick={() => onPromptClick?.('Generate a pitch deck for ' + companyName)}
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Create pitch deck
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_forward</i>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Simple content widget 3 */}
              <div className="flex flex-col items-start p-0 gap-[8px] w-[444px] min-w-[380px] flex-1">
                <div className="flex flex-row items-start p-0 gap-[8px] w-full">
                  <div className="font-['Roboto'] font-medium text-[16px] leading-[24px] tracking-[0.1px] text-[#202124] w-full">
                    Budget Flexibility vs. Market Opportunities
                  </div>
                </div>
                <div className="font-['Roboto'] font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#303030] w-full">
                  {companyName} is currently operating under a restrictive fixed budget model that includes trademark spend, leading to a year-over-year spend decline of ~$100k
                  <CitationBadge sources={[mockSource4]} />
                  <ul className="list-disc pl-5 mt-2 mb-0">
                    <li><strong>Address Missed Demand:</strong> Share insights on growing market demand in categories like bathroom fixtures, where Acme.com has seen declining click coverage due to budget caps</li>
                  </ul>
                </div>
                <div className="flex flex-row flex-wrap items-start content-start p-[8px_0px] gap-[4px_8px] w-full">
                  <button 
                    onClick={() => onPromptClick?.('Generate a pitch deck for ' + companyName)}
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Create pitch deck
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_forward</i>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* [Footer actions] */}
          <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full">
            {/* [Prompts] */}
            <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Analyze headroom opportunities')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Analyze headroom opportunities
                  </div>
                </div>
              </div>
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Discover new pipeline opportunities')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Discover new pipeline opportunities
                  </div>
                </div>
              </div>
            </div>

            {/* [Actions] */}
            <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
              {focusedSection?.id === 'top-of-mind-themes' ? (
                <button 
                  className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                  onClick={() => onRefineClick?.('', '')}
                >
                  Cancel refining
                </button>
              ) : (
                <>
                  <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Sources
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_drop_down</i>
                      </div>
                    </div>
                  </button>
                  <button 
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                    onClick={() => onRefineClick?.('top-of-mind-themes', 'Top of mind themes')}
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">pen_spark_io25</i>
                      </div>
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Refine
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
          {sectionLoading === 'top-of-mind-themes' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Card 6: Internal summary */}
        <div id="internal-summary-section" {...getSectionStyle('internal-summary')}>
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'internal-summary' ? 'opacity-30' : ''}`}>

          {/* [Header] */}
          <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
            {/* [Primary section] */}
            <div className="flex flex-row items-center p-[0px_24px] gap-[8px] flex-1 h-[48px]">
              <i className="google-symbols text-[24px] leading-none text-[#202124]">view_compact</i>
              <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#202124]">
                Internal summary
              </div>
            </div>
            {/* [Header actions] */}
            <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
              <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                <i className="google-symbols text-[24px] leading-none text-[#5F6368]">more_vert</i>
              </button>
            </div>
          </div>

          {/* [Content] */}
          <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
            {/* Frame 2134538686 */}
            <div className="flex flex-row flex-wrap items-start p-0 gap-[16px] w-full">
              {/* CS Scorecard 1 */}
              <div className="flex flex-col items-start p-0 flex-1 min-w-[200px]">
                <div className="flex flex-row items-start p-0 gap-[4px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    Q3 Target
                  </div>
                </div>
                <div className="flex flex-row items-end p-0 gap-[4px] h-[36px]">
                  <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#202124]">
                    $102.6M
                  </div>
                </div>
              </div>

              {/* CS Scorecard 2 */}
              <div className="flex flex-col items-start p-0 flex-1 min-w-[200px]">
                <div className="flex flex-row items-start p-0 gap-[4px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    QTD Revenue
                  </div>
                </div>
                <div className="flex flex-row items-end p-0 gap-[4px] h-[36px]">
                  <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#202124]">
                    $102.6M
                  </div>
                </div>
                <div className="flex flex-row items-center pt-[4px] pr-0 pb-0 pl-0 gap-[4px] h-[20px]">
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                      $106.9M
                    </div>
                  </div>
                </div>
              </div>

              {/* CS Scorecard 3 */}
              <div className="flex flex-col items-start p-0 flex-1 min-w-[200px]">
                <div className="flex flex-row items-start p-0 gap-[4px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    w/w
                  </div>
                </div>
                <div className="flex flex-row items-end p-0 gap-[4px] h-[36px]">
                  <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#202124]">
                    $21M
                  </div>
                </div>
                <div className="flex flex-row items-center pt-[4px] pr-0 pb-0 pl-0 gap-[4px] h-[20px]">
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                      $106.9M
                    </div>
                  </div>
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#188038] flex items-center gap-[2px]">
                      <i className="google-symbols text-[16px] leading-none">arrow_drop_up</i> 12pt
                    </div>
                  </div>
                </div>
              </div>

              {/* CS Scorecard 4 */}
              <div className="flex flex-col items-start p-0 flex-1 min-w-[200px]">
                <div className="flex flex-row items-start p-0 gap-[4px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    Finance outlook
                  </div>
                </div>
                <div className="flex flex-row items-end p-0 gap-[4px] h-[36px]">
                  <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#C5221F]">
                    -$27.8K
                  </div>
                </div>
                <div className="flex flex-row items-center pt-[4px] pr-0 pb-0 pl-0 gap-[4px] h-[20px]">
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                      $106.9M
                    </div>
                  </div>
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#188038] flex items-center gap-[2px]">
                      <i className="google-symbols text-[16px] leading-none">arrow_drop_up</i> 12pt
                    </div>
                  </div>
                </div>
              </div>

              {/* CS Scorecard 5 */}
              <div className="flex flex-col items-start p-0 flex-1 min-w-[200px]">
                <div className="flex flex-row items-start p-0 gap-[4px]">
                  <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                    Sales outlook
                  </div>
                </div>
                <div className="flex flex-row items-end p-0 gap-[4px] h-[36px]">
                  <div className="font-['Google_Sans'] font-normal text-[28px] leading-[36px] flex items-center text-[#C5221F]">
                    -4.2%
                  </div>
                </div>
                <div className="flex flex-row items-center pt-[4px] pr-0 pb-0 pl-0 gap-[4px] h-[20px]">
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[16px]">
                    <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                      $106.9M
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center p-0 gap-[8px] w-[16px] h-[16px]">
                    <i className="google-symbols text-[16px] leading-none text-[#F9AB00]">warning</i>
                  </div>
                </div>
              </div>
            </div>

            {/* CCS/.atoms/Simple content widget */}
            <div className="flex flex-row justify-between items-center p-0 gap-[8px] w-full">
              <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1F1F1F]">
                Revenue trend
              </div>
              <div className="flex flex-row items-center gap-[16px]">
                <div className="flex flex-row items-center gap-[8px]">
                  <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#5E5E5E]">Dates</span>
                  <div className="flex flex-row items-center justify-between p-[6px_12px] gap-[8px] bg-white border border-[#79747E] rounded-[8px] cursor-pointer select-none">
                    <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#1F1F1F]">QTD</span>
                    <i className="google-symbols text-[18px] text-[#49454F]">arrow_drop_down</i>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[8px]">
                  <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#5E5E5E]">Products</span>
                  <div className="flex flex-row items-center justify-between p-[6px_12px] gap-[8px] bg-white border border-[#79747E] rounded-[8px] cursor-pointer select-none">
                    <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#1F1F1F]">All</span>
                    <i className="google-symbols text-[18px] text-[#49454F]">arrow_drop_down</i>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart and Side Legend */}
            <div className="flex flex-row items-start gap-[24px] w-full h-[364px] min-w-0 min-h-0 mt-[16px]">
              <div className="flex-1 h-full relative isolate min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={internalSummaryData} barCategoryGap="20%" margin={{ top: 20, right: 10, bottom: 20, left: -10 }}>
                    <CartesianGrid stroke="#E2E2E9" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={(props) => {
                        const { x, y, payload } = props;
                        if (payload.value === 'Jan 1' || payload.value === 'Mar 30') {
                          return (
                            <text x={x} y={y + 16} fill="#5E5E5E" fontSize={14} fontFamily="Google Sans Text" textAnchor="middle">
                              {payload.value}
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      domain={[0, 10]}
                      ticks={[0, 2.5, 5.0, 7.5, 10.0]}
                      tick={{ fontSize: 14, fill: '#5E5E5E', fontFamily: 'Google Sans Text' }}
                      tickFormatter={(value) => `$${value.toFixed(1)}M`}
                    />
                    
                    {/* Target lines (renders as a custom top line mark/scatter or reference segment) */}
                    <Bar 
                      dataKey="target" 
                      fill="none"
                      legendType="none"
                      shape={(props: any) => {
                        const { x, y, width } = props;
                        const barW = 24;
                        const centerX = x + (width / 2);
                        return (
                          <line 
                            x1={centerX - 12} 
                            y1={y} 
                            x2={centerX + 12} 
                            y2={y} 
                            stroke="#72777A" 
                            strokeWidth={3} 
                          />
                        );
                      }} 
                    />

                    {/* Active/Actual Revenue Bar */}
                    <Bar 
                      dataKey="revenue" 
                      fill="#1A73E8" 
                      radius={[8, 8, 0, 0]} 
                      barSize={24}
                    />

                    {/* Finance Outlook projected Bar */}
                    <Bar 
                      dataKey="outlook" 
                      fill="#8AB4F8" 
                      radius={[8, 8, 0, 0]} 
                      barSize={24}
                    />

                    {/* Last Year Trend Line */}
                    <Line 
                      type="monotone" 
                      dataKey="lastYear" 
                      stroke="#FF7A00" 
                      strokeWidth={3} 
                      strokeDasharray="4 3" 
                      dot={false} 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Figma Side Legend */}
              <div className="flex flex-col items-start gap-[20px] w-[180px] pt-[20px]">
                <div className="flex flex-row items-center gap-[12px]">
                  <div className="w-[20px] h-[20px] bg-[#1A73E8] rounded-[2px]" />
                  <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#3C4043]">Revenue</span>
                </div>
                <div className="flex flex-row items-center gap-[12px]">
                  <div className="w-[20px] h-[20px] bg-[#8AB4F8] rounded-[2px]" />
                  <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#3C4043]">Finance outlook</span>
                </div>
                <div className="flex flex-row items-center gap-[12px]">
                  <div className="w-[20px] h-[2px] bg-[#72777A]" />
                  <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#3C4043]">Target</span>
                </div>
                <div className="flex flex-row items-center gap-[12px]">
                  <div className="w-[20px] h-[0px] border-t-2 border-dashed border-[#FF7A00]" />
                  <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#3C4043]">Last year</span>
                </div>
              </div>
            </div>

            {/* Figma style Bottom Card Actions */}
            <div className="flex flex-row justify-between items-center w-full pt-[16px] border-t border-[#E2E2E9] mt-[8px]">
              <button className="box-border flex flex-row items-center p-[8px_16px] gap-[8px] h-[40px] bg-white border border-[#79747E] rounded-[100px] cursor-pointer hover:bg-black/5">
                <i className="google-symbols text-[18px] text-[#1A73E8]">subdirectory_arrow_right</i>
                <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1F1F1F]">Show revenue trend by product area</span>
              </button>
              
              <button className="flex flex-row items-center gap-[8px] bg-transparent border-none cursor-pointer hover:opacity-80">
                <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1A73E8]">Deep dive</span>
                <i className="google-symbols text-[18px] text-[#1A73E8]">chevron_right</i>
              </button>
            </div>

          </div>

          {/* [Footer actions] */}
          <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full">
            {/* [Prompts] */}
            <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Analyze headroom opportunities')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Analyze headroom opportunities
                  </div>
                </div>
              </div>
              <div 
                className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                onClick={() => onPromptClick?.('Discover new pipeline opportunities')}
              >
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Discover new pipeline opportunities
                  </div>
                </div>
              </div>
            </div>

            {/* [Actions] */}
            <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
              {focusedSection?.id === 'internal-summary' ? (
                <button 
                  className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                  onClick={() => onRefineClick?.('', '')}
                >
                  Cancel refining
                </button>
              ) : (
                <>
                  <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Sources
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">arrow_drop_down</i>
                      </div>
                    </div>
                  </button>
                  <button 
                    className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                    onClick={() => onRefineClick?.('internal-summary', 'Internal summary')}
                  >
                    <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                      <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                        <i className="google-symbols text-[20px] leading-none text-[#1A73E8] flex items-center text-center">pen_spark_io25</i>
                      </div>
                      <div className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8]">
                        Refine
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
          {sectionLoading === 'internal-summary' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Footer Section */}
        <div className="flex flex-col items-start p-0 w-full min-w-[380px] bg-[#4E8FF8]/[0.08] rounded-[16px]">
          {/* [Header] */}
          <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
            {/* [Primary section] */}
            <div className="flex flex-row items-center p-[0px_24px] gap-[8px] w-full h-[48px] flex-1">
              <div className="font-['Google_Sans'] font-normal text-[18px] leading-[24px] flex items-center text-[#1F1F1F]">
                What else would you like to add?
              </div>
            </div>
          </div>

          {/* CCS/[Content] */}
          <div className="flex flex-col items-start p-0 w-full">
            <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
              {/* CCS/.atoms/Simple content widget */}
              <div className="flex flex-col items-start p-0 gap-[8px] w-full min-w-[380px]">
                <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full">
                  Click on a chip below to add additional helpful content to the canvas that will help you with your diagnosis. You can also ask Connect AI to add content to the canvas. <a href="#" className="text-[#1A73E8] no-underline hover:underline">Learn more</a>
                </div>
              </div>
            </div>
          </div>

          {/* [Footer actions] */}
          <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full rounded-none">
            {/* [Prompts] */}
            <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] w-full flex-1">
              {/* CS Chip (assistive) 1 */}
              <div className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]">
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">add_box</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Pipeline summary
                  </div>
                </div>
              </div>

              {/* CS Chip (assistive) 2 */}
              <div className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]">
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">add_box</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Multi-quarter plan summary
                  </div>
                </div>
              </div>

              {/* CS Chip (assistive) 3 */}
              <div className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]">
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">add_box</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    {companyName} Stakeholder summary
                  </div>
                </div>
              </div>

              {/* CS Chip (assistive) 4 */}
              <div className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]">
                <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                  <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">add_box</i>
                  <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                    Share of traffic summary
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-[11px] text-[#5F6368] pb-6">
          <p className="m-0">Canvas generated 1 min ago by Connect AI using <a href="#" className="text-[#5F6368] underline">13 sources</a></p>
          <p className="m-0">This data is strictly confidential and need-to-know, and may be deemed to be material nonpublic information. <a href="#" className="text-[#1A73E8] no-underline hover:underline">Learn more about insider trading <i className="google-symbols text-[10px]">open_in_new</i></a></p>
        </div>

        </div>
      </div>

      {selectionPopup && (
        <div 
          id="selection-popup"
          className="fixed z-[9999] transform -translate-x-1/2 -translate-y-full"
          style={{ left: selectionPopup.x, top: selectionPopup.y - 8 }}
        >
          <button 
            className="box-border flex flex-row items-center p-[6px_16px_6px_8px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#DADCE0] rounded-[100px] cursor-pointer hover:bg-[#F8F9FA] shadow-[0_4px_8px_3px_rgba(0,0,0,0.15),0_1px_3px_0_rgba(0,0,0,0.30)]"
            onClick={() => {
              if (onAskConnectAI) {
                onAskConnectAI(selectionPopup.text, selectionPopup.sectionId);
              }
              setSelectionPopup(null);
              window.getSelection()?.removeAllRanges();
            }}
          >
            <div className="w-[20px] h-[20px] flex-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_4213_26959)">
                  <path d="M16.1862 2.125H7.81373C6.87623 2.125 6.00873 2.625 5.53998 3.4375L1.35498 10.6875C0.88623 11.5 0.88623 12.5 1.35498 13.3125L5.54123 20.5625C6.00998 21.375 6.87623 21.875 7.81498 21.875H16.1862C17.1237 21.875 17.9912 21.375 18.46 20.5625L22.6462 13.3125C23.115 12.5 23.115 11.5 22.6462 10.6875L18.46 3.4375C17.9912 2.625 17.125 2.125 16.1862 2.125Z" fill="url(#paint0_linear_4213_26959)"/>
                  <path d="M6.90125 21.5265L22.795 12.3502C22.915 12.2802 22.9963 12.1502 22.9963 12.4502 22.88 12.899 22.6488 13.3002L18.4487 20.5752C17.985 21.379 17.1262 21.874 16.1987 21.874H7.79875C7.335 21.874 6.88875 21.7502 6.5 21.5252C6.62875 21.6002 6.78125 21.5952 6.9025 21.5252L6.90125 21.5265Z" fill="#1A73E8"/>
                  <path d="M10.5 15.5C10.45 15.5 10.4038 15.4837 10.3625 15.45C10.3213 15.4162 10.2912 15.375 10.275 15.325C10.1337 14.7662 9.92125 14.2413 9.6375 13.75C9.35375 13.2587 9.00875 12.8087 8.6 12.4C8.19125 11.9912 7.74125 11.6463 7.25 11.3625C6.75875 11.0788 6.23375 10.8663 5.675 10.725C5.625 10.7088 5.58375 10.6787 5.55 10.6375C5.51625 10.5962 5.5 10.55 5.5 10.5C5.5 10.45 5.51625 10.4038 5.55 10.3625C5.58375 10.3213 5.625 10.2912 5.675 10.275C6.23375 10.1337 6.75875 9.92125 7.25 9.6375C7.74125 9.35375 8.19125 9.00875 8.6 8.6C9.00875 8.19125 9.35375 7.74125 9.6375 7.25C9.92125 6.75875 10.1337 6.23375 10.275 5.675C10.2912 5.625 10.3213 5.58375 10.3625 5.55C10.4038 5.51625 10.45 5.5 10.5 5.5C10.55 5.5 10.5938 5.51625 10.6313 5.55C10.6688 5.58375 10.6962 5.625 10.7125 5.675C10.8625 6.23375 11.0788 6.75875 11.3625 7.25C11.6463 7.74125 11.9912 8.19125 12.4 8.6C12.8087 9.00875 13.2587 9.35375 13.75 9.6375C14.2413 9.92125 14.7662 10.1337 15.325 10.275C15.375 10.2912 15.4162 10.3213 15.45 10.3625C15.4837 10.4038 15.5 10.45 15.5 10.5C15.5 10.55 15.4837 10.5962 15.45 10.6375C15.4162 10.6787 15.375 10.7088 15.325 10.725C14.7662 10.8663 14.2413 11.0788 13.75 11.3625C13.2587 11.6463 12.8087 11.9912 12.4 12.4C11.9912 12.8087 11.6463 13.2587 11.3625 13.75C11.0788 14.2413 10.8663 14.7662 10.725 15.325C10.7088 15.375 10.6787 15.4162 10.6375 15.45C10.5962 15.4837 10.55 15.5 10.5 15.5Z" fill="white"/>
                </g>
                <defs>
                  <linearGradient id="paint0_linear_4213_26959" x1="7.77748" y1="15.445" x2="16.72" y2="8.14875" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#217BFE"/>
                    <stop offset="0.25" stopColor="#078EFB"/>
                    <stop offset="0.33" stopColor="#1E8EFB"/>
                    <stop offset="0.56" stopColor="#648FFD"/>
                    <stop offset="0.72" stopColor="#908FFE"/>
                    <stop offset="0.8" stopColor="#A190FF"/>
                    <stop offset="0.84" stopColor="#A892FE"/>
                    <stop offset="0.93" stopColor="#B797FE"/>
                    <stop offset="1" stopColor="#BD99FE"/>
                  </linearGradient>
                  <clipPath id="clip0_4213_26959">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-center tracking-[0.25px] text-[#3C4043]">
              Ask Connect AI
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
