import React from 'react';

export const AccountsDecliningHoverCard = () => {
  return (
    <div className="absolute z-50 flex flex-col items-start p-0 w-[410px] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] rounded-[8px] top-full left-1/2 -translate-x-1/2 mt-2 cursor-default no-underline text-left">
      {/* Header */}
      <div className="flex flex-row items-center p-[8px_16px] gap-[10px] w-full h-[32px] bg-white rounded-t-[8px]">
        <div className="flex flex-row items-center p-0 gap-[4px]">
          <i className="google-symbols text-[16px] text-[#5F6368]">business</i>
          <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#202124]">
            Acme Corp
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-row items-start p-[0px_16px] gap-[12px] w-full h-[36px] bg-white shadow-[inset_0px_-1px_0px_#DADCE0]">
        <div className="flex flex-col justify-end items-center p-0 w-[93px] h-[36px]">
          <div className="flex flex-col justify-center items-center p-[0px_16px] w-full h-full relative">
            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#1B1B1C]">
              Decliners
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3271EA]"></div>
          </div>
        </div>
        <div className="flex flex-col justify-end items-center p-0 w-[71px] h-[36px]">
          <div className="flex flex-col justify-center items-center p-[0px_16px] w-full h-full">
            <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#474747]">
              Risers
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-row items-start p-0 w-full h-[168px] bg-white shadow-[inset_0px_-1px_0px_#DADCE0] rounded-b-[8px]">
        
        {/* Column 1: Accounts */}
        <div className="flex flex-col justify-start items-start p-0 w-[174px] h-full bg-white rounded-bl-[8px]">
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
                <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124] truncate w-[100px]">
                  Acme corp West
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
                <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124] truncate w-[115px]">
                  Acme corp US Star
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
                <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124] truncate w-[92px]">
                  Acme corp MW
                </div>
                <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368]">
                  4881160
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: 7d w/w */}
        <div className="flex flex-col justify-start items-end p-0 w-[63px] h-full bg-white">
          <div className="flex flex-row justify-end items-center p-[4px_10px_4px_16px] gap-[8px] h-[24px]">
            <div className="font-['Google_Sans'] font-medium text-[10px] leading-[16px] tracking-[0.1px] text-[#202124]">
              7d w/w
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-end p-[4px_8px] w-full h-[44px]">
            <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
              -$15.2k
            </div>
            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#C5221F]">
              -6%
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-end p-[4px_8px] w-full h-[44px]">
            <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
              -$12.6k
            </div>
            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#C5221F]">
              -5%
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-end p-[4px_8px] w-full h-[44px]">
            <div className="font-['Google_Sans_Text'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
              -$10.6k
            </div>
            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#C5221F]">
              -3%
            </div>
          </div>
        </div>

        {/* Column 3: Insights */}
        <div className="flex flex-col justify-start items-start p-0 w-[173px] h-full bg-white rounded-br-[8px]">
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
              Campaign budget paused
            </div>
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
          </div>
          <div className="flex flex-row items-center py-[2px] px-0 w-full h-[4px]">
            <div className="w-full h-0 border-t border-[rgba(1,44,111,0.1)]"></div>
          </div>
          <div className="flex flex-col justify-center items-start p-[4px_8px] w-full h-[44px]">
          </div>
        </div>

      </div>
    </div>
  );
};
