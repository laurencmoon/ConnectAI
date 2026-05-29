import React from 'react';

export const CanvasLoadingState = ({ type = 'diagnose' }: { type?: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides' }) => {
  return (
    <div className="fixed right-0 left-[420px] top-0 bottom-0 z-[60] bg-white flex flex-col border-l border-[#E8EAED] shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out">
      <style>{`
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
          border-radius: 24px;
        }
      `}</style>
      
      <div className="flex flex-col items-start p-0 isolate w-[calc(100%-48px)] max-w-[1680px] mx-auto shrink-0 bg-[linear-gradient(266.54deg,#E7F2FF_0%,#F7ECFE_100%)] border-b border-l border-r border-[#DADCE0] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.04)] rounded-b-[20px] relative z-10">
        {/* [Primary row] */}
        <div className="box-border flex flex-col items-start p-[8px_8px_16px_24px] w-full h-[88px] border-b border-[#DADCE0] z-[2]">
          {/* [row] */}
          <div className="flex flex-row items-center pt-[8px] gap-[24px] w-full h-[48px]">
            {/* Header canvas title */}
            <div className="font-['Google_Sans'] font-medium text-[32px] leading-[40px] text-[#000000] flex-1 truncate">
              {type === 'prepare' ? 'Meeting brief' : type === 'gap' ? 'Gap to Target canvas' : type === 'sales' ? 'Sales Outlook canvas' : type === 'slides' ? 'Pitch Deck presentation' : 'Company Diagnosis canvas'}
            </div>
            
            {/* [Page level actions] */}
            <div className="flex flex-row justify-end items-center p-0 w-[96px] h-[48px]">
              <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
                <i className="google-symbols text-[24px] leading-none text-[#5F6368]">ios_share</i>
              </button>
              <button className="flex flex-col justify-center items-center p-[8px] w-[48px] min-w-[32px] h-[48px] min-h-[32px] rounded-full border-none bg-transparent cursor-pointer hover:bg-black/5">
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
      
      <div className="flex-1 overflow-y-auto p-6 bg-[#ffffff] flex flex-col items-center">
        <div className="w-full max-w-[1680px] flex flex-col gap-[32px] items-stretch justify-start">
          
          <div className="flex flex-row items-center gap-[32px] w-full h-[207px] shrink-0">
            <div className="flex-1 h-full shimmer-bg"></div>
            <div className="flex-1 h-full shimmer-bg"></div>
          </div>
          
          <div className="w-full h-[263px] shrink-0 shimmer-bg"></div>
          <div className="w-full h-[261px] shrink-0 shimmer-bg"></div>
          <div className="w-full h-[262px] shrink-0 shimmer-bg"></div>

        </div>
      </div>
    </div>
  );
};
