import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CitationBadge, Source } from './CitationBadge';
import { RefinedSectionResult } from '../services/gemini';

export const MeetingPrepCanvas = ({ 
  onClose,
  onPromptClick,
  focusedSection,
  onRefineClick,
  onAskConnectAI,
  sectionLoading,
  companyName = 'Neary Brands',
  customSectionContents,
  selectedDateRange = 'Jan 1 - today',
  onDateRangeChange
}: { 
  onClose: () => void,
  onPromptClick?: (text: string) => void,
  focusedSection?: { id: string; title: string } | null,
  onRefineClick?: (id: string, title: string) => void,
  onAskConnectAI?: (text: string) => void,
  sectionLoading?: string | null,
  companyName?: string,
  customSectionContents?: Record<string, RefinedSectionResult>,
  selectedDateRange?: string,
  onDateRangeChange?: (newRange: string) => void
}) => {
  const mockSource1: Source = {
    id: '1',
    type: 'link',
    title: 'Campaign Performance Dashboard',
    url: 'https://example.com/dashboard'
  };

  const mockSource2: Source = {
    id: '2',
    type: 'transcript',
    title: 'Last Week Sync',
    date: '2026-05-05',
    participants: ['Alice Brown', 'Bob Green'],
    transcriptSnippet: 'Alice: The PMax spend drop is the main reason for the revenue decline.\nBob: We need to fix the policy issue to resume spend. Have you checked the disapproved assets?\nAlice: Yes, I looked into it this morning. The destination URL is returning a 404 error on our summer campaign landing page.\nBob: Oh, that makes sense. Let\'s update the destination link to the new active collections page and request a re-review.\nAlice: Good call. I\'ll get that updated today so we can get these campaigns back up and running.\nBob: Perfect, keep me posted on the approval status. We also need to review budget allocation for the Larroude BR campaigns to capitalize on their strong performance.'
  };

  const mockSource3: Source = {
    id: '3',
    type: 'slides',
    title: 'Q2 Account Strategy Deck',
    url: 'https://example.com/slides',
    lastUpdated: 'Apr 28, 2026'
  };

  const mockSource4: Source = {
    id: '4',
    type: 'docs',
    title: 'Neary Brands Meeting Brief',
    url: 'https://example.com/docs',
    lastUpdated: 'May 14, 2026'
  };

  const mockSource5: Source = {
    id: '5',
    type: 'sheets',
    title: 'Product Adoption Matrix',
    url: 'https://example.com/sheets',
    lastUpdated: 'May 10, 2026'
  };

  const mockSource6: Source = {
    id: '6',
    type: 'docs',
    title: 'Executive Brief & Action Items',
    url: 'https://example.com/docs',
    lastUpdated: 'May 12, 2026'
  };

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [refinedSections, setRefinedSections] = useState<Record<string, boolean>>({});
  const [hoveredCitationId, setHoveredCitationId] = useState<string | null>(null);
  const [selectionPopup, setSelectionPopup] = useState<{ x: number, y: number, text: string } | null>(null);
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({
    panel1: true,
    panel2: false,
    panel3: false
  });
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const agendaContentRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (!agendaContentRef.current) return;
    const textToCopy = agendaContentRef.current.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setToastVisible(true);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const togglePanel = (panelId: string) => {
    setExpandedPanels(prev => ({ ...prev, [panelId]: !prev[panelId] }));
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

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
        className: "flex flex-col items-start p-0 w-full rounded-[16px] border-2 border-[#1A73E8] bg-white relative transition-all duration-300 shadow-[0_0_15px_rgba(26,115,232,0.3)]",
        style: {}
      };
    }
    
    return {
      className: `flex flex-col items-start p-0 w-full rounded-[16px] border border-[#E8EAED] ${defaultBg} relative transition-all duration-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]`,
      style: {}
    };
  };

  const data = [
    { name: 'Oct 25', value: 410000 },
    { name: 'Nov 25', value: 520000 },
    { name: 'Dec 25', value: 490000 },
    { name: 'Jan 26', value: 480000 },
    { name: 'Feb 26', value: 390000 },
    { name: 'Mar 26', value: 439700 },
  ];

  const customPerfContent = customSectionContents && customSectionContents['company-performance-summary'];
  const chartType = customPerfContent?.chartType || 'area';
  const chartData = customPerfContent?.chartData || data;

  const renderHoverCardContent = (id: string, title: string, content: React.ReactNode) => (
    <div className="absolute top-full right-0 mt-2 z-[9999] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[#E8EAED] w-[360px] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED]">
        <div className="flex items-center gap-2">
          <i className="google-symbols text-[#1A73E8] text-[20px]">insights</i>
          <span className="font-['Google_Sans'] font-medium text-[15px] text-[#202124]">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-[#E8F0FE] text-[#1A73E8] text-[11px] font-medium px-2 py-0.5 rounded-full">AI Analysis</div>
          <i className="google-symbols text-[#5F6368] text-[18px] cursor-pointer hover:text-black">close</i>
        </div>
      </div>
      <div className="font-['Google_Sans_Text'] text-[14px] leading-[20px] text-[#3C4043]">
        {content}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#E8EAED]">
        <span className="font-['Google_Sans_Text'] text-[12px] text-[#5F6368]">
          Sources
        </span>
        <i className="google-symbols text-[18px] leading-none text-[#1A73E8]">arrow_drop_down</i>
      </div>
      <div 
        className="flex flex-row items-center p-0 gap-[8px] h-[20px] cursor-pointer group"
        onClick={() => onRefineClick?.(id, title)}
      >
        <i className="google-symbols text-[18px] leading-none text-[#1A73E8]">edit_spark</i>
        <div className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1A73E8] group-hover:underline">
          Refine
        </div>
      </div>
    </div>
  );

  return (
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
                onAskConnectAI(selectionPopup.text);
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
            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-center tracking-[0.25px] text-[#3C4043] whitespace-nowrap">
              Ask Connect AI
            </div>
          </button>
        </div>
      )}

      <div className="flex flex-col items-start p-0 isolate w-[calc(100%-48px)] max-w-[1680px] mx-auto shrink-0 bg-[linear-gradient(266.54deg,#E7F2FF_0%,#F7ECFE_100%)] border-b border-l border-r border-[#DADCE0] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.04)] rounded-b-[20px] relative z-10">
        <div className="box-border flex flex-col items-start p-[8px_8px_16px_24px] w-full h-[88px] border-b border-[#DADCE0] z-[2]">
          <div className="flex flex-row items-center pt-[8px] gap-[24px] w-full h-[48px]">
            <div className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#000000] flex-1 truncate">
              Meeting brief for {companyName} Bi-weekly
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
              v1.001.a
            </div>
          </div>
        </div>
        
        <div className="flex flex-row items-center p-[6px_24px] gap-[8px] w-full h-[44px] z-[1]">
          <div className="flex flex-row items-center gap-[16px]">
            <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#1B1B1C]">
              Next meeting
            </span>
            <div className="flex flex-row items-center gap-[4px]">
              <span className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#474747]">
                Time:
              </span>
              <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
                Mar 24, 1:00 PM
              </span>
              <span className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#474747]">
                (Bi-weekly on Tuesdays)
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center gap-[4px] ml-4">
            <span className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#474747]">
              Attendees:
            </span>
            <div className="flex flex-row items-center gap-[8px]">
              <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
                3
              </span>
              <div className="flex flex-row items-center">
                <img className="w-[24px] h-[24px] rounded-[20px] mx-[-6px] relative z-[3]" src="https://i.pravatar.cc/150?img=11" alt="Attendee" />
                <img className="w-[24px] h-[24px] rounded-[475px] mx-[-6px] relative z-[2]" src="https://i.pravatar.cc/150?img=12" alt="Attendee" />
                <img className="w-[24px] h-[24px] rounded-[475px] mx-[-6px] relative z-[1]" src="https://i.pravatar.cc/150?img=13" alt="Attendee" />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-[4px] ml-4">
            <span className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#474747]">
              Location:
            </span>
            <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
              Virtual
            </span>
          </div>

          <div className="flex flex-row items-center gap-[8px] ml-auto mr-4">
            <span className="font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase text-[#919191]">Scope</span>
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
                <div className="absolute top-full right-0 mt-1 w-[180px] bg-white border border-[#DADCE0] rounded-[8px] shadow-lg z-[100] py-1">
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

          <button className="flex flex-row justify-center items-center px-[8px] py-[8px] gap-[4px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]">
            <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
              View in Google Calendar
            </span>
            <i className="google-symbols text-[20px] text-[#3271EA]">open_in_new</i>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-[#ffffff] flex flex-col items-center">
        <div className="w-full max-w-[1680px] flex flex-col gap-6">
        
        {/* Top Row: Company performance summary & Meeting agenda */}
        <div className="flex flex-row gap-6 w-full">
          
          {/* Section 1: Company performance summary */}
          <div 
            {...getSectionStyle('company-performance-summary', 'bg-[#E7F2FF]/[0.6]')} 
            className={`${getSectionStyle('company-performance-summary', 'bg-[#E7F2FF]/[0.6]').className} flex-1 min-w-[380px] max-w-[615px]`}
          >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'company-performance-summary' ? 'opacity-30' : ''}`}>

                <div className="flex flex-row items-center p-[16px_24px_8px] w-full">
                  <div className="flex flex-row items-center gap-[8px] flex-1">
                    <i className="google-symbols text-[24px] leading-none text-[#1B1B1C]">bar_chart</i>
                    <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                      Company performance summary
                    </div>
                  </div>
                  <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                    <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                      <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                        {selectedDateRange}
                      </div>
                    </div>
                    <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                      <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                  <div className="flex flex-col gap-[8px] w-full">
                    <div className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1B1B1C]">
                      Revenue trend
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                      {customPerfContent ? (
                        <p className="m-0 whitespace-pre-wrap">{customPerfContent.text}</p>
                      ) : refinedSections['company-performance-summary'] ? (
                        <>
                          <span className={`citation-highlight ${hoveredCitationId === 'rev-dropped-perf' ? 'active' : ''}`}>
                            {`Since you last met with ${companyName}, revenue dropped 42% largely driven by a 71% decline in PMax campaign spend.`}
                          </span>
                          <CitationBadge 
                            sources={[mockSource1, mockSource4]} 
                            onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'rev-dropped-perf' : null)}
                          />
                          <span className={`citation-highlight ${hoveredCitationId === 'rev-recovery-perf' ? 'active' : ''}`}>
                            {` However, recent adjustments have shown early signs of recovery in QTD metrics.`}
                          </span>
                          <CitationBadge 
                            sources={[mockSource2, mockSource3]} 
                            onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'rev-recovery-perf' : null)}
                          />
                        </>
                      ) : (
                        <>
                          <span className={`citation-highlight ${hoveredCitationId === 'rev-dropped-perf' ? 'active' : ''}`}>
                            {`Since you last met with ${companyName}, revenue dropped 42% largely driven by a 71% decline in PMax campaign spend.`}
                          </span>
                          <CitationBadge 
                            sources={[mockSource1, mockSource4]} 
                            onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'rev-dropped-perf' : null)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="h-[152px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5F6368', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5F6368', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                          <Bar dataKey="value" fill="#1A73E8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : chartType === 'line' ? (
                        <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5F6368', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5F6368', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                          <Line type="monotone" dataKey="value" stroke="#1A73E8" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      ) : (
                        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5F6368', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5F6368', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                          <Area type="monotone" dataKey="value" stroke="#F28B82" fill="#FAD2CF" strokeWidth={2} />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-[8px] w-full mt-2">
                    <div className="flex flex-row justify-between items-center w-full">
                      <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] text-[#1B1B1C] w-[128px]">QTD revenue</span>
                      <span className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] text-[#474747] text-center w-[47px]">$439.7k</span>
                      <span className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] text-[#474747] text-right w-[129px]">+$3.3k (82% w/w)</span>
                    </div>
                    <div className="flex flex-row justify-between items-center w-full">
                      <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] text-[#1B1B1C] w-[128px]">Finance outlook</span>
                      <span className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] text-[#474747] text-center w-[27px]">55%</span>
                      <span className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] text-[#474747] text-right w-[129px]">No w/w change</span>
                    </div>
                    <div className="flex flex-row justify-between items-center w-full">
                      <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] text-[#1B1B1C] w-[128px]">Points won+live</span>
                      <span className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] text-[#474747] text-center w-[21px]">631</span>
                      <span className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] text-[#474747] text-right w-[129px]">+35pts since last wk</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center px-[24px] pt-4 border-t border-[#E8EAED] w-full mt-4">
                  <span className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
                    Last updated: Sat, May 15, 2026
                  </span>
                </div>
                <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full mt-auto">
                  <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
                    <div 
                      onClick={() => onPromptClick?.('How are campaigns performing?')}
                      className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                    >
                      <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                        <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                        <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                          How are campaigns performing?
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
                    {focusedSection?.id === 'company-performance-summary' ? (
                      <button 
                        className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                        onClick={() => onRefineClick?.('', '')}
                      >
                        Cancel refining
                      </button>
                    ) : (
                      <div className="flex flex-row gap-2">
                        <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]">
                          <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                            <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                              Sources
                            </span>
                            <i className="google-symbols text-[20px] text-[#3271EA]">arrow_drop_down</i>
                          </div>
                        </button>
                        <button 
                          className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                          onClick={() => onRefineClick?.('company-performance-summary', 'Company performance summary')}
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
                      </div>
                    )}
                  </div>

                </div>
          </div>
          {sectionLoading === 'company-performance-summary' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
          </div>

          {/* Section 2: Meeting agenda */}
          <div 
            {...getSectionStyle('meeting-agenda', 'bg-[#E7F2FF]/[0.6]')} 
            className={`${getSectionStyle('meeting-agenda', 'bg-[#E7F2FF]/[0.6]').className} flex-1 min-w-[380px]`}
          >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'meeting-agenda' ? 'opacity-30' : ''}`}>

                <div className="flex flex-row items-center p-[16px_24px_8px] w-full">
                  <div className="flex flex-row items-center gap-[8px] flex-1">
                    <i className="google-symbols text-[24px] leading-none text-[#1B1B1C]">list_alt</i>
                    <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                      Meeting agenda
                    </div>
                  </div>
                  <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                    <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                      <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                        {selectedDateRange}
                      </div>
                    </div>
                    <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                      <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
                    </button>
                  </div>
                </div>
                
                {/* Formatting actions */}
                <div className="flex flex-row items-center p-[0px_10px] w-full h-[36px]">
                  <button onClick={() => handleFormat('bold')} className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[20px] text-[#5E5E5E]">format_bold</i>
                  </button>
                  <button onClick={() => handleFormat('italic')} className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[20px] text-[#5E5E5E]">format_italic</i>
                  </button>
                  <button onClick={() => handleFormat('underline')} className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[20px] text-[#5E5E5E]">format_underlined</i>
                  </button>
                  <div className="w-[0px] h-[36px] border border-solid border-[rgba(1,44,111,0.1)] mx-[4px]"></div>
                  <button onClick={() => handleFormat('insertOrderedList')} className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[20px] text-[#5E5E5E]">format_list_numbered</i>
                  </button>
                  <button onClick={() => handleFormat('insertUnorderedList')} className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[20px] text-[#5E5E5E]">format_list_bulleted</i>
                  </button>
                  <div className="w-[0px] h-[36px] border border-solid border-[rgba(1,44,111,0.1)] mx-[4px]"></div>
                  <button onClick={() => handleFormat('outdent')} className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[20px] text-[#5E5E5E]">format_indent_decrease</i>
                  </button>
                  <button onClick={() => handleFormat('indent')} className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[20px] text-[#5E5E5E]">format_indent_increase</i>
                  </button>
                  <div className="w-[0px] h-[36px] border border-solid border-[rgba(1,44,111,0.1)] mx-[4px]"></div>
                  <button onClick={() => {
                    const url = prompt('Enter link URL:');
                    if (url) handleFormat('createLink', url);
                  }} className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[20px] text-[#5E5E5E]">link</i>
                  </button>
                </div>
                <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-[calc(100%-32px)] mx-[16px] bg-[#FFFFFF] rounded-[16px] flex-1 mt-[8px]">
                  <div className="flex flex-row items-center p-[0px_16px] gap-[8px] w-full h-[48px] bg-[rgba(231,242,255,0.38)] rounded-[16px] border border-solid border-[#A8C7FA]" contentEditable={false}>
                    <div className="flex flex-row items-center p-[12px_0px] w-[24px] h-[48px]">
                      <i className="google-symbols text-[24px] leading-none" style={{ background: 'linear-gradient(60.06deg, #217BFE 19.36%, #078EFB 39.03%, #BD99FE 69.85%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>auto_awesome</i>
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#303030]">
                      AI-generated suggested topics
                    </div>
                  </div>
                  <div 
                    ref={agendaContentRef}
                    className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full outline-none whitespace-pre-wrap"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                  >
                    {customSectionContents && customSectionContents['meeting-agenda'] ? (
                      customSectionContents['meeting-agenda'].text
                    ) : (
                      <>
                        <p className="font-bold text-[#474747] mb-1 flex items-center gap-1">
                          Review of Last Meeting's Action Items:{' '}
                          <CitationBadge 
                            sources={[mockSource4]} 
                            onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'agenda-action-items' : null)}
                          />
                        </p>
                        <ul className="list-disc pl-5 mb-4 space-y-1 text-[#474747]">
                          <li>
                            <span className={`citation-highlight ${hoveredCitationId === 'agenda-action-progress' ? 'active' : ''}`}>
                              Briefly touch on progress for key items like the MER dashboard and 2026 growth goals.
                            </span>
                            <CitationBadge 
                              sources={[mockSource2]} 
                              onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'agenda-action-progress' : null)}
                            />
                          </li>
                        </ul>
                        <p className="font-bold text-[#474747] mb-1 flex items-center gap-1">
                          Current Performance Deep Dive (Last 14 Days):{' '}
                          <CitationBadge 
                            sources={[mockSource1, mockSource3]} 
                            onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'agenda-perf-deep' : null)}
                          />
                        </p>
                        <ul className="list-disc pl-5 mb-4 space-y-1 text-[#474747]">
                          <li>
                            <span className={`citation-highlight ${hoveredCitationId === 'agenda-rev-dip' ? 'active' : ''}`}>
                              Discuss the w/w revenue dip and declines in Performance Max and DVA.
                            </span>
                            <CitationBadge 
                              sources={[mockSource1]} 
                              onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'agenda-rev-dip' : null)}
                            />
                          </li>
                          <li>
                            <span className={`citation-highlight ${hoveredCitationId === 'agenda-paused-camps' ? 'active' : ''}`}>
                              Analyze paused campaigns in and the impact on spend.
                            </span>
                            <CitationBadge 
                              sources={[mockSource5]} 
                              onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'agenda-paused-camps' : null)}
                            />
                          </li>
                          {refinedSections['meeting-agenda'] && (
                            <li>
                              <span className={`citation-highlight ${hoveredCitationId === 'agenda-budget-inc' ? 'active' : ''}`}>
                                Review the budget increase and positive momentum in the Larroude BR - Google account.
                              </span>
                              <CitationBadge 
                                sources={[mockSource2, mockSource6]} 
                                onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'agenda-budget-inc' : null)}
                              />
                            </li>
                          )}
                        </ul>
                        <p className="font-bold text-[#474747] mb-1 flex items-center gap-1">
                          Troubleshooting & Account Health:{' '}
                          <CitationBadge 
                            sources={[mockSource3]} 
                            onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'agenda-troubleshoot' : null)}
                          />
                        </p>
                        <ul className="list-disc pl-5 mb-4 space-y-1 text-[#474747]">
                          <li>
                            <span className={`citation-highlight ${hoveredCitationId === 'agenda-policy-violation' ? 'active' : ''}`}>
                              There is a policy violation in 2 accounts due to website destination not working
                            </span>
                            <CitationBadge 
                              sources={[mockSource1, mockSource5]} 
                              onHoverChange={(hovered) => setHoveredCitationId(hovered ? 'agenda-policy-violation' : null)}
                            />
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-row justify-between items-center px-[24px] pt-4 border-t border-[#E8EAED] w-full mt-4">
                  <span className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
                    Last updated: Fri, May 14, 2026
                  </span>
                </div>

                <div className="flex flex-row items-end p-[8px_16px_16px] gap-[16px] w-full mt-auto">
                  <div className="flex flex-row flex-wrap items-center p-0 gap-[4px_8px] flex-1">
                  </div>
                  <div className="flex flex-row justify-end items-end p-[2px_0px] gap-[8px]">
                    <button 
                      onClick={handleCopy}
                      className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]"
                    >
                      <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                        <i className="google-symbols text-[20px] text-[#3271EA]">content_copy</i>
                        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                          Copy to clipboard
                        </span>
                      </div>
                    </button>
                    <button 
                      onClick={() => onPromptClick?.('Draft meeting agenda email for Neary Brands Bi-Weekly')}
                      className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]"
                    >
                      <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                          Draft meeting agenda email
                        </span>
                        <i className="google-symbols text-[20px] text-[#3271EA]">mail</i>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* Section 3: Suggested follow-ups */}
        <div 
          {...getSectionStyle('suggested-follow-ups', 'bg-[#E7F2FF]/[0.6]')}
          className={`${getSectionStyle('suggested-follow-ups', 'bg-[#E7F2FF]/[0.6]').className} w-full min-w-[380px]`}
        >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'suggested-follow-ups' ? 'opacity-30' : ''}`}>

              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] w-full h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#1B1B1C]">task_alt</i>
                  <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                    Suggested follow-ups
                  </div>
                </div>
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full flex items-center gap-1 whitespace-pre-wrap">
                  {customSectionContents && customSectionContents['suggested-follow-ups'] ? (
                    customSectionContents['suggested-follow-ups'].text
                  ) : (
                    <>
                      From the last recorded meeting on Mar 30, 2026, there were 4 action items identified for follow-up: <CitationBadge sources={[mockSource2]} />
                    </>
                  )}
                </div>
                
                <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[16px] w-full">
                  {/* Card 1 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[300px] h-[200px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      Add custom intent and in-market audience signals while increasing headlines and adding a sixth sitelink to PMax campaigns <CitationBadge sources={[mockSource3]} />
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 12, 2026</span>
                      <div className="flex flex-row items-center gap-[4px]">
                        <span className="font-['Google_Sans_Text'] font-normal text-[12px] text-[#5E5E5E] mr-1">Assigned to:</span>
                        <img className="w-[16px] h-[16px] rounded-[220px]" src="https://i.pravatar.cc/150?img=13" alt="Avatar" />
                        <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#5E5E5E]">Customer, Alex</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[300px] h-[200px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      Research and share the "ad variations" feature article to understand its limitations for testing ad copy without disrupting live experiments <CitationBadge sources={[mockSource6]} />
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 11, 2026</span>
                      <div className="flex flex-row items-center gap-[4px]">
                        <span className="font-['Google_Sans_Text'] font-normal text-[12px] text-[#5E5E5E] mr-1">Assigned to:</span>
                        <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#5E5E5E]">Unidentified</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[300px] h-[200px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      Discuss a potential YouTube awareness collaboration with Nick and Morgan to facilitate re-engagement between Google and Harmlin. The customer committed to this after the agent reported unsuccessful direct outreach attempts. <CitationBadge sources={[mockSource2, mockSource4]} />
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 14, 2026</span>
                      <div className="flex flex-row items-center gap-[4px]">
                        <span className="font-['Google_Sans_Text'] font-normal text-[12px] text-[#5E5E5E] mr-1">Assigned to:</span>
                        <img className="w-[16px] h-[16px] rounded-[220px]" src="https://i.pravatar.cc/150?img=13" alt="Avatar" />
                        <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#5E5E5E]">Customer, Alex</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full mt-auto">
                <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
                  <div 
                    onClick={() => onPromptClick?.('Tell me a full summary of the last meeting')}
                    className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                  >
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                      <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                        Tell me a full summary of the last meeting
                      </div>
                    </div>
                  </div>
                  <div 
                    onClick={() => onPromptClick?.('What is Acme’s sentiment with Google partnership so far this year')}
                    className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                  >
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                      <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                        What is Acme’s sentiment with Google partnership so far this year
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
                  {focusedSection?.id === 'suggested-follow-ups' ? (
                    <button 
                      className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                      onClick={() => onRefineClick?.('', '')}
                    >
                      Cancel refining
                    </button>
                  ) : (
                    <>
                      <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]">
                        <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                          <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                            Sources
                          </span>
                          <i className="google-symbols text-[20px] text-[#3271EA]">arrow_drop_down</i>
                        </div>
                      </button>
                      <button 
                        className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                        onClick={() => onRefineClick?.('suggested-follow-ups', 'Suggested follow-ups')}
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
          {sectionLoading === 'suggested-follow-ups' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Section 4: Critical blockers and open cases */}
        <div 
          {...getSectionStyle('critical-blockers', 'bg-[#E7F2FF]/[0.6]')}
          className={`${getSectionStyle('critical-blockers', 'bg-[#E7F2FF]/[0.6]').className} w-full min-w-[380px]`}
        >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'critical-blockers' ? 'opacity-30' : ''}`}>

              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] w-full h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#1B1B1C]">monitor_heart</i>
                  <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                    Critical blockers and open cases
                  </div>
                </div>
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full flex items-center gap-1">
                  From the last recorded meeting on Mar 30, 2026, there were 4 action items identified for follow-up: <CitationBadge sources={[mockSource1, mockSource5]} />
                </div>

                {/* Card 1: Disapproved Ads */}
                <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full bg-[#FFFFFF] rounded-[12px] relative">
                  {/* Header */}
                  <div className="flex flex-row items-center gap-[8px] w-full">
                    <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C]">
                      13 disapproved Ads due to destination accessibility policy violations
                    </div>
                    <div className="flex flex-row items-center gap-[8px]">
                      <span className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C]">(</span>
                      <div className="flex flex-row items-center gap-[4px]">
                        <div className="w-[24px] h-[16px] bg-[#5E5E5E] rounded-[2px] flex items-center justify-center text-white text-[8px] font-bold">GA</div>
                        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">1587456845</span>
                      </div>
                      <span className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C]">)</span>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex flex-row items-start gap-[16px] w-full">
                    {/* Scorecard */}
                    <div className="flex flex-col items-start p-[16px] w-[121px] bg-[#FFF8F8] rounded-[12px]">
                      <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Revenue impact</div>
                      <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] text-[#B3251E]">-$28.62</div>
                    </div>
                    {/* Diagnosed root cause */}
                    <div className="flex flex-col items-start gap-[8px] flex-1">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">Diagnosed root cause</div>
                      <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                        Policy scans indicate "Destination not working" and "Destination Not Accessible" errors across top-performing search campaigns. <CitationBadge sources={[mockSource1]} />
                      </div>
                    </div>
                    {/* Recommendation */}
                    <div className="flex flex-col items-start gap-[8px] flex-1">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">Recommendation</div>
                      <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                        Conduct a technical audit of landing page URLs and server response times for the affected campaigns to ensure consistent accessibility. <CitationBadge sources={[mockSource4]} />
                      </div>
                    </div>
                  </div>
                  {/* Footer Actions */}
                  <div className="flex flex-row items-center justify-between w-full mt-[8px] pt-3 border-t border-[#E8EAED]">
                    <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 15, 2026</span>
                    <div className="flex flex-row gap-[16px]">
                      <button className="flex flex-row items-center gap-[8px] bg-transparent border-none cursor-pointer hover:bg-black/5 p-[8px] rounded-[4px]">
                        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">View in Google Ads</span>
                        <i className="google-symbols text-[20px] text-[#3271EA]">open_in_new</i>
                      </button>
                      <button className="flex flex-row items-center gap-[8px] bg-transparent border-none cursor-pointer hover:bg-black/5 p-[8px] rounded-[4px]">
                        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">Important action</span>
                        <i className="google-symbols text-[20px] text-[#3271EA]">arrow_forward</i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 2: Stalled 1P audience */}
                <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full bg-[#FFFFFF] rounded-[12px] relative">
                  {/* Header */}
                  <div className="flex flex-row items-center gap-[8px] w-full">
                    <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C]">
                      Stalled 1P audience data integration
                    </div>
                    <div className="flex flex-row items-center gap-[8px]">
                      <span className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C]">(</span>
                      <div className="flex flex-row items-center gap-[4px]">
                        <div className="w-[24px] h-[16px] bg-[#5E5E5E] rounded-[2px] flex items-center justify-center text-white text-[8px] font-bold">GA</div>
                        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">1587456851</span>
                      </div>
                      <span className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C]">)</span>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex flex-row items-start gap-[16px] w-full">
                    {/* Description */}
                    <div className="flex flex-col items-start gap-[8px] flex-1">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">Description</div>
                      <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                        High-funnel awareness efficiency is limited by the inability to exclude existing customers in PMax campaigns <CitationBadge sources={[mockSource3]} />
                      </div>
                    </div>
                    {/* Diagnosed root cause */}
                    <div className="flex flex-col items-start gap-[8px] flex-1">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">Diagnosed root cause</div>
                      <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                        Legal review of the privacy policy transition to Volkswagen Group Japan is still pending, which blocks data sharing for Customer Match. <CitationBadge sources={[mockSource6]} />
                      </div>
                    </div>
                    {/* Recommendation */}
                    <div className="flex flex-col items-start gap-[8px] flex-1">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">Recommendation</div>
                      <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030]">
                        Escalate the policy update to Audi's legal and IT teams to unblock critical Audience Exclusion capabilities. <CitationBadge sources={[mockSource2]} />
                      </div>
                    </div>
                  </div>
                  {/* Footer Actions */}
                  <div className="flex flex-row items-center justify-between w-full mt-[8px] pt-3 border-t border-[#E8EAED]">
                    <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 14, 2026</span>
                    <div className="flex flex-row gap-[16px]">
                      <button className="flex flex-row items-center gap-[8px] bg-transparent border-none cursor-pointer hover:bg-black/5 p-[8px] rounded-[4px]">
                        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">View in Google Ads</span>
                        <i className="google-symbols text-[20px] text-[#3271EA]">open_in_new</i>
                      </button>
                      <button className="flex flex-row items-center gap-[8px] bg-transparent border-none cursor-pointer hover:bg-black/5 p-[8px] rounded-[4px]">
                        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">Important action</span>
                        <i className="google-symbols text-[20px] text-[#3271EA]">arrow_forward</i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Service Request Updates Sub-section */}
                <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1B1B1C] mt-[16px] w-full">
                  Service request updates:
                </div>

                <div className="flex flex-row gap-[16px] w-full">
                  {/* Card 1 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center p-[4px] gap-[2px] bg-[#F2F2F2] rounded-[4px]">
                        <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#303030] px-[4px]">Created May 1, 2026</span>
                      </div>
                      <CitationBadge sources={[mockSource5]} />
                    </div>
                    <div className="flex flex-row items-center gap-[4px] w-full">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">Case ID 2-7276000040532</div>
                      <i className="google-symbols text-[24px] text-[#1B1B1C]">open_in_new</i>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 15, 2026</span>
                      <div className="flex flex-row items-center gap-[4px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Assigned to:</div>
                        <img className="w-[16px] h-[16px] rounded-full" src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
                        <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Rockey Carmichael</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center p-[4px] gap-[2px] bg-[#F2F2F2] rounded-[4px]">
                        <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#303030] px-[4px]">Created Apr 28, 2026</span>
                      </div>
                      <CitationBadge sources={[mockSource2]} />
                    </div>
                    <div className="flex flex-row items-center gap-[4px] w-full">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">Case ID 6-1257000040650</div>
                      <i className="google-symbols text-[24px] text-[#1B1B1C]">open_in_new</i>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 13, 2026</span>
                      <div className="flex flex-row items-center gap-[4px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Assigned to:</div>
                        <img className="w-[16px] h-[16px] rounded-full" src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
                        <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Rockey Carmichael</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center p-[4px] gap-[2px] bg-[#F2F2F2] rounded-[4px]">
                        <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#303030] px-[4px]">Resolved May 5, 2026</span>
                      </div>
                      <CitationBadge sources={[mockSource6]} />
                    </div>
                    <div className="flex flex-row items-center gap-[4px] w-full">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">Case ID 4-8701000039834</div>
                      <i className="google-symbols text-[24px] text-[#1B1B1C]">open_in_new</i>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 10, 2026</span>
                      <div className="flex flex-row items-center gap-[4px]">
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Assigned to:</div>
                        <img className="w-[16px] h-[16px] rounded-full" src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
                        <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Rockey Carmichael</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full mt-auto">
                <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
                  <div 
                    onClick={() => onPromptClick?.(`Tell me the number of policy issues and cases ${companyName} had in the last 6 months`)}
                    className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                  >
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                      <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                        Tell me the number of policy issues and cases {companyName} had in the last 6 months
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
                  {focusedSection?.id === 'critical-blockers' ? (
                    <button 
                      className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                      onClick={() => onRefineClick?.('', '')}
                    >
                      Cancel refining
                    </button>
                  ) : (
                    <>
                      <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]">
                        <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                          <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                            Sources
                          </span>
                          <i className="google-symbols text-[20px] text-[#3271EA]">arrow_drop_down</i>
                        </div>
                      </button>
                      <button 
                        className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                        onClick={() => onRefineClick?.('critical-blockers', 'Critical blockers and open cases')}
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
          {sectionLoading === 'critical-blockers' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Section 6: Pitch recommendations */}
        <div 
          {...getSectionStyle('pitch-recommendations', 'bg-[#E7F2FF]/[0.6]')}
          className={`${getSectionStyle('pitch-recommendations', 'bg-[#E7F2FF]/[0.6]').className} w-full min-w-[380px] rounded-[16px] flex flex-col items-start p-0 relative`}
        >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'pitch-recommendations' ? 'opacity-30' : ''}`}>

              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] w-full h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#1B1B1C]">handshake</i>
                  <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                    Pitch recommendations
                  </div>
                </div>
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                    <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                      <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                        {selectedDateRange}
                      </div>
                    </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                <div className="flex flex-col items-start p-0 gap-[8px] w-full">
                  <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full flex items-center gap-1">
                    These recommendations focus on driving a combined $83.8k in revenue uplift by increasing AI Max adoption and expanding into multi-lingual search campaigns with a $1,000 daily budget. To ensure these growth efforts are tracked accurately, the plan also includes implementing Enhanced Conversions for Web in GA4 to bridge measurement gaps for the {companyName} US-W account. <CitationBadge sources={[mockSource3, mockSource4]} />
                  </div>
                  <div className="flex flex-row flex-wrap items-start content-start p-[8px_0px] gap-[4px_8px] w-full">
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#ACEDFF] rounded-[8px] cursor-pointer">
                      <i className="google-symbols text-[18px] text-[#012C6F]">check</i>
                      <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#012C6F]">
                        Top pitch suggestions
                      </div>
                    </div>
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]">
                      <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                        Measurement setup
                      </div>
                    </div>
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]">
                      <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                        Campaign optimizations
                      </div>
                    </div>
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]">
                      <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                        Policy issues
                      </div>
                    </div>
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]">
                      <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                        Upsell
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start p-0 gap-[4px] w-full">
                  
                  {/* Panel 1 */}
                  <div className={`flex flex-col items-start p-[0px_0px_8px] w-full bg-[#FFFFFF] ${expandedPanels.panel1 ? 'rounded-[8px_8px_4px_4px]' : 'rounded-[8px]'}`}>
                    <div 
                      className="flex flex-row items-center p-[8px_0px] gap-[24px] w-full h-[80px] rounded-[8px] cursor-pointer"
                      onClick={() => togglePanel('panel1')}
                    >
                      <div className="flex flex-row items-center p-[0px_0px_0px_24px] w-[592px] h-[64px]">
                        <div className="flex flex-col justify-center items-start p-0 w-[570px] h-[64px]">
                          <div className="flex flex-row items-center p-0 gap-[8px] w-full h-[32px]">
                            <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#000000]">
                              Adopt AI Max
                            </div>
                          </div>
                          <div className="font-['Google_Sans_Text'] font-medium text-[11px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] w-full h-[32px] flex items-center">
                            AI Max depth is currently at 26%. Uses Smart Bidding, wants to grow, is concerned about declining ROAS and conversion rate of AI Max traffic.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center p-0 gap-[8px] flex-1 h-[0px]">
                        <div className="w-full h-[0px] border-t border-dashed border-[#A1C9FF]"></div>
                      </div>
                      <div className="flex flex-row justify-end items-center p-[0px_24px_0px_0px] gap-[32px] w-[248px] h-[44px]">
                        <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                          <div className="flex flex-row items-start p-0 gap-[4px] w-full h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Revenue uplift</div>
                          </div>
                          <div className="flex flex-row items-end p-0 gap-[4px] w-full h-[28px]">
                            <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">+$47k</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                          <div className="flex flex-row items-start p-0 gap-[4px] w-full h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Predicted points</div>
                          </div>
                          <div className="flex flex-row items-end p-0 gap-[4px] w-full h-[28px]">
                            <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">~104 pts</div>
                          </div>
                        </div>
                      </div>
                      <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                        <i className="google-symbols text-[24px] leading-[50px] flex items-center text-center text-[#5E5E5E]">
                          {expandedPanels.panel1 ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </i>
                      </button>
                    </div>

                    {expandedPanels.panel1 && (
                      <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                        <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-full">What to pitch:</div>
                        <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                          <li><strong>Top eligible campaign:</strong> Search_Shoes_3/14<i className="google-symbols text-[16px] align-middle ml-1">open_in_new</i>. 6% of advertiser’s 30-day spend as of 12/5, utilizes 85% of its budget, but does not use AI Max. <CitationBadge sources={[mockSource1]} /></li>
                        </ul>
                        <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full pl-[24px]">
                          Expand campaign performance details
                        </div>
                        <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                          <li><strong>Action:</strong> Upgrade to AI Max, to double down on the positive momentum in reaching more potential customers at the same or higher ROAS. <strong>Activate now to be fully ready to capture new demand from MLK Sales Promotion event.</strong> <CitationBadge sources={[mockSource2]} /></li>
                          <li><strong>Benefit:</strong> An estimated $450 daily conversion value is estimated as advertisers that activate AI Max in Search campaigns will typically see 14% uplift <CitationBadge sources={[mockSource3]} /></li>
                        </ul>
                        <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full pl-[24px]">
                          Show all campaigns without AI Max
                        </div>
                        <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full pl-[24px]">
                          See Optiscore
                        </div>
                        <div className="flex flex-col items-start p-0 gap-[8px] w-full">
                          <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-full">How to pitch:</div>
                          <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                            <li><strong>Peer adoption:</strong> <span className="bg-[#E6F4EA] px-1">Over 60% customers in fashion vertical have AI Max turned on.</span> Advertisers that activate AI Max in Search campaigns will typically see 14% more conversions or conversion value at a similar CPA/ROAS. For campaigns that are still mostly using exact and phrase keywords, the typical uplift is even higher at 27% <CitationBadge sources={[mockSource2]} /></li>
                            <li><strong>Past adoption:</strong> <span className="bg-[#E6F4EA] px-1">Campaign Search_Hat_6/14<i className="google-symbols text-[16px] align-middle ml-1">open_in_new</i> adopted AI Max on 8/15, and observed a 15% increase in conversions in the 30 days after adoption.</span> Targeting change was a likely contributor to the performance uplift based on Ads Explanation data <CitationBadge sources={[mockSource4]} /></li>
                            <li><strong>Asset Readiness:</strong> Customer already has 2 image assets that can be used for the campaign. To create required video assets, leverage free gTech Service<i className="google-symbols text-[16px] align-middle ml-1">open_in_new</i>, Brand Studio<i className="google-symbols text-[16px] align-middle ml-1">open_in_new</i> in Google Ads. <CitationBadge sources={[mockSource5]} /></li>
                          </ul>
                        </div>
                        <div className="flex flex-row justify-between items-center p-[0px_16px] gap-[8px] w-full h-[36px] bg-[rgba(0,53,73,0.04)] rounded-[100px]">
                          <div className="flex flex-row items-center p-0 h-[36px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] flex items-center text-center text-[#474747] mr-[8px]">
                              How do you like this pitch recommendation?
                            </div>
                            <button className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                              <i className="google-symbols text-[20px] leading-[50px] flex items-center text-center text-[#5E5E5E]">thumb_up</i>
                            </button>
                            <button className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                              <i className="google-symbols text-[20px] leading-[50px] flex items-center text-center text-[#5E5E5E]">thumb_down</i>
                            </button>
                          </div>
                          <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] underline text-[#1B1B1C] cursor-pointer">
                              Key talking point
                            </div>
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
                              •
                            </div>
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
                              Generated 1d ago
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Panel 2 */}
                  <div className={`flex flex-col items-start p-[0px_0px_8px] w-full bg-[#FFFFFF] ${expandedPanels.panel2 ? 'rounded-[8px_8px_4px_4px]' : 'rounded-[8px]'}`}>
                    <div 
                      className="flex flex-row items-center p-[8px_0px] gap-[24px] w-full h-[80px] rounded-[8px] cursor-pointer"
                      onClick={() => togglePanel('panel2')}
                    >
                      <div className="flex flex-row items-center p-[0px_0px_0px_24px] w-[592px] h-[64px]">
                        <div className="flex flex-col justify-center items-start p-0 w-[570px] h-[64px]">
                          <div className="flex flex-row items-center p-0 gap-[8px] w-full h-[32px]">
                            <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#000000]">
                              Expand to multi-lingual search
                            </div>
                          </div>
                          <div className="font-['Google_Sans_Text'] font-medium text-[11px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] w-full h-[32px] flex items-center">
                            Opportunity to expand campaigns targeting Spanish speakers in the US.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center p-0 gap-[8px] flex-1 h-[0px]">
                        <div className="w-full h-[0px] border-t border-dashed border-[#A1C9FF]"></div>
                      </div>
                      <div className="flex flex-row justify-end items-center p-[0px_24px_0px_0px] gap-[32px] w-[248px] h-[44px]">
                        <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                          <div className="flex flex-row items-start p-0 gap-[4px] w-full h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Revenue uplift</div>
                          </div>
                          <div className="flex flex-row items-end p-0 gap-[4px] w-full h-[28px]">
                            <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">+$30k</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                          <div className="flex flex-row items-start p-0 gap-[4px] w-full h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Predicted points</div>
                          </div>
                          <div className="flex flex-row items-end p-0 gap-[4px] w-full h-[28px]">
                            <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">~55 pts</div>
                          </div>
                        </div>
                      </div>
                      <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                        <i className="google-symbols text-[24px] leading-[50px] flex items-center text-center text-[#5E5E5E]">
                          {expandedPanels.panel2 ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </i>
                      </button>
                    </div>

                    {expandedPanels.panel2 && (
                      <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                        <div className="flex flex-col items-start p-0 gap-[8px] w-full">
                          <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-full">What to pitch:</div>
                          <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                            <li><strong>Top eligible campaign:</strong> Search_English_US_1/14<i className="google-symbols text-[16px] align-middle ml-1">open_in_new</i>. High performing campaign targeting English speakers in the US. <CitationBadge sources={[mockSource4]} /></li>
                          </ul>
                          <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full pl-[24px]">
                            Expand campaign performance details
                          </div>
                          <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                            <li><strong>Action:</strong> Duplicate top-performing English campaigns and translate keywords/ad copy to Spanish. Target Spanish speakers in the US. <CitationBadge sources={[mockSource1]} /></li>
                            <li><strong>Benefit:</strong> Reach a large, untapped demographic. Expected to generate an additional $30k in revenue with a daily budget of $1000. <CitationBadge sources={[mockSource6]} /></li>
                          </ul>
                        </div>
                        <div className="flex flex-col items-start p-0 gap-[8px] w-full">
                          <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-full">How to pitch:</div>
                          <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                            <li><strong>Market Opportunity:</strong> <span className="bg-[#E6F4EA] px-1">The US Hispanic market represents a significant growth opportunity.</span> Many competitors are not fully capitalizing on Spanish-language search queries. <CitationBadge sources={[mockSource3]} /></li>
                            <li><strong>Translation Support:</strong> <span className="bg-[#E6F4EA] px-1">Leverage Google's translation tools and services.</span> We can assist in translating top-performing ad copy and keywords to ensure cultural relevance and accuracy. <CitationBadge sources={[mockSource5]} /></li>
                            <li><strong>Asset Readiness:</strong> Customer already has visual assets that can be reused. We just need to update the text overlays and ad copy. <CitationBadge sources={[mockSource2]} /></li>
                          </ul>
                        </div>
                        <div className="flex flex-row justify-between items-center p-[0px_16px] gap-[8px] w-full h-[36px] bg-[rgba(0,53,73,0.04)] rounded-[100px]">
                          <div className="flex flex-row items-center p-0 h-[36px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] flex items-center text-center text-[#474747] mr-[8px]">
                              How do you like this pitch recommendation?
                            </div>
                            <button className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                              <i className="google-symbols text-[20px] leading-[50px] flex items-center text-center text-[#5E5E5E]">thumb_up</i>
                            </button>
                            <button className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                              <i className="google-symbols text-[20px] leading-[50px] flex items-center text-center text-[#5E5E5E]">thumb_down</i>
                            </button>
                          </div>
                          <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] underline text-[#1B1B1C] cursor-pointer">
                              Key talking point
                            </div>
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
                              •
                            </div>
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
                              Generated 1d ago
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Panel 3 */}
                  <div className={`flex flex-col items-start p-[0px_0px_8px] w-full bg-[#FFFFFF] ${expandedPanels.panel3 ? 'rounded-[4px_4px_8px_8px]' : 'h-[80px] rounded-[4px_4px_8px_8px] overflow-hidden'}`}>
                    <div 
                      className="flex flex-row items-center p-[8px_0px] gap-[24px] w-full h-[80px] rounded-[8px] cursor-pointer shrink-0"
                      onClick={() => togglePanel('panel3')}
                    >
                      <div className="flex flex-row items-center p-[0px_0px_0px_24px] w-[592px] h-[64px]">
                        <div className="flex flex-col justify-center items-start p-0 w-[570px] h-[64px]">
                          <div className="flex flex-row items-center p-0 gap-[8px] w-full h-[32px]">
                            <div className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#000000]">
                              Enhanced Conversions for Web in GA4
                            </div>
                          </div>
                          <div className="font-['Google_Sans_Text'] font-medium text-[11px] leading-[16px] tracking-[0.1px] flex items-center text-[#5E5E5E] w-full h-[32px]">
                            6 conversion actions in account {companyName} US-W can adopt EC4W. This can help fill measurement gaps by matching hashed first-party data.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center p-0 gap-[8px] flex-1 h-[0px]">
                        <div className="w-full h-[0px] border-t border-dashed border-[#A1C9FF]"></div>
                      </div>
                      <div className="flex flex-row justify-end items-center p-[0px_24px_0px_0px] gap-[32px] w-[248px] h-[44px]">
                        <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                          <div className="flex flex-row items-start p-0 gap-[4px] w-full h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Revenue uplift</div>
                          </div>
                          <div className="flex flex-row items-end p-0 gap-[4px] w-full h-[28px]">
                            <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">+$6.8k</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start p-0 w-[96px] h-[44px]">
                          <div className="flex flex-row items-start p-0 gap-[4px] w-full h-[16px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">Predicted points</div>
                          </div>
                          <div className="flex flex-row items-end p-0 gap-[4px] w-full h-[28px]">
                            <div className="font-['Google_Sans'] font-normal text-[22px] leading-[28px] flex items-center text-[#1B1B1C]">~55 pts</div>
                          </div>
                        </div>
                      </div>
                      <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                        <i className="google-symbols text-[24px] leading-[50px] flex items-center text-center text-[#5E5E5E]">
                          {expandedPanels.panel3 ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </i>
                      </button>
                    </div>

                    {expandedPanels.panel3 && (
                      <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                        <div className="flex flex-col items-start p-0 gap-[8px] w-full">
                          <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-full">What to pitch:</div>
                          <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                            <li><strong>Top eligible account:</strong> {companyName} US-W. 6 conversion actions are currently eligible for Enhanced Conversions for Web. <CitationBadge sources={[mockSource5]} /></li>
                          </ul>
                          <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full pl-[24px]">
                            Expand conversion action details
                          </div>
                          <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                            <li><strong>Action:</strong> Implement Enhanced Conversions for Web in GA4 to improve the accuracy of conversion measurement and unlock more powerful bidding. <CitationBadge sources={[mockSource4]} /></li>
                            <li><strong>Benefit:</strong> Recover conversions that otherwise wouldn't have been measured. Advertisers typically see a 5% increase in reported conversions for Search. <CitationBadge sources={[mockSource1]} /></li>
                          </ul>
                        </div>
                        <div className="flex flex-col items-start p-0 gap-[8px] w-full">
                          <div className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] text-[#1B1B1C] w-full">How to pitch:</div>
                          <ul className="list-disc pl-[24px] m-0 font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#1B1B1C] w-full space-y-[8px]">
                            <li><strong>Data Privacy:</strong> <span className="bg-[#E6F4EA] px-1">EC4W uses a secure one-way hashing algorithm.</span> First-party customer data is hashed before it is sent to Google, ensuring privacy and compliance. <CitationBadge sources={[mockSource6]} /></li>
                            <li><strong>Implementation Support:</strong> <span className="bg-[#E6F4EA] px-1">Setup can be done via Google Tag Manager or the Google tag.</span> We can provide step-by-step guides and technical support to ensure a smooth implementation. <CitationBadge sources={[mockSource2]} /></li>
                            <li><strong>Future-Proofing:</strong> As third-party cookies are phased out, relying on first-party data through solutions like EC4W is critical for maintaining measurement accuracy. <CitationBadge sources={[mockSource3]} /></li>
                          </ul>
                        </div>
                        <div className="flex flex-row justify-between items-center p-[0px_16px] gap-[8px] w-full h-[36px] bg-[rgba(0,53,73,0.04)] rounded-[100px]">
                          <div className="flex flex-row items-center p-0 h-[36px]">
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] flex items-center text-center text-[#474747] mr-[8px]">
                              How do you like this pitch recommendation?
                            </div>
                            <button className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                              <i className="google-symbols text-[20px] leading-[50px] flex items-center text-center text-[#5E5E5E]">thumb_up</i>
                            </button>
                            <button className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] min-w-[32px] min-h-[32px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-black/5">
                              <i className="google-symbols text-[20px] leading-[50px] flex items-center text-center text-[#5E5E5E]">thumb_down</i>
                            </button>
                          </div>
                          <div className="flex flex-row justify-end items-center p-0 gap-[8px] h-[20px]">
                            <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] underline text-[#1B1B1C] cursor-pointer">
                              Key talking point
                            </div>
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
                              •
                            </div>
                            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#1B1B1C]">
                              Generated 1d ago
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
                <div className="flex flex-row justify-between items-center px-[24px] pt-4 border-t border-[#E8EAED] w-full mt-4">
                  <span className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
                    Last updated: Sat, May 15, 2026
                  </span>
                </div>
              </div>

              <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full mt-auto">
                <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
                  <div 
                    onClick={() => onPromptClick?.(`What product offerings have been most successful for ${companyName}?`)}
                    className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                  >
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                      <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                        What product offerings have been most successful for {companyName}?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
                  {focusedSection?.id === 'pitch-recommendations' ? (
                    <button 
                      className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                      onClick={() => onRefineClick?.('', '')}
                    >
                      Cancel refining
                    </button>
                  ) : (
                    <>
                      <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]">
                        <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                          <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                            Sources
                          </span>
                          <i className="google-symbols text-[20px] text-[#3271EA]">arrow_drop_down</i>
                        </div>
                      </button>
                      <button 
                        className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                        onClick={() => onRefineClick?.('pitch-recommendations', 'Pitch recommendations')}
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
          {sectionLoading === 'pitch-recommendations' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Section 7: Relevant news since you last met */}
        <div 
          {...getSectionStyle('relevant-news', 'bg-[#E7F2FF]/[0.6]')}
          className={`${getSectionStyle('relevant-news', 'bg-[#E7F2FF]/[0.6]').className} w-full min-w-[380px]`}
        >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'relevant-news' ? 'opacity-30' : ''}`}>

              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] w-full h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#1B1B1C]">article</i>
                  <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                    Relevant news since you last met
                  </div>
                </div>
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                  <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                    <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                    <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                      {selectedDateRange}
                    </div>
                  </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full flex items-center gap-1">
                  Recent market data highlights {companyName}'s leadership in sustainable circularity and AI-driven customer experiences, though new competition in ultra-fast delivery remains a key strategic hurdle. These articles illustrate how the brand is successfully navigating 2026's shift toward high-tech transparency and "slow fashion" values. <CitationBadge sources={[mockSource2, mockSource6]} />
                </div>

                <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[16px] w-full">
                  {/* Card 1 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[380px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center p-0 gap-[2px]">
                        <div className="w-[16px] h-[16px] bg-gray-200 rounded-sm flex items-center justify-center text-[10px] font-bold">D</div>
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                          www.deemnews.com
                        </div>
                      </div>
                      <CitationBadge sources={[mockSource1]} />
                    </div>
                    <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C] w-full">
                      {companyName} to Pilot AI-Powered "Virtual Style Twins" to Combat Rising Return Rates
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      By leveraging generative AI for high-fidelity fit recommendations, {companyName} aims to solve the industry's $30 billion sizing crisis and significantly reduce e-commerce returns.
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 14, 2026</span>
                      <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                        Published 2 days ago
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[380px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center p-0 gap-[2px]">
                        <div className="w-[16px] h-[16px] bg-gray-200 rounded-sm flex items-center justify-center text-[10px] font-bold">C</div>
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                          www.clothingandfashion.com
                        </div>
                      </div>
                      <CitationBadge sources={[mockSource4]} />
                    </div>
                    <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C] w-full">
                      Industry Leader: {companyName} Achieves Full Supply Chain Traceability Ahead of 2027 US Mandate
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      Currently awaiting confirmation of the The company has successfully integrated Digital Product Passports (DPP) across its entire 2026 collection, providing customers with radical transparency into material origins and ethi...
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 11, 2026</span>
                      <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                        Published 5 days ago
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[380px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center p-0 gap-[2px]">
                        <div className="w-[16px] h-[16px] bg-gray-200 rounded-sm flex items-center justify-center text-[10px] font-bold">S</div>
                        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                          www.sunhorizonnews.com
                        </div>
                      </div>
                      <CitationBadge sources={[mockSource3]} />
                    </div>
                    <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C] w-full">
                      {companyName} Secures Midwest Partnership to Enable 4-Hour "Quick Commerce" Deliveries
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      As "ultra-fast" fulfillment becomes a competitive necessity in the 2026 market, {companyName} is pivoting its distribution model to meet the immediate-gratification expectations of Gen Z shoppers.
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 4, 2026</span>
                      <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                        Published 12 days ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full mt-auto">
                <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
                  <div 
                    onClick={() => onPromptClick?.(`What is ${companyName} strategic business objectives this year?`)}
                    className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                  >
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                      <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                        What is {companyName} strategic business objectives this year?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
                  {focusedSection?.id === 'relevant-news' ? (
                    <button 
                      className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                      onClick={() => onRefineClick?.('', '')}
                    >
                      Cancel refining
                    </button>
                  ) : (
                    <>
                      <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]">
                        <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                          <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                            Sources
                          </span>
                          <i className="google-symbols text-[20px] text-[#3271EA]">arrow_drop_down</i>
                        </div>
                      </button>
                      <button 
                        className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                        onClick={() => onRefineClick?.('relevant-news', 'Relevant news since you last met')}
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
          {sectionLoading === 'relevant-news' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Section 8: New product launches */}
        <div 
          {...getSectionStyle('new-product-launches', 'bg-[#E7F2FF]/[0.6]')}
          className={`${getSectionStyle('new-product-launches', 'bg-[#E7F2FF]/[0.6]').className} w-full min-w-[380px]`}
        >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'new-product-launches' ? 'opacity-30' : ''}`}>

              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] w-full h-[48px]">
                  <i className="google-symbols text-[24px] leading-none text-[#1B1B1C]">rocket_launch</i>
                  <div className="font-['Google_Sans'] font-medium text-[28px] leading-[36px] flex items-center text-[#000000]">
                    New product launches
                  </div>
                </div>
                <div className="flex flex-row justify-end items-center p-0 gap-[8px] flex-1 h-[48px]">
                    <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                      <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                        {selectedDateRange}
                      </div>
                    </div>
                  <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full flex items-center gap-1">
                  Based on {companyName} focus on "Quick Commerce" and 2026 planning, there are 5 relevant Google Ads product launches that launched recently: <CitationBadge sources={[mockSource5]} />
                </div>

                <div className="flex flex-row flex-wrap items-start content-start p-0 gap-[16px] w-full">
                  {/* Card 1 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[380px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">
                        Ads (VA) Price Drop Badge
                      </div>
                      <CitationBadge sources={[mockSource3]} />
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      Eligible for {companyName} US-W to showcase a price drop badge in the clothing feed to increase CTR, launching in Q2 2026.
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 15, 2026</span>
                      <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                        Launched Feb 20, 2026
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[380px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">
                        PMax Smart Bidding Exploration for Search
                      </div>
                      <CitationBadge sources={[mockSource1]} />
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      Eligible for {companyName} US-SE using tROAS to capture incremental search traffic that might otherwise be missed due to strict target constraints.
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 12, 2026</span>
                      <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                        Launched Feb 16, 2026
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="flex flex-col items-start p-[24px] gap-[16px] flex-1 min-w-[380px] bg-[#FFFFFF] rounded-[8px] relative">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">
                        PMax Video Asset Limit Increase
                      </div>
                      <CitationBadge sources={[mockSource6]} />
                    </div>
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#474747] w-full">
                      (GA - Feb 2026). The limit has increased from 5 to 15 assets, allowing {companyName} to test more model-specific creative variations to improve Ad Strength. Lea...
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-auto pt-3 border-t border-[#E8EAED]">
                      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">Last updated: May 8, 2026</span>
                      <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E]">
                        Launched Feb 4, 2026
                      </div>
                    </div>
                  </div>
                </div>

                <button className="flex flex-row items-center p-0 gap-[8px] bg-transparent border-none cursor-pointer mt-[8px]">
                  <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                    Show 2 more
                  </span>
                </button>
                <div className="flex flex-row justify-between items-center px-[24px] pt-4 border-t border-[#E8EAED] w-full mt-4">
                  <span className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
                    Last updated: Sat, May 15, 2026
                  </span>
                </div>
              </div>

              <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full mt-auto">
                <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] flex-1">
                  <div 
                    onClick={() => onPromptClick?.(`What types of product offerings are successful with ${companyName}?`)}
                    className="box-border flex flex-row items-center p-0 h-[32px] min-h-[24px] bg-[#FFFFFF] border border-[#DADCE0] rounded-full cursor-pointer hover:bg-[#F8F9FA]"
                  >
                    <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
                      <i className="google-symbols text-[18px] leading-none text-[#1A73E8] flex items-center text-center">prompt_suggestion</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043]">
                        What types of product offerings are successful with {companyName}?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-end items-end p-0 gap-[8px]">
                  {focusedSection?.id === 'new-product-launches' ? (
                    <button 
                      className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                      onClick={() => onRefineClick?.('', '')}
                    >
                      Cancel refining
                    </button>
                  ) : (
                    <>
                      <button className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[100px] bg-transparent border-none cursor-pointer hover:bg-[rgba(50,113,234,0.04)]">
                        <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                          <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3271EA]">
                            Sources
                          </span>
                          <i className="google-symbols text-[20px] text-[#3271EA]">arrow_drop_down</i>
                        </div>
                      </button>
                      <button 
                        className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                        onClick={() => onRefineClick?.('new-product-launches', 'New product launches')}
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
          {sectionLoading === 'new-product-launches' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Section 9: What else would you like to add? */}
        <div 
          {...getSectionStyle('what-else', 'bg-[#E7F2FF]/[0.6]')}
          className={`${getSectionStyle('what-else', 'bg-[#E7F2FF]/[0.6]').className} w-full min-w-[380px]`}
        >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'what-else' ? 'opacity-30' : ''}`}>

              <div className="flex flex-row items-center p-[8px_0px] w-full h-[64px]">
                <div className="flex flex-row items-center p-[0px_24px] gap-[8px] w-full h-[48px]">
                  <div className="font-['Google_Sans'] font-normal text-[20px] leading-[24px] flex items-center text-[#1F1F1F]">
                    What else would you like to add?
                  </div>
                  <div className="flex flex-row justify-end items-center p-0 gap-[8px] ml-auto h-[48px]">
                    <div className="flex flex-row items-center p-[0px_12px] gap-[6px] h-[32px] min-h-[24px] select-none mr-2">
                      <i className="google-symbols text-[18px] leading-none text-[#5F6368]">calendar_today</i>
                      <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#5F6368] whitespace-nowrap">
                        {selectedDateRange}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start p-[16px_24px] gap-[16px] w-full">
                <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#303030] w-full flex items-center gap-1">
                  Click on a chip below to add additional helpful content to the canvas that will help you with your diagnosis. You can also ask Connect AI to add content to the canvas. <a href="#" className="text-[#3271EA] no-underline">Learn more</a> <CitationBadge sources={[mockSource2, mockSource4]} />
                </div>
              </div>

              <div className="flex flex-row items-end p-[8px_24px_16px] gap-[16px] w-full mt-auto">
                <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px_8px] w-full">
                  <button className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[18px] text-[#1157CE]">add_box</i>
                    <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                      Conversation insights summary
                    </span>
                  </button>

                  <button className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[18px] text-[#1157CE]">add_box</i>
                    <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                      Social media campaign highlights
                    </span>
                  </button>

                  <button className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[18px] text-[#1157CE]">add_box</i>
                    <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                      Pipeline summary
                    </span>
                  </button>

                  <button className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[18px] text-[#1157CE]">add_box</i>
                    <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                      Multi-quarter plan summary
                    </span>
                  </button>

                  <button className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[18px] text-[#1157CE]">add_box</i>
                    <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                      {companyName} Stakeholder summary
                    </span>
                  </button>

                  <button className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] bg-[#FFFFFF] border border-[#ABABAB] rounded-[8px] cursor-pointer hover:bg-black/5">
                    <i className="google-symbols text-[18px] text-[#1157CE]">add_box</i>
                    <span className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#474747]">
                      Share of traffic summary
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center px-[24px] pt-4 border-t border-[#E8EAED] w-full mt-4">
                <span className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
                  Last updated: Sat, May 15, 2026
                </span>
              </div>
          </div>
          {sectionLoading === 'what-else' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        </div>
      </div>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#333333] text-white px-4 py-3 rounded-[4px] shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_6px_10px_0_rgba(0,0,0,0.14),0_1px_18px_0_rgba(0,0,0,0.12)] font-['Google_Sans_Text'] text-[14px] transition-all duration-300 ease-in-out z-50 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        Copied to clipboard
      </div>
    </div>
  );
};
