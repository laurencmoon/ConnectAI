import React from 'react';

export const ActionItemsHoverCard = ({ companyName = 'Neary Brands', topicTitle = '3 action items' }: { companyName?: string, topicTitle?: string }) => {
  return (
    <div className="absolute z-50 flex flex-col items-start p-0 w-[369px] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] rounded-[8px] top-full left-1/2 -translate-x-1/2 mt-2 cursor-default no-underline text-left">
      {/* Header */}
      <div className="flex flex-row items-center p-[8px_16px] gap-[10px] w-full h-[32px] bg-white shadow-[inset_0px_-1px_0px_#DADCE0] rounded-t-[8px]">
        <div className="flex flex-row items-center p-0 gap-[4px]">
          <i className="google-symbols text-[16px] text-[#5F6368]">business</i>
          <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#202124]">
            {companyName}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-start p-[12px_0px] gap-[8px] w-full bg-white rounded-b-[8px]">
        <div className="flex flex-row items-center p-[0px_16px] gap-[2px] w-full h-[20px]">
          <div className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#202124]">
            {topicTitle}:
          </div>
        </div>

        <div className="flex flex-col items-start p-[0px_16px] gap-[8px] w-full">
          <div className="flex items-start">
            <span className="mr-2 mt-2 w-1 h-1 bg-[#1B1B1C] rounded-full flex-shrink-0"></span>
            <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1B1B1C]">
              <span className="font-medium">Credit Invoice Resolve ($16k):</span> No confirmation was found that the manual $16k USD/AUD credit subtraction from the January meeting was finalized.
            </div>
          </div>

          <div className="flex items-start">
            <span className="mr-2 mt-2 w-1 h-1 bg-[#1B1B1C] rounded-full flex-shrink-0"></span>
            <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1B1B1C]">
              <span className="font-medium">Organize NIO Meeting (Neary/PD/Google):</span> Currently awaiting confirmation of the agenda and final attendee list.
            </div>
          </div>

          <div className="flex items-start">
            <span className="mr-2 mt-2 w-1 h-1 bg-[#1B1B1C] rounded-full flex-shrink-0"></span>
            <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1B1B1C]">
              <span className="font-medium">Consult Google Global on NIO Initiative:</span> No corresponding completion signal was found in recent messages or notes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
