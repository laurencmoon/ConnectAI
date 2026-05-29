import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

const chartData = [
  { name: 'Feb 16', declining: 450000, rising: 200000, company: 650000 },
  { name: '', declining: 480000, rising: 190000, company: 670000 },
  { name: '', declining: 470000, rising: 210000, company: 680000 },
  { name: '', declining: 520000, rising: 250000, company: 770000 },
  { name: '', declining: 540000, rising: 240000, company: 780000 },
  { name: '', declining: 480000, rising: 220000, company: 700000 },
  { name: '', declining: 460000, rising: 260000, company: 720000 },
  { name: '', declining: 530000, rising: 280000, company: 810000 },
  { name: '', declining: 470000, rising: 300000, company: 770000 },
  { name: '', declining: 480000, rising: 340000, company: 820000 },
  { name: '', declining: 460000, rising: 350000, company: 810000 },
  { name: 'Mar 1', declining: 420000, rising: 280000, company: 700000 },
];

export const BudgetDecreasedHoverCard = () => {
  return (
    <div className="absolute z-50 flex flex-col items-start p-0 w-[351px] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] rounded-[8px] top-full left-1/2 -translate-x-1/2 mt-2 cursor-default no-underline text-left">
      {/* Header */}
      <div className="flex flex-row items-center p-[8px_16px] gap-[10px] w-full h-[32px] bg-white rounded-t-[8px] border-b border-[#DADCE0]">
        <div className="flex flex-row items-center p-0 gap-[4px]">
          <i className="google-symbols text-[16px] text-[#5F6368]">business</i>
          <div className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] tracking-[0.1px] text-[#202124]">
            Acme Corp
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[208px] bg-white border-b border-[#DADCE0] p-4 flex flex-col">
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAED" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#5F6368', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#5F6368', fontSize: 12 }} 
                ticks={[0, 500000, 1000000]}
                tickFormatter={(value) => value === 0 ? '$0' : value === 500000 ? '$500k' : '$1M'}
              />
              <Tooltip />
              <Area type="monotone" dataKey="rising" stackId="1" stroke="none" fill="#A8DAB5" />
              <Area type="monotone" dataKey="declining" stackId="1" stroke="none" fill="#F6B2B5" />
              <Area type="monotone" dataKey="company" stroke="#9AA0A6" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-row justify-between items-start w-full mt-4 text-[12px]">
          <div className="flex flex-col items-start text-[#5F6368] mt-4">
            w/w
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#9AA0A6] rounded-full"></div>
              <span className="text-[#202124]">Company</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F6B2B5] rounded-sm"></div>
              <span className="text-[#202124]">Declining accts</span>
            </div>
            <span className="text-[#202124] ml-5">-$107k <span className="text-[#C5221F]">-3%</span></span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#A8DAB5] rounded-sm"></div>
              <span className="text-[#202124]">Rising accts</span>
            </div>
            <span className="text-[#202124] ml-5">$482.2k <span className="text-[#188038]">29%</span></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-row items-start p-[4px_0px_0px] w-full h-[44px] bg-white border-b border-[#DADCE0]">
        <div className="flex flex-col justify-end items-center p-0 flex-1 h-[40px]">
          <div className="flex flex-col justify-center items-center p-[0px_16px] w-full h-full relative">
            <div className="font-['Google_Sans'] font-medium text-[13px] leading-[20px] text-[#1B1B1C]">
              Revenue loss insights (1)
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3271EA]"></div>
          </div>
        </div>
        <div className="flex flex-col justify-end items-center p-0 flex-1 h-[40px]">
          <div className="flex flex-col justify-center items-center p-[0px_16px] w-full h-full">
            <div className="font-['Google_Sans'] font-medium text-[13px] leading-[20px] text-[#474747]">
              Revenue gain insights (0)
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-row items-start p-[8px_0px_8px_16px] w-full h-[52px] bg-white border-b border-[#DADCE0]">
        <div className="flex flex-row items-start p-0 gap-[4px] w-[288px] h-[36px] rounded-[16px]">
          <div className="flex flex-col justify-center items-start p-0 gap-[10px] w-[23px] h-[18px]">
            <div className="flex flex-row justify-center items-center p-[0px_4px] gap-[5px] w-[16px] h-[16px] bg-[#E6F4EA] rounded-[32px]">
              <div className="font-['Google_Sans'] font-normal text-[10px] leading-[13px] tracking-[0.1px] text-[#188038]">
                1
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-start p-0 w-[261px] h-[36px]">
            <div className="font-['Google_Sans_Text'] font-medium text-[13px] leading-[20px] tracking-[0.2px] text-[#202124]">
              Campaign budget decreased
            </div>
            <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368]">
              6 campaigns from 1 account decreased budget
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col justify-center items-end p-[8px] gap-[16px] w-full h-[36px] rounded-b-[8px]">
        <button className="flex flex-row items-center p-0 gap-[4px] bg-transparent border-none cursor-pointer">
          <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#1A73E8]">
            View more
          </div>
          <i className="google-symbols text-[18px] text-[#1A73E8]">chevron_right</i>
        </button>
      </div>

    </div>
  );
};
