import React from 'react';

export const DailyAnomaliesHoverCard = () => {
  return (
    <div className="absolute z-50 flex flex-col items-start p-0 w-[725px] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] rounded-[8px] top-full left-1/2 -translate-x-1/2 mt-2 cursor-default no-underline text-left">
      {/* Header */}
      <div className="flex flex-row items-center p-[8px_16px] gap-[10px] w-full h-[32px] bg-white shadow-[inset_0px_-1px_0px_#DADCE0] rounded-t-[8px]">
        <div className="flex flex-row items-center p-0 gap-[4px]">
          <i className="google-symbols text-[16px] text-[#5F6368]">business</i>
          <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#202124]">
            Acme Corp
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-row items-start p-0 w-full h-[124px]">
        
        {/* Column 1: Accounts */}
        <div className="flex flex-col justify-start items-start p-0 w-[160px] h-full bg-white">
          <div className="flex flex-row items-center p-[4px_24px_4px_16px] gap-[8px] h-[24px]">
            <div className="font-['Google_Sans'] font-medium text-[10px] leading-[16px] tracking-[0.1px] text-[#202124]">
              Accounts
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col items-start p-[4px_16px] w-full h-[44px]">
            <div className="flex flex-row items-start p-0 gap-[4px] rounded-[16px]">
              <div className="flex flex-col justify-center items-start p-0 gap-[10px] h-[18px]">
                <div className="flex flex-row justify-center items-center px-[4px] py-0 gap-[10px] h-[13px] bg-[#5F6368] rounded-[4px]">
                  <div className="font-['Google_Sans'] font-normal text-[10px] leading-[13px] tracking-[0.1px] text-white">
                    GA
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-start p-0">
                <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
                  Acme corp NY42
                </div>
                <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368]">
                  11284619
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col items-start p-[4px_16px] w-full h-[44px]">
            <div className="flex flex-row items-start p-0 gap-[4px] rounded-[16px]">
              <div className="flex flex-col justify-center items-start p-0 gap-[10px] h-[18px]">
                <div className="flex flex-row justify-center items-center px-[4px] py-0 gap-[10px] h-[13px] bg-[#5F6368] rounded-[4px]">
                  <div className="font-['Google_Sans'] font-normal text-[10px] leading-[13px] tracking-[0.1px] text-white">
                    GA
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-start p-0">
                <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
                  Acme corp P-US
                </div>
                <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368]">
                  588918
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
        </div>

        {/* Column 2: Revenue */}
        <div className="flex flex-col justify-start items-end p-0 w-[73px] h-full bg-white">
          <div className="flex flex-row justify-end items-center p-[4px_10px_4px_16px] gap-[8px] h-[24px]">
            <div className="font-['Google_Sans'] font-medium text-[10px] leading-[16px] tracking-[0.1px] text-[#202124]">
              Revenue
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
            <div className="flex flex-col items-end p-0 w-full">
              <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
                $316k
              </div>
              <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368]">
                Sun, Mar 1
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
            <div className="flex flex-col items-end p-0 w-full">
              <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
                $281k
              </div>
              <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368]">
                Sun, Mar 1
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
        </div>

        {/* Column 3: Anomaly */}
        <div className="flex flex-col justify-start items-start p-0 w-[186px] h-full bg-white">
          <div className="flex flex-row justify-center items-center p-[4px_10px] gap-[8px] h-[24px]">
            <div className="font-['Google_Sans'] font-medium text-[10px] leading-[16px] tracking-[0.1px] text-[#202124]">
              Anomaly
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
            <div className="flex flex-row items-center p-0 gap-[4px]">
              <i className="google-symbols text-[16px] text-[#C5221F]">arrow_downward</i>
              <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
                $16.2k below expected
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
            <div className="flex flex-row items-center p-0 gap-[4px]">
              <i className="google-symbols text-[16px] text-[#C5221F]">arrow_downward</i>
              <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
                $12.8k below expected
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
        </div>

        {/* Column 4: Insights */}
        <div className="flex flex-col justify-start items-start p-0 w-[128px] h-full bg-white">
          <div className="flex flex-row justify-center items-center p-[4px_10px] gap-[8px] h-[24px]">
            <div className="font-['Google_Sans'] font-medium text-[10px] leading-[16px] tracking-[0.1px] text-[#202124]">
              Insights
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
            <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
              Budget decreased
            </div>
            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368]">
              5 campaigns
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
            <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
              Budget decreased
            </div>
            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368]">
              3 campaigns
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
        </div>

        {/* Column 5: Trend */}
        <div className="flex flex-col justify-start items-start p-0 w-[100px] h-full bg-white">
          <div className="flex flex-row justify-center items-center p-[4px_10px] gap-[8px] h-[24px]">
            <div className="font-['Google_Sans'] font-medium text-[10px] leading-[16px] tracking-[0.1px] text-[#202124]">
              Trend
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
            <div className="relative w-[84px] h-[14px]">
              <svg width="84" height="14" viewBox="0 0 84 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
                <path d="M0 7L16 7L24 10L48 10L64 10L84 14" stroke="#BDC1C6" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M0 7L16 7L24 10L48 10L64 10L80 14" stroke="#1A73E8" strokeWidth="1" />
              </svg>
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
            <div className="relative w-[84px] h-[14px]">
              <svg width="84" height="14" viewBox="0 0 84 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
                <path d="M0 7L16 7L24 10L48 10L64 10L84 14" stroke="#BDC1C6" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M0 7L16 7L24 10L48 10L64 10L80 14" stroke="#1A73E8" strokeWidth="1" />
              </svg>
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
        </div>

        {/* Column 6: Actions */}
        <div className="flex flex-col justify-start items-end p-0 w-[78px] h-full bg-white">
          <div className="flex flex-row justify-center items-center p-[4px_10px] gap-[8px] h-[24px]">
            <div className="font-['Google_Sans'] font-medium text-[10px] leading-[16px] tracking-[0.1px] text-[#202124]">
              
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px_4px_16px] w-full h-[44px]">
            <button className="flex flex-row items-center p-0 gap-[4px] bg-transparent border-none cursor-pointer">
              <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#1A73E8]">
                View
              </div>
              <i className="google-symbols text-[18px] text-[#1A73E8]">chevron_right</i>
            </button>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px_4px_16px] w-full h-[44px]">
            <button className="flex flex-row items-center p-0 gap-[4px] bg-transparent border-none cursor-pointer">
              <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#1A73E8]">
                View
              </div>
              <i className="google-symbols text-[18px] text-[#1A73E8]">chevron_right</i>
            </button>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
