import React from 'react';

export const AgentUpdateMessage = ({ onOpenCanvas }: { onOpenCanvas?: () => void }) => {
  return (
    <div className="flex flex-col items-start p-0 gap-[8px] w-[388px]">
      <div className="flex flex-col justify-center items-start pl-[8px] gap-[16px] w-[388px] h-[32px]">
        <div className="flex flex-row items-center p-0 gap-[8px] w-[380px] h-[32px]">
          <div className="w-[32px] h-[32px] shrink-0 relative flex items-center justify-center">
            <div className="absolute w-[22px] h-[22px] inset-0 m-auto flex items-center justify-center">
              <div 
                className="absolute inset-[3.96%] bg-white z-0"
              />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute z-10 w-full h-full">
                <path d="M16.1862 2.125H7.81373C6.87623 2.125 6.00873 2.625 5.53998 3.4375L1.35498 10.6875C0.88623 11.5 0.88623 12.5 1.35498 13.3125L5.54123 20.5625C6.00998 21.375 6.87623 21.875 7.81498 21.875H16.1862C17.1237 21.875 17.9912 21.375 18.46 20.5625L22.6462 13.3125C23.115 12.5 23.115 11.5 22.6462 10.6875L18.46 3.4375C17.9912 2.625 17.125 2.125 16.1862 2.125Z" fill="url(#paint0_linear_gemini)"/>
                <path d="M6.90125 21.5265L22.795 12.3502C22.915 12.2802 22.9963 12.1502 22.9963 12.0015C22.9963 12.4502 22.88 12.899 22.6488 13.3002L18.4487 20.5752C17.985 21.379 17.1262 21.874 16.1987 21.874H7.79875C7.335 21.874 6.88875 21.7502 6.5 21.5252C6.62875 21.6002 6.78125 21.5952 6.9025 21.5252L6.90125 21.5265Z" fill="#1A73E8"/>
                <path d="M10.5 15.5C10.45 15.5 10.4038 15.4837 10.3625 15.45C10.3213 15.4162 10.2912 15.375 10.275 15.325C10.1337 14.7662 9.92125 14.2413 9.6375 13.75C9.35375 13.2587 9.00875 12.8087 8.6 12.4C8.19125 11.9912 7.74125 11.6463 7.25 11.3625C6.75875 11.0788 6.23375 10.8663 5.675 10.725C5.625 10.7088 5.58375 10.6787 5.55 10.6375C5.51625 10.5962 5.5 10.55 5.5 10.5C5.5 10.45 5.51625 10.4038 5.55 10.3625C5.58375 10.3213 5.625 10.2912 5.675 10.275C6.23375 10.1337 6.75875 9.92125 7.25 9.6375C7.74125 9.35375 8.19125 9.00875 8.6 8.6C9.00875 8.19125 9.35375 7.74125 9.6375 7.25C9.92125 6.75875 10.1337 6.23375 10.275 5.675C10.2912 5.625 10.3213 5.58375 10.3625 5.55C10.4038 5.51625 10.45 5.5 10.5 5.5C10.55 5.5 10.5938 5.51625 10.6313 5.55C10.6688 5.58375 10.6962 5.625 10.7125 5.675C10.8625 6.23375 11.0788 6.75875 11.3625 7.25C11.6463 7.74125 11.9912 8.19125 12.4 8.6C12.8087 9.00875 13.2587 9.35375 13.75 9.6375C14.2413 9.92125 14.7662 10.1337 15.325 10.275C15.375 10.2912 15.4162 10.3213 15.45 10.3625C15.4837 10.4038 15.5 10.45 15.5 10.5C15.5 10.55 15.4837 10.5962 15.45 10.6375C15.4162 10.6787 15.375 10.7088 15.325 10.725C14.7662 10.8663 14.2413 11.0788 13.75 11.3625C13.2587 11.6463 12.8087 11.9912 12.4 12.4C11.9912 12.8087 11.6463 13.2587 11.3625 13.75C11.0788 14.2413 10.8663 14.7662 10.725 15.325C10.7088 15.375 10.6787 15.4162 10.6375 15.45C10.5962 15.4837 10.55 15.5 10.5 15.5Z" fill="white" className="z-20 relative"/>
                <defs>
                  <linearGradient id="paint0_linear_gemini" x1="7.77748" y1="15.445" x2="16.72" y2="8.14875" gradientUnits="userSpaceOnUse">
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
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex flex-row items-center gap-[4px] h-[32px]">
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1F1F1F]">Agent</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start p-0 gap-[16px] w-[388px]">
        <div className="flex flex-col items-start p-0 gap-[8px] w-[388px]">
          <div className="flex flex-col items-start px-[16px] gap-[8px] w-[388px]">
            <div className="flex flex-col items-start p-0 gap-[8px] w-full">
              <div className="flex flex-row items-start p-0 gap-[8px] w-full">
                <i className="google-symbols shrink-0 text-[#444746] text-[20px]">article_spark</i>
                <div className="font-['Google_Sans'] font-bold text-[16px] leading-[20px] tracking-[0.16px] text-[#1B1B1C] w-full">
                  Sales outlook and forecast notes updated
                </div>
              </div>

              <div className="font-['Roboto'] font-normal text-[13px] leading-[20px] tracking-[0.2px] text-[#202124] w-full max-w-[335px] mt-1">
                I have updated your <span className="font-bold">Sales outlook totals</span> and updated Display, Apps, Search+ and YouTube+ for each company in your portfolio.
                <br/><br/>
                I have also updated your <span className="font-bold">weekly forecast notes</span> on your behalf. You may view and make edits.
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center px-[16px] gap-[8px] w-full">
          <button onClick={onOpenCanvas} className="flex flex-col justify-center items-start p-0 gap-[8px] bg-[#3271EA] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors">
            <div className="flex flex-row justify-center items-center px-[12px] gap-[4px] h-[36px] rounded-[4px]">
              <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-white">
                View sales outlook and forecast notes
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
