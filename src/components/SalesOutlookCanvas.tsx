import React, { useState, useEffect, useRef } from 'react';
import { CitationBadge, Source } from './CitationBadge';
import { RefinedSectionResult } from '../services/gemini';

export const SalesOutlookCanvas = ({ 
  onClose, 
  companyName = 'Nike',
  refiningCard,
  onRefineClick,
  sectionLoading,
  customSectionContents
}: { 
  onClose: () => void, 
  companyName?: string,
  refiningCard?: { id: string, title: string } | null,
  onRefineClick?: (id: string, title: string) => void,
  sectionLoading?: string | null,
  customSectionContents?: Record<string, RefinedSectionResult>
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
    transcriptSnippet: 'John: We are seeing a 15% increase in conversion rates with PMax campaigns.\nJane: That is great news! Let us scale that.'
  };

  const renderTextWithCitations = (text: string) => {
    const pieces = text.split(/(\[\d+\])/g);
    return pieces.map((piece, index) => {
      if (piece.match(/^\[\d+\]$/)) {
        const num = piece.slice(1, -1);
        const source = num === '1' ? mockSource1 : mockSource2;
        return <CitationBadge key={index} sources={[source]} />;
      }
      return piece;
    });
  };
  const [selectedCompany, setSelectedCompany] = useState(companyName || 'Nike');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  const companies = [
    'Nike',
    'Acme Corp',
    'Veloce Motorworks',
    'Kinetix Performance',
    'Lyra Activewear',
    'Apex Drifter',
    'LuminaGrid US Residential',
    'CopperQuill Local',
    'Ironbound B2B',
    'Ironbound local',
    'VelvetIris Brand'
  ];

  const getMetricsForCompany = (name: string) => {
    if (name === 'Nike') {
      return {
        salesOutlook: '35.2',
        displayMetrics: '5.8',
        appsMetrics: '3.4',
        searchMetrics: '15.1',
        youtubeMetrics: '9.9',
        forecastNote: "Executive summary\n" +
          "• Strong Growth Trajectory [1]\n" +
          "• Top Line Explanation: Nike is seeing exceptional performance in digital channels, driven by new product launches and aggressive marketing in the lifestyle segment.\n\n" +
          "Context from Latest Meetings\n" +
          "• Highlights\n" +
          "  • Digital Sales Surge: Direct-to-consumer digital sales are up 18% quarter-over-quarter. [2]\n" +
          "  • Brand Affinity: High engagement in the \"Just Do It\" interactive campaign.\n" +
          "• Lowlights\n" +
          "  • Raw Material Costs: Slight increase in logistics costs due to supply chain shifts.\n\n" +
          "Revenue Outlooks\n" +
          "• Sales Outlook: $35.2M (102% to Target)\n" +
          "• YouTube+ Outlook: $9.9M (95% to Target)"
      };
    }

    if (name === 'Acme Corp') {
      return {
        salesOutlook: '23.7',
        displayMetrics: '4.2',
        appsMetrics: '2.1',
        searchMetrics: '10.8',
        youtubeMetrics: '7.6',
        forecastNote: "Executive summary\n" +
          "• Maintain Call\n" +
          "• Top Line Explanation: Maintaining the current outlook as consistent performance in core search categories offsets the slight deceleration in mid-market acquisition seen earlier this month.\n\n" +
          "Context from Latest Meetings\n" +
          "• Highlights\n" +
          "  • Strong Performance in Q2 Campaigns: Early data from the \"Spring Renewal\" campaign indicates a 12% higher CTR than the historical benchmark, suggesting high creative resonance.\n" +
          "  • Incrementally Breakthrough: Preliminary results from the GeoX experiment in the Northeast region show a 5% lift in pure incremental conversions, validating recent automated bidding adjustments.\n" +
          "• Lowlights\n" +
          "  • Supply Chain Headwinds: Two Tier-1 retail partners reported inventory delays, leading to a temporary pause in high-intent product PLAs (Product Listing Ads) for the next 10 days.\n" +
          "  • Pipeline Conversion Lag: Average sales cycle length for the Enterprise segment has increased by 4 days, requiring a more aggressive mid-funnel nurture strategy.\n\n" +
          "Key Activities (Last Week)\n" +
          "• New Product Adoption: Successfully migrated three major accounts to Broad Match + Smart Bidding beta to capture long-tail query volume.\n" +
          "• Campaign Launch: Initiated the \"Back-to-Business\" video sequence across YouTube Select to build top-of-funnel awareness for the upcoming fiscal quarter.\n" +
          "• Experimentation: Launched a cross-channel attribution test to measure the halo effect of Video Action Campaigns on traditional Search volume.\n\n" +
          "Revenue Outlooks\n" +
          "• Sales Outlook: $48.2M (94% to Target)\n" +
          "  • w/w Δ in SO: +$1.4M (+2.1ppts)\n" +
          "• YouTube+ Outlook: $18.5M (89% to Target)\n" +
          "  • w/w Δ in SO: -$0.3M (-0.8ppts)"
      };
    }

    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
       salesOutlook: (hash % 50 + 10).toFixed(1),
       displayMetrics: (hash % 10 + 1).toFixed(1),
       appsMetrics: ((hash * 2) % 10 + 1).toFixed(1),
       searchMetrics: ((hash * 3) % 20 + 5).toFixed(1),
       youtubeMetrics: ((hash * 4) % 15 + 2).toFixed(1),
       forecastNote: `Executive summary\n` +
          `• Adjust Call\n` +
          `• Top Line Explanation: Adjusting the outlook for ${name} as we see shifts in engagement metrics and adjusted channel investments.\n\n` +
          `Context from Latest Meetings\n` +
          `• Highlights\n` +
          `  • Video Action Campaigns scaling effectively.\n` +
          `  • Positive momentum in broad match conversions.\n` +
          `• Lowlights\n` +
          `  • Increased competition driving up CPCs in core segments.\n` +
          `  • Slower than expected adoption of new campaign types.\n\n` +
          `Key Activities (Last Week)\n` +
          `• Continued optimization of Performance Max setups.\n` +
          `• Audience expansion tests initiated.\n\n` +
          `Revenue Outlooks\n` +
          `• Sales Outlook: $${(hash % 40 + 20).toFixed(1)}M (${85 + (hash % 15)}% to Target)\n` +
          `  • w/w Δ in SO: +$${(hash % 5).toFixed(1)}M\n` +
          `• YouTube+ Outlook: $${(hash % 15 + 5).toFixed(1)}M (${80 + (hash % 20)}% to Target)`
    };
  };

  const [salesOutlook, setSalesOutlook] = useState('23.7');
  const [displayMetrics, setDisplayMetrics] = useState('4.2');
  const [appsMetrics, setAppsMetrics] = useState('2.1');
  const [searchMetrics, setSearchMetrics] = useState('10.8');
  const [youtubeMetrics, setYoutubeMetrics] = useState('7.6');
  const [forecastNote, setForecastNote] = useState("");

  useEffect(() => {
    const metrics = getMetricsForCompany(selectedCompany);
    setSalesOutlook(metrics.salesOutlook);
    setDisplayMetrics(metrics.displayMetrics);
    setAppsMetrics(metrics.appsMetrics);
    setSearchMetrics(metrics.searchMetrics);
    setYoutubeMetrics(metrics.youtubeMetrics);
    setForecastNote(metrics.forecastNote);
  }, [selectedCompany]);

  useEffect(() => {
    if (customSectionContents && customSectionContents['forecastNote']?.text) {
      setForecastNote(customSectionContents['forecastNote'].text);
    }
    if (customSectionContents && customSectionContents['salesOutlook']?.text) {
      setForecastNote(prev => customSectionContents['salesOutlook']!.text + "\n\n" + prev);
    }
  }, [customSectionContents]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      `}</style>
      
      {/* Canvas header */}
      <div className="w-full flex-none z-10 border-b border-[#DADCE0]">
        <div className="flex flex-col items-start p-0 isolate w-full max-w-[1680px] mx-auto bg-[linear-gradient(266.54deg,#F7ECFE_0%,#FFFFFF_30.29%,#E0F4FF_100%)] shadow-[0px_2px_6px_3px_rgba(0,0,0,0.04)] rounded-b-[20px] border-x border-b border-[#DADCE0] border-t-0">
        
        {/* [Primary row] */}
        <div className="box-border flex flex-col items-start p-[12px_8px_12px_24px] w-full h-[88px] border-b border-[#DADCE0]">
          {/* [row] */}
          <div className="flex flex-row items-center p-0 gap-[24px] w-full h-[48px]">
            {/* Header canvas title */}
            <h1 className="flex-1 h-[44px] font-['Google_Sans'] font-medium text-[36px] leading-[44px] text-[#000000] m-0">
              Sales outlook and forecast notes
            </h1>
            
            {/* [Page level actions] */}
            <div className="flex flex-row justify-end items-center p-0 w-[96px] h-[48px]">
              <button className="bg-transparent border-none cursor-pointer flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full hover:bg-[rgba(32,33,36,0.08)] relative">
                <i className="google-symbols text-[#5F6368] text-[24px] leading-[50px] flex items-center text-center absolute inset-0 justify-center">ios_share</i>
              </button>
              <button onClick={onClose} className="bg-transparent border-none cursor-pointer flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full hover:bg-[rgba(32,33,36,0.08)] relative">
                <i className="google-symbols text-[#5F6368] text-[24px] leading-[50px] flex items-center text-center absolute inset-0 justify-center">close</i>
              </button>
            </div>
          </div>

          {/* Container (Subtitle) */}
          <div className="flex flex-row items-start p-0 gap-[8px] w-full h-[16px] mt-auto">
            {/* Canvas mode piece */}
            <div className="flex flex-row items-center p-0 w-[101px] h-[16px]">
              <div className="flex flex-col justify-center items-center p-0 gap-[8px] w-[16px] h-[16px] rounded-[2px]">
                <div className="w-[1.5px] h-[8px] bg-[#4E8FF8]"></div>
              </div>
              <div className="w-[85px] h-[16px] font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase bg-clip-text text-transparent bg-[linear-gradient(60.06deg,#1157CE_19.36%,#4E8FF8_39.03%,#9254EA_69.85%)]">
                Canvas mode
              </div>
            </div>
            
            {/* Version piece */}
            <div className="h-[16px] font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase text-[#5E5E5E]">
              v1.02.2A
            </div>
          </div>
        </div>

        {/* [Secondary row] */}
        <div className="flex flex-row items-center p-[6px_24px] gap-[8px] w-full h-[44px] box-border">
          <div className="font-['Roboto'] font-medium text-[11px] leading-[16px] tracking-[0.8px] uppercase text-[#5E5E5E]">
            SCOPE
          </div>
          <div className="relative" ref={companyDropdownRef}>
            <button 
              className="box-border flex flex-row justify-center items-center px-3 py-1.5 gap-2 h-[32px] bg-white border border-[#DADCE0] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA] shadow-sm"
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
            >
              <i className="google-symbols text-[#5F6368] text-[18px]">domain</i>
              <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3C4043]">{selectedCompany}</span>
              <i className="google-symbols text-[#5F6368] text-[18px]">arrow_drop_down</i>
            </button>
            {isCompanyDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-auto min-w-[200px] flex-col rounded-[8px] bg-[#FFFFFF] py-[8px] shadow-[0_4px_8px_3px_rgba(0,0,0,0.15),0_1px_3px_0_rgba(0,0,0,0.30)] z-[100] max-h-[300px] overflow-y-auto">
                {companies.map((company) => (
                  <button 
                    key={company}
                    className={`flex items-center justify-start px-[16px] py-[10px] text-[14px] w-full text-left border-none cursor-pointer ${
                      selectedCompany === company ? 'bg-[#E8F0FE] text-[#1A73E8]' : 'text-[#3C4043] hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedCompany(company);
                      setIsCompanyDropdownOpen(false);
                    }}
                  >
                    {company}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="box-border flex flex-row justify-center items-center px-3 py-1.5 gap-2 h-[32px] bg-white border border-[#DADCE0] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA] shadow-sm">
            <i className="google-symbols text-[#5F6368] text-[18px]">calendar_today</i>
            <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#3C4043]">May 11 2026</span>
            <i className="google-symbols text-[#5F6368] text-[18px]">arrow_drop_down</i>
          </button>
        </div>
      </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto flex flex-col px-6 pb-6 items-center">
        <div className="w-full max-w-[1680px] mx-auto flex flex-col gap-6 pt-6">
        
        {/* Sales Outlook Section */}
        <div className={`flex flex-col items-start p-6 gap-6 w-full max-w-[1680px] rounded-[24px] transition-all duration-200 relative ${
          sectionLoading === 'salesOutlook' 
            ? 'border-2 border-transparent bg-[#E8F0FE]' 
            : refiningCard?.id === 'salesOutlook' 
              ? 'bg-[#E8F0FE] border-2 border-[#1A73E8]' 
              : 'bg-[#F0F4FC]'
        }`}
        style={sectionLoading === 'salesOutlook' ? {
          background: 'linear-gradient(white, white) padding-box, linear-gradient(86deg, #217BFE 0%, #7621FE 100%) border-box',
          border: '2px solid transparent'
        } : {}}
        >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'salesOutlook' ? 'opacity-30' : ''}`}>
            <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center gap-3">
              <i className="google-symbols text-[#1A73E8] text-[28px] bg-white text-[#1A73E8] p-1.5 rounded-lg shadow-sm">insights</i>
              <h2 className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1F1F1F] m-0">
                {selectedCompany} sales outlook
              </h2>
            </div>
            <button 
              className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
              onClick={() => onRefineClick?.('salesOutlook', 'Sales Outlook')}
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
          
          <div className="flex flex-row items-start justify-between w-full">
            <div className="flex flex-col gap-1 pr-[10%] border-r border-[#DADCE0]">
              <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#3C4043]">Sales outlook</div>
              <div className="flex items-baseline">
                <span className="font-['Google_Sans'] font-medium text-[40px] leading-[48px] text-[#1F1F1F]">$</span>
                <input 
                  type="text" 
                  value={salesOutlook} 
                  onChange={(e) => setSalesOutlook(e.target.value)}
                  className="font-['Google_Sans'] font-medium text-[40px] leading-[48px] text-[#1F1F1F] bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-[#1a73e8] focus:outline-none w-[90px]"
                />
                <span className="font-['Google_Sans'] font-medium text-[40px] leading-[48px] text-[#1F1F1F]">M</span>
              </div>
              <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#5F6368]">60% of target $39.6M</div>
            </div>

            <div className="flex flex-col gap-1 flex-1 pl-[5%]">
              <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#3C4043]">Display</div>
              <div className="flex items-baseline">
                <input 
                  type="text" 
                  value={displayMetrics} 
                  onChange={(e) => setDisplayMetrics(e.target.value)}
                  className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#1F1F1F] bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-[#1a73e8] focus:outline-none w-[55px]"
                />
                <span className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#1F1F1F]">M</span>
              </div>
              <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#5F6368] flex items-center gap-1">
                +$92.7k <span className="text-[#188038] text-[12px] font-medium flex items-center">▲12pt</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#3C4043]">Apps</div>
              <div className="flex items-baseline">
                <input 
                  type="text" 
                  value={appsMetrics} 
                  onChange={(e) => setAppsMetrics(e.target.value)}
                  className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#1F1F1F] bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-[#1a73e8] focus:outline-none w-[50px]"
                />
                <span className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#1F1F1F]">M</span>
              </div>
              <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#5F6368] flex items-center gap-1">
                +$92.7k <span className="text-[#188038] text-[12px] font-medium flex items-center">▲12pt</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#3C4043]">Search+</div>
              <div className="flex items-baseline">
                <input 
                  type="text" 
                  value={searchMetrics} 
                  onChange={(e) => setSearchMetrics(e.target.value)}
                  className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#1F1F1F] bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-[#1a73e8] focus:outline-none w-[70px]"
                />
                <span className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#1F1F1F]">M</span>
              </div>
              <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#5F6368] flex items-center gap-1">
                +$92.7k <span className="text-[#188038] text-[12px] font-medium flex items-center">▲12pt</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#3C4043]">YouTube+</div>
              <div className="flex items-baseline">
                <input 
                  type="text" 
                  value={youtubeMetrics} 
                  onChange={(e) => setYoutubeMetrics(e.target.value)}
                  className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#1F1F1F] bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-[#1a73e8] focus:outline-none w-[55px]"
                />
                <span className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#1F1F1F]">M</span>
              </div>
              <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#5F6368] flex items-center gap-1">
                $106.9M <span className="text-[#188038] text-[12px] font-medium flex items-center">▲12pt</span>
              </div>
            </div>
          </div>
          </div>
          {refiningCard?.id === 'salesOutlook' && (
            <div className="flex flex-row justify-end w-full mt-2">
              <button 
                className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                onClick={() => onRefineClick?.('', '')}
              >
                Cancel refining
              </button>
            </div>
          )}
          {sectionLoading === 'salesOutlook' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>

        {/* Forecast Note Section */}
        <div className={`flex flex-col items-start p-6 gap-4 w-full max-w-[1680px] rounded-[24px] transition-all duration-200 relative ${
          sectionLoading === 'forecastNote' 
            ? 'border-2 border-transparent bg-[#E8F0FE]' 
            : refiningCard?.id === 'forecastNote' 
              ? 'bg-[#E8F0FE] border-2 border-[#1A73E8]' 
              : 'bg-[#F0F4FC]'
        }`}
        style={sectionLoading === 'forecastNote' ? {
          background: 'linear-gradient(white, white) padding-box, linear-gradient(86deg, #217BFE 0%, #7621FE 100%) border-box',
          border: '2px solid transparent'
        } : {}}
        >
          <div className={`w-full flex flex-col gap-6 ${sectionLoading === 'forecastNote' ? 'opacity-30' : ''}`}>
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center gap-3">
                <i className="google-symbols text-[#1A73E8] text-[28px] bg-white p-1.5 rounded-lg shadow-sm">event_note</i>
              <h2 className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1F1F1F] m-0">
                {selectedCompany} forecast note
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="flex flex-col justify-center items-start p-0 gap-[8px] h-[36px] rounded-[4px] bg-transparent border-none cursor-pointer hover:bg-black/5"
                onClick={() => onRefineClick?.('forecastNote', 'Forecast Note')}
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
              <button className="bg-transparent border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-[rgba(32,33,36,0.08)]">
                <i className="google-symbols text-[#5F6368] text-[24px]">more_vert</i>
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* Rich text toolbar */}
            <div className="flex flex-row items-center px-4 py-2 gap-2 bg-white border-b border-[#DADCE0]">
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <span className="font-serif font-bold text-[#444746] text-lg">B</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <span className="font-serif italic text-[#444746] text-lg">I</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <span className="font-serif underline text-[#444746] text-lg">U</span>
              </button>
              <div className="w-[1px] h-[20px] bg-[#DADCE0] mx-1"></div>
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <i className="google-symbols text-[#444746] text-[20px]">format_list_bulleted</i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <i className="google-symbols text-[#444746] text-[20px]">format_list_numbered</i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <i className="google-symbols text-[#444746] text-[20px]">format_indent_decrease</i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <i className="google-symbols text-[#444746] text-[20px]">format_indent_increase</i>
              </button>
              <div className="w-[1px] h-[20px] bg-[#DADCE0] mx-1"></div>
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <i className="google-symbols text-[#444746] text-[20px]">link</i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded hover:bg-[#F1F3F4] cursor-pointer">
                <i className="google-symbols text-[#444746] text-[20px]">format_clear</i>
              </button>
            </div>
            
            <div className="relative w-full min-h-[400px]">
              <div 
                className="p-6 font-['Google_Sans_Text'] font-normal text-[18px] leading-[26px] text-[#3C4043] whitespace-pre-wrap break-words pointer-events-none"
                aria-hidden="true"
              >
                {forecastNote.split('\n').map((line, index, array) => {
                  const isHeading = 
                    line.trim().length > 0 && 
                    !line.startsWith('•') && 
                    !line.startsWith('  •') && 
                    !line.startsWith('-') &&
                    (index === 0 || array[index - 1].trim() === '');
                  return (
                    <span key={index} className={isHeading ? 'font-bold text-[#1F1F1F]' : ''}>
                      {renderTextWithCitations(line)}
                      {index === array.length - 1 ? (line === '' ? <br /> : null) : '\n'}
                    </span>
                  );
                })}
              </div>
              <textarea
                value={forecastNote}
                onChange={(e) => setForecastNote(e.target.value)}
                className="absolute inset-0 w-full h-full p-6 font-['Google_Sans_Text'] font-normal text-[18px] leading-[26px] resize-none border-none focus:outline-none bg-transparent text-transparent caret-black whitespace-pre-wrap break-words overflow-hidden selection:text-transparent selection:bg-blue-200"
                spellCheck={false}
              />
            </div>
            
            {/* Footer actions */}
            <div className="flex flex-row items-center justify-between p-3 px-6 border-t border-[#DADCE0] bg-[#FAFAFA]">
              <div className="flex flex-row items-center gap-4">
                <button className="bg-transparent border-none cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(32,33,36,0.08)]">
                  <i className="google-symbols text-[#5F6368] text-[20px]">share</i>
                </button>
                <button className="bg-transparent border-none cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(32,33,36,0.08)]">
                  <i className="google-symbols text-[#5F6368] text-[20px]">mail</i>
                </button>
                <button className="bg-transparent border-none cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(32,33,36,0.08)]">
                  <i className="google-symbols text-[#5F6368] text-[20px]">content_copy</i>
                </button>
              </div>
              <div className="flex flex-row items-center gap-3">
                <button className="flex flex-row items-center justify-center gap-2 px-4 h-9 bg-transparent border border-transparent hover:bg-black/5 text-[#1A73E8] rounded-full cursor-pointer">
                  <i className="google-symbols text-[#1A73E8] text-[18px]">sync</i>
                  <span className="font-['Google_Sans'] font-medium text-[14px]">Re-Generate</span>
                </button>
                <button className="flex flex-row items-center justify-center px-6 h-9 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] font-['Google_Sans'] font-medium text-[14px] rounded-full border-none cursor-pointer transition-colors">
                  Save
                </button>
              </div>
            </div>
            </div>
          </div>
          {refiningCard?.id === 'forecastNote' && (
            <div className="flex flex-row justify-end w-full mt-2">
              <button 
                className="font-['Google_Sans'] font-medium text-[14px] text-[#5F6368] hover:text-[#202124] cursor-pointer bg-transparent border-none"
                onClick={() => onRefineClick?.('', '')}
              >
                Cancel refining
              </button>
            </div>
          )}
          {sectionLoading === 'forecastNote' && (
            <div className="absolute inset-0 shimmer-bg pointer-events-none"></div>
          )}
        </div>
        </div>
      </div>
      
      {/* Footer Legal Context */}
      <div className="flex flex-col p-4 px-8 mt-auto bg-white border-t border-[#E8EAED]">
        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#5F6368]">
          Canvas generated 1 min ago by Connect AI using <span className="underline cursor-pointer">13 sources</span>
        </div>
        <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#5F6368] flex items-center gap-1">
          This data is strictly confidential and need-to-know, and may be deemed to be material nonpublic information. 
          <span className="text-[#1A73E8] cursor-pointer hover:underline flex items-center gap-1">
            Learn more about insider trading <i className="google-symbols text-[14px]">open_in_new</i>
          </span>
        </div>
      </div>
    </div>
  );
};
