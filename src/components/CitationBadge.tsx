import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type Source = {
  id: string;
  type: 'slides' | 'sheets' | 'docs' | 'link' | 'transcript';
  title: string;
  url?: string;
  pageId?: string;
  date?: string;
  participants?: string[];
  transcriptSnippet?: string;
  lastUpdated?: string;
};

export const renderSourceIcon = (type: string) => {
  switch (type) {
    case 'slides':
      return <div className="w-[18px] h-[18px] bg-[#f9ab00] rounded-[2px] flex items-center justify-center mr-2 opacity-90"><div className="w-2.5 h-1.5 bg-white rounded-[1px] mt-[1px]" /></div>;
    case 'sheets':
      return <div className="w-[18px] h-[18px] bg-[#1a73e8] rounded-[2px] flex items-center justify-center mr-2 opacity-90"><div className="w-full h-0 border-t-2 border-white/80" /></div>;
    case 'docs':
      return <div className="w-[18px] h-[18px] bg-[#4285f4] rounded-[2px] flex flex-col items-center justify-center mr-2 opacity-90 gap-[2px]"><div className="w-[10px] h-[1.5px] bg-white rounded-sm" /><div className="w-[10px] h-[1.5px] bg-white rounded-sm" /><div className="w-[6px] h-[1.5px] bg-white rounded-sm self-start ml-1" /></div>;
    case 'link':
    default:
      return <i className="google-symbols text-[20px] text-[#5f6368] mr-2" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>link</i>;
  }
};

export const CitationBadge = ({ sources, onSourceClick, onHoverChange }: { sources: Source[], onSourceClick?: (s: Source) => void, onHoverChange?: (hovered: boolean) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (badgeRef.current) {
      setRect(badgeRef.current.getBoundingClientRect());
    }
    setIsHovered(true);
    if (onHoverChange) onHoverChange(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      if (onHoverChange) onHoverChange(false);
    }, 150);
  };

  const renderHoverCardContent = () => {
    if (sources.length === 0) return null;

    const gap = 12;
    const calculateLeftStyle = (cardWidth: number) => {
      if (!rect) return { left: '0px', transform: 'translate(0, -100%)' };
      const halfWidth = cardWidth / 2;
      const targetLeft = rect.left + rect.width / 2;
      
      // Left boundary check
      if (targetLeft - halfWidth < gap) {
        return {
          left: `${gap}px`,
          transform: 'translate(0, -100%)'
        };
      }
      // Right boundary check
      if (targetLeft + halfWidth > window.innerWidth - gap) {
        return {
          left: `${window.innerWidth - cardWidth - gap}px`,
          transform: 'translate(0, -100%)'
        };
      }
      // Centered default
      return {
        left: `${targetLeft}px`,
        transform: 'translate(-50%, -100%)'
      };
    };

    if (sources.length === 1) {
      const source = sources[0];
      if (source.type === 'transcript') {
        const cardWidth = 377;
        const positionStyle = calculateLeftStyle(cardWidth);
        return (
          <div 
            className="fixed box-border flex flex-col items-start p-[16px] gap-[16px] w-[377px] h-auto bg-[#FFFFFF] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15),0px_1px_3px_rgba(0,0,0,0.3)] rounded-[8px] z-[9999]"
            style={{ 
              top: `${rect!.top - 8}px`, 
              left: positionStyle.left,
              transform: positionStyle.transform
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex flex-col items-start p-0 gap-[16px] w-full">
              <div className="flex flex-col items-start p-0 gap-[8px] w-full">
                <div className="font-['Google_Sans'] font-medium text-[16px] leading-[24px] tracking-[0.1px] text-[#202124] w-full">
                  {source.title}
                </div>
                <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#000000] w-full whitespace-pre-wrap">
                  <span className="font-bold">Date:</span> {source.date}<br/>
                  <span className="font-bold">Participants:</span><br/>
                  {source.participants?.map(p => `• ${p}`).join('\n')}<br/>
                  {source.transcriptSnippet && (
                    <div 
                      className="max-h-[180px] overflow-y-auto border-t border-[#E8EAED] pt-2 mt-2 pr-1 font-['Roboto'] text-[13px] leading-[18px] text-[#3C4043]"
                      dangerouslySetInnerHTML={{ __html: source.transcriptSnippet.replace(/^(.*?):/gm, '<strong>$1:</strong>') }} 
                    />
                  )}
                </div>
              </div>
              
              <div className="flex flex-row items-start p-0 gap-[8px] w-full">
                <button className="flex flex-col justify-center items-start p-0 gap-[8px] bg-[#1A73E8] rounded-[4px] border-none cursor-pointer">
                  <div className="flex flex-row justify-center items-center p-[0px_8px] gap-[4px] h-[36px] rounded-[4px]">
                    <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] tracking-[0.16px] text-[#FFFFFF]">
                      View meeting transcript
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Default hover card for 1 source
      const showLastUpdated = (source.type === 'docs' || source.type === 'slides') && source.lastUpdated;
      const cardWidth = 261;
      const positionStyle = calculateLeftStyle(cardWidth);
      return (
        <div 
          className="fixed box-border flex flex-col items-start p-[12px_16px] gap-[4px] w-[261px] min-h-[48px] h-auto bg-[#FFFFFF] border border-[#CCCDCF] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15),0px_1px_3px_rgba(0,0,0,0.3)] rounded-[8px] z-[9999] cursor-pointer hover:bg-gray-50"
          style={{ 
            top: `${rect!.top - 8}px`, 
            left: positionStyle.left,
            transform: positionStyle.transform
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => {
            e.stopPropagation();
            if (source.type === 'link' && source.pageId && onSourceClick) {
              onSourceClick(source);
            } else if (source.url) {
              window.open(source.url, '_blank');
            }
          }}
        >
          <div className="flex flex-row items-center p-0 gap-[11px] min-h-[24px] h-auto w-full">
            <div className="flex-none">{renderSourceIcon(source.type)}</div>
            <span className="font-['Google_Sans_Text'] font-normal text-[#1A73E8] text-[14px] leading-[20px] flex-none">{source.id}</span>
            <span className="font-['Google_Sans_Text'] font-normal text-[#1F1F1F] text-[14px] leading-[20px] break-words line-clamp-2 flex-1">{source.title}</span>
          </div>
          {showLastUpdated && (
            <div className="font-['Google_Sans_Text'] font-normal text-[11px] leading-[16px] text-[#5F6368] mt-1 border-t border-[#E8EAED] pt-1 w-full">
              This doc was last updated: {source.lastUpdated}
            </div>
          )}
        </div>
      );
    }

    // Hover card for multiple sources
    const cardWidth = 300;
    const positionStyle = calculateLeftStyle(cardWidth);
    return (
      <div 
        className="fixed box-border flex flex-col items-start p-[16px] gap-[12px] w-[300px] h-auto bg-[#FFFFFF] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15),0px_1px_3px_rgba(0,0,0,0.3)] rounded-[8px] z-[9999]"
        style={{ 
          top: `${rect!.top - 8}px`, 
          left: positionStyle.left,
          transform: positionStyle.transform
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#5F6368] mb-1">
          Sources
        </div>
        <div className="flex flex-col gap-2 w-full">
          {sources.map((src) => {
            const showLastUpdated = (src.type === 'docs' || src.type === 'slides') && src.lastUpdated;
            return (
              <div 
                key={src.id} 
                className="flex flex-col p-2 gap-1 bg-[#F8F9FA] rounded-[4px] cursor-pointer hover:bg-[#F1F3F4]"
                onClick={(e) => {
                  e.stopPropagation();
                  if (src.type === 'link' && src.pageId && onSourceClick) {
                    onSourceClick(src);
                  } else if (src.url) {
                    window.open(src.url, '_blank');
                  }
                }}
              >
                <div className="flex flex-row items-center gap-[8px] w-full">
                  <div className="flex-none">{renderSourceIcon(src.type)}</div>
                  <span className="font-['Google_Sans_Text'] font-normal text-[#1F1F1F] text-[13px] leading-[16px] break-words line-clamp-1 flex-1">{src.title}</span>
                </div>
                {showLastUpdated && (
                  <div className="font-['Google_Sans_Text'] font-normal text-[11px] leading-[16px] text-[#5F6368] ml-[26px]">
                    This doc was last updated: {src.lastUpdated}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <span className="inline-flex relative ml-1 align-middle pointer-events-auto z-10" ref={badgeRef} onMouseLeave={handleMouseLeave}>
      <span 
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E8F0FE] text-[#1A73E8] cursor-pointer mb-[1px] hover:bg-[#D2E3FC]"
        onMouseEnter={handleMouseEnter}
        onClick={() => {
          if (sources.length === 1 && onSourceClick) {
            const source = sources[0];
            if (source.type === 'link' && source.pageId) {
              onSourceClick(source);
            } else if (source.url) {
              window.open(source.url, '_blank');
            }
          }
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.96536 11.2163C2.14314 11.2163 1.44314 10.9274 0.865365 10.3496C0.287587 9.76072 -0.001302 9.05516 -0.001302 8.23294C-0.001302 7.84405 0.0709202 7.46628 0.215365 7.09961C0.37092 6.73294 0.587587 6.41072 0.865365 6.13294L3.06536 3.93294L3.91536 4.78294L1.71536 6.98294C1.5487 7.14961 1.41536 7.34405 1.31536 7.56628C1.22648 7.77739 1.18203 7.99961 1.18203 8.23294C1.18203 8.73294 1.35425 9.15516 1.6987 9.49961C2.04314 9.83294 2.46536 9.99961 2.96536 9.99961C3.1987 9.99961 3.42092 9.95516 3.63203 9.86628C3.84314 9.77739 4.03203 9.64961 4.1987 9.48294L6.41537 7.28294L7.26536 8.13294L5.0487 10.3329C4.77092 10.6218 4.4487 10.8441 4.08203 10.9996C3.72648 11.1441 3.35425 11.2163 2.96536 11.2163ZM4.43203 7.59961L3.58203 6.74961L6.73203 3.59961L7.58203 4.44961L4.43203 7.59961ZM8.0987 7.26628L7.2487 6.41628L9.46537 4.21628C9.63203 4.06072 9.75425 3.87739 9.83203 3.66628C9.92092 3.44405 9.96537 3.22183 9.96537 2.99961C9.96537 2.49961 9.79314 2.07739 9.4487 1.73294C9.11537 1.3885 8.6987 1.21628 8.1987 1.21628C7.96537 1.21628 7.74314 1.26072 7.53203 1.34961C7.32092 1.42739 7.13203 1.54961 6.96537 1.71628L4.76537 3.93294L3.91536 3.08294L6.11537 0.866276C6.39314 0.577387 6.71537 0.36072 7.08203 0.216275C7.4487 0.0718311 7.82648 -0.000391006 8.21537 -0.000391006C9.03759 -0.000391006 9.73203 0.288498 10.2987 0.866276C10.8765 1.44405 11.1654 2.14961 11.1654 2.98294C11.1654 3.37183 11.0931 3.74961 10.9487 4.11628C10.8043 4.47183 10.5931 4.7885 10.3154 5.06628L8.0987 7.26628Z" fill="#5F6368"/>
        </svg>
      </span>
      {isHovered && sources.length > 0 && rect && createPortal(
        renderHoverCardContent(),
        document.body
      )}
    </span>
  );
};
