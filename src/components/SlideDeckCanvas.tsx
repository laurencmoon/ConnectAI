import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { CitationBadge, Source } from './CitationBadge';
import { RefinedSectionResult } from '../services/gemini';

export const SlideDeckCanvas = ({
  onClose,
  companyName = 'Nike',
  focusedSection,
  onRefineClick,
  sectionLoading,
  customSectionContents,
  onPromptClick
}: {
  onClose: () => void,
  companyName?: string,
  focusedSection?: { id: string; title: string } | null,
  onRefineClick?: (id: string, title: string) => void,
  sectionLoading?: string | null,
  customSectionContents?: Record<string, RefinedSectionResult>,
  onPromptClick?: (text: string) => void
}) => {
  // Local date picker state for header
  const [selectedDateRange, setSelectedDateRange] = useState('Jan 1 - today');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [openDatePickerCardId, setOpenDatePickerCardId] = useState<string | null>(null);
  const [openSourcesCardId, setOpenSourcesCardId] = useState<string | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Mock sources for slide deck citations
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
    transcriptSnippet: 'We need to establish a premium digital footprint this quarter to outpace competitors in non-branded searches.'
  };

  const mockSource3: Source = {
    id: '3',
    type: 'slides',
    title: 'Media Pitch Deck',
    url: 'https://example.com/slides',
    lastUpdated: 'May 12, 2026'
  };

  const mockSource4: Source = {
    id: '4',
    type: 'docs',
    title: 'Account Health Review',
    url: 'https://example.com/docs',
    lastUpdated: 'Mar 12, 2026'
  };

  // Click outside listener for date picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Render helper for section headers (Slide card headers)
  const renderSlideHeader = (id: string, title: string) => (
    <div className="flex flex-row items-center p-[12px_24px] w-full h-[64px] border-b border-[#DADCE0] bg-white">
      <div className="flex flex-row items-center gap-[8px] flex-1">
        <i className="google-symbols text-[24px] leading-none" style={{ background: 'linear-gradient(60deg, #1157CE 20%, #4E8FF8 50%, #9254EA 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>drive_presentation</i>
        <div className="font-['Google_Sans'] font-medium text-[22px] leading-[28px] text-[#1B1B1C]">
          {title}
        </div>
      </div>
      <div className="flex flex-row justify-end items-center p-0 gap-[8px]">
        <button className="flex flex-col justify-center items-center p-[8px] w-[48px] h-[48px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
          <i className="google-symbols text-[24px] leading-none text-[#5E5E5E]">more_vert</i>
        </button>
      </div>
    </div>
  );

  // Render helper for section footers (Slide card footers aligned horizontally on one single line)
  const renderSlideFooter = (id: string, title: string, sources: Source[]) => (
    <div className="flex flex-row justify-between items-center w-full border-t border-[#DADCE0] pt-4 mt-auto bg-white p-[0px_24px_16px]">
      <span className="font-['Roboto'] font-normal text-[11px] text-[#5F6368]">
        Last updated: May 18, 2026
      </span>
      <div className="flex flex-row justify-end items-center gap-[8px] relative">
        {focusedSection?.id === id ? (
          <button
            className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none mr-2"
            onClick={() => onRefineClick?.('', '')}
          >
            Cancel refining
          </button>
        ) : (
          <>
            <div className="relative">
              <button
                onClick={() => setOpenSourcesCardId(openSourcesCardId === id ? null : id)}
                className="flex flex-row justify-center items-center px-3 h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5 text-[#1A73E8] font-['Google_Sans'] font-medium text-[14px]"
              >
                Sources
                <i className="google-symbols text-[20px] text-[#1A73E8] ml-1">arrow_drop_down</i>
              </button>
              {openSourcesCardId === id && (
                <div className="absolute bottom-full right-0 mb-2 w-[260px] bg-white border border-[#DADCE0] rounded-[8px] shadow-lg z-[100] py-1">
                  {sources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-2 text-[13px] text-[#3C4043] hover:bg-[#F8F9FA] no-underline"
                      onClick={() => setOpenSourcesCardId(null)}
                    >
                      {sIdx + 1}. {src.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => onRefineClick?.(id, title)}
              className="flex flex-row justify-center items-center px-3 h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5 text-[#1A73E8] font-['Google_Sans'] font-medium text-[14px]"
            >
              <i className="google-symbols text-[20px] leading-none text-[#1A73E8] mr-1">pen_spark_io25</i>
              Refine
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Custom style for sections (handles refinement border focus/shimmer)
  const getSectionStyle = (id: string, defaultBg: string = 'bg-[rgba(231,242,255,0.6)]') => {
    const isRefining = focusedSection?.id === id;
    const isLoading = sectionLoading === id;
    return {
      className: `box-border flex flex-col items-start min-w-[380px] overflow-clip rounded-[16px] relative shrink-0 w-full transition-all duration-200 border-2 ${
        isLoading 
          ? 'border-transparent bg-[#E8F0FE]' 
          : isRefining 
            ? 'bg-[#E8F0FE] border-[#1A73E8] shadow-lg' 
            : `${defaultBg} border-transparent`
      }`
    };
  };

  // Pie chart data for Slide 6
  const chartData = [
    { name: 'Search+', value: 50 },
    { name: 'Video (YouTube)', value: 35 },
    { name: 'Performance Max', value: 15 }
  ];
  const COLORS = ['#1A73E8', '#9254EA', '#FF9900'];

  return (
    <div className="fixed right-0 left-[420px] top-0 bottom-0 z-[60] bg-[#F8F9FA] flex flex-col border-l border-[#E8EAED] shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 100% 0; }
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

        /* Responsive Slide Container Queries styling */
        .slide-container {
          container-type: inline-size;
          container-name: slide;
          width: 100%;
          max-width: 1280px;
          aspect-ratio: 16 / 9;
          height: auto;
          margin-left: auto;
          margin-right: auto;
          border-radius: 12px;
          box-sizing: border-box;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid #E8EAED;
          position: relative;
          overflow: hidden;
        }

        @container slide (max-width: 1600px) {
          .slide-title-1 {
            font-size: 4.5cqi !important;
            line-height: 5.5cqi !important;
            margin-bottom: 2cqi !important;
          }
          .slide-subtitle-1 {
            font-size: 1.8cqi !important;
            line-height: 2.6cqi !important;
          }
          .slide-title-divider {
            font-size: 6cqi !important;
            line-height: 7cqi !important;
          }
          .slide-subtitle-divider {
            font-size: 1.6cqi !important;
            line-height: 2.4cqi !important;
          }
          .slide-heading {
            font-size: 3.2cqi !important;
            line-height: 4cqi !important;
            margin-top: 0 !important;
            margin-bottom: 1.5cqi !important;
          }
          .slide-body-list {
            font-size: 1.5cqi !important;
            line-height: 2.2cqi !important;
            gap: 1.5cqi !important;
          }
          .slide-card-title {
            font-size: 1.8cqi !important;
            line-height: 2.4cqi !important;
          }
          .slide-card-text {
            font-size: 1.3cqi !important;
            line-height: 1.8cqi !important;
          }
          .slide-card-icon {
            font-size: 2.8cqi !important;
          }
          .slide-pie-title {
            font-size: 1.8cqi !important;
            line-height: 2.4cqi !important;
          }
          .slide-pie-text {
            font-size: 1.3cqi !important;
            line-height: 1.8cqi !important;
          }
          .slide-pie-row {
            font-size: 1.3cqi !important;
          }
          .slide-roadmap-step {
            font-size: 1.5cqi !important;
          }
          .slide-roadmap-text {
            font-size: 1.1cqi !important;
            line-height: 1.5cqi !important;
          }
          .slide-roadmap-num {
            width: 4.5cqi !important;
            height: 4.5cqi !important;
            font-size: 1.8cqi !important;
          }
        }
      `}</style>

      {/* Canvas Header */}
      <div className="w-full flex-none z-10 border-b border-[#DADCE0]">
        <div className="flex flex-col items-start p-0 isolate w-full max-w-[1680px] mx-auto bg-[linear-gradient(266.54deg,#F7ECFE_0%,#FFFFFF_30.29%,#E0F4FF_100%)] shadow-[0px_2px_6px_3px_rgba(0,0,0,0.04)] rounded-b-[20px] border-x border-b border-[#DADCE0] border-t-0">
          <div className="box-border flex flex-col items-start p-[12px_8px_12px_24px] w-full h-[88px] border-b border-[#DADCE0]">
            <div className="flex flex-row items-center p-0 gap-[24px] w-full h-[48px]">
              <h1 className="flex-1 h-[44px] font-['Google_Sans'] font-medium text-[36px] leading-[44px] text-[#000000] m-0 truncate">
                Pitch deck for {companyName}
              </h1>
              <div className="flex flex-row justify-end items-center p-0 w-[96px] h-[48px]">
                <button className="bg-transparent border-none cursor-pointer flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full hover:bg-[rgba(32,33,36,0.08)] relative">
                  <i className="google-symbols text-[#5F6368] text-[24px] leading-[50px] flex items-center text-center absolute inset-0 justify-center">ios_share</i>
                </button>
                <button onClick={onClose} className="bg-transparent border-none cursor-pointer flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full hover:bg-[rgba(32,33,36,0.08)] relative">
                  <i className="google-symbols text-[#5F6368] text-[24px] leading-[50px] flex items-center text-center absolute inset-0 justify-center">close</i>
                </button>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex items-center relative shrink-0">
                <i className="google-symbols text-[16px] leading-none text-[#1157CE] mr-1">sync</i>
                <p className="bg-clip-text font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase bg-[linear-gradient(86.54deg,#00BBDF_0%,#3271EA_50.48%,#C597FF_100%)] text-transparent bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap">
                  Canvas mode
                </p>
              </div>
              <p className="font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase text-[#919191] whitespace-nowrap">
                v1.001.a
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center px-[24px] py-[6px] relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <p className="font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase text-[#919191] whitespace-nowrap">
                  Dates
                </p>
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                  <div className="flex flex-col font-['Google_Sans_Text'] font-bold text-[11px] leading-[16px] tracking-[0.1px] text-[#303030] whitespace-nowrap">
                    <p className="leading-[16px]">May 04 - May 18, 2026</p>
                  </div>
                </div>
              </div>
              <button className="box-border flex flex-row items-center justify-center px-[12px] h-[36px] bg-transparent border border-[#DADCE0] rounded-[4px] cursor-pointer hover:bg-[#F8F9FA] transition-colors">
                <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#1A73E8] flex items-center gap-1">
                  Open in Google Slides
                  <i className="google-symbols text-[20px]">open_in_new</i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slides Container */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#ffffff] flex flex-col items-center">
        <div className="w-full max-w-[1680px] flex flex-col gap-[32px] items-stretch justify-start">

          {/* Slide 1: Title Slide */}
          <div {...getSectionStyle('slide-1')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-1' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-1', 'Slide 1: Title Slide')}
              <div className="slide-container flex flex-col items-center justify-center bg-[#FDFBF7] p-[5%]">
                {customSectionContents && customSectionContents['slide-1'] ? (
                  <div className="text-center whitespace-pre-wrap font-['Google_Sans'] font-normal text-[24px] text-[#1D192B] px-4">
                    {customSectionContents['slide-1'].text}
                  </div>
                ) : (
                  <>
                    <h1 className="font-['Playfair_Display'] font-serif text-[48px] leading-[56px] text-[#1D192B] text-center max-w-[85%] mb-4 slide-title-1">
                      Re-Igniting the {companyName} Brand
                    </h1>
                    <p className="font-['Google_Sans_Text'] font-normal text-[18px] leading-[26px] text-[#5E5E5E] text-center max-w-[70%] slide-subtitle-1">
                      Strategic outline & Q3 media objectives for the Google Partnership
                    </p>
                  </>
                )}
              </div>
              {renderSlideFooter('slide-1', 'Slide 1: Title Slide', [mockSource1, mockSource3])}
            </div>
            {sectionLoading === 'slide-1' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 2: Divider Section 1 */}
          <div {...getSectionStyle('slide-2', 'bg-[rgba(29,25,43,0.05)]')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-2' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-2', 'Slide 2: Section Divider')}
              <div className="slide-container flex flex-col items-center justify-center bg-[#1D192B] p-[5%]">
                {customSectionContents && customSectionContents['slide-2'] ? (
                  <div className="text-center whitespace-pre-wrap font-['Google_Sans'] font-normal text-[24px] text-[#FDFBF7] px-4">
                    {customSectionContents['slide-2'].text}
                  </div>
                ) : (
                  <>
                    <h2 className="font-['Playfair_Display'] font-serif text-[64px] leading-[72px] text-[#D7C39B] tracking-[1.5px] uppercase m-0 slide-title-divider">
                      THE CASE
                    </h2>
                    <p className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#FDFBF7] opacity-80 mt-3 slide-subtitle-divider">
                      Market context & performance diagnostics
                    </p>
                  </>
                )}
              </div>
              {renderSlideFooter('slide-2', 'Slide 2: Section Divider', [mockSource2])}
            </div>
            {sectionLoading === 'slide-2' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 3: Reclaiming Premium Status */}
          <div {...getSectionStyle('slide-3')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-3' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-3', 'Slide 3: Reclaiming Premium Status')}
              <div className="slide-container bg-[#FDFBF7] flex flex-row gap-[4%] items-center p-[5%]">
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                  <h3 className="font-['Playfair_Display'] font-serif text-[32px] leading-[40px] text-[#1D192B] m-0 slide-heading">
                    Reclaiming Premium Position
                  </h3>
                  {customSectionContents && customSectionContents['slide-3'] ? (
                    <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[26px] text-[#303030] whitespace-pre-wrap overflow-y-auto max-h-[80%]">
                      {customSectionContents['slide-3'].text}
                    </div>
                  ) : (
                    <ul className="m-0 pl-6 flex flex-col gap-4 text-[#303030] font-['Google_Sans_Text'] text-[18px] leading-[28px] slide-body-list">
                      <li>
                        Recognizing a stark contrast in discovery index spend vs competitors.
                      </li>
                      <li>
                        The Opportunity: Shift 15% of external social channels to Google Demand Gen & YouTube VAC.
                      </li>
                      <li>
                        Leverage high-intent activewear search volume to establish a premium digital footprint.
                      </li>
                    </ul>
                  )}
                </div>
                <div className="w-[40%] aspect-[16/9] h-auto flex-none rounded-[12px] overflow-hidden border border-[#DADCE0]">
                  <img 
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600" 
                    alt="Fashion Models"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {renderSlideFooter('slide-3', 'Slide 3: Reclaiming Premium Status', [mockSource1, mockSource2, mockSource3])}
            </div>
            {sectionLoading === 'slide-3' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 4: A Full-Funnel YouTube Approach */}
          <div {...getSectionStyle('slide-4')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-4' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-4', 'Slide 4: A Full-Funnel YouTube Approach')}
              <div className="slide-container bg-[#FDFBF7] flex flex-col justify-between p-[5%]">
                <h3 className="font-['Playfair_Display'] font-serif text-[32px] leading-[40px] text-[#1D192B] m-0 slide-heading">
                  A Full-Funnel YouTube Approach
                </h3>
                {customSectionContents && customSectionContents['slide-4'] ? (
                  <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[26px] text-[#303030] whitespace-pre-wrap overflow-y-auto h-[80%]">
                    {customSectionContents['slide-4'].text}
                  </div>
                ) : (
                  <div className="flex flex-row gap-4 justify-between items-stretch my-auto h-[70%]">
                    <div className="flex-1 bg-white p-4 rounded-[8px] border border-[#E8EAED] shadow-sm flex flex-col gap-2">
                      <i className="google-symbols text-[#1A73E8] text-[28px] slide-card-icon">visibility</i>
                      <h4 className="font-['Google_Sans'] font-bold text-[16px] text-[#1B1B1C] m-0 slide-card-title">Awareness</h4>
                      <p className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[18px] text-[#5E5E5E] m-0 slide-card-text">
                        YouTube Select: Position the brand alongside premium cultural channels.
                      </p>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-[8px] border border-[#E8EAED] shadow-sm flex flex-col gap-2">
                      <i className="google-symbols text-[#9254EA] text-[28px] slide-card-icon">video_library</i>
                      <h4 className="font-['Google_Sans'] font-bold text-[16px] text-[#1B1B1C] m-0 slide-card-title">Consideration</h4>
                      <p className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[18px] text-[#5E5E5E] m-0 slide-card-text">
                        In-Feed & Shorts: Capture active interest using influencer and creator campaigns.
                      </p>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-[8px] border border-[#E8EAED] shadow-sm flex flex-col gap-2">
                      <i className="google-symbols text-[#00A2B1] text-[28px] slide-card-icon">shopping_cart</i>
                      <h4 className="font-['Google_Sans'] font-bold text-[16px] text-[#1B1B1C] m-0 slide-card-title">Action</h4>
                      <p className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[18px] text-[#5E5E5E] m-0 slide-card-text">
                        Video Action (VAC): Drive direct conversion with product feeds and shoppable ads.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {renderSlideFooter('slide-4', 'Slide 4: A Full-Funnel YouTube Approach', [mockSource1, mockSource2, mockSource3])}
            </div>
            {sectionLoading === 'slide-4' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 5: Divider Section 2 */}
          <div {...getSectionStyle('slide-5', 'bg-[rgba(29,25,43,0.05)]')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-5' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-5', 'Slide 5: Section Divider')}
              <div className="slide-container flex flex-col items-center justify-center bg-[#1D192B] p-[5%]">
                {customSectionContents && customSectionContents['slide-5'] ? (
                  <div className="text-center whitespace-pre-wrap font-['Google_Sans'] font-normal text-[24px] text-[#FDFBF7] px-4">
                    {customSectionContents['slide-5'].text}
                  </div>
                ) : (
                  <>
                    <h2 className="font-['Playfair_Display'] font-serif text-[64px] leading-[72px] text-[#D7C39B] tracking-[1.5px] uppercase m-0 slide-title-divider">
                      THE PLAN
                    </h2>
                    <p className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#FDFBF7] opacity-80 mt-3 slide-subtitle-divider">
                      Budget allocation, resource splits & operational roadmaps
                    </p>
                  </>
                )}
              </div>
              {renderSlideFooter('slide-5', 'Slide 5: Section Divider', [mockSource3])}
            </div>
            {sectionLoading === 'slide-5' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 6: Media Budget Allocation */}
          <div {...getSectionStyle('slide-6')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-6' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-6', 'Slide 6: Media Budget Allocation')}
              <div className="slide-container bg-[#FDFBF7] flex flex-col justify-between p-[5%]">
                <h3 className="font-['Playfair_Display'] font-serif text-[32px] leading-[40px] text-[#1D192B] m-0 slide-heading">
                  Media Budget Allocation
                </h3>
                {customSectionContents && customSectionContents['slide-6'] ? (
                  <div className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[26px] text-[#303030] whitespace-pre-wrap overflow-y-auto h-[80%]">
                    {customSectionContents['slide-6'].text}
                  </div>
                ) : (
                  <div className="flex flex-row gap-[4%] items-center justify-between my-auto h-[75%]">
                    <div className="w-[40%] h-[95%] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="65%"
                            outerRadius="90%"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend 
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ fontSize: '11px', fontFamily: 'Google Sans Text', paddingTop: '8px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 flex flex-col gap-3 bg-white p-6 rounded-[12px] border border-[#E8EAED] shadow-sm h-[95%] justify-center">
                      <h4 className="font-['Google_Sans'] font-bold text-[18px] text-[#1B1B1C] m-0 slide-pie-title">Optimized Channel Split</h4>
                      <p className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[18px] text-[#5E5E5E] m-0 slide-pie-text">
                        Based on active campaign efficiency, we suggest reallocating 15% of display spend to Video Action campaigns to unblock conversion friction.
                      </p>
                      <div className="flex flex-col gap-2 mt-1 slide-pie-row">
                        <div className="flex items-center justify-between text-[14px] font-medium">
                          <span className="text-[#1A73E8]">Search+ (Core Performance)</span>
                          <span className="text-[#1B1B1C]">50% ($250k)</span>
                        </div>
                        <div className="flex items-center justify-between text-[14px] font-medium">
                          <span className="text-[#9254EA]">Video (YouTube Full-Funnel)</span>
                          <span className="text-[#1B1B1C]">35% ($175k)</span>
                        </div>
                        <div className="flex items-center justify-between text-[14px] font-medium">
                          <span className="text-[#FF9900]">Performance Max</span>
                          <span className="text-[#1B1B1C]">15% ($75k)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {renderSlideFooter('slide-6', 'Slide 6: Media Budget Allocation', [mockSource1, mockSource4])}
            </div>
            {sectionLoading === 'slide-6' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 7: Divider Section 3 */}
          <div {...getSectionStyle('slide-7', 'bg-[rgba(29,25,43,0.05)]')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-7' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-7', 'Slide 7: Section Divider')}
              <div className="slide-container flex flex-col items-center justify-center bg-[#1D192B] p-[5%]">
                {customSectionContents && customSectionContents['slide-7'] ? (
                  <div className="text-center whitespace-pre-wrap font-['Google_Sans'] font-normal text-[24px] text-[#FDFBF7] px-4">
                    {customSectionContents['slide-7'].text}
                  </div>
                ) : (
                  <>
                    <h2 className="font-['Playfair_Display'] font-serif text-[64px] leading-[72px] text-[#D7C39B] tracking-[1.5px] uppercase m-0 slide-title-divider">
                      THE IMPACT
                    </h2>
                    <p className="font-['Google_Sans_Text'] font-normal text-[16px] leading-[24px] text-[#FDFBF7] opacity-80 mt-3 slide-subtitle-divider">
                      Projected return, conversion lifts & business outcomes
                    </p>
                  </>
                )}
              </div>
              {renderSlideFooter('slide-7', 'Slide 7: Section Divider', [mockSource4])}
            </div>
            {sectionLoading === 'slide-7' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 8: Refining Success Metrics */}
          <div {...getSectionStyle('slide-8')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-8' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-8', 'Slide 8: Refining Success Metrics')}
              <div className="slide-container bg-[#FDFBF7] flex flex-row gap-[4%] items-center p-[5%]">
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                  <h3 className="font-['Playfair_Display'] font-serif text-[32px] leading-[40px] text-[#1D192B] m-0 slide-heading">
                    Refining Success Metrics
                  </h3>
                  {customSectionContents && customSectionContents['slide-8'] ? (
                    <div className="font-['Google_Sans_Text'] font-normal text-[18px] leading-[28px] text-[#303030] whitespace-pre-wrap overflow-y-auto max-h-[80%]">
                      {customSectionContents['slide-8'].text}
                    </div>
                  ) : (
                    <ul className="m-0 pl-6 flex flex-col gap-3 text-[#303030] font-['Google_Sans_Text'] text-[16px] leading-[26px] slide-body-list">
                      <li>
                        Aim for a +14% lift in overall purchase conversions within 60 days of rollout.
                      </li>
                      <li>
                        Establish tag compliance (Enhanced Conversions) to unblock tracking gaps.
                      </li>
                      <li>
                        Measure incrementality via standard brand lift studies on YouTube Select.
                      </li>
                    </ul>
                  )}
                </div>
                <div className="w-[40%] aspect-[16/9] h-auto flex-none rounded-[12px] overflow-hidden border border-[#DADCE0]">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600" 
                    alt="Computer Desk"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {renderSlideFooter('slide-8', 'Slide 8: Refining Success Metrics', [mockSource1, mockSource2, mockSource4])}
            </div>
            {sectionLoading === 'slide-8' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 9: 4-Step Roadmap */}
          <div {...getSectionStyle('slide-9')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-9' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-9', 'Slide 9: Operational Roadmap')}
              <div className="slide-container bg-[#FDFBF7] flex flex-col justify-between p-[5%]">
                <h3 className="font-['Playfair_Display'] font-serif text-[32px] leading-[40px] text-[#1D192B] m-0 slide-heading">
                  4-Step Tour of the Roadmap
                </h3>
                {customSectionContents && customSectionContents['slide-9'] ? (
                  <div className="font-['Google_Sans_Text'] font-normal text-[18px] leading-[28px] text-[#303030] whitespace-pre-wrap overflow-y-auto h-[80%]">
                    {customSectionContents['slide-9'].text}
                  </div>
                ) : (
                  <div className="flex flex-row gap-4 justify-between items-stretch relative my-auto h-[65%]">
                    {/* Connector line */}
                    <div className="absolute top-[22%] left-[12%] right-[12%] h-[2px] bg-[#E8EAED] z-0 hidden md:block"></div>
                    
                    <div className="flex-1 flex flex-col items-center text-center gap-2 z-10">
                      <div className="w-[36px] h-[36px] rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-[14px] slide-roadmap-num">1</div>
                      <h4 className="font-['Google_Sans'] font-bold text-[14px] text-[#1B1B1C] m-0 slide-roadmap-step">Q3 Kickoff</h4>
                      <p className="font-['Google_Sans_Text'] font-normal text-[11px] leading-[15px] text-[#5E5E5E] m-0 slide-roadmap-text">
                        Tag Audit & Enhanced Conversions setup.
                      </p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center text-center gap-2 z-10">
                      <div className="w-[36px] h-[36px] rounded-full bg-[#9254EA] text-white flex items-center justify-center font-bold text-[14px] slide-roadmap-num">2</div>
                      <h4 className="font-['Google_Sans'] font-bold text-[14px] text-[#1B1B1C] m-0 slide-roadmap-step">Asset Launch</h4>
                      <p className="font-['Google_Sans_Text'] font-normal text-[11px] leading-[15px] text-[#5E5E5E] m-0 slide-roadmap-text">
                        Deploy new video formats and assets.
                      </p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center text-center gap-2 z-10">
                      <div className="w-[36px] h-[36px] rounded-full bg-[#FCBD00] text-white flex items-center justify-center font-bold text-[14px] slide-roadmap-num">3</div>
                      <h4 className="font-['Google_Sans'] font-bold text-[14px] text-[#1B1B1C] m-0 slide-roadmap-step">Funnel Scale</h4>
                      <p className="font-['Google_Sans_Text'] font-normal text-[11px] leading-[15px] text-[#5E5E5E] m-0 slide-roadmap-text">
                        Unleash YouTube Select and VAC.
                      </p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center text-center gap-2 z-10">
                      <div className="w-[36px] h-[36px] rounded-full bg-[#34A853] text-white flex items-center justify-center font-bold text-[14px] slide-roadmap-num">4</div>
                      <h4 className="font-['Google_Sans'] font-bold text-[14px] text-[#1B1B1C] m-0 slide-roadmap-step">Optimize</h4>
                      <p className="font-['Google_Sans_Text'] font-normal text-[11px] leading-[15px] text-[#5E5E5E] m-0 slide-roadmap-text">
                        Audit policy health and adjust budget.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {renderSlideFooter('slide-9', 'Slide 9: Operational Roadmap', [mockSource1, mockSource2, mockSource3, mockSource4])}
            </div>
            {sectionLoading === 'slide-9' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

          {/* Slide 10: Data-Driven Insights (Closing slide) */}
          <div {...getSectionStyle('slide-10')}>
            <div className={`w-full flex flex-col items-center gap-6 ${sectionLoading === 'slide-10' ? 'opacity-30' : ''}`}>
              {renderSlideHeader('slide-10', 'Slide 10: Data-Driven Insights')}
              <div className="slide-container bg-[#FDFBF7] flex flex-row gap-[4%] items-center p-[5%]">
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                  <h3 className="font-['Playfair_Display'] font-serif text-[32px] leading-[40px] text-[#1D192B] m-0 slide-heading">
                    Data-Driven Insights
                  </h3>
                  {customSectionContents && customSectionContents['slide-10'] ? (
                    <div className="font-['Google_Sans_Text'] font-normal text-[18px] leading-[28px] text-[#303030] whitespace-pre-wrap overflow-y-auto max-h-[80%]">
                      {customSectionContents['slide-10'].text}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 font-['Google_Sans_Text'] text-[16px] leading-[26px] text-[#474747] slide-body-list">
                      <div>
                        <strong>Incrementality is key:</strong> Brand lift studies show +18% surge in unbranded active searches when backed by video action.
                      </div>
                      <div>
                        <strong>Ready to execute:</strong> Q3 timelines are locked and operational, pending tag integration checks.
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-[35%] aspect-[16/9] h-auto flex-none rounded-[12px] overflow-hidden border border-[#DADCE0]">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" 
                    alt="Fashion Lifestyle Portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {renderSlideFooter('slide-10', 'Slide 10: Data-Driven Insights', [mockSource2, mockSource4])}
            </div>
            {sectionLoading === 'slide-10' && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
          </div>

        </div>
      </div>
    </div>
  );
};
