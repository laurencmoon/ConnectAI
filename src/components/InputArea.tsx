import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send, Square } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string) => void;
  isChatActive: boolean;
  isGenerating?: boolean;
  onStop?: () => void;
}

export function InputArea({ onSend, isChatActive, isGenerating, onStop }: InputAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (text.trim() && !isGenerating) {
      onSend(text);
      setText('');
      setIsFocused(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="w-full flex justify-center bg-white" ref={containerRef}>
      {/* Prompt area */}
      <div className="flex flex-col justify-end items-end p-[12px] pb-[13px] gap-[12px] w-full bg-[#E8F0FE] rounded-t-[28px]">
        
        {/* Input field */}
        <form 
          onSubmit={handleSubmit} 
          className={`box-border flex flex-col justify-center items-start p-[8px] gap-[16px] w-full bg-white border ${isFocused ? 'border-blue-400' : 'border-[#C4C7C5]'} rounded-[24px] transition-colors`}
        >
          
          {/* Text field */}
          <div className="flex flex-row items-end px-[12px] pt-[12px] pb-0 w-full">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              placeholder={isChatActive ? "Type a question..." : "Type the @ symbol to select a company"}
              className="flex-1 bg-transparent border-none focus:outline-none text-[16px] leading-[24px] text-[#1F1F1F] placeholder-[#1F1F1F]/60 resize-none overflow-y-auto max-h-[200px]"
              rows={1}
              disabled={isGenerating}
              style={{ minHeight: '24px' }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-row justify-between items-center w-full h-[40px]">
            {/* Left */}
            <div className="flex flex-row items-center gap-[4px] h-[40px]">
              {/* Pill 3 (Add) */}
              <button type="button" className="flex justify-center items-center w-[40px] h-[40px] rounded-full hover:bg-gray-100 transition-colors">
                <Plus className="w-[20px] h-[20px] text-[#575B5F]" />
              </button>
            </div>

            {/* Input button desktop */}
            {isGenerating ? (
              <button 
                type="button"
                onClick={onStop}
                className="flex justify-center items-center w-[40px] h-[40px] bg-[#F8FAFD] rounded-full hover:bg-[#E8F0FE] transition-colors"
              >
                <Square className="w-[20px] h-[20px] text-[#1B1C1D] fill-current" />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={!text.trim()}
                className="flex justify-center items-center w-[40px] h-[40px] bg-[#F8FAFD] rounded-full hover:bg-[#E8F0FE] disabled:opacity-50 disabled:hover:bg-[#F8FAFD] transition-colors"
              >
                <Send className="w-[20px] h-[20px] text-[#1B1C1D]" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
