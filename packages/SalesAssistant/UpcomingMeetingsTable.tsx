import React, { useState } from 'react';
import { ActionItemsHoverCard } from './ActionItemsHoverCard';
import { TopicsDiscussedHoverCard } from './TopicsDiscussedHoverCard';
import { AccountsDecliningHoverCard2 } from './AccountsDecliningHoverCard2';
import { AccountsRisingHoverCard } from './AccountsRisingHoverCard';

export const UpcomingMeetingsTable = ({ onPrepare }: { onPrepare?: (company: string) => void }) => {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const meetings = [
    {
      company: 'Silver Leaf Labs',
      companyMore: '+2',
      title: 'DV360 / Search Silver Leaf Labs Office Hours',
      datetime: 'Mar 20, 10:00 PM',
      avatarsMore: '+2',
      topics: [
        { icon: 'description', title: '3 action items', desc: 'Consult Google Global on Silver Leaf Initiative <span class="text-[#1a73e8]">+2</span>' },
        { icon: 'description', title: '3 topics discussed', desc: 'YouTube Media Strategy Update <span class="text-[#1a73e8]">+2</span>' },
        { icon: 'trending_up', title: '5 of 8 accounts rising', platform: 'DV', platformName: 'SilverLeaf US', desc: '+$26.3k (-6%) 7d w/w' }
      ]
    },
    {
      company: 'Neary Brands',
      companyMore: '',
      title: 'Neary Brands',
      datetime: 'Mar 20, 1:00 PM',
      avatarsMore: '+2',
      topics: [
        { icon: 'description', title: '3 action items', desc: 'Credit Invoice Resolve ($16k)' },
        { icon: 'description', title: '3 topics discussed', desc: 'Steering the "AI Co-Pilot" (Agentic AI) <span class="text-[#1a73e8]">+2</span>' },
        { icon: 'trending_down', title: '3 of 9 accounts declining', platform: 'GA', platformName: 'Neary Brands Store UK', desc: '-$15.6k (-1.2%) 7d w/w' }
      ]
    },
    {
      company: 'Veloce Motorworks',
      companyMore: '',
      title: 'R1 Creative Shareout',
      datetime: 'Mar 20, 2:00 PM',
      avatarsMore: '+2',
      topics: [
        { icon: 'description', title: '3 action items', desc: 'Allowlist the customer for DemandGen view <span class="text-[#1a73e8]">+2</span>' },
        { icon: 'description', title: '3 topics discussed', desc: 'Financial & Measurement Strategy <span class="text-[#1a73e8]">+2</span>' },
        { icon: 'trending_down', title: '4 of 12 accounts declining', platform: 'GA', platformName: 'Veloce Overland', desc: '-$15.2k (-5%) 7d w/w' }
      ]
    },
    {
      company: 'Apex Inc.',
      companyMore: '+2',
      title: 'Apex Bi-weekly Connect',
      datetime: 'Mar 23, 10:00 AM',
      avatarsMore: '+2',
      topics: [
        { icon: 'description', title: '4 action items', desc: 'Confirm timeline for the gas price project <span class="text-[#1a73e8]">+3</span>' },
        { icon: 'description', title: '3 topics discussed', desc: 'Measurement & YouTube Shorts <span class="text-[#1a73e8]">+2</span>' },
        { icon: 'trending_down', title: '4 of 8 accounts declining', platform: 'GA', platformName: 'Apex Global', desc: '+$7.6k (+6%) 7d w/w' }
      ]
    },
    {
      company: 'Lyra Activewear',
      companyMore: '',
      title: 'Lyra Activewear Bi-weekly Connect',
      datetime: 'Mar 24, 11:00 AM',
      avatarsMore: '+2',
      topics: [
        { icon: 'description', title: '3 action items', desc: 'Google Tag/Floodlight conversion deep dive <span class="text-[#1a73e8]">+2</span>' },
        { icon: 'description', title: '3 topics discussed', desc: 'Strategic Support & Program Alignment <span class="text-[#1a73e8]">+2</span>' },
        { icon: 'trending_down', title: '15 of 52 accounts declining', platform: 'GA', platformName: 'Lyra Brands', desc: '-$1.6k (-6%) 7d w/w' }
      ]
    }
  ];

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="hidden sm:flex items-center text-[13px] text-[#5f6368] border-b border-[#dadce0] pb-2 mb-4 px-4">
          <div className="w-[300px]">Meeting</div>
          <div className="flex-1 pl-8">Top topics</div>
        </div>
        
        {meetings.map((meeting, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-start py-4 border-b border-[#f1f3f4] px-4 transition-colors gap-4 sm:gap-0">
            <div className="w-full sm:w-[300px] sm:pr-4">
              <div className="flex items-center gap-1 text-[12px] text-[#5f6368] mb-1">
                <i className="google-symbols text-[14px]">domain</i>
                <span>{meeting.company}</span>
                {meeting.companyMore && <span className="text-[#1a73e8]">{meeting.companyMore}</span>}
              </div>
              <div className="font-medium text-[#202124] text-[15px] mb-2 leading-tight">{meeting.title}</div>
              <div className="flex items-center gap-2 text-[12px] text-[#5f6368]">
                <span className="bg-[#f1f3f4] px-2 py-0.5 rounded-full">{meeting.datetime}</span>
                <span>•</span>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-[#dadce0] border border-white -ml-0 flex items-center justify-center overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#dadce0] border border-white -ml-1 flex items-center justify-center overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#dadce0] border border-white -ml-1 flex items-center justify-center overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <span className="text-[#1a73e8]">{meeting.avatarsMore}</span>
              </div>
            </div>
            
            <div className="flex-1 w-full sm:w-auto sm:pl-8 flex gap-3 flex-wrap">
              {meeting.topics.map((topic: any, j: number) => {
                const isActionItems = topic.title.toLowerCase().includes('action items');
                const isTopicsDiscussed = topic.title.toLowerCase().includes('topics discussed');
                const isAccountsDeclining = topic.title.toLowerCase().includes('accounts declining');
                const isAccountsRising = topic.title.toLowerCase().includes('accounts rising');
                const isHoverable = isActionItems || isTopicsDiscussed || isAccountsDeclining || isAccountsRising;
                return (
                  <div key={j} className="bg-[#f8f9fa] rounded-xl p-3 flex-1 min-w-[180px] max-w-full sm:max-w-[240px] border border-[#f1f3f4]">
                    <div className="flex items-center gap-1 text-[13px] font-medium text-[#202124] mb-1 relative">
                      <i className="google-symbols text-[#5f6368] text-[16px]">{topic.icon}</i>
                      <span 
                        className={`underline decoration-dotted ${isHoverable ? 'cursor-pointer' : ''}`}
                        onMouseEnter={() => isHoverable && setHoveredTopic(`${i}-${j}`)}
                        onMouseLeave={() => isHoverable && setHoveredTopic(null)}
                      >
                        {topic.title}
                      </span>
                      {hoveredTopic === `${i}-${j}` && isActionItems && <ActionItemsHoverCard companyName={meeting.company} topicTitle={topic.title} />}
                      {hoveredTopic === `${i}-${j}` && isTopicsDiscussed && <TopicsDiscussedHoverCard companyName={meeting.company} topicTitle={topic.title} />}
                      {hoveredTopic === `${i}-${j}` && isAccountsDeclining && <AccountsDecliningHoverCard2 companyName={meeting.company} />}
                      {hoveredTopic === `${i}-${j}` && isAccountsRising && <AccountsRisingHoverCard companyName={meeting.company} />}
                    </div>
                    <div className="text-[12px] text-[#5f6368] flex items-center gap-1 flex-wrap">
                      {topic.platform && <span className="bg-[#f1f3f4] px-1 rounded text-[10px] font-medium">{topic.platform}</span>}
                      {topic.platformName && <span>{topic.platformName}</span>}
                      <span dangerouslySetInnerHTML={{ __html: topic.desc }}></span>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex items-center justify-end w-[100px] ml-auto">
                <button 
                  onClick={() => onPrepare && onPrepare(meeting.company)}
                  className="text-[#1a73e8] bg-transparent border-none font-medium text-[14px] cursor-pointer flex items-center gap-1 hover:bg-[#f1f3f4] px-3 py-2 rounded-full"
                >
                  Prepare
                  <i className="google-symbols text-[18px]">chevron_right</i>
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="py-4 px-4 border-b border-[#f1f3f4]">
          <button className="text-[#1a73e8] bg-transparent border-none font-medium text-[14px] cursor-pointer hover:underline p-0">
            View 5 more customer meetings
          </button>
        </div>
      </div>
    </div>
  );
};
