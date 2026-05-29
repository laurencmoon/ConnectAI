import React, { useState, useRef } from 'react';
import { useRipple } from '../hooks/useRipple';
import { ConnectAILogo, ConnectAiLogoHovered, ConnectAiBg, ConnectAiBgHovered } from './Icons';

export const NavRailItem = ({ itemName, itemLogo, fontFamily, active = false, onClick }: { itemName: string, itemLogo: string, fontFamily: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`box-border flex flex-col items-center justify-center p-0 w-full bg-transparent border-0 cursor-pointer no-underline group ${active ? 'active' : ''}`}>
    <div className={`box-border flex flex-col gap-1 items-center justify-center py-[6px] px-2 w-full rounded-2xl group-hover:before:bg-[rgba(32,33,36,0.08)] group-[.active]:before:bg-[#1967d2] group-hover:before:rounded-full group-hover:before:content-[''] group-hover:before:h-8 group-hover:before:absolute group-hover:before:w-14 group-hover:before:z-[-1] group-[.active]:before:rounded-full group-[.active]:before:content-[''] group-[.active]:before:h-8 group-[.active]:before:absolute group-[.active]:before:w-14 group-[.active]:before:z-[-1]`}>
      <i className={`flex items-center text-2xl w-6 h-6 text-[#3c4043] group-hover:text-[#202124] group-[.active]:text-white not-italic ${fontFamily}`}>{itemLogo}</i>
    </div>
    <span className={`font-medium text-[11px] leading-[14px] tracking-[0.3px] text-[#3c4043] text-center w-full px-1 whitespace-normal break-words group-[.active]:text-[#174ea6]`}>{itemName}</span>
  </button>
);

export interface SideNavToolbarProps {
  onConnectClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const SideNavToolbar = ({ onConnectClick }: SideNavToolbarProps) => {
  const { ripples: connectRipples, addRipple: addConnectRipple } = useRipple();
  const { ripples: helpRipples, addRipple: addHelpRipple } = useRipple();
  const { ripples: phoneRipples, addRipple: addPhoneRipple } = useRipple();
  const { ripples: forumRipples, addRipple: addForumRipple } = useRipple();
  const { ripples: addBtnRipples, addRipple: addAddBtnRipple } = useRipple();
  
  const handleConnectHover = (e: React.MouseEvent<HTMLDivElement>) => {
     addConnectRipple(e);
  };

  return (
    <div className="flex flex-col items-center pb-[8px] pt-[4px] px-[2px] border-none rounded-[48px] bg-white gap-0 absolute bottom-[16px] left-1/2 transform -translate-x-1/2 w-[48px]">
          
      {/* Connect Icon Wrapper */}
      <div 
        onClick={(e) => { addConnectRipple(e); if(onConnectClick) onConnectClick(e); }} 
        onMouseEnter={handleConnectHover}
        className="relative overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 mb-0 w-[40px] h-[40px] group"
      >
        <ConnectAILogo className="absolute top-[8px] left-[8px] h-[24px] w-[24px] rounded-full transition-opacity duration-200 opacity-100 group-hover:opacity-0" />
        <ConnectAiLogoHovered className="absolute top-[8px] left-[8px] h-[24px] w-[24px] rounded-full transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
        
        {/* BG */}
        <ConnectAiBg className="h-[40px] w-[40px] absolute z-[-1] rounded-full left-0 top-0 transition-opacity duration-200 opacity-100 group-hover:opacity-0" />
        <ConnectAiBgHovered className="h-[40px] w-[40px] absolute z-[-1] rounded-full left-0 top-0 animate-[spin_2500ms_linear_1ms_infinite] transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
        
        {connectRipples.map(ripple => <span key={ripple.id} className="ripple-span" style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }} />)}
      </div>

      {/* Sales Icon Button */}
      <div onClick={addHelpRipple} className="relative overflow-hidden items-center justify-center flex w-9 h-9 p-[8px] rounded-full border-transparent cursor-pointer focus:border-[var(--chroma-color-blue-border-hover)] hover:bg-[var(--opacity-mapping-4-grey-800)] mb-0 group">
        <i className="google-symbols text-[var(--shared-palette-grey-40)] w-5 h-5 flex group-hover:text-[var(--shared-palette-blue-deep)]" style={{ fontSize: '20px' }}>help</i>
        {helpRipples.map(ripple => <span key={ripple.id} className="ripple-span" style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }} />)}
      </div>

      <div onClick={addPhoneRipple} className="relative overflow-hidden items-center justify-center flex w-9 h-9 p-[8px] rounded-full border-transparent cursor-pointer focus:border-[var(--chroma-color-blue-border-hover)] hover:bg-[var(--opacity-mapping-4-grey-800)] mb-0 group">
        <i className="google-symbols text-[var(--shared-palette-grey-40)] w-5 h-5 flex group-hover:text-[var(--shared-palette-blue-deep)]" style={{ fontSize: '20px' }}>phone</i>
        {phoneRipples.map(ripple => <span key={ripple.id} className="ripple-span" style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }} />)}
      </div>

      {/* Sales FAB */}
      <div onClick={addForumRipple} className="relative overflow-hidden items-center justify-center flex w-9 h-9 rounded-full border-transparent cursor-pointer focus:border-[var(--chroma-color-blue-border-hover)] hover:bg-[var(--opacity-mapping-4-grey-800)] mb-0 group">
        <i className="google-symbols text-[var(--shared-palette-grey-40)] w-5 h-5 flex group-hover:text-[var(--shared-palette-blue-deep)]" style={{ fontSize: '20px' }}>forum</i>
        {forumRipples.map(ripple => <span key={ripple.id} className="ripple-span" style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }} />)}
      </div>

      {/* Add Button */}
      <div onClick={addAddBtnRipple} className="relative overflow-hidden items-center justify-center flex w-9 h-9 rounded-full bg-[var(--shared-palette-blue-variant-95)] cursor-pointer hover:bg-[var(--shared-palette-blue-variant-90)] focus:border-[var(--chroma-color-blue-border-hover)] transition-colors border-transparent mb-0 group">
        <i className="google-symbols text-[var(--shared-palette-grey-40)] w-5 h-5 flex group-hover:text-[var(--shared-palette-blue-deep)]" style={{ fontSize: '20px' }}>add</i>
        {addBtnRipples.map(ripple => <span key={ripple.id} className="ripple-span" style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }} />)}
      </div>
    </div>
  );
};

export const Sidebar = ({ onNavClick }: { onNavClick?: () => void }) => {
  const [activeItem, setActiveItem] = useState('Mission Control');

  const handleNavClick = (itemName: string) => {
    setActiveItem(itemName);
    if (onNavClick) {
      onNavClick();
    }
  };

  const navItems = [
    { name: 'Mission Control', icon: 'dashboard', fontFamily: 'google-symbols' },
    { name: 'Portfolio', icon: 'business_center', fontFamily: 'material-symbols-outlined' },
    { name: 'Plan & pitch', icon: 'strategy', fontFamily: 'material-symbols-outlined' },
    { name: 'Report', icon: 'monitoring', fontFamily: 'material-symbols-outlined' },
    { name: 'Engagements', icon: 'contacts', fontFamily: 'material-symbols-outlined' },
    { name: 'Resources', icon: 'book_ribbon', fontFamily: 'material-symbols-outlined' },
    { name: 'Support', icon: 'support_agent', fontFamily: 'material-symbols-outlined' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-[94px] box-border flex flex-col items-center pb-14 gap-[16px] bg-[linear-gradient(90deg,#174ea614_0%,#f0f4f9_100%)] border-r border-[#dadce0] z-50 overflow-x-hidden">
      <button className="mt-[16px] mb-[16px] flex items-center justify-center w-12 h-12 rounded-full hover:bg-[rgba(32,33,36,0.08)] border-none bg-transparent cursor-pointer">
        <i className="google-symbols text-[#5f6368]">menu</i>
      </button>
      
      {navItems.map((item) => (
        <NavRailItem
          key={item.name}
          itemName={item.name}
          itemLogo={item.icon}
          fontFamily={item.fontFamily}
          active={activeItem === item.name}
          onClick={() => handleNavClick(item.name)}
        />
      ))}

      <SideNavToolbar onConnectClick={() => {}} />
    </div>
  );
};
