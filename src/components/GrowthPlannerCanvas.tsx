import React, { useState, useEffect } from 'react';

export const GrowthPlannerCanvas = ({ 
  onClose,
  companyName = 'Acme Corp'
}: { 
  onClose: () => void,
  companyName?: string
}) => {
  // Toggle states for customization growth levers
  const [isBiddingChecked, setIsBiddingChecked] = useState(true);
  const [isPMaxChecked, setIsPMaxChecked] = useState(true);
  const [isValueBasedChecked, setIsValueBasedChecked] = useState(true);
  const [isAIMaxChecked, setIsAIMaxChecked] = useState(true);
  const [isWebToAppChecked, setIsWebToAppChecked] = useState(true);
  const [isEnhancedChecked, setIsEnhancedChecked] = useState(true);
  const [isPMaxCampaignChecked, setIsPMaxCampaignChecked] = useState(false);
  const [isDemandGenChecked, setIsDemandGenChecked] = useState(true);

  // Interactive Attainment Slider multiplier scaling state (default starts at 4.8)
  const [sliderMultiplier, setSliderMultiplier] = useState(4.8);

  // Recalculate values dynamically based on both checks and sliderMultiplier
  const currentBase = 8.1;
  const currentInv = 1.6;
  
  // Conversion value scales dynamically based on sliderMultiplier
  // (attainmentRatio * totalInv = totalValue)
  const invBid = isBiddingChecked ? 0.2 : 0;
  const invVBB = isValueBasedChecked ? 0.1 : 0;
  const invAI = isAIMaxChecked ? 1.6 : 0;
  const invW2AC = isWebToAppChecked ? 1.6 : 0;
  const invECW = isEnhancedChecked ? 0.2 : 0;
  const invDG = isDemandGenChecked ? 1.6 : 0;
  const invPMaxCampaign = isPMaxCampaignChecked ? 0.2 : 0;
  const totalInv = currentInv + invBid + invVBB + invAI + invW2AC + invECW + invDG + invPMaxCampaign;

  const totalValue = totalInv * sliderMultiplier;

  // Dynamic proportional distribution across levers
  const baseDiff = totalValue - currentBase;
  
  const biddingShare = isBiddingChecked ? 1.0 : 0;
  const vbbShare = isValueBasedChecked ? 0.3 : 0;
  const aiShare = isAIMaxChecked ? 1.0 : 0;
  const w2acShare = isWebToAppChecked ? 2.0 : 0;
  const ecwShare = isEnhancedChecked ? 3.2 : 0;
  const dgShare = isDemandGenChecked ? 3.6 : 0;
  const totalShare = biddingShare + vbbShare + aiShare + w2acShare + ecwShare + dgShare;

  const valBid = totalShare > 0 ? (biddingShare / totalShare) * baseDiff : 0;
  const valVBB = totalShare > 0 ? (vbbShare / totalShare) * baseDiff : 0;
  const valAI = totalShare > 0 ? (aiShare / totalShare) * baseDiff : 0;
  const valW2AC = totalShare > 0 ? (w2acShare / totalShare) * baseDiff : 0;
  const valECW = totalShare > 0 ? (ecwShare / totalShare) * baseDiff : 0;
  const valDG = totalShare > 0 ? (dgShare / totalShare) * baseDiff : 0;

  // Accumulator bottom calculations for the floating waterfall bars
  const bidBottom = currentBase;
  const vbbBottom = bidBottom + (isBiddingChecked ? valBid : 0);
  const aiBottom = vbbBottom + (isValueBasedChecked ? valVBB : 0);
  const w2acBottom = aiBottom + (isAIMaxChecked ? valAI : 0);
  const ecwBottom = w2acBottom + (isWebToAppChecked ? valW2AC : 0);
  const dgBottom = ecwBottom + (isEnhancedChecked ? valECW : 0);
  
  const chartHeight = 210; // Maximum height of the grid area in pixels
  const chartMax = Math.max(22, Math.ceil(totalValue * 1.15));
  const scaleY = (val: number) => (val / chartMax) * chartHeight;

  const topVal = Math.ceil(chartMax);
  const line4 = Math.round(topVal * 0.8);
  const line3 = Math.round(topVal * 0.6);
  const line2 = Math.round(topVal * 0.4);
  const line1 = Math.round(topVal * 0.2);

  // Current active tab selection state
  const [activeTab, setActiveTab] = useState<'levers' | 'efficiency'>('levers');

  return (
    <div className="fixed right-0 left-[420px] top-0 bottom-0 z-[60] bg-white flex flex-col border-l border-[#E8EAED] shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out">
      
      {/* Header Block */}
      <div className="flex flex-col items-start p-0 isolate w-[calc(100%-48px)] max-w-[1680px] mx-auto shrink-0 bg-[linear-gradient(266.54deg,#E7F2FF_0%,#F7ECFE_100%)] border-b border-l border-r border-[#DADCE0] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.04)] rounded-b-[20px] relative z-10">
        <div className="box-border flex flex-col items-start p-[8px_8px_16px_24px] w-full h-[88px] border-b border-[#DADCE0] z-[2]">
          <div className="flex flex-row items-center pt-[8px] gap-[24px] w-full h-[48px]">
            <div className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#000000] flex-1 truncate">
              Growth Planner canvas for {companyName}
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
        
        {/* Scope Breadcrumbs row */}
        <div className="flex flex-row items-center p-[6px_24px] gap-[8px] w-full h-[44px] z-[1]">
          <div className="font-['Roboto'] font-medium text-[11px] leading-[16px] flex items-center tracking-[0.8px] uppercase text-[#919191] whitespace-nowrap">
            Scope
          </div>
          <div className="box-border flex flex-row items-center p-0 h-[32px] bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] cursor-pointer hover:bg-[#F8F9FA]">
            <div className="flex flex-row items-center p-[0px_12px] gap-[4px] h-[32px] min-h-[24px]">
              <i className="google-symbols text-[18px] leading-none text-[#3C4043] flex items-center text-center">calendar_today</i>
              <div className="font-['Roboto'] font-medium text-[13px] leading-[20px] flex items-center tracking-[0.2px] text-[#3C4043] whitespace-nowrap">
                Apr 16 - Jun 30, 2026
              </div>
              <div className="flex flex-row items-center p-0 gap-[8px] w-[12px] h-[18px]">
                <i className="google-symbols text-[18px] leading-none text-[#3C4043] flex items-center text-center">arrow_drop_down</i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Body Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#ffffff] flex flex-col items-center relative">
        <div className="w-full max-w-[1680px] flex flex-col gap-6">
          
          {/* Custom Canvas Widget Frame */}
          <div className="box-border flex flex-col items-start p-[24px] gap-[20px] w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-[20px] shadow-sm">
            
            {/* Title Row */}
            <div className="flex flex-row items-center gap-[12px] w-full">
              <i className="google-symbols text-[28px] text-[#1A73E8]">analytics</i>
              <h2 className="font-['Google_Sans'] font-medium text-[24px] leading-[32px] text-[#1D1B20] m-0">
                Performance Growth Planner
              </h2>
            </div>

            <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#444746]">
              Plan your customer's growth for performance products. <span className="text-[#1A73E8] cursor-pointer font-medium">Learn more</span>
            </div>

            {/* Main Splits (Performance scenario Left vs Customize levers Right) */}
            <div className="flex flex-col lg:flex-row gap-[24px] w-full mt-[8px]">
              
              {/* Left column: Scenario & Waterfall graph */}
              <div className="flex-1 bg-white border border-[#DADCE0] rounded-[20px] p-[24px] flex flex-col gap-[20px]">
                
                {/* Scenario header */}
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="font-['Google_Sans'] font-medium text-[18px] text-[#1F1F1F]">Performance scenario</span>
                    <span className="font-['Google_Sans_Text'] text-[12px] text-[#5F6368]">Forecast for Apr 16 to Jun 30, 2026</span>
                  </div>
                  <button className="box-border flex flex-row items-center p-[6px_12px] gap-[6px] h-[32px] border border-[#DADCE0] rounded-full bg-transparent font-['Google_Sans_Text'] text-[13px] text-[#3C4043] cursor-pointer hover:bg-gray-50">
                    <i className="google-symbols text-[18px]">tune</i>
                    <span>Business Context</span>
                  </button>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-3 gap-[16px] w-full">
                  {/* Conversion value */}
                  <div className="bg-white border border-[#DADCE0] rounded-[12px] p-[16px] flex flex-col gap-[4px]">
                    <span className="font-['Google_Sans_Text'] text-[12px] text-[#5F6368] leading-[16px]">Conversion value</span>
                    <span className="font-['Google_Sans'] font-medium text-[28px] text-[#1F1F1F] leading-[36px]">
                      {totalValue.toFixed(1)}M
                    </span>
                    <span className="font-['Google_Sans_Text'] text-[12px] text-[#5F6368] leading-[16px]">
                      vs 8.1M <span className="text-[#137333] font-bold bg-[#E6F4EA] px-[6px] py-[2px] rounded-[4px] ml-1">+{ (totalValue - currentBase).toFixed(1) }M</span>
                    </span>
                  </div>

                  {/* Investment */}
                  <div className="bg-white border border-[#DADCE0] rounded-[12px] p-[16px] flex flex-col gap-[4px]">
                    <span className="font-['Google_Sans_Text'] text-[12px] text-[#5F6368] leading-[16px]">Investment</span>
                    <span className="font-['Google_Sans'] font-medium text-[28px] text-[#1F1F1F] leading-[36px]">
                      ${totalInv.toFixed(1)}M
                    </span>
                    <span className="font-['Google_Sans_Text'] text-[12px] text-[#5F6368] leading-[16px]">
                      vs 1.6M <span className="text-[#137333] font-bold bg-[#E6F4EA] px-[6px] py-[2px] rounded-[4px] ml-1">+${ (totalInv - currentInv).toFixed(1) }M</span>
                    </span>
                  </div>

                  {/* Conv. value / Investment */}
                  <div className="bg-white border border-[#1A73E8] rounded-[12px] p-[16px_16px_20px] flex flex-col gap-[4px] relative shadow-sm">
                    <span className="font-['Google_Sans_Text'] text-[12px] text-[#5F6368] leading-[16px]">Conv. value / Investment</span>
                    <span className="font-['Google_Sans'] font-medium text-[28px] text-[#1F1F1F] leading-[36px]">
                      {sliderMultiplier.toFixed(2)}
                    </span>
                    <span className="font-['Google_Sans_Text'] text-[12px] text-[#5F6368] leading-[16px]">
                      vs 5.21 <span className="text-[#C5221F] font-bold bg-[#FCE8E6] px-[6px] py-[2px] rounded-[4px] ml-1">-{ (5.21 - sliderMultiplier).toFixed(2) }</span>
                    </span>
                    
                    {/* Dynamic Slider component inside scorecard frame */}
                    <div className="w-full mt-4 flex items-center gap-2 relative z-10">
                      <input 
                        type="range" 
                        min="3.0" 
                        max="6.0" 
                        step="0.05"
                        value={sliderMultiplier}
                        onChange={(e) => setSliderMultiplier(parseFloat(e.target.value))}
                        className="w-full accent-[#1A73E8] cursor-pointer h-[4px] bg-gray-200 rounded-lg appearance-none"
                      />
                    </div>

                    <div className="absolute inset-0 border-2 border-[#1A73E8] rounded-[12px] pointer-events-none" />
                  </div>
                </div>

                {/* Tabs selectors */}
                <div className="flex flex-row p-0 w-[280px] h-[36px] bg-[#F1F3F4] rounded-full gap-1 p-1 self-center mt-2">
                  <button 
                    onClick={() => setActiveTab('levers')}
                    className={`flex-1 h-full flex items-center justify-center rounded-full border-none font-['Google_Sans'] font-medium text-[13px] cursor-pointer transition-all duration-300 ${activeTab === 'levers' ? 'bg-white text-[#1A73E8] shadow-sm' : 'bg-transparent text-[#5F6368] hover:bg-black/5'}`}
                  >
                    <i className="google-symbols text-[16px] mr-1">waterfall_chart</i>
                    Growth levers
                  </button>
                  <button 
                    onClick={() => setActiveTab('efficiency')}
                    className={`flex-1 h-full flex items-center justify-center rounded-full border-none font-['Google_Sans'] font-medium text-[13px] cursor-pointer transition-all duration-300 ${activeTab === 'efficiency' ? 'bg-white text-[#1A73E8] shadow-sm' : 'bg-transparent text-[#5F6368] hover:bg-black/5'}`}
                  >
                    <i className="google-symbols text-[16px] mr-1">trending_up</i>
                    Efficiency
                  </button>
                </div>

                {/* Waterfall dynamic graphic chart */}
                <div className="w-full border border-[#DADCE0] rounded-[16px] bg-white p-[24px_16px_16px] flex flex-col gap-[16px] overflow-x-auto mt-[10px]">
                  <div className="flex flex-row min-w-[760px]">
                    
                    {/* Left Y-Axis title & labels */}
                    <div className="w-[70px] h-[240px] relative flex flex-col justify-between items-end pr-2 shrink-0">
                      {/* Rotated Y-Axis Title */}
                      <div className="absolute left-[-35px] top-[90px] -rotate-90 font-['Google_Sans_Text'] text-[11px] font-medium text-[#5F6368] uppercase tracking-wider whitespace-nowrap">
                        Conversion value
                      </div>
                      
                      {/* Y-Axis Labels */}
                      <div className="absolute text-[11px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(topVal) - 6}px` }}>{topVal}M</div>
                      <div className="absolute text-[11px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(line4) - 6}px` }}>{line4}M</div>
                      <div className="absolute text-[11px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(line3) - 6}px` }}>{line3}M</div>
                      <div className="absolute text-[11px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(line2) - 6}px` }}>{line2}M</div>
                      <div className="absolute text-[11px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(line1) - 6}px` }}>{line1}M</div>
                      <div className="absolute text-[11px] text-[#5F6368] font-medium" style={{ bottom: `${scaleY(0) - 6}px` }}>0</div>
                    </div>

                    {/* Chart Area with Grid & Bars */}
                    <div className="flex-1 h-[240px] relative border-b border-[#BDC1C6]">
                      {/* Gridlines */}
                      <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(topVal)}px` }} />
                      <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(line4)}px` }} />
                      <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(line3)}px` }} />
                      <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(line2)}px` }} />
                      <div className="absolute inset-x-0 border-t border-dashed border-[#E8EAED]" style={{ bottom: `${scaleY(line1)}px` }} />
                      
                      {/* Bars row container */}
                      <div className="absolute inset-0 flex flex-row justify-between items-end px-[12px]">
                        
                        {/* Current setting column */}
                        <div className="flex flex-col items-center justify-end h-full w-[72px] relative shrink-0">
                          <span className="absolute text-[12px] font-bold text-[#3C4043] transition-all duration-500" style={{ bottom: `${scaleY(currentBase) + 6}px` }}>
                            {currentBase}M
                          </span>
                          <div 
                            className="w-[42px] bg-[#7A869A] rounded-[4px_4px_0_0] transition-all duration-500 ease-in-out" 
                            style={{ height: `${scaleY(currentBase)}px`, bottom: '0px' }} 
                          />
                        </div>

                        {/* Bid/budget column */}
                        <div className={`flex flex-col items-center justify-end h-full relative transition-all duration-500 ease-in-out shrink-0 ${isBiddingChecked ? 'w-[72px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                          {isBiddingChecked && (
                            <>
                              <span className="absolute text-[11px] font-bold text-[#1A73E8] transition-all duration-500" style={{ bottom: `${scaleY(bidBottom + valBid) + 6}px` }}>
                                +{valBid.toFixed(1)}M
                              </span>
                              <div 
                                className="w-[42px] bg-[#669DF2] rounded-[4px] transition-all duration-500 ease-in-out absolute" 
                                style={{ height: `${scaleY(valBid)}px`, bottom: `${scaleY(bidBottom)}px` }} 
                              />
                            </>
                          )}
                        </div>

                        {/* VBB column */}
                        <div className={`flex flex-col items-center justify-end h-full relative transition-all duration-500 ease-in-out shrink-0 ${isValueBasedChecked ? 'w-[72px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                          {isValueBasedChecked && (
                            <>
                              <span className="absolute text-[11px] font-bold text-[#1A73E8] transition-all duration-500" style={{ bottom: `${scaleY(vbbBottom + valVBB) + 6}px` }}>
                                +{valVBB.toFixed(1)}M
                              </span>
                              <div 
                                className="w-[42px] bg-[#669DF2] rounded-[4px] transition-all duration-500 ease-in-out absolute" 
                                style={{ height: `${scaleY(valVBB)}px`, bottom: `${scaleY(vbbBottom)}px` }} 
                              />
                            </>
                          )}
                        </div>

                        {/* Broad match column */}
                        <div className={`flex flex-col items-center justify-end h-full relative transition-all duration-500 ease-in-out shrink-0 ${isAIMaxChecked ? 'w-[72px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                          {isAIMaxChecked && (
                            <>
                              <span className="absolute text-[11px] font-bold text-[#1A73E8] transition-all duration-500" style={{ bottom: `${scaleY(aiBottom + valAI) + 6}px` }}>
                                +{valAI.toFixed(1)}M
                              </span>
                              <div 
                                className="w-[42px] bg-[#669DF2] rounded-[4px] transition-all duration-500 ease-in-out absolute" 
                                style={{ height: `${scaleY(valAI)}px`, bottom: `${scaleY(aiBottom)}px` }} 
                              />
                            </>
                          )}
                        </div>

                        {/* W2AC column */}
                        <div className={`flex flex-col items-center justify-end h-full relative transition-all duration-500 ease-in-out shrink-0 ${isWebToAppChecked ? 'w-[72px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                          {isWebToAppChecked && (
                            <>
                              <span className="absolute text-[11px] font-bold text-[#1A73E8] transition-all duration-500" style={{ bottom: `${scaleY(w2acBottom + valW2AC) + 6}px` }}>
                                +{valW2AC.toFixed(1)}M
                              </span>
                              <div 
                                className="w-[42px] bg-[#669DF2] rounded-[4px] transition-all duration-500 ease-in-out absolute" 
                                style={{ height: `${scaleY(valW2AC)}px`, bottom: `${scaleY(w2acBottom)}px` }} 
                              />
                            </>
                          )}
                        </div>

                        {/* ECW column */}
                        <div className={`flex flex-col items-center justify-end h-full relative transition-all duration-500 ease-in-out shrink-0 ${isEnhancedChecked ? 'w-[72px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                          {isEnhancedChecked && (
                            <>
                              <span className="absolute text-[11px] font-bold text-[#1A73E8] transition-all duration-500" style={{ bottom: `${scaleY(ecwBottom + valECW) + 6}px` }}>
                                +{valECW.toFixed(1)}M
                              </span>
                              <div 
                                className="w-[42px] bg-[#669DF2] rounded-[4px] transition-all duration-500 ease-in-out absolute" 
                                style={{ height: `${scaleY(valECW)}px`, bottom: `${scaleY(ecwBottom)}px` }} 
                              />
                            </>
                          )}
                        </div>

                        {/* New DG column */}
                        <div className={`flex flex-col items-center justify-end h-full relative transition-all duration-500 ease-in-out shrink-0 ${isDemandGenChecked ? 'w-[72px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                          {isDemandGenChecked && (
                            <>
                              <span className="absolute text-[11px] font-bold text-[#1A73E8] transition-all duration-500" style={{ bottom: `${scaleY(dgBottom + valDG) + 6}px` }}>
                                +{valDG.toFixed(1)}M
                              </span>
                              <div 
                                className="w-[42px] bg-[#669DF2] rounded-[4px] transition-all duration-500 ease-in-out absolute" 
                                style={{ height: `${scaleY(valDG)}px`, bottom: `${scaleY(dgBottom)}px` }} 
                              />
                            </>
                          )}
                        </div>

                        {/* Total column */}
                        <div className="flex flex-col items-center justify-end h-full w-[72px] relative shrink-0">
                          <span className="absolute text-[12px] font-bold text-[#1A73E8] transition-all duration-500" style={{ bottom: `${scaleY(totalValue) + 6}px` }}>
                            {totalValue.toFixed(1)}M
                          </span>
                          <div 
                            className="w-[42px] bg-[#1A73E8] rounded-[4px_4px_0_0] transition-all duration-500 ease-in-out" 
                            style={{ height: `${scaleY(totalValue)}px`, bottom: '0px' }} 
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Row 1: Levers text labels below horizontal axis */}
                  <div className="flex flex-row min-w-[760px] pl-[70px]">
                    <div className="flex-1 flex flex-row justify-between items-start px-[12px] text-center text-[11px] text-[#5F6368] font-medium leading-tight mt-2">
                      <div className="w-[72px] shrink-0">Current setting</div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isBiddingChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        Bid/budget optimizations
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isValueBasedChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        VBB
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isAIMaxChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        Broad match
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isWebToAppChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        W2AC
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isEnhancedChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        ECW
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isDemandGenChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        New DG
                      </div>
                      <div className="w-[72px] shrink-0 font-bold text-[#3C4043]">Total</div>
                    </div>
                  </div>

                  {/* Row 2: Investment values below levers labels */}
                  <div className="flex flex-row min-w-[760px] border-t border-gray-100 pt-2 mt-1 items-center">
                    <div className="w-[70px] shrink-0 font-['Google_Sans'] font-bold text-[12px] text-[#5F6368] text-right pr-2">
                      Investment
                    </div>
                    <div className="flex-1 flex flex-row justify-between items-center px-[12px] text-center text-[12px] text-[#3C4043] font-medium">
                      <div className="w-[72px] shrink-0">$1.6M</div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isBiddingChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        +$0.2M
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isValueBasedChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        +$0.1M
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isAIMaxChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        +$0.1M
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isWebToAppChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        +$0.6M
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isEnhancedChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        +$0.4M
                      </div>
                      <div className={`transition-all duration-500 ease-in-out shrink-0 ${isDemandGenChecked ? 'w-[72px]' : 'w-0 overflow-hidden'}`}>
                        +$1.0M
                      </div>
                      <div className="w-[72px] shrink-0 font-bold">${totalInv.toFixed(1)}M</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right column: Customize growth levers */}
              <div className="w-full lg:w-[400px] bg-white border border-[#DADCE0] rounded-[20px] p-[24px] flex flex-col gap-[24px]">
                <div className="font-['Google_Sans'] font-medium text-[18px] text-[#1F1F1F] border-b border-gray-100 pb-3">
                  Customize growth levers
                </div>

                {/* Optimize group */}
                <div className="flex flex-col gap-[16px] w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <span className="font-['Google_Sans'] font-bold text-[13px] text-[#1F1F1F] uppercase tracking-wider">Optimize</span>
                    <span className="font-['Google_Sans_Text'] text-[11px] text-[#5F6368]">Forecast vs. Current</span>
                  </div>

                  {/* Lever 1: Bidding and budget */}
                  <div className="flex flex-col gap-1 w-full font-['Google_Sans_Text']">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={isBiddingChecked} 
                            onChange={(e) => setIsBiddingChecked(e.target.checked)} 
                            className="sr-only"
                          />
                          {/* Custom Toggle Pill Switch */}
                          <div className={`w-[36px] h-[20px] rounded-full transition-colors duration-300 ${isBiddingChecked ? 'bg-[#1A73E8]' : 'bg-[#72777A]'}`}></div>
                          <div className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 shadow-sm ${isBiddingChecked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="font-normal text-[14px] text-[#1F1F1F]">Bidding and budget</span>
                      </label>
                    </div>
                    <span className="text-[12px] text-[#5F6368] pl-[48px] leading-[16px]">
                      Enforce specific conv. value/ invest. for DG (forecasted at <strong>3.62</strong>)
                    </span>
                  </div>

                  {/* Lever 2: PMax Ad strength */}
                  <div className="flex flex-row justify-between items-center w-full font-['Google_Sans_Text']">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isPMaxChecked} 
                          onChange={(e) => setIsPMaxChecked(e.target.checked)} 
                          className="sr-only"
                        />
                        <div className={`w-[36px] h-[20px] rounded-full transition-colors duration-300 ${isPMaxChecked ? 'bg-[#1A73E8]' : 'bg-[#72777A]'}`}></div>
                        <div className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 shadow-sm ${isPMaxChecked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="font-normal text-[14px] text-[#1F1F1F]">PMax Ad strength</span>
                    </label>
                    <span className="text-[13px] text-[#1F1F1F] font-medium"><strong>36%</strong> vs. 25%</span>
                  </div>
                </div>

                {/* Grow product adoption group */}
                <div className="flex flex-col gap-[16px] w-full pt-2 border-t border-gray-100">
                  <div className="flex flex-row justify-between items-center w-full">
                    <span className="font-['Google_Sans'] font-bold text-[13px] text-[#1F1F1F] uppercase tracking-wider">Grow product adoption</span>
                    <span className="font-['Google_Sans_Text'] text-[11px] text-[#5F6368]">Forecast vs. Current</span>
                  </div>

                  {/* Value based bidding */}
                  <div className="flex flex-row justify-between items-center w-full font-['Google_Sans_Text']">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isValueBasedChecked} 
                          onChange={(e) => setIsValueBasedChecked(e.target.checked)} 
                          className="sr-only"
                        />
                        <div className={`w-[36px] h-[20px] rounded-full transition-colors duration-300 ${isValueBasedChecked ? 'bg-[#1A73E8]' : 'bg-[#72777A]'}`}></div>
                        <div className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 shadow-sm ${isValueBasedChecked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="font-normal text-[14px] text-[#1F1F1F]">Value based bidding</span>
                    </label>
                    <span className="text-[13px] text-[#1F1F1F] font-medium"><strong>75%</strong> vs. 25%</span>
                  </div>

                  {/* AI Max */}
                  <div className="flex flex-row justify-between items-center w-full font-['Google_Sans_Text']">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isAIMaxChecked} 
                          onChange={(e) => setIsAIMaxChecked(e.target.checked)} 
                          className="sr-only"
                        />
                        <div className={`w-[36px] h-[20px] rounded-full transition-colors duration-300 ${isAIMaxChecked ? 'bg-[#1A73E8]' : 'bg-[#72777A]'}`}></div>
                        <div className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 shadow-sm ${isAIMaxChecked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="font-normal text-[14px] text-[#1F1F1F]">AI Max</span>
                    </label>
                    <span className="text-[13px] text-[#1F1F1F] font-medium"><strong>40%</strong> vs. 14%</span>
                  </div>

                  {/* Web to App Connect */}
                  <div className="flex flex-row justify-between items-center w-full font-['Google_Sans_Text']">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isWebToAppChecked} 
                          onChange={(e) => setIsWebToAppChecked(e.target.checked)} 
                          className="sr-only"
                        />
                        <div className={`w-[36px] h-[20px] rounded-full transition-colors duration-300 ${isWebToAppChecked ? 'bg-[#1A73E8]' : 'bg-[#72777A]'}`}></div>
                        <div className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 shadow-sm ${isWebToAppChecked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="font-normal text-[14px] text-[#1F1F1F]">Web to App Connect</span>
                    </label>
                    <span className="text-[13px] text-[#1F1F1F] font-medium"><strong>32%</strong> vs. 12%</span>
                  </div>

                  {/* Enhanced Conversions */}
                  <div className="flex flex-row justify-between items-center w-full font-['Google_Sans_Text']">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isEnhancedChecked} 
                          onChange={(e) => setIsEnhancedChecked(e.target.checked)} 
                          className="sr-only"
                        />
                        <div className={`w-[36px] h-[20px] rounded-full transition-colors duration-300 ${isEnhancedChecked ? 'bg-[#1A73E8]' : 'bg-[#72777A]'}`}></div>
                        <div className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 shadow-sm ${isEnhancedChecked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="font-normal text-[14px] text-[#1F1F1F]">Enhanced Conversions for Web</span>
                    </label>
                    <span className="text-[13px] text-[#1F1F1F] font-medium"><strong>29%</strong> vs. 8%</span>
                  </div>
                </div>

                {/* Launch new campaigns group */}
                <div className="flex flex-col gap-[16px] w-full pt-2 border-t border-gray-100">
                  <div className="flex flex-row justify-between items-center w-full">
                    <span className="font-['Google_Sans'] font-bold text-[13px] text-[#1F1F1F] uppercase tracking-wider">Launch new campaigns</span>
                    <span className="font-['Google_Sans_Text'] text-[11px] text-[#5F6368]">Forecast vs. Current</span>
                  </div>

                  {/* PMax Campaigns */}
                  <div className="flex flex-row justify-between items-center w-full font-['Google_Sans_Text']">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isPMaxCampaignChecked} 
                          onChange={(e) => setIsPMaxCampaignChecked(e.target.checked)} 
                          className="sr-only"
                        />
                        <div className={`w-[36px] h-[20px] rounded-full transition-colors duration-300 ${isPMaxCampaignChecked ? 'bg-[#1A73E8]' : 'bg-[#72777A]'}`}></div>
                        <div className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 shadow-sm ${isPMaxCampaignChecked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="font-normal text-[14px] text-[#1F1F1F]">New PMax campaigns</span>
                    </label>
                    <i className="google-symbols text-[18px] text-[#5F6368] cursor-pointer">help_outline</i>
                  </div>

                  {/* Demand Gen Campaigns */}
                  <div className="flex flex-row justify-between items-center w-full font-['Google_Sans_Text']">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isDemandGenChecked} 
                          onChange={(e) => setIsDemandGenChecked(e.target.checked)} 
                          className="sr-only"
                        />
                        <div className={`w-[36px] h-[20px] rounded-full transition-colors duration-300 ${isDemandGenChecked ? 'bg-[#1A73E8]' : 'bg-[#72777A]'}`}></div>
                        <div className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 shadow-sm ${isDemandGenChecked ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="font-normal text-[14px] text-[#1F1F1F]">New Demand Gen campaigns</span>
                    </label>
                    <span className="text-[13px] text-[#1F1F1F] font-medium"><strong>24%</strong> vs. 12%</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Actions row */}
            <div className="flex flex-row items-center justify-end w-full border-t border-gray-100 pt-4 mt-3 gap-[16px]">
              <button className="box-border flex flex-row items-center p-[6px_12px] gap-[6px] h-[32px] border border-[#DADCE0] rounded-full bg-transparent font-['Google_Sans_Text'] text-[13px] text-[#3C4043] cursor-pointer hover:bg-gray-50">
                <i className="google-symbols text-[18px]">download</i>
                <span>Export</span>
              </button>
              <button className="font-['Google_Sans'] font-medium text-[14px] text-[#1A73E8] bg-transparent border-none cursor-pointer hover:underline">
                Open full experience &rarr;
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
