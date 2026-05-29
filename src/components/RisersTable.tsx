import React from 'react';

export const RisersTable = ({ onDiagnose }: { onDiagnose?: (company: string) => void }) => {
  const topRisers = [
    { name: 'Silver Leaf Labs', id: 'Silver Leaf Labs', type: 'domain', trend: '$87.6k', pct: '+0.6%', insights: [
      { icon: 'trending_up', title: '5 of 8 accounts rising', platform: 'DV', platformName: 'SilverLeaf US', desc: '+$26.3k (+6%) 7d w/w' }
    ]},
    { name: 'Titan Forge Dynamics', id: 'Titan Forge Dynamics', type: 'domain', trend: '$21.2k', pct: '+1.2%', insights: [
      { icon: 'warning', iconColor: 'text-[#188038]', title: '1 daily anomaly', platform: 'GA', platformName: 'TitanForge B2B', desc: '<span class="text-[#188038]">+$12.2k</span> above expected' },
      { icon: 'trending_up', title: '4 of 12 accounts rising', platform: 'GA', platformName: 'TitanForge Local', desc: '+$15.2k (+5%) 7d w/w' },
      { icon: 'bar_chart', title: 'Target CPA increased', platform: '', platformName: '', desc: '33 campaigns increased Target CPA.' }
    ]},
    { name: 'Aura & Ember', id: 'Aura & Ember', type: 'domain', trend: '$18.6k', pct: '+0.6%', insights: [
      { icon: 'warning', iconColor: 'text-[#188038]', title: '1 daily anomaly', platform: 'GA', platformName: 'AuraEmber UK', desc: '<span class="text-[#188038]">+$4.5k</span> below expected' },
      { icon: 'trending_up', title: '3 of 9 accounts rising', platform: 'GA', platformName: 'AuraEmber US', desc: '+$5.6k (+6%) 7d w/w' },
      { icon: 'bar_chart', title: 'Budget increased <span class="text-[#1a73e8]">+1</span>', platform: '', platformName: '', desc: '6 campaigns increased budget' }
    ]},
    { name: 'Zenith Nomad', id: 'Zenith Nomad', type: 'domain', trend: '$17.6k', pct: '+0.6%', insights: [
      { icon: 'trending_up', title: '4 of 8 accounts rising', platform: 'GA', platformName: 'ZenithNomad CA', desc: '+$7.6k (+6%) 7d w/w' },
      { icon: 'bar_chart', title: 'Budget increased', platform: '', platformName: '', desc: '6 campaigns increased budget' }
    ]},
    { name: 'Paradox Protocol', id: 'Paradox Protocol', type: 'domain', trend: '$15.6k', pct: '+0.6%', insights: [
      { icon: 'trending_up', title: '15 of 52 accounts rising', platform: 'GA', platformName: 'Paradox Enterprise', desc: '+$1.6k (+6%) 7d w/w' },
      { icon: 'bar_chart', title: 'Budget increased', platform: '', platformName: '', desc: '6 campaigns increased budget' }
    ]}
  ];

  const additionalAccounts = [
    { name: 'Neon Nebula', id: 'NeonNebula US', type: 'domain', trend: '$1.7k', pct: '+0.6%', insights: [
      { icon: 'warning', iconColor: 'text-[#188038]', title: 'Daily anomaly', platform: '', platformName: '', desc: '<span class="text-[#188038]">+$0.6k</span> above expected' }
    ]},
    { name: 'Hearth & Thistle', id: 'HearthThistle UK', type: 'domain', trend: '$1.6k', pct: '+0.6%', insights: [
      { icon: 'warning', iconColor: 'text-[#188038]', title: 'Daily anomaly', platform: '', platformName: '', desc: '<span class="text-[#188038]">+$0.7k</span> above expected' },
      { icon: 'bar_chart', title: 'Budget increased <span class="text-[#1a73e8]">+2</span>', platform: '', platformName: '', desc: '6 campaigns increased budget' }
    ]},
    { name: 'Stratos Aerospace', id: 'Stratos B2B', type: 'domain', trend: '$1.5k', pct: '+0.6%', insights: [
      { icon: 'bar_chart', title: 'Budget increased <span class="text-[#1a73e8]">+2</span>', platform: '', platformName: '', desc: '6 campaigns increased budget' }
    ]},
    { name: 'Velvet & Vine', id: 'VelvetVine Local', type: 'domain', trend: '$1.4k', pct: '+0.6%', insights: []},
    { name: 'Apex Algorithm', id: 'ApexAlgo Global', type: 'domain', trend: '$1.2k', pct: '+0.6%', insights: [
      { icon: 'bar_chart', title: 'Budget increased <span class="text-[#1a73e8]">+2</span>', platform: '', platformName: '', desc: '6 campaigns increased budget' }
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
        {acc.insights.map((insight: any, j: number) => (
          <div key={j} className="bg-[#f8f9fa] rounded-xl p-3 flex-1 min-w-[200px] max-w-full sm:max-w-[280px] border border-[#f1f3f4]">
            <div className="flex items-center gap-1 text-[13px] font-medium text-[#202124] mb-1">
              <i className={`google-symbols ${insight.iconColor || 'text-[#5f6368]'} text-[16px]`}>{insight.icon}</i>
              <span className="underline decoration-dotted" dangerouslySetInnerHTML={{ __html: insight.title }}></span>
            </div>
            <div className="text-[12px] text-[#5f6368] flex items-center gap-1 flex-wrap">
              {insight.platform && <span className="bg-[#f1f3f4] px-1 rounded text-[10px] font-medium">{insight.platform}</span>}
              {insight.platformName && <span>{insight.platformName}</span>}
              <span dangerouslySetInnerHTML={{ __html: insight.desc }}></span>
            </div>
          </div>
        ))}
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
        
        {topRisers.map(renderAccountRow)}

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
