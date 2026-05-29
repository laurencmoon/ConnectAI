import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RisersTable } from './RisersTable';
import { UpcomingMeetingsTable } from './UpcomingMeetingsTable';
import { FinanceOutlookHoverCard } from './FinanceOutlookHoverCard';
import { DailyAnomaliesHoverCard } from './DailyAnomaliesHoverCard';
import { AccountsDecliningHoverCard } from './AccountsDecliningHoverCard';
import { BudgetDecreasedHoverCard } from './BudgetDecreasedHoverCard';

const data = [
  { name: 'Jan 1', revenue: 7.8, outlook: 0, target: 8.5, lastYear: 9.1 },
  { name: 'W2', revenue: 7.6, outlook: 0, target: 8.0, lastYear: 8.9 },
  { name: 'W3', revenue: 0, outlook: 7.0, target: 7.5, lastYear: 8.1 },
  { name: 'W4', revenue: 0, outlook: 7.6, target: 8.3, lastYear: 6.0 },
  { name: 'W5', revenue: 0, outlook: 7.0, target: 7.5, lastYear: 7.3 },
  { name: 'W6', revenue: 0, outlook: 8.0, target: 7.7, lastYear: 6.2 },
  { name: 'W7', revenue: 0, outlook: 7.8, target: 8.7, lastYear: 8.4 },
  { name: 'Mar 30', revenue: 0, outlook: 7.0, target: 7.6, lastYear: 6.1 }
];

const KPICard = ({ title, value, subtext }: any) => (
  <div className="flex flex-col items-start p-[24px] bg-white rounded-[16px] flex-1 min-w-[140px] h-[124px]">
    {/* Label */}
    <div className="flex flex-row items-start p-0 gap-[4px] h-[16px] flex-none order-0 grow-0">
      <div className="h-[16px] font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5E5E5E] flex-none order-0 grow-0 whitespace-nowrap">
        {title}
      </div>
    </div>
    
    {/* Value */}
    <div className="flex flex-row items-end p-0 gap-[4px] h-[40px] flex-none order-1 grow-0 mt-[12px]">
      <div className="h-[40px] font-['Google_Sans'] font-normal text-[32px] leading-[40px] flex items-center text-[#1B1B1C] flex-none order-0 grow-0 whitespace-nowrap">
        {value}
      </div>
    </div>

    {/* Descriptor */}
    <div className="flex flex-row items-center pt-[4px] pr-0 pb-0 pl-0 gap-[4px] h-[20px] flex-none order-2 grow-0">
      {/* Meta 1 */}
      <div className="flex flex-row items-center p-0 gap-[8px] h-[16px] flex-none order-0 grow-0">
        <div className="h-[16px] font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] tracking-[0.1px] text-[#5F6368] flex-none order-0 grow-0 whitespace-nowrap" dangerouslySetInnerHTML={{ __html: subtext }} />
      </div>
    </div>
  </div>
);

const AccountsTable = ({ onDiagnose }: { onDiagnose?: (company: string) => void }) => {
  const [hoveredInsight, setHoveredInsight] = useState<string | null>(null);

  const topDecliners = [
    { name: 'Acme corp', id: 'Acme corp NY42', type: 'domain', trend: '-$87.6k', pct: '-5.2%', insights: [
      { icon: 'warning', iconColor: 'text-[#d93025]', title: '2 daily anomalies', platform: 'GA', platformName: 'Acme corp NY42', desc: '<span class="text-[#d93025]">-$16.2k</span> below expected' },
      { icon: 'trending_down', title: '3 of 9 accounts declining', platform: 'GA', platformName: 'Acme corp West', desc: '-$15.2k (-6%) 7d w/w' },
      { icon: 'bar_chart', title: 'Budget decreased <span class="text-[#1a73e8]">+2</span>', platform: '', platformName: '', desc: '6 campaigns decreased budget' }
    ]},
    { name: 'Veloce Motorworks', id: 'Veloce US', type: 'domain', trend: '-$42.6k', pct: '-7.6%', insights: [
      { icon: 'warning', iconColor: 'text-[#d93025]', title: '3 daily anomalies', platform: 'GA', platformName: 'Veloce Motorwor... <span class="text-[#1a73e8]">+2</span>', desc: '<span class="text-[#d93025]">-$52.5k</span> below expected' },
      { icon: 'trending_down', title: '4 of 12 accounts declining', platform: 'GA', platformName: 'Veloce Overland', desc: '-$35.2k (-5%) 7d w/w' }
    ]},
    { name: 'Kinetix Performance', id: 'Kinetix Global', type: 'domain', trend: '-$37.1k', pct: '-4.6%', insights: [
      { icon: 'trending_down', title: '5 of 7 accounts declining', platform: 'GA', platformName: 'Kinetix Performance <span class="text-[#1a73e8]">+5</span>', desc: '-$9.9k (-18%) 7d w/w' },
      { icon: 'bar_chart', title: 'Budget decreased <span class="text-[#1a73e8]">+2</span>', platform: '', platformName: '', desc: '6 campaigns decreased budget' }
    ]},
    { name: 'Lyra Activewear', id: 'Lyra Fabrics', type: 'domain', trend: '-$30.2k', pct: '-3.2%', insights: [
      { icon: 'warning', iconColor: 'text-[#d93025]', title: '3 daily anomalies', platform: 'GA', platformName: 'Lyra Activewear <span class="text-[#1a73e8]">+2</span>', desc: '<span class="text-[#d93025]">-$6.2k</span> below expected' }
    ]},
    { name: 'Apex Drifter', id: 'Apex Inc.', type: 'domain', trend: '-$25.9k', pct: '-2.1%', insights: [
      { icon: 'bar_chart', title: 'Budget decreased', platform: '', platformName: '', desc: '9 campaigns decreased budget' },
      { icon: 'trending_down', title: '3 of 10 accounts declining', platform: 'GA', platformName: 'Apex Drift - NW <span class="text-[#1a73e8]">+3</span>', desc: '-$13.6k (-6%) 7d w/w' }
    ]}
  ];

  const additionalAccounts = [
    { name: 'LuminaGrid US Residential', id: 'Lumina Grid', type: 'domain', trend: '-$1.7k', pct: '-0.6%', insights: [
      { icon: 'warning', iconColor: 'text-[#d93025]', title: 'Daily anomaly', platform: '', platformName: '', desc: '<span class="text-[#d93025]">-$16.2k</span> below expected' }
    ]},
    { name: 'CopperQuill Local', id: 'Copper & Quill', type: 'domain', trend: '-$1.6k', pct: '-0.6%', insights: [
      { icon: 'warning', iconColor: 'text-[#d93025]', title: 'Daily anomaly', platform: '', platformName: '', desc: '<span class="text-[#d93025]">-$16.2k</span> below expected' },
      { icon: 'bar_chart', title: 'Budget decreased <span class="text-[#1a73e8]">+2</span>', platform: '', platformName: '', desc: '6 campaigns decreased budget' }
    ]},
    { name: 'Ironbound B2B', id: 'Ironbound Logistics', type: 'domain', trend: '-$1.5k', pct: '-0.6%', insights: [
      { icon: 'bar_chart', title: 'Budget decreased <span class="text-[#1a73e8]">+2</span>', platform: '', platformName: '', desc: '6 campaigns decreased budget' }
    ]},
    { name: 'Ironbound local', id: 'Ironbound Logistics', type: 'domain', trend: '-$1.4k', pct: '-0.6%', insights: []},
    { name: 'VelvetIris Brand', id: 'Velvet Iris', type: 'domain', trend: '-$1.2k', pct: '-0.6%', insights: [
      { icon: 'bar_chart', title: 'Budget decreased <span class="text-[#1a73e8]">+2</span>', platform: '', platformName: '', desc: '6 campaigns decreased budget' }
    ]}
  ];

  const renderAccountRow = (acc: any, i: number) => (
    <div key={i} className="flex flex-col sm:flex-row items-start py-4 border-b border-[#f1f3f4] px-4 transition-colors gap-4 sm:gap-0">
      <div className="w-full sm:w-[200px]">
        <div className="flex items-center gap-2">
          <i className="google-symbols text-[#5f6368] text-[18px]">{acc.type}</i>
          <span className="font-medium text-[#202124] text-[15px]">{acc.name}</span>
        </div>
        <div className="text-[12px] text-[#5f6368] mt-1 flex items-center gap-1">
          {acc.id !== acc.name && <span className="bg-[#f1f3f4] px-1 rounded text-[10px] font-medium">GA</span>}
          {acc.id}
        </div>
      </div>
      
      <div className="w-full sm:w-[100px] sm:text-right">
        <div className="font-medium text-[#202124] text-[15px]">{acc.trend}</div>
        <div className="text-[13px] text-[#5f6368]">{acc.pct}</div>
      </div>
      
      <div className="flex-1 w-full sm:w-auto sm:pl-8 flex gap-3 flex-wrap">
        {acc.insights.map((insight: any, j: number) => {
          const isAnomaly = insight.title.toLowerCase().includes('anomal');
          const isDeclining = insight.title.toLowerCase().includes('declining');
          const isBudget = insight.title.toLowerCase().includes('budget decreased');
          const isHoverable = isAnomaly || isDeclining || isBudget;
          return (
            <div key={j} className="bg-[#f8f9fa] rounded-xl p-3 flex-1 min-w-[200px] max-w-full sm:max-w-[280px] border border-[#f1f3f4]">
              <div className="flex items-center gap-1 text-[13px] font-medium text-[#202124] mb-1 relative">
                <i className={`google-symbols ${insight.iconColor || 'text-[#5f6368]'} text-[16px]`}>{insight.icon}</i>
                <span 
                   className={`underline decoration-dotted ${isHoverable ? 'cursor-pointer' : ''}`} 
                   dangerouslySetInnerHTML={{ __html: insight.title }}
                   onMouseEnter={() => isHoverable && setHoveredInsight(`${acc.id}-${j}`)}
                   onMouseLeave={() => isHoverable && setHoveredInsight(null)}
                ></span>
                {hoveredInsight === `${acc.id}-${j}` && isAnomaly && <DailyAnomaliesHoverCard />}
                {hoveredInsight === `${acc.id}-${j}` && isDeclining && <AccountsDecliningHoverCard />}
                {hoveredInsight === `${acc.id}-${j}` && isBudget && <BudgetDecreasedHoverCard />}
              </div>
              <div className="text-[12px] text-[#5f6368] flex items-center gap-1 flex-wrap">
                {insight.platform && <span className="bg-[#f1f3f4] px-1 rounded text-[10px] font-medium">{insight.platform}</span>}
                {insight.platformName && <span dangerouslySetInnerHTML={{ __html: insight.platformName }}></span>}
                <span dangerouslySetInnerHTML={{ __html: insight.desc }}></span>
              </div>
            </div>
          );
        })}
        {acc.insights.length === 0 && <div className="flex-1"></div>}
        
        <div className="flex items-center justify-end w-[100px] ml-auto">
          <button 
            onClick={() => onDiagnose?.(acc.name)}
            className="text-[#1a73e8] bg-transparent border-none font-medium text-[14px] cursor-pointer flex items-center gap-1 hover:bg-[#f1f3f4] px-3 py-2 rounded-full"
          >
            Diagnose
            <i className="google-symbols text-[18px]">chevron_right</i>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="hidden sm:flex items-center text-[13px] text-[#5f6368] border-b border-[#dadce0] pb-2 mb-4 px-4">
          <div className="w-[200px]">Company name</div>
          <div className="w-[100px] text-right">7d w/w</div>
          <div className="flex-1 pl-8">Top insights</div>
        </div>
        
        {topDecliners.map(renderAccountRow)}

        <div className="py-4 px-4 border-b border-[#f1f3f4]">
          <button className="text-[#1a73e8] bg-transparent border-none font-medium text-[14px] cursor-pointer hover:underline p-0">
            View 5 more companies
          </button>
        </div>

        <div className="flex items-center text-[13px] text-[#5f6368] border-b border-[#dadce0] py-2 px-4 bg-[#f8f9fa]">
          <div className="w-[200px] flex items-center gap-1">Additional accounts <i className="google-symbols text-[14px]">help</i></div>
          <div className="w-[100px] text-right">7d w/w</div>
          <div className="flex-1 pl-8">Top insights</div>
        </div>

        {additionalAccounts.map(renderAccountRow)}
      </div>
    </div>
  );
};

export const MainContent = ({ onDiagnose, onPrepare }: { onDiagnose?: (company: string) => void, onPrepare?: (company: string) => void }) => {
  const [activeTab, setActiveTab] = useState('Decliners');
  const [showFinanceHover, setShowFinanceHover] = useState(false);

  return (
    <div className="flex-1 min-w-0 ml-0 lg:mr-[452px] md:mr-4 mr-0 pt-[72px] p-6 bg-[#f1f3f4] min-h-screen font-brand">
      <h1 className="text-[28px] leading-[36px] font-normal text-[#202124] mb-6 mt-2">Performance summary</h1>
      
      <div className="flex flex-col xl:flex-row gap-4 mb-8">
        <div className="flex-[2] bg-white rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#f1f3f4]">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-[20px] leading-[24px] font-normal text-[#202124] m-0">Revenue trend</h2>
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-sm text-gray-500">Dates</span>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#dadce0] rounded-lg bg-white text-[13px] text-[#3c4043] cursor-pointer hover:bg-[#f8f9fa]">
                  QTD <i className="google-symbols text-[18px]">arrow_drop_down</i>
                </button>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="text-sm text-gray-500">Products</span>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#dadce0] rounded-lg bg-white text-[13px] text-[#3c4043] cursor-pointer hover:bg-[#f8f9fa]">
                  All <i className="google-symbols text-[18px]">arrow_drop_down</i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-1 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} barCategoryGap="20%" margin={{ top: 20, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid stroke="#f1f3f4" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={(props) => {
                      const { x, y, payload } = props;
                      if (payload.value === 'Jan 1' || payload.value === 'Mar 30') {
                        return (
                          <text x={x} y={y + 16} fill="#5E5E5E" fontSize={12} fontFamily="Inter" textAnchor="middle">
                            {payload.value}
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[0, 10]}
                    ticks={[0, 2.5, 5.0, 7.5, 10.0]}
                    tick={{ fontSize: 12, fill: '#5f6368' }} 
                    tickFormatter={(val) => `$${val.toFixed(1)}M`} 
                  />
                  <Tooltip />
                  
                  {/* Target line custom render */}
                  <Bar 
                    dataKey="target" 
                    fill="none"
                    legendType="none"
                    shape={(props: any) => {
                      const { x, y, width } = props;
                      const barW = 24;
                      const centerX = x + (width / 2);
                      return (
                        <line 
                          x1={centerX - 12} 
                          y1={y} 
                          x2={centerX + 12} 
                          y2={y} 
                          stroke="#72777A" 
                          strokeWidth={2.5} 
                        />
                      );
                    }} 
                  />

                  {/* Revenue active bar */}
                  <Bar dataKey="revenue" fill="#1a73e8" radius={[6, 6, 0, 0]} barSize={24} />

                  {/* Outlook projected bar */}
                  <Bar dataKey="outlook" fill="#8ab4f8" radius={[6, 6, 0, 0]} barSize={24} />

                  {/* Last Year trend line */}
                  <Line type="monotone" dataKey="lastYear" stroke="#FF7A00" strokeWidth={2.5} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-[140px] pl-0 sm:pl-4 pt-4 sm:pt-0 flex flex-row sm:flex-col flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-[12px] text-[#5f6368]">
                <div className="w-4 h-4 bg-[#1a73e8] rounded-[2px]"></div> Revenue
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#5f6368]">
                <div className="w-4 h-4 bg-[#8ab4f8] rounded-[2px]"></div> Finance outlook
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#5f6368]">
                <div className="w-4 h-[2px] bg-[#72777A]"></div> Target
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#5f6368]">
                <div className="w-4 h-0 border-t-2 border-dashed border-[#FF7A00]"></div> Last year
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-between items-center border-t border-[#f1f3f4] pt-4 gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#dadce0] rounded-full bg-white text-[14px] font-medium text-[#3c4043] cursor-pointer hover:bg-[#f8f9fa]">
              <i className="google-symbols text-[18px] text-[#1a73e8]">subdirectory_arrow_right</i> Show revenue trend by product area
            </button>
            <button className="flex items-center gap-1 text-[#1a73e8] bg-transparent border-none font-medium text-[14px] cursor-pointer hover:bg-[#f1f3f4] px-3 py-2 rounded-full">
              Deep dive <i className="google-symbols text-[18px]">chevron_right</i>
            </button>
          </div>
        </div>
        
        <div className="flex-none flex flex-col items-start p-0 gap-[12px] w-full xl:w-[471px] h-auto xl:h-[260px] order-1 grow-0">
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center p-0 gap-[12px] w-full h-auto sm:h-[124px] flex-none order-0 self-stretch grow-0">
            <KPICard title="Q1 target" value="$39.6M" subtext="Gap to target: $5.6M" />
            <KPICard title="Finance outlook" value={
              <span 
                className="text-[#DB372D] underline decoration-dotted relative cursor-pointer"
                onMouseEnter={() => setShowFinanceHover(true)}
                onMouseLeave={() => setShowFinanceHover(false)}
              >
                94%
                {showFinanceHover && <FinanceOutlookHoverCard />}
              </span>
            } subtext="$37.2M • <span class='text-[#DB372D]'>-1.2pp w/w</span>" />
            <KPICard title="Sales outlook" value="102%" subtext="$40.4M" />
          </div>
          
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center p-0 gap-[12px] w-full h-auto sm:h-[124px] flex-none order-1 self-stretch grow-0">
            <KPICard title="QTD revenue" value="$39.6M" subtext="<span class='text-[#188038]'>+6.5% w/w</span> • <span class='text-[#DB372D]'>-3.1% y/y</span>" />
            <KPICard title="Points won+live" value="15858" subtext="Q4 target 20651" />
            <KPICard title="Points run rate" value="117%" subtext="$40.4M" />
          </div>
        </div>
      </div>

      <h1 className="text-[28px] leading-[36px] font-normal text-[#202124] mb-4">Top focus areas</h1>
      
      <div className="bg-white border border-[#a8c7fa] rounded-xl p-4 mb-4 text-[14px] text-[#202124]">
        You have 1 decliner above $30k w/w, and 3 risers above $20k w/w. In the next day, you have 3 meetings with 1 unreviewed brief.
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('Decliners')}
          className={`${activeTab === 'Decliners' ? 'bg-[#c2e7ff] text-[#001d35] border-none' : 'bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa]'} px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 cursor-pointer`}
        >
          {activeTab === 'Decliners' && <i className="google-symbols text-[18px]">check</i>} Decliners
        </button>
        <button 
          onClick={() => setActiveTab('Risers')}
          className={`${activeTab === 'Risers' ? 'bg-[#c2e7ff] text-[#001d35] border-none' : 'bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa]'} px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 cursor-pointer`}
        >
          {activeTab === 'Risers' && <i className="google-symbols text-[18px]">check</i>} Risers
        </button>
        <button 
          onClick={() => setActiveTab('Upcoming meetings')}
          className={`${activeTab === 'Upcoming meetings' ? 'bg-[#c2e7ff] text-[#001d35] border-none' : 'bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa]'} px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 cursor-pointer`}
        >
          {activeTab === 'Upcoming meetings' && <i className="google-symbols text-[18px]">check</i>} Upcoming meetings
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#f1f3f4] relative">
        <div className="p-6 border-b border-[#f1f3f4] flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-[20px] leading-[24px] font-normal text-[#202124] m-0">
            {activeTab === 'Decliners' ? 'Top declining companies' : activeTab === 'Risers' ? 'Top rising companies' : 'Upcoming customer meetings'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {activeTab !== 'Upcoming meetings' && (
              <button className="flex items-center gap-2 px-3 py-1.5 border border-[#dadce0] rounded-lg bg-white text-[13px] text-[#3c4043] cursor-pointer hover:bg-[#f8f9fa]">
                All product areas <i className="google-symbols text-[18px]">arrow_drop_down</i>
              </button>
            )}
            {activeTab !== 'Upcoming meetings' && (
              <button className="flex items-center gap-2 px-3 py-1.5 border border-[#dadce0] rounded-lg bg-white text-[13px] text-[#3c4043] cursor-pointer hover:bg-[#f8f9fa]">
                7d w/w <i className="google-symbols text-[18px]">arrow_drop_down</i>
              </button>
            )}
          </div>
        </div>
        
        {activeTab === 'Decliners' && <AccountsTable onDiagnose={onDiagnose} />}
        {activeTab === 'Risers' && <RisersTable onDiagnose={onDiagnose} />}
        {activeTab === 'Upcoming meetings' && <UpcomingMeetingsTable onPrepare={onPrepare} />}
      </div>
    </div>
  );
};
