import React from 'react';

export const AppBar = () => {
  return (
    <div className="h-[72px] left-[94px] right-0 ml-0 py-0 px-[16px] bg-[#f1f3f4] fixed top-0 border-none flex items-center justify-between z-40">
      <div className="flex items-center">
        <img src="https://static.corp.google.com/greentea/images/rebrand/lockup_sales_prod.svg" alt="Connect Sales" className="h-[48px] w-[119px] ml-[-8px]" />
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-transparent border-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-[rgba(32,33,36,0.08)]">
          <i className="google-symbols text-[#5f6368]">more_vert</i>
        </button>
        <button className="bg-transparent border-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-[rgba(32,33,36,0.08)] relative">
          <i className="google-symbols text-[#5f6368]">notifications</i>
          <span className="absolute top-1 right-1 bg-[#d93025] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">1</span>
        </button>
        <button className="bg-transparent border-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-[rgba(32,33,36,0.08)]">
          <i className="google-symbols text-[#5f6368]">help</i>
        </button>
        <button className="bg-transparent border-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-[rgba(32,33,36,0.08)]">
          <i className="google-symbols text-[#5f6368]">search</i>
        </button>
        <div className="flex items-center bg-white rounded-full px-3 py-1 border border-[#dadce0] cursor-pointer hover:bg-gray-50">
          <span className="text-sm text-[#3c4043] mr-2">SMB-MMS D LG FR-DUB2</span>
          <img src="https://picsum.photos/seed/user/32/32" alt="User" className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};
