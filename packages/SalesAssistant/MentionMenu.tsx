import React from 'react';
import { MENTION_CATEGORIES, MENTION_DATA } from './MentionMenuData';

interface MentionMenuProps {
  category: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectItem: (item: any) => void;
  query: string;
}

export const MentionMenu: React.FC<MentionMenuProps> = ({ category, onSelectCategory, onSelectItem, query }) => {
  const currentCategory = category ? MENTION_CATEGORIES.find(c => c.id === category) : null;
  const items = category ? (MENTION_DATA[category] || []) : [];

  const getDriveIconShape = (type: string) => {
    switch(type) {
      case 'doc': return <div className="text-[#1A73E8] bg-white border border-[#E0E0E0] rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)] w-4 h-4 flex items-center justify-center text-[10px]"><i className="google-symbols font-medium text-[12px]">description</i></div>;
      case 'sheet': return <div className="text-[#188038] bg-white border border-[#E0E0E0] rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)] w-4 h-4 flex items-center justify-center text-[10px]"><i className="google-symbols font-medium text-[12px]">grid_on</i></div>;
      case 'slide': return <div className="text-[#F4B400] bg-white border border-[#E0E0E0] rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)] w-4 h-4 flex items-center justify-center text-[10px]"><i className="google-symbols font-medium text-[12px]">slideshow</i></div>;
      default: return <div className="text-[#5F6368] bg-white border border-[#E0E0E0] rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)] w-4 h-4 flex items-center justify-center text-[10px]"><i className="google-symbols font-medium text-[12px]">draft</i></div>;
    }
  };

  if (!category) {
    return (
      <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#f8f9fa] border border-[#e8eaed] shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-[16px] overflow-hidden z-50">
        <div className="px-4 py-3 font-['Google_Sans_Text'] font-medium text-[14px] text-[#202124]">
          Select a category
        </div>
        <div className="flex flex-col py-2 max-h-[300px] overflow-y-auto">
          {MENTION_CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat.id)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-[#e8f0fe] bg-transparent border-none cursor-pointer w-full text-left"
            >
              <div className="w-5 h-5 flex items-center justify-center text-[#5f6368]">
                {cat.id === 'accounts' ? (
                  <div className="text-[10px] font-bold tracking-tighter bg-[#5f6368] text-white w-full h-full flex items-center justify-center rounded-[2px]">GA</div>
                ) : cat.id === 'google_drive' ? (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%.svg.png" className="w-full h-full object-contain" alt="Drive" onError={(e) => e.currentTarget.src = "https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png"} />
                ) : (
                  <i className="google-symbols text-[20px]">{cat.icon}</i>
                )}
              </div>
              <span className="font-['Google_Sans_Text'] font-medium text-[14px] text-[#202124] flex-1">{cat.title}</span>
              <i className="google-symbols text-[20px] text-[#5f6368]">chevron_right</i>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#f8f9fa] border border-[#e8eaed] shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-[16px] overflow-hidden z-50 flex flex-col max-h-[550px]">
      <button 
        onClick={() => onSelectCategory(null)}
        className="flex items-center gap-2 px-4 py-4 hover:bg-[#e8eaed] bg-transparent border-none cursor-pointer w-full text-left font-['Google_Sans_Text'] font-medium text-[14px] text-[#202124] shrink-0"
      >
        <i className="google-symbols text-[18px]">chevron_left</i>
        {currentCategory?.title} ({currentCategory?.count})
      </button>
      <div className="flex flex-col py-1 overflow-y-auto w-full pb-3">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectItem(item)}
            className={`flex ${item.sub ? 'items-start py-3' : 'items-center py-2.5'} gap-4 px-4 hover:bg-[#e8f0fe] bg-transparent border-none cursor-pointer w-full text-left`}
          >
            <div className={`w-5 h-5 flex items-center justify-center text-[#5f6368] shrink-0 ${item.sub ? 'mt-0.5' : ''}`}>
               {category === 'accounts' ? (
                  <div className={`text-[10px] font-bold tracking-tighter ${item.badge === 'DV' ? 'bg-[#5f6368]' : 'bg-[#5f6368]'} text-white w-full h-full flex flex-col items-center justify-center rounded-[2px]`}>{item.badge}</div>
                ) : category === 'google_drive' ? (
                  getDriveIconShape(item.type)
                ) : category === 'ad_campaigns' ? (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg" className="w-full h-full object-contain" alt="Ads" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<i class="google-symbols text-[20px]">campaign</i>'); }} />
                ) : category === 'meetings' ? (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Google_Calendar_icon_%282020%29.svg" className="w-full h-full object-contain" alt="Calendar" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<i class="google-symbols text-[20px]">calendar_today</i>'); }} />
                ) : (
                  <i className="google-symbols text-[20px]">{item.icon || currentCategory?.icon}</i>
                )}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden justify-center">
              <span className={`font-['Google_Sans_Text'] font-medium text-[14px] leading-tight text-[#202124] whitespace-nowrap overflow-hidden text-ellipsis ${item.sub ? 'mb-1' : ''}`}>{item.title}</span>
              {item.sub && (
                <span className="font-['Google_Sans_Text'] font-normal text-[12px] leading-tight text-[#5f6368] whitespace-nowrap overflow-hidden text-ellipsis">{item.sub}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
