import React, { useState, useEffect } from 'react';

export const Canvas = ({ onClose }: { onClose: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed left-0 right-[420px] top-0 bottom-0 z-40 bg-white flex flex-col border-r border-[#E8EAED] shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EAED] h-[72px] shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-[22px] font-medium text-[#202124] m-0">Company diagnosis for Acme Corp</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#F1F3F4] rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center">
            <i className="google-symbols text-[24px] text-[#5F6368]">ios_share</i>
          </button>
          <button onClick={onClose} className="p-2 hover:bg-[#F1F3F4] rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center">
            <i className="google-symbols text-[24px] text-[#5F6368]">close</i>
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <style>{`
            @keyframes shimmer {
              0% {
                background-position: 0% 0;
              }
              100% {
                background-position: 100% 0;
              }
            }
            .animate-shimmer {
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
            }
          `}</style>
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex gap-6">
              <div className="h-[240px] flex-1 rounded-[24px] animate-shimmer"></div>
              <div className="h-[240px] flex-1 rounded-[24px] animate-shimmer"></div>
            </div>
            <div className="h-[240px] w-full rounded-[24px] animate-shimmer"></div>
            <div className="h-[240px] w-full rounded-[24px] animate-shimmer"></div>
            <div className="h-[240px] w-full rounded-[24px] animate-shimmer"></div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA]">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E8EAED] p-8">
            <h2 className="text-[24px] font-medium text-[#202124] mb-6 mt-0">Q3 Performance Overview</h2>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-6 border border-[#E8EAED] rounded-xl">
                <div className="text-[14px] text-[#5F6368] mb-2">Total Revenue</div>
                <div className="text-[32px] font-medium text-[#202124]">$4.2M</div>
                <div className="text-[14px] text-[#1E8E3E] mt-2 flex items-center gap-1">
                  <i className="google-symbols text-[16px]">trending_up</i> +12% vs last quarter
                </div>
              </div>
              <div className="p-6 border border-[#E8EAED] rounded-xl">
                <div className="text-[14px] text-[#5F6368] mb-2">ROAS</div>
                <div className="text-[32px] font-medium text-[#202124]">3.8x</div>
                <div className="text-[14px] text-[#1E8E3E] mt-2 flex items-center gap-1">
                  <i className="google-symbols text-[16px]">trending_up</i> +0.4x vs target
                </div>
              </div>
              <div className="p-6 border border-[#E8EAED] rounded-xl">
                <div className="text-[14px] text-[#5F6368] mb-2">Active Campaigns</div>
                <div className="text-[32px] font-medium text-[#202124]">14</div>
                <div className="text-[14px] text-[#5F6368] mt-2 flex items-center gap-1">
                  <i className="google-symbols text-[16px]">keep</i> 2 need attention
                </div>
              </div>
            </div>
            <h3 className="text-[18px] font-medium text-[#202124] mb-4">Key Insights</h3>
            <ul className="space-y-4 p-0 m-0 list-none">
              <li className="flex gap-3">
                <i className="google-symbols text-[#1A73E8]">lightbulb</i>
                <div>
                  <div className="font-medium text-[#202124]">Search campaigns driving growth</div>
                  <div className="text-[#5F6368] text-[14px]">Non-brand search queries related to "enterprise solutions" have increased by 24%, driving a significant portion of the new leads.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <i className="google-symbols text-[#D93025]">warning</i>
                <div>
                  <div className="font-medium text-[#202124]">Display network fatigue</div>
                  <div className="text-[#5F6368] text-[14px]">CTR on the main display prospecting campaign has dropped by 15% over the last 3 weeks. Recommend refreshing creative assets.</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
