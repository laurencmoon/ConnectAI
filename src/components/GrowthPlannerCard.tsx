import React, { useState, useRef, useEffect } from 'react';

export const GrowthPlannerCard = ({ 
  onOpenPlanner,
  onEditCanvas,
  onExportPlan 
}: { 
  onOpenPlanner?: () => void,
  onEditCanvas?: () => void,
  onExportPlan?: (format: 'csv' | 'sheet') => void 
}) => {
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chartHeight = 160; // Grid area height in pixels
  const chartMax = 22; // 22M max scaling range
  const scaleY = (val: number) => (val / chartMax) * chartHeight;

  return (
    <div className="box-border flex flex-col items-start p-[16px] sm:p-[24px] gap-[20px] w-full max-w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-[20px] shadow-sm mt-3 overflow-hidden box-border">
      
      {/* Short Intro Paragraph */}
      <div className="font-['Google_Sans_Text'] font-normal text-[15px] leading-[22px] text-[#3C4043] w-full">
        This plan for <strong>Acme corp</strong> projects significant growth, increasing total investment by <strong>$2.4M</strong> to deliver an additional <strong>$11.1M in Conversion Value</strong> between Nov 14 and Dec 31, 2025. <span className="text-[#1A73E8] cursor-pointer font-medium">1</span>
      </div>

      {/* Key Metric Overview */}
      <div className="flex flex-col items-start p-0 gap-[8px] w-full">
        <div className="font-['Google_Sans'] font-bold text-[14px] leading-[20px] text-[#3C4043]">
          Key Metric Overview:
        </div>
        
        <div className="flex flex-row gap-[8px] w-full">
          {/* Conversion value */}
          <div className="flex-1 bg-white border border-[#DADCE0] rounded-[12px] p-[10px_8px_12px_10px] sm:p-[12px_16px] flex flex-col gap-[4px] min-w-0">
            <span className="font-['Google_Sans_Text'] text-[10px] sm:text-[11px] text-[#5F6368] leading-[14px] sm:leading-[16px] font-medium truncate">
              Conversion value
            </span>
            <span className="font-['Google_Sans'] font-medium text-[18px] sm:text-[22px] text-[#202124] leading-tight">
              19.2M
            </span>
            <div className="flex flex-row items-center flex-wrap gap-1 font-['Google_Sans_Text'] text-[10px] sm:text-[11px] text-[#5F6368] leading-none mt-0.5">
              <span className="whitespace-nowrap">vs 8.1M</span>
              <span className="text-[#137333] font-bold bg-[#E6F4EA] px-[4px] py-[1px] rounded text-[9px] sm:text-[10px] whitespace-nowrap">
                +11.1M
              </span>
            </div>
          </div>

          {/* Investment */}
          <div className="flex-1 bg-white border border-[#DADCE0] rounded-[12px] p-[10px_8px_12px_10px] sm:p-[12px_16px] flex flex-col gap-[4px] min-w-0">
            <span className="font-['Google_Sans_Text'] text-[10px] sm:text-[11px] text-[#5F6368] leading-[14px] sm:leading-[16px] font-medium truncate">
              Investment
            </span>
            <span className="font-['Google_Sans'] font-medium text-[18px] sm:text-[22px] text-[#202124] leading-tight">
              $4.0M
            </span>
            <div className="flex flex-row items-center flex-wrap gap-1 font-['Google_Sans_Text'] text-[10px] sm:text-[11px] text-[#5F6368] leading-none mt-0.5">
              <span className="whitespace-nowrap">vs 1.6M</span>
              <span className="text-[#137333] font-bold bg-[#E6F4EA] px-[4px] py-[1px] rounded text-[9px] sm:text-[10px] whitespace-nowrap">
                +$2.4M
              </span>
            </div>
          </div>

          {/* Conv. value / Investment */}
          <div className="flex-1 bg-white border border-[#DADCE0] rounded-[12px] p-[10px_8px_12px_10px] sm:p-[12px_16px] flex flex-col gap-[4px] min-w-0">
            <span className="font-['Google_Sans_Text'] text-[10px] sm:text-[11px] text-[#5F6368] leading-[14px] sm:leading-[16px] font-medium truncate">
              Conv. value / Investment
            </span>
            <span className="font-['Google_Sans'] font-medium text-[18px] sm:text-[22px] text-[#202124] leading-tight">
              4.81
            </span>
            <div className="flex flex-row items-center flex-wrap gap-1 font-['Google_Sans_Text'] text-[10px] sm:text-[11px] text-[#5F6368] leading-none mt-0.5">
              <span className="whitespace-nowrap">vs 5.21</span>
              <span className="text-[#C5221F] font-bold bg-[#FCE8E6] px-[4px] py-[1px] rounded text-[9px] sm:text-[10px] whitespace-nowrap">
                -0.40
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Scenario by Growth Levers */}
      <div className="flex flex-col items-start p-0 gap-[12px] w-full">
        <div className="font-['Google_Sans'] font-bold text-[14px] leading-[20px] text-[#3C4043]">
          Plan Scenario by Growth Levers:
        </div>

        {/* Waterfall Chart Container */}
        <div className="w-full border border-[#DADCE0] rounded-[16px] bg-white p-[24px_16px_16px] flex flex-col gap-[16px] overflow-x-auto">
          
          {/* Dynamic Graphic Waterfall Chart */}
          <div className="flex flex-row min-w-[560px] h-[220px]">
            
            {/* Left Y-Axis title & labels */}
            <div className="w-[60px] h-[180px] relative flex flex-col justify-between items-end pr-2 shrink-0">
              {/* Rotated Y-Axis Title */}
              <div className="absolute left-[-32px] top-[70px] -rotate-90 font-['Google_Sans_Text'] text-[10px] font-medium text-[#5F6368] uppercase tracking-wider whitespace-nowrap">
                Conversion value
              </div>
              
              {/* Y-Axis Labels */}
              <div className="absolute text-[10px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(20) - 5}px` }}>20M</div>
              <div className="absolute text-[10px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(16) - 5}px` }}>16M</div>
              <div className="absolute text-[10px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(12) - 5}px` }}>12M</div>
              <div className="absolute text-[10px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(8) - 5}px` }}>8M</div>
              <div className="absolute text-[10px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(4) - 5}px` }}>4M</div>
              <div className="absolute text-[10px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(0) - 5}px` }}>0</div>
            </div>

            {/* Chart Area with Grid & Bars */}
            <div className="flex-1 h-[180px] relative border-b border-[#BDC1C6]">
              {/* Gridlines */}
              <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(20)}px` }} />
              <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(16)}px` }} />
              <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(12)}px` }} />
              <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(8)}px` }} />
              <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(4)}px` }} />

              {/* Bars row container */}
              <div className="absolute inset-0 flex flex-row justify-between items-end px-[8px]">
                
                {/* Current setting column */}
                <div className="flex flex-col items-center justify-end h-full w-[54px] relative shrink-0">
                  <span className="absolute text-[11px] font-bold text-[#3C4043]" style={{ bottom: `${scaleY(8.1) + 4}px` }}>
                    8.1
                  </span>
                  <div 
                    className="w-[30px] bg-[#7A869A] rounded-[3px_3px_0_0]" 
                    style={{ height: `${scaleY(8.1)}px`, bottom: '0px' }} 
                  />
                </div>

                {/* Bid/budget column */}
                <div className="flex flex-col items-center justify-end h-full w-[54px] relative shrink-0">
                  <span className="absolute text-[10px] font-bold text-[#1A73E8]" style={{ bottom: `${scaleY(9.1) + 4}px` }}>
                    +1.0
                  </span>
                  <div 
                    className="w-[30px] bg-[#669DF2] rounded-[3px] absolute" 
                    style={{ height: `${scaleY(1.0)}px`, bottom: `${scaleY(8.1)}px` }} 
                  />
                </div>

                {/* VBB column */}
                <div className="flex flex-col items-center justify-end h-full w-[54px] relative shrink-0">
                  <span className="absolute text-[10px] font-bold text-[#1A73E8]" style={{ bottom: `${scaleY(9.4) + 4}px` }}>
                    +0.3
                  </span>
                  <div 
                    className="w-[30px] bg-[#669DF2] rounded-[3px] absolute" 
                    style={{ height: `${scaleY(0.3)}px`, bottom: `${scaleY(9.1)}px` }} 
                  />
                </div>

                {/* AI Max column */}
                <div className="flex flex-col items-center justify-end h-full w-[54px] relative shrink-0">
                  <span className="absolute text-[10px] font-bold text-[#1A73E8]" style={{ bottom: `${scaleY(10.4) + 4}px` }}>
                    +1.0
                  </span>
                  <div 
                    className="w-[30px] bg-[#669DF2] rounded-[3px] absolute" 
                    style={{ height: `${scaleY(1.0)}px`, bottom: `${scaleY(9.4)}px` }} 
                  />
                </div>

                {/* W2AC column */}
                <div className="flex flex-col items-center justify-end h-full w-[54px] relative shrink-0">
                  <span className="absolute text-[10px] font-bold text-[#1A73E8]" style={{ bottom: `${scaleY(12.4) + 4}px` }}>
                    +2.0
                  </span>
                  <div 
                    className="w-[30px] bg-[#669DF2] rounded-[3px] absolute" 
                    style={{ height: `${scaleY(2.0)}px`, bottom: `${scaleY(10.4)}px` }} 
                  />
                </div>

                {/* ECW column */}
                <div className="flex flex-col items-center justify-end h-full w-[54px] relative shrink-0">
                  <span className="absolute text-[10px] font-bold text-[#1A73E8]" style={{ bottom: `${scaleY(15.6) + 4}px` }}>
                    +3.2
                  </span>
                  <div 
                    className="w-[30px] bg-[#669DF2] rounded-[3px] absolute" 
                    style={{ height: `${scaleY(3.2)}px`, bottom: `${scaleY(12.4)}px` }} 
                  />
                </div>

                {/* New DG column */}
                <div className="flex flex-col items-center justify-end h-full w-[54px] relative shrink-0">
                  <span className="absolute text-[10px] font-bold text-[#1A73E8]" style={{ bottom: `${scaleY(19.2) + 4}px` }}>
                    +3.6
                  </span>
                  <div 
                    className="w-[30px] bg-[#669DF2] rounded-[3px] absolute" 
                    style={{ height: `${scaleY(3.6)}px`, bottom: `${scaleY(15.6)}px` }} 
                  />
                </div>

                {/* Total column */}
                <div className="flex flex-col items-center justify-end h-full w-[54px] relative shrink-0">
                  <span className="absolute text-[11px] font-bold text-[#1A73E8]" style={{ bottom: `${scaleY(19.2) + 4}px` }}>
                    19.2
                  </span>
                  <div 
                    className="w-[30px] bg-[#1A73E8] rounded-[3px_3px_0_0]" 
                    style={{ height: `${scaleY(19.2)}px`, bottom: '0px' }} 
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Labels Row below Y-Axis line */}
          <div className="flex flex-row min-w-[560px] pl-[60px] border-b border-gray-100 pb-6">
            <div className="flex-1 flex flex-row justify-between items-start px-[8px] text-center text-[10px] text-[#5F6368] font-medium leading-tight mt-2">
              <div className="w-[54px] shrink-0 rotate-[-35deg] origin-top-left mt-1 translate-y-1 whitespace-nowrap">Current</div>
              <div className="w-[54px] shrink-0 rotate-[-35deg] origin-top-left mt-1 translate-y-1 whitespace-nowrap">Bid/budget</div>
              <div className="w-[54px] shrink-0 rotate-[-35deg] origin-top-left mt-1 translate-y-1 whitespace-nowrap">VBB</div>
              <div className="w-[54px] shrink-0 rotate-[-35deg] origin-top-left mt-1 translate-y-1 whitespace-nowrap">AI Max</div>
              <div className="w-[54px] shrink-0 rotate-[-35deg] origin-top-left mt-1 translate-y-1 whitespace-nowrap">W2AC</div>
              <div className="w-[54px] shrink-0 rotate-[-35deg] origin-top-left mt-1 translate-y-1 whitespace-nowrap">ECW</div>
              <div className="w-[54px] shrink-0 rotate-[-35deg] origin-top-left mt-1 translate-y-1 whitespace-nowrap">New DG</div>
              <div className="w-[54px] shrink-0 font-bold text-[#3C4043] rotate-[-35deg] origin-top-left mt-1 translate-y-1 whitespace-nowrap">Total</div>
            </div>
          </div>

          {/* Investment Breakdown Grid */}
          <div className="flex flex-col items-start gap-[8px] w-full mt-2">
            <div className="font-['Google_Sans'] font-bold text-[14px] text-[#3C4043]">Investment</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[8px_16px] w-full font-['Google_Sans_Text'] text-[13px] text-[#5E6368]">
              <div><span className="font-semibold text-[#3C4043]">Current:</span> $1.6M</div>
              <div><span className="font-semibold text-[#3C4043]">Bid/budget:</span> +$0.2M</div>
              <div><span className="font-semibold text-[#3C4043]">VBB:</span> +$0.1M</div>
              <div><span className="font-semibold text-[#3C4043]">AI Max:</span> +$1.6M</div>
              <div><span className="font-semibold text-[#3C4043]">W2AC:</span> +$1.6M</div>
              <div><span className="font-semibold text-[#3C4043]">ECW:</span> +$0.2M</div>
              <div><span className="font-semibold text-[#3C4043]">New DG:</span> $1.6M</div>
              <div><span className="font-semibold text-[#3C4043]">AI Max:</span> +$0.2M</div>
              <div><span className="font-semibold text-[#3C4043]">Total:</span> $4.0M</div>
            </div>
          </div>

        </div>
      </div>

      {/* Business Context Tags */}
      <div className="box-border flex flex-col items-start p-[16px] gap-[12px] w-full bg-[#FFFFFF] border border-[#DADCE0] rounded-[16px]">
        <div className="font-['Google_Sans'] font-bold text-[13px] text-[#3C4043]">Business context</div>
        <div className="flex flex-row flex-wrap gap-[8px] w-full">
          <div className="box-border flex flex-row items-center p-[6px_12px] gap-[6px] h-[28px] bg-[#F1F3F4] border border-[#DADCE0] rounded-full font-['Google_Sans_Text'] text-[13px] text-[#3C4043]">
            <i className="google-symbols text-[16px] leading-none">public</i>
            <span>United States</span>
          </div>
          <div className="box-border flex flex-row items-center p-[6px_12px] gap-[6px] h-[28px] bg-[#F1F3F4] border border-[#DADCE0] rounded-full font-['Google_Sans_Text'] text-[13px] text-[#3C4043]">
            <i className="google-symbols text-[16px] leading-none">campaign</i>
            <span>Search +3</span>
          </div>
          <div className="box-border flex flex-row items-center p-[6px_12px] gap-[6px] h-[28px] bg-[#F1F3F4] border border-[#DADCE0] rounded-full font-['Google_Sans_Text'] text-[13px] text-[#3C4043]">
            <i className="google-symbols text-[16px] leading-none">local_offer</i>
            <span>Purchases +5</span>
          </div>
          <div className="box-border flex flex-row items-center p-[6px_12px] gap-[6px] h-[28px] bg-[#F1F3F4] border border-[#DADCE0] rounded-full font-['Google_Sans_Text'] text-[13px] text-[#3C4043]">
            <i className="google-symbols text-[16px] leading-none">folder</i>
            <span>Retailers & Gen...+1</span>
          </div>
        </div>
      </div>

      {/* Open Growth Planner Link */}
      <button 
        onClick={onOpenPlanner}
        className="text-[#1A73E8] bg-transparent border-none p-0 font-['Google_Sans'] font-medium text-[15px] leading-[20px] cursor-pointer hover:underline self-start mt-1"
      >
        Open Growth Planner
      </button>

      {/* Source toggles matching other cards */}
      <div className="flex flex-row items-center justify-between w-full border-t border-gray-200 pt-3">
        <button className="flex items-center gap-1 text-[#1A73E8] font-['Google_Sans_Text'] font-medium text-[14px] bg-transparent border-none cursor-pointer hover:underline">
          Sources <i className="google-symbols text-[20px]">expand_more</i>
        </button>
        <div className="flex items-center gap-4 text-[#5F6368]">
          <i className="google-symbols text-[20px] cursor-pointer hover:text-black">share</i>
          <i className="google-symbols text-[20px] cursor-pointer hover:text-black">thumb_up</i>
          <i className="google-symbols text-[20px] cursor-pointer hover:text-black">thumb_down</i>
        </div>
      </div>

      {/* Staging primary action row outside card frame */}
      <div className="flex flex-row flex-wrap items-center gap-[12px] w-full mt-2 relative z-50">
        <button 
          onClick={onEditCanvas}
          className="box-border flex flex-row justify-center items-center p-[0px_24px] gap-[8px] h-[36px] bg-[#1A73E8] rounded-full text-white border-none font-['Google_Sans'] font-medium text-[14px] cursor-pointer hover:bg-[#1557B0] shadow-sm"
        >
          Edit in Canvas
        </button>

        {/* Export Plan Dropdown menu */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            className="box-border flex flex-row justify-center items-center p-[0px_16px] gap-[6px] h-[36px] border border-[#dadce0] rounded-full bg-white text-[#1a73e8] font-['Google_Sans'] font-medium text-[14px] cursor-pointer hover:bg-[#f8f9fa]"
          >
            <i className="google-symbols text-[18px] text-[#1a73e8]">download</i>
            <span>Export plan</span>
            <i className="google-symbols text-[18px] text-[#1a73e8]">{isExportDropdownOpen ? 'arrow_drop_down' : 'arrow_drop_up'}</i>
          </button>

          {isExportDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-[280px] flex-col rounded-[8px] bg-[#FFFFFF] py-[8px] shadow-[0_4px_8px_3px_rgba(0,0,0,0.15),0_1px_3px_0_rgba(0,0,0,0.30)] z-[100]">
              <button 
                onClick={() => { onExportPlan?.('csv'); setIsExportDropdownOpen(false); }}
                className="flex items-center justify-start px-[16px] py-[10px] text-[13px] text-[#3C4043] w-full text-left border-none bg-transparent cursor-pointer hover:bg-[#f1f3f4]"
              >
                Export plan summary (.csv)
              </button>
              <button 
                onClick={() => { onExportPlan?.('sheet'); setIsExportDropdownOpen(false); }}
                className="flex items-center justify-start px-[16px] py-[10px] text-[13px] text-[#3C4043] w-full text-left border-none bg-transparent cursor-pointer hover:bg-[#f1f3f4] border-t border-gray-100"
              >
                Export implementation details (Google Sheet)
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
