import React, { useEffect, useRef } from 'react';
import { Sparkles, Calendar, TrendingUp, Star, Lightbulb } from 'lucide-react';
import { ThinkingIndicator } from './ThinkingIndicator';
import Markdown from 'react-markdown';

export function ChatArea({ session, onSourceClick }: { session: any, onSourceClick?: (source: any) => void }) {
  const prevMessagesLengthRef = useRef(session?.messages?.length || 0);
  const prevSessionIdRef = useRef(session?.id);
  const [openSources, setOpenSources] = React.useState<Record<string, boolean>>({});
  const [openThinking, setOpenThinking] = React.useState<Record<string, boolean>>({});

  const toggleSources = (msgId: string) => {
    setOpenSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const toggleThinking = (msgId: string) => {
    setOpenThinking(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const renderSourceIcon = (type: string) => {
    switch (type) {
      case 'slides':
        return <div className="w-[18px] h-[18px] bg-[#f9ab00] rounded-[2px] flex items-center justify-center mr-2 opacity-90"><div className="w-2.5 h-1.5 bg-white rounded-sm mt-1" /></div>;
      case 'sheets':
        return <div className="w-[18px] h-[18px] bg-[#1a73e8] rounded-[2px] flex items-center justify-center mr-2 opacity-90"><div className="w-full h-0 border-t-2 border-white/80" /></div>;
      case 'docs':
        return <div className="w-[18px] h-[18px] bg-[#4285f4] rounded-[2px] flex flex-col items-center justify-center mr-2 opacity-90 gap-[2px]"><div className="w-2.5 h-[1.5px] bg-white rounded-sm" /><div className="w-2.5 h-[1.5px] bg-white rounded-sm" /><div className="w-[6px] h-[1.5px] bg-white rounded-sm self-start ml-1" /></div>;
      case 'link':
      default:
        return <i className="google-symbols text-[20px] text-[#5f6368] mr-2">link</i>;
    }
  };

  useEffect(() => {
    if (session?.id === prevSessionIdRef.current && session?.messages?.length > prevMessagesLengthRef.current) {
      // Find the last user message
      const lastUserMsg = [...session.messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
        // Small delay to ensure DOM has updated
        setTimeout(() => {
          const el = document.getElementById(`msg-${lastUserMsg.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      }
    }
    prevMessagesLengthRef.current = session?.messages?.length || 0;
    prevSessionIdRef.current = session?.id;
  }, [session?.messages, session?.id]);

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" 
            alt="User" 
            className="w-16 h-16 rounded-full mb-4 object-cover"
          />
          <h1 className="text-4xl font-medium text-gray-900 mb-1">
            Hi <span className="text-blue-500">Samantha</span>,
          </h1>
          <h2 className="text-4xl font-medium text-gray-800">
            How can I help today?
          </h2>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Lightbulb className="w-5 h-5" />
            Tip
          </div>
          <p className="text-gray-700">Did you know? I can read and respond in 42 different languages!</p>
        </div>

        <div className="space-y-2">
          <ActionCard 
            icon={<div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Star className="w-5 h-5" /></div>}
            title="Account deep dive"
            subtitle="Your complete guide to advertiser accounts"
            isNew
          />
          <ActionCard 
            icon={<div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Calendar className="w-5 h-5" /></div>}
            title="Meeting preparation"
            subtitle="All your meeting info in one place"
            isNew
          />
          <ActionCard 
            icon={<div className="bg-blue-100 p-2 rounded-lg text-blue-600"><TrendingUp className="w-5 h-5" /></div>}
            title="My performance"
            subtitle="Get a detailed look at your sales performance"
            isNew
          />
          <ActionCard 
            icon={<div className="bg-blue-50 p-2 rounded-full text-blue-500"><Sparkles className="w-5 h-5" /></div>}
            title="What else can Connect AI do?"
            subtitle="Browse more prompts"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      {session.messages.map((msg: any, idx: number) => (
        <div key={msg.id || idx} id={`msg-${msg.id}`} className="mb-8">
          {msg.role === 'user' ? (
            <div className="flex flex-col justify-center items-start p-[12px_16px_16px] gap-[4px] w-full min-h-[84px] bg-[#E7F0FE] rounded-[16px] mb-6">
              {/* Metadata */}
              <div className="flex flex-row justify-between items-center p-[8px_0px_4px] gap-[8px] w-full h-[32px] self-stretch">
                <div className="flex flex-row items-center p-0 gap-[8px] flex-1 h-[20px]">
                  <div className="w-[20px] h-[20px] relative rounded-full overflow-hidden bg-[#8AB4F8]">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=40&h=40" 
                      alt="User" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#4C4D50]">Samantha</div>
                </div>
              </div>
              {/* Message */}
              <div className="flex flex-row items-start p-0 gap-[10px] w-full min-h-[20px]">
                <div className="flex flex-row flex-wrap items-center content-start p-0 gap-[4px] flex-1 min-h-[20px]">
                  <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1F1F1F] whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {(msg.isGenerating || msg.thinking) && (
                <ThinkingIndicator 
                  prompt={session.messages[idx-1]?.content} 
                  thinking={msg.thinking} 
                  isMoma={msg.isMoma} 
                  isGenerating={msg.isGenerating}
                  sourcesCount={msg.sources?.length || 0}
                />
              )}
              
              {msg.content && (
                <div className="flex flex-col justify-center items-start p-[12px_16px_20px] gap-[12px] relative w-full rounded-[16px] mt-2">
                  <div className="flex flex-row items-center p-0 gap-[8px] h-[22px]">
                    <div className="w-[22px] h-[22px] flex-none relative">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-0">
                        <g clipPath="url(#clip0_4213_26959)">
                          <g>
                            <path d="M16.1862 2.125H7.81373C6.87623 2.125 6.00873 2.625 5.53998 3.4375L1.35498 10.6875C0.88623 11.5 0.88623 12.5 1.35498 13.3125L5.54123 20.5625C6.00998 21.375 6.87623 21.875 7.81498 21.875H16.1862C17.1237 21.875 17.9912 21.375 18.46 20.5625L22.6462 13.3125C23.115 12.5 23.115 11.5 22.6462 10.6875L18.46 3.4375C17.9912 2.625 17.125 2.125 16.1862 2.125Z" fill="url(#paint0_linear_4213_26959)"/>
                            <path d="M6.90125 21.5265L22.795 12.3502C22.915 12.2802 22.9963 12.1502 22.9963 12.4502 22.88 12.899 22.6488 13.3002L18.4487 20.5752C17.985 21.379 17.1262 21.874 16.1987 21.874H7.79875C7.335 21.874 6.88875 21.7502 6.5 21.5252C6.62875 21.6002 6.78125 21.5952 6.9025 21.5252L6.90125 21.5265Z" fill="#1A73E8"/>
                          </g>
                          <g>
                            <path d="M10.5 15.5C10.45 15.5 10.4038 15.4837 10.3625 15.45C10.3213 15.4162 10.2912 15.375 10.275 15.325C10.1337 14.7662 9.92125 14.2413 9.6375 13.75C9.35375 13.2587 9.00875 12.8087 8.6 12.4C8.19125 11.9912 7.74125 11.6463 7.25 11.3625C6.75875 11.0788 6.23375 10.8663 5.675 10.725C5.625 10.7088 5.58375 10.6787 5.55 10.6375C5.51625 10.5962 5.5 10.55 5.5 10.5C5.5 10.45 5.51625 10.4038 5.55 10.3625C5.58375 10.3213 5.625 10.2912 5.675 10.275C6.23375 10.1337 6.75875 9.92125 7.25 9.6375C7.74125 9.35375 8.19125 9.00875 8.6 8.6C9.00875 8.19125 9.35375 7.74125 9.6375 7.25C9.92125 6.75875 10.1337 6.23375 10.275 5.675C10.2912 5.625 10.3213 5.58375 10.3625 5.55C10.4038 5.51625 10.45 5.5 10.5 5.5C10.55 5.5 10.5938 5.51625 10.6313 5.55C10.6688 5.58375 10.6962 5.625 10.7125 5.675C10.8625 6.23375 11.0788 6.75875 11.3625 7.25C11.6463 7.74125 11.9912 8.19125 12.4 8.6C12.8087 9.00875 13.2587 9.35375 13.75 9.6375C14.2413 9.92125 14.7662 10.1337 15.325 10.275C15.375 10.2912 15.4162 10.3213 15.45 10.3625C15.4837 10.4038 15.5 10.45 15.5 10.5C15.5 10.55 15.4837 10.5962 15.45 10.6375C15.4162 10.6787 15.375 10.7088 15.325 10.725C14.7662 10.8663 14.2413 11.0788 13.75 11.3625C13.2587 11.6463 12.8087 11.9912 12.4 12.4C11.9912 12.8087 11.6463 13.2587 11.3625 13.75C11.0788 14.2413 10.8663 14.7662 10.725 15.325C10.7088 15.375 10.6787 15.4162 10.6375 15.45C10.5962 15.4837 10.55 15.5 10.5 15.5Z" fill="white"/>
                          </g>
                        </g>
                        <defs>
                          <linearGradient id="paint0_linear_4213_26959" x1="7.77748" y1="15.445" x2="16.72" y2="8.14875" gradientUnits="userSpaceOnUse">
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
                          <clipPath id="clip0_4213_26959">
                            <rect width="24" height="24" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    {msg.thinkingText ? (
                      <button 
                        onClick={() => toggleThinking(msg.id)}
                        className="flex items-center gap-1 font-['Google_Sans_Text'] font-medium text-[15px] leading-[20px] text-[#1F1F1F] bg-transparent border-none cursor-pointer hover:bg-black/5 rounded p-[4px_4px_4px_8px] -ml-2 transition-colors"
                      >
                        Show thinking ({msg.sources?.length || 0} sources)... <i className="google-symbols font-medium text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>{openThinking[msg.id] ? 'expand_less' : 'expand_more'}</i>
                      </button>
                    ) : (
                      <div className="font-['Google_Sans_Text'] font-medium text-[15px] leading-[20px] text-[#1F1F1F]">
                        Connect AI
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center items-start p-0 gap-[12px] w-full">
                    {msg.thinkingText && openThinking[msg.id] && (
                      <div className="border-l-2 border-[#E8EAED] pl-4 ml-1 mb-2 font-mono text-[13px] leading-[24px] text-[#4C4D50] whitespace-pre-wrap w-[90%]">
                        {msg.thinkingText}
                      </div>
                    )}
                    <div className="flex flex-col items-start p-0 w-full">
                      <div className="font-['Roboto'] font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#3C4043] w-full prose prose-blue max-w-none">
                        <Markdown>{msg.content || msg.text}</Markdown>
                      </div>
                    </div>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-col w-full gap-2 mt-2 pt-[8px]">
                        <div className="flex flex-row items-center justify-between w-full">
                          <button
                            onClick={() => toggleSources(msg.id)}
                            className="flex items-center gap-1 text-[#1a73e8] font-['Google_Sans_Text'] font-medium text-[15px] bg-transparent border-none cursor-pointer p-[8px] hover:bg-black/5 rounded-[4px] ml-[-8px]"
                          >
                            Sources <i className="google-symbols font-medium text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>{openSources[msg.id] ? 'expand_less' : 'expand_more'}</i>
                          </button>
                          <div className="flex items-center gap-4 text-[#5f6368]">
                            <i className="google-symbols text-[20px] cursor-pointer hover:text-[#3C4043]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>share</i>
                            <i className="google-symbols text-[20px] cursor-pointer hover:text-[#3C4043]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>thumb_up</i>
                            <i className="google-symbols text-[20px] cursor-pointer hover:text-[#3C4043]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>thumb_down</i>
                          </div>
                        </div>
                        {openSources[msg.id] && (
                          <div className="flex flex-col gap-3 mt-1 pb-[8px]">
                            {msg.sources.map((src: any) => (
                              <button
                                key={src.id}
                                onClick={() => {
                                  if (src.type === 'link' && src.pageId) {
                                    onSourceClick?.(src);
                                  } else if (src.url) {
                                    window.open(src.url, '_blank');
                                  }
                                }}
                                className="flex items-center px-[16px] py-[14px] border border-[#dadce0] rounded-[8px] hover:bg-[#f8f9fa] bg-white cursor-pointer transition-colors w-full text-left drop-shadow-sm min-h-[52px]"
                              >
                                {renderSourceIcon(src.type)}
                                <span className="font-['Google_Sans_Text'] font-medium text-[#1a73e8] ml-[12px] mr-[16px] text-[15px]">{src.id}</span>
                                <span className="font-['Google_Sans_Text'] font-normal text-[#202124] text-[15px]">{src.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ActionCard({ icon, title, subtitle, isNew = false }: { icon: React.ReactNode, title: string, subtitle: string, isNew?: boolean }) {
  return (
    <button className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
      {icon}
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-blue-700">{title}</h3>
          {isNew && <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase">NEW</span>}
        </div>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </button>
  );
}
