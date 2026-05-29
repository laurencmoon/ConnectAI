import React, { useState, useRef, useEffect } from 'react';
import { Source, CitationBadge, renderSourceIcon } from './CitationBadge';
import { AgentUpdateMessage } from './AgentUpdateMessage';
import { createPortal } from 'react-dom';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { ConnectAILogo, MomaLogo, GoogleLogo } from './Icons';
import { MentionMenu } from './MentionMenu';
import { generateChatResponse, generateEmailDraft } from '../services/gemini';
import { GrowthPlannerCard } from './GrowthPlannerCard';

type ChatItem = {
  id: string;
  title: string;
  group: 'Today' | 'Last 7 days';
  isPinned: boolean;
};

type SavedCanvas = {
  id: string;
  title: string;
  type: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides';
  company: string;
};



type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isAgentPlan?: boolean;
  planSteps?: string[];
  agentPlanType?: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides';
  company?: string;
  isAction?: boolean;
  isGeneratingCanvas?: boolean;
  canvasStep?: number;
  sources?: Source[];
  scannedSourcesCount?: number;
  proofOfWork?: {
    items: { bold: string, text: string }[];
  };
  attachment?: {
    name: string;
    url: string;
    type: string;
    base64?: string;
  };
  thinkingText?: string;
  isMeetingSelection?: boolean;
  meetingSelectionStatus?: 'pending' | 'submitted' | 'editing';
  selectedMeeting?: string;
  isAgentUpdate?: boolean;
  isPitchDeckFollowUp?: boolean;
  pitchDeckSelectionStatus?: 'pending' | 'submitted' | 'editing';
  selectedDivisionId?: string;
  selectedCountry?: string;
  isMeetingAgendaEmail?: boolean;
  emailBodyText?: string;
  isMeetingPrepWizard?: boolean;
  meetingPrepWizardStatus?: 'pending' | 'submitted' | 'editing';
  selectedPrepCompany?: string;
  selectedPrepMeeting?: string;
  isFocusAreasSelection?: boolean;
  focusAreasSelectionStatus?: 'pending' | 'submitted' | 'editing';
  selectedFocusAreas?: string[];
  meetingPrepOtherText?: string;
  isCompanyDiagnosisWizard?: boolean;
  companyDiagnosisWizardStatus?: 'pending' | 'submitted' | 'editing';
  selectedDiagCompany?: string;
  selectedDiagAccounts?: string[];
  isCompanyDiagnosisClarification?: boolean;
  companyDiagnosisClarificationStatus?: 'pending' | 'submitted' | 'editing';
  selectedUserRole?: 'AE' | 'AS';
  selectedCompanyId?: string;
  selectedCurrency?: string;
  selectedRegion?: string;
  selectedIntent?: string;
  selectedProductSegment?: string;
  selectedMarketSegment?: string;
  selectedGranularitySegment?: string;
  selectedMeetingType?: string;
  selectedMeetingGoal?: string;
  isPitchDeckTailoring?: boolean;
  pitchDeckTailoringStatus?: 'pending' | 'submitted' | 'editing';
  selectedTimeFrame?: string;
  selectedWhyNow?: string;
  selectedConstraints?: string;
  selectedLandingPageUrl?: string;
  selectedVideoAssets?: string;
  selectedExtraDocs?: string;
  isPitchDeckNarrativeReview?: boolean;
  pitchDeckNarrativeStatus?: 'pending' | 'submitted' | 'editing';
  selectedNarrativeAlign?: string;
  narrativeText?: string;
};

const initialChatMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: 'user', text: 'Can you help me draft a pitch for Performance Max for Acme Corp?' },
    { id: 'm2', sender: 'ai', text: 'Here is a customer brief for Acme Corp\n\nExecutive Summary:\nA silicon valley based technology startup that is advancing artificial intelligence. They are planning to IPO in 2026. [1, 2]\n\nGoogle Ads Snapshot:\nDisapprovals: 2 Ad Groups in Display campaign (\'Spring_Sale_2025\') are inactive due to sitelink. [1]\n\nPrimary Opportunity - PMax Optimization:\nClient reacted positively to a PMax pitch on Jan 15, 2025. PMax is ideal for reaching their target audience and driving online sales efficiently once tracking provides reliable signals. [1, 2, 3]', sources: [
      { id: '1', type: 'link', title: 'Benchmarks Page', pageId: 'benchmarks' },
      { id: '2', type: 'slides', title: 'Pmax pitch deck', url: 'https://docs.google.com/presentation' },
      { id: '3', type: 'transcript', title: 'Meeting Transcript: Q1 Strategy Sync', date: 'January 15, 2025', participants: ['You (Google Ads Account Strategist)', 'Casey (E-commerce Marketing Manager)'], transcriptSnippet: 'You: Thanks for taking the time to meet, Casey. I was looking at the recent performance of the Spring_Sale_2025 campaign.\nCasey: Yeah, it hasn\'t been doing as well as we hoped. We seem to be missing our target CPA.\nYou: I noticed that two of the ad groups were inactive because of some sitelink disapprovals. We can get those fixed up quickly. But I also wanted to bring up Performance Max.\nCasey: Performance Max? I think we briefly discussed that last quarter. How would that help here?\nYou: PMax is actually ideal for reaching your target audience across all of Google\'s channels from a single campaign. It uses machine learning to find conversions more efficiently.\nCasey: That sounds promising. But I\'m a bit worried about losing control over where our ads appear.\nYou: I understand that concern. PMax does automate a lot, but you still provide the creative assets, and the Insights page gives you a lot of transparency into what\'s driving performance.\nCasey: Okay, that makes me feel a bit better. What\'s the timeline for getting something like this set up?\nYou: If you\'re onboard, I\'d love to start a technical audit of your tracking tags this week. Once we confirm the data is clean, we can build out the asset groups and launch.\nCasey: Honestly, let\'s do it. If it can find customers we\'re missing on standard Search, I\'m all in. What do you need from my end to get the ball rolling?\nYou: I\'ll send over a checklist today. Basically, we\'ll need your latest creative assets and access to review the tag configurations.\nCasey: Sounds good, look forward to the email.' }
    ] },
    { id: 'm3', sender: 'user', text: 'That looks good, but can you emphasize the machine learning aspect more?' },
    { id: 'm4', sender: 'ai', text: 'Certainly! Here is the revised pitch emphasizing Google\'s AI and machine learning capabilities...' },
    { id: 'm5', sender: 'user', text: 'Perfect. What are the key objections I should anticipate?' },
    { id: 'm6', sender: 'ai', text: 'For Performance Max, common objections include loss of control and lack of channel-specific reporting. I suggest countering with the value of automation and the comprehensive insights provided in the Insights page.' }
  ],
  '2': [
    { id: 'm1', sender: 'user', text: 'I have a QBR with Nike next week. What were their top performing campaigns last quarter?' },
    { id: 'm2', sender: 'ai', text: 'Based on the Q2 data, Nike\'s top performing campaigns were the "Summer Activewear" Search campaign and the "New Releases" Shopping campaign.' },
    { id: 'm3', sender: 'user', text: 'Great. Did they hit their target ROAS?' },
    { id: 'm4', sender: 'ai', text: 'Yes, their overall ROAS for Q2 was 4.2x, which exceeded their target of 3.8x.' },
    { id: 'm5', sender: 'user', text: 'Can you generate a slide outline for the QBR?' },
    { id: 'm6', sender: 'ai', text: 'Here is a suggested outline for the Nike QBR:\n1. Executive Summary\n2. Q2 Performance Review\n3. Campaign Deep Dives\n4. Q3 Strategic Recommendations' }
  ],
  '3': [
    { id: 'm1', sender: 'user', text: 'I need a value proposition for YouTube Ads for Veloce Motorworks.' },
    { id: 'm2', sender: 'ai', text: 'Veloce Motorworks can leverage YouTube Ads to drive brand awareness for their new electric vehicle line. The value prop should focus on reaching in-market auto buyers.' },
    { id: 'm3', sender: 'user', text: 'How does that compare to their current TV spend?' },
    { id: 'm4', sender: 'ai', text: 'YouTube offers better targeting and measurement compared to traditional TV. We can reach specific audiences based on their search behavior and interests.' },
    { id: 'm5', sender: 'user', text: 'Can you give me a 3-sentence elevator pitch?' },
    { id: 'm6', sender: 'ai', text: '"Veloce Motorworks can reach the next generation of EV buyers where they spend their time: on YouTube. By leveraging Google\'s audience intent signals, we can drive measurable awareness and consideration more efficiently than traditional TV. Let\'s shift 15% of the TV budget to YouTube to capture this high-intent audience."' }
  ],
  '4': [
    { id: 'm1', sender: 'user', text: 'I need a cold call script for a new prospect, Kinetix Global. They are a B2B software company.' },
    { id: 'm2', sender: 'ai', text: 'Here is a cold call script tailored for Kinetix Global: "Hi [Name], I\'m calling from Google. I noticed Kinetix Global is expanding its enterprise software offerings..."' },
    { id: 'm3', sender: 'user', text: 'Make it a bit shorter and focus on lead generation.' },
    { id: 'm4', sender: 'ai', text: '"Hi [Name], I\'m with Google. We\'ve been helping B2B software companies like yours increase their qualified lead volume by 30% using AI-powered Search campaigns. Do you have 2 minutes to discuss how we could do this for Kinetix Global?"' },
    { id: 'm5', sender: 'user', text: 'That\'s better. What if they say they are already working with an agency?' },
    { id: 'm6', sender: 'ai', text: 'If they mention an agency, you can say: "That\'s great you have an agency partner. We actually work alongside many agencies to provide Google-specific insights and beta access they might not have. Would you be open to a quick joint call?"' }
  ],
  '5': [
    { id: 'm1', sender: 'user', text: 'My client, Acme Corp, is pushing back on increasing their Q4 budget. They say it\'s too risky.' },
    { id: 'm2', sender: 'ai', text: 'Budget objections are common in Q4. You can address the risk by highlighting the projected ROI and the flexibility of Google Ads.' },
    { id: 'm3', sender: 'user', text: 'What specific data can I show them to reduce the perceived risk?' },
    { id: 'm4', sender: 'ai', text: 'Show them the "Daily projection" chart from your dashboard. It indicates that with the current budget, they will miss their Q1 target by $5.6M. An increased budget is necessary to capture the remaining demand.' },
    { id: 'm5', sender: 'user', text: 'Good point. How should I phrase the ask?' },
    { id: 'm6', sender: 'ai', text: '"I understand the concern about risk. However, our data shows a $5.6M gap to your target. By incrementally increasing the budget on our top-performing Performance Max campaigns, we can capture existing demand with a proven ROAS, minimizing the risk while hitting your goals."' }
  ],
  '6': [
    { id: 'm1', sender: 'user', text: 'I want to upsell Veloce Overland on Discovery Ads for Q4.' },
    { id: 'm2', sender: 'ai', text: 'Discovery Ads are a great upsell for Veloce Overland to reach users across the YouTube Home feed, Discover, and Gmail.' },
    { id: 'm3', sender: 'user', text: 'What\'s the best angle to pitch this?' },
    { id: 'm4', sender: 'ai', text: 'Pitch it as a way to drive inspiration and action during the holiday shopping season. Highlight the visually rich format.' },
    { id: 'm5', sender: 'user', text: 'Can you give me some projected performance metrics if they invest $50k?' },
    { id: 'm6', sender: 'ai', text: 'Based on their historical account performance and industry benchmarks, a $50k investment in Discovery Ads could yield approximately 2.5M impressions, 25k clicks, and an estimated 150 conversions at a $330 CPA.' }
  ],
  '7': [
    { id: 'm1', sender: 'user', text: 'Acme Corp NY42 just got their Merchant Center suspended due to "Misrepresentation".' },
    { id: 'm2', sender: 'ai', text: 'A "Misrepresentation" suspension usually means there is an issue with the website\'s contact information, return policy, or checkout process.' },
    { id: 'm3', sender: 'user', text: 'I checked their site, the return policy is there. What else could it be?' },
    { id: 'm4', sender: 'ai', text: 'Ensure the return policy is easily accessible from the footer of every page. Also, verify that the business address and phone number on the website match the information in Merchant Center.' },
    { id: 'm5', sender: 'user', text: 'Ah, the address in Merchant Center is their old office. I\'ll have them update it. How long does the review take?' },
    { id: 'm6', sender: 'ai', text: 'Once they update the address and request a review in Merchant Center, it typically takes 3-5 business days for the team to process the appeal.' }
  ]
};

import { ExternalMessage } from '../App';





const renderFormattedText = (textContent: string) => {
  const pieces = textContent.split(/(\*\*.*?\*\*)/g);
  return pieces.map((piece, i) => {
    if (piece.startsWith('**') && piece.endsWith('**')) {
      const content = piece.slice(2, -2);
      return (
        <span key={i} className="font-bold text-[16px] text-[#3C4043] block mt-3 mb-1">
          {content}
        </span>
      );
    }
    return <span key={i}>{piece}</span>;
  });
};

const AIResponseText = ({ text, msg, onSourceClick }: { text: string, msg: Message, onSourceClick?: (s: Source) => void }) => {
  const [hoveredCitationId, setHoveredCitationId] = useState<string | null>(null);

  if (!msg.sources || msg.sources.length === 0) {
    return <>{renderFormattedText(text)}</>;
  }

  // Split by paragraphs
  const paragraphs = text.split('\n\n');

  return (
    <>
      {paragraphs.map((para, paraIndex) => {
        // Find all citations in this paragraph
        const citations: string[] = para.match(/(\[[0-9,\s]+\])/g) || [];
        const sourceIds = new Set<string>();
        
        citations.forEach(cit => {
          const numbers = cit.slice(1, -1).split(',').map(n => n.trim());
          numbers.forEach(num => sourceIds.add(num));
        });

        const sources = Array.from(sourceIds)
          .map(id => msg.sources?.find(s => s.id === id))
          .filter((s): s is Source => s !== undefined);

        // Remove citations from text for display
        let cleanedPara = para;
        citations.forEach(cit => {
          cleanedPara = cleanedPara.replace(cit, '');
        });

        // Unique ID for paragraph citation highlighting
        const citationId = `msg-${msg.id}-para-${paraIndex}`;

        return (
          <p key={paraIndex} className="mb-4 last:mb-0">
            <span className={`citation-highlight ${hoveredCitationId === citationId ? 'active' : ''}`}>
              {renderFormattedText(cleanedPara)}
            </span>
            {sources.length > 0 && (
              <CitationBadge 
                sources={sources}
                onSourceClick={onSourceClick}
                onHoverChange={(hovered) => setHoveredCitationId(hovered ? citationId : null)}
              />
            )}
          </p>
        );
      })}
    </>
  );
};

const MeetingPrepWizardCard = ({ 
  msg, 
  onSubmit, 
  onCancel,
  onEdit 
}: { 
  msg: Message, 
  onSubmit: (company: string, meeting: string, meetingType: string, meetingGoal: string) => void, 
  onCancel?: () => void,
  onEdit: () => void 
}) => {
  const [company, setCompany] = useState(msg.selectedPrepCompany || '');
  const [meeting, setMeeting] = useState(msg.selectedPrepMeeting || '');
  const [meetingType, setMeetingType] = useState(msg.selectedMeetingType || 'Operational Meeting');
  const [meetingGoal, setMeetingGoal] = useState(msg.selectedMeetingGoal || 'Finalize the JBP');
  const skipMeeting = msg.skipMeeting || false;

  const companies = [
    'Nike',
    'Acme Corp',
    'Veloce Motorworks',
    'Kinetix Performance',
    'Lyra Activewear',
    'Apex Drifter',
    'LuminaGrid US Residential',
    'CopperQuill Local',
    'Ironbound B2B',
    'Ironbound local',
    'VelvetIris Brand'
  ];
  const meetings = [
    'Nike // Q1 Performance sync Wed May 27 2026',
    'Acme Corp // Google Bi-Weekly sync Wed May 27 2026 at 1:00 PM PT',
    'Neary Brands // Google sync at 1:00 PM today',
    'Veloce Motorworks // Google QBR Wed May 27 2026',
    'Kinetix Performance sync at 2:30 PM today',
    'Lyra Activewear sync at 3:30 PM today',
    'Apex Drifter sync at 4:00 PM today'
  ];

  const meetingTypes = [
    'Operational Meeting',
    'Strategic Meeting',
    'JBP meeting',
    'Internal meeting',
    'Quarterly planning meeting',
    'C-level executive meeting'
  ];

  const meetingGoals = [
    'Finalize the JBP',
    'address action items',
    'pitch new products and opportunties',
    'relationship building',
    'new customer kickoff'
  ];

  const filteredMeetings = company 
    ? meetings.filter(m => m.toLowerCase().includes(company.toLowerCase()))
    : meetings;

  const handleCompanyChange = (selectedCompany: string) => {
    setCompany(selectedCompany);
    setMeeting(''); // Reset meeting when company changes
  };

  const hasPreviousSubmission = msg.selectedPrepCompany && msg.selectedPrepMeeting;

  if (msg.meetingPrepWizardStatus === 'submitted') {
    return (
      <div className="group flex flex-col items-start p-[12px_16px_16px] gap-[8px] w-full max-w-[388px] bg-[#E8F0FE] rounded-[16px] rounded-tr-[4px] mt-2 relative">
         <div className="flex flex-row items-center gap-[8px] w-full relative">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=40&h=40" alt="Samantha" className="w-[24px] h-[24px] rounded-full object-cover" />
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Samantha</span>
            <button 
               className="absolute right-0 top-0 bg-transparent border-none cursor-pointer hidden group-hover:flex items-center justify-center p-0 text-[#5F6368] hover:text-[#202124]"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            >
               <i className="google-symbols text-[18px]">edit</i>
            </button>
         </div>
         <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
            <strong>Selected the following:</strong>
            <ul className="list-disc pl-5 mt-1 mb-0">
              <li><strong>Company:</strong> {msg.selectedPrepCompany}</li>
              <li><strong>Meeting:</strong> {msg.selectedPrepMeeting}</li>
              <li><strong>Meeting Type:</strong> {msg.selectedMeetingType}</li>
              <li><strong>Meeting Goal:</strong> {msg.selectedMeetingGoal}</li>
            </ul>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-[16px] gap-[16px] w-full max-w-[388px] bg-white border border-[#DADCE0] rounded-[16px] mt-2 shadow-sm">
      <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1F1F1F] w-full">
        {skipMeeting ? 'Proceeding straight to content focus area selections.' : 'Select details for meeting prep:'}
      </div>
      
      {!skipMeeting && (
        <div className="flex flex-col gap-[12px] w-full">
          <div className="relative w-full">
            <select
              value={company}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full h-[48px] px-[16px] bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[15px] text-[#1F1F1F] appearance-none cursor-pointer focus:outline-none focus:border-[#1A73E8]"
            >
              <option value="" disabled>Select company</option>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="absolute right-[16px] top-[14px] pointer-events-none flex items-center text-[#444746]">
              <i className="google-symbols text-[24px]">arrow_drop_down</i>
            </div>
          </div>

          <div className="relative w-full">
            <select
              value={meeting}
              onChange={(e) => setMeeting(e.target.value)}
              disabled={!company}
              className="w-full h-[48px] px-[16px] bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[15px] text-[#1F1F1F] appearance-none cursor-pointer focus:outline-none focus:border-[#1A73E8] disabled:opacity-50"
            >
              <option value="" disabled>Select specific meeting</option>
              {filteredMeetings.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="absolute right-[16px] top-[14px] pointer-events-none flex items-center text-[#444746]">
              <i className="google-symbols text-[24px]">arrow_drop_down</i>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Type selector */}
      <div className="flex flex-col gap-[6px] w-full">
        <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#444746]">
          What type of meeting are you preparing for?
        </span>
        <div className="relative w-full">
          <select
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value)}
            className="w-full h-[48px] px-[16px] bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[15px] text-[#1F1F1F] appearance-none cursor-pointer focus:outline-none focus:border-[#1A73E8]"
          >
            {meetingTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="absolute right-[16px] top-[14px] pointer-events-none flex items-center text-[#444746]">
            <i className="google-symbols text-[24px]">arrow_drop_down</i>
          </div>
        </div>
      </div>

      {/* Meeting Goal / Objective selector */}
      <div className="flex flex-col gap-[6px] w-full">
        <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#444746]">
          What is your goal for the meeting?
        </span>
        <div className="relative w-full">
          <select
            value={meetingGoal}
            onChange={(e) => setMeetingGoal(e.target.value)}
            className="w-full h-[48px] px-[16px] bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[15px] text-[#1F1F1F] appearance-none cursor-pointer focus:outline-none focus:border-[#1A73E8]"
          >
            {meetingGoals.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <div className="absolute right-[16px] top-[14px] pointer-events-none flex items-center text-[#444746]">
            <i className="google-symbols text-[24px]">arrow_drop_down</i>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-[8px] mt-2">
        <button 
           className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-[#1A73E8] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors disabled:opacity-50"
           disabled={!company || !meeting}
           onClick={() => onSubmit(company, meeting, meetingType, meetingGoal)}
        >
           <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-white">Submit</span>
        </button>

        {msg.meetingPrepWizardStatus === 'editing' && hasPreviousSubmission && onCancel && (
          <button 
             className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-transparent rounded-[100px] border border-[#C4C7C5] cursor-pointer hover:bg-black/5 transition-colors"
             onClick={() => onCancel()}
          >
             <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-[#1A73E8]">Cancel</span>
          </button>
        )}
      </div>
    </div>
  );
};

const FocusAreasSelectionCard = ({ 
  msg, 
  onSubmit, 
  onEdit 
}: { 
  msg: Message, 
  onSubmit: (selected: string[], otherText: string) => void, 
  onEdit: () => void 
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>(msg.selectedFocusAreas || []);
  const [otherText, setOtherText] = useState(msg.meetingPrepOtherText || '');

  const focusOptions = [
    'Include conversation insights from meeting transcripts',
    'Share of traffic summary',
    'Pipeline summary',
    'Multi-quarter plan summary',
    'Social media campaign highlights'
  ];

  const handleCheckboxChange = (opt: string) => {
    if (checkedItems.includes(opt)) {
      setCheckedItems(checkedItems.filter(item => item !== opt));
    } else {
      setCheckedItems([...checkedItems, opt]);
    }
  };

  if (msg.focusAreasSelectionStatus === 'submitted') {
    return (
      <div className="group flex flex-col items-start p-[12px_16px_16px] gap-[8px] w-full max-w-[388px] bg-[#E8F0FE] rounded-[16px] rounded-tr-[4px] mt-2 relative">
         <div className="flex flex-row items-center gap-[8px] w-full relative">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=40&h=40" alt="Samantha" className="w-[24px] h-[24px] rounded-full object-cover" />
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Samantha</span>
            <button 
               className="absolute right-0 top-0 bg-transparent border-none cursor-pointer hidden group-hover:flex items-center justify-center p-0 text-[#5F6368] hover:text-[#202124]"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            >
               <i className="google-symbols text-[18px]">edit</i>
            </button>
         </div>
         <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
            <strong>Selected the following focus areas:</strong>
            <ul className="list-disc pl-5 mt-1 mb-0">
              {msg.selectedFocusAreas?.map(item => (
                <li key={item}>{item}</li>
              ))}
              {msg.meetingPrepOtherText && (
                <li><strong>Other:</strong> {msg.meetingPrepOtherText}</li>
              )}
            </ul>
         </div>
      </div>
    );
  }

  const isFromPromptChip = msg.selectedPrepCompany && msg.selectedPrepMeeting && !msg.skipMeeting;

  return (
    <div className="flex flex-col items-start p-[16px] gap-[16px] w-full max-w-[388px] bg-white border border-[#DADCE0] rounded-[16px] mt-2 shadow-sm">
      <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1F1F1F] w-full">
        {isFromPromptChip ? (
          <>
            To better prepare for your meeting and make the canvas more tailored to your needs, select focus areas for the meeting below and click submit.
          </>
        ) : (
          <>
            To better prepare for your meeting and make the canvas more tailored to your needs, select focus areas for the meeting below and click submit.
          </>
        )}
        <br/><br/>Include the following info:
      </div>

      <div className="flex flex-col gap-[12px] w-full">
        {focusOptions.map(opt => (
          <label key={opt} className="flex flex-row items-start gap-[12px] cursor-pointer select-none w-full">
            <div className="relative flex items-center justify-center w-[24px] h-[24px] mt-[2px]">
              <input
                type="checkbox"
                checked={checkedItems.includes(opt)}
                onChange={() => handleCheckboxChange(opt)}
                className="sr-only"
              />
              <i className={`google-symbols text-[24px] ${checkedItems.includes(opt) ? 'text-[#1A73E8]' : 'text-[#444746]'}`}>
                {checkedItems.includes(opt) ? 'check_box' : 'check_box_outline_blank'}
              </i>
            </div>
            <span className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1F1F1F] pt-[2px]">
              {opt}
            </span>
          </label>
        ))}

        <div className="flex flex-col gap-[6px] w-full mt-2">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#444746]">Other</span>
          <textarea
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Enter custom focus area or notes..."
            className="w-full h-[80px] p-[12px] border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[14px] text-[#1F1F1F] resize-none focus:outline-none focus:border-[#1A73E8]"
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-[12px] w-full mt-2">
        <button 
           className="flex flex-col justify-center items-center px-[16px] h-[36px] bg-transparent rounded-[100px] border-none cursor-pointer hover:bg-black/5"
           onClick={() => onSubmit(checkedItems, '')}
        >
           <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-[#1A73E8]">Skip</span>
        </button>
        
        <button 
           className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-[#1A73E8] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors disabled:opacity-50"
           disabled={checkedItems.length === 0 && !otherText.trim()}
           onClick={() => onSubmit(checkedItems, otherText)}
        >
           <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-white">Submit</span>
        </button>
      </div>
    </div>
  );
};
const CompanyDiagnosisWizardCard = ({ 
  msg, 
  onSubmit, 
  onCancel,
  onEdit 
}: { 
  msg: Message, 
  onSubmit: (company: string, accounts: string[]) => void, 
  onCancel?: () => void,
  onEdit: () => void 
}) => {
  const [company, setCompany] = useState(msg.selectedDiagCompany || '');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(msg.selectedDiagAccounts || []);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const skipCompany = msg.skipCompany || false;

  const companies = [
    'Nike',
    'Acme Corp',
    'Veloce Motorworks',
    'Kinetix Performance',
    'Lyra Activewear',
    'Apex Drifter',
    'LuminaGrid US Residential',
    'CopperQuill Local',
    'Ironbound B2B',
    'Ironbound local',
    'VelvetIris Brand'
  ];
  const accounts = ['GA12345', 'GA1756483', 'GA1937465', 'GA9988123', 'GA8827456'];

  const handleAccountToggle = (acc: string) => {
    if (selectedAccounts.includes(acc)) {
      setSelectedAccounts(selectedAccounts.filter(a => a !== acc));
    } else {
      setSelectedAccounts([...selectedAccounts, acc]);
    }
  };

  const hasPreviousSubmission = msg.selectedDiagCompany && msg.selectedDiagAccounts && msg.selectedDiagAccounts.length > 0;

  if (msg.companyDiagnosisWizardStatus === 'submitted') {
    return (
      <div className="group flex flex-col items-start p-[12px_16px_16px] gap-[8px] w-full max-w-[388px] bg-[#E8F0FE] rounded-[16px] rounded-tr-[4px] mt-2 relative">
         <div className="flex flex-row items-center gap-[8px] w-full relative">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=40&h=40" alt="Samantha" className="w-[24px] h-[24px] rounded-full object-cover" />
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Samantha</span>
            <button 
               className="absolute right-0 top-0 bg-transparent border-none cursor-pointer hidden group-hover:flex items-center justify-center p-0 text-[#5F6368] hover:text-[#202124]"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            >
               <i className="google-symbols text-[18px]">edit</i>
            </button>
         </div>
         <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
            <strong>Selected the following:</strong>
            <ul className="list-disc pl-5 mt-1 mb-0">
              <li><strong>Company:</strong> {msg.selectedDiagCompany}</li>
              <li><strong>Account(s):</strong> {msg.selectedDiagAccounts?.join(', ')}</li>
            </ul>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-[16px] gap-[16px] w-full max-w-[388px] bg-white border border-[#DADCE0] rounded-[16px] mt-2 shadow-sm relative">
      <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1F1F1F] w-full">
        {skipCompany ? 'Select the accounts you want to proceed with for diagnosis.' : 'Select the company you want to diagnose. Then click submit to proceed.'}
      </div>
      
      <div className="flex flex-col gap-[12px] w-full relative z-30">
        {/* Single Company Selector */}
        {!skipCompany && (
          <div className="relative w-full">
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full h-[48px] px-[16px] bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[15px] text-[#1F1F1F] appearance-none cursor-pointer focus:outline-none focus:border-[#1A73E8]"
            >
              <option value="" disabled>Select company</option>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="absolute right-[16px] top-[14px] pointer-events-none flex items-center text-[#444746]">
              <i className="google-symbols text-[24px]">arrow_drop_down</i>
            </div>
          </div>
        )}

        {/* Checkbox-driven Account Selector */}
        <div className="relative w-full">
          <div 
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="w-full h-[48px] px-[16px] bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[15px] text-[#1F1F1F] flex items-center justify-between cursor-pointer select-none"
          >
            <span className="truncate">
              {selectedAccounts.length > 0 ? selectedAccounts.join(', ') : 'Select account'}
            </span>
            <i className="google-symbols text-[24px] text-[#444746]">arrow_drop_down</i>
          </div>

          {isAccountMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DADCE0] rounded-[8px] shadow-lg max-h-[220px] overflow-y-auto p-[8px] flex flex-col gap-[4px] z-40">
              {/* Select All toggle option */}
              <label className="flex flex-row items-center gap-[12px] px-[8px] py-[6px] border-b border-gray-100 hover:bg-[#F1F3F4] rounded-[4px] cursor-pointer select-none w-full">
                <div className="relative flex items-center justify-center w-[20px] h-[20px]">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.length === accounts.length}
                    onChange={() => {
                      if (selectedAccounts.length === accounts.length) {
                        setSelectedAccounts([]);
                      } else {
                        setSelectedAccounts([...accounts]);
                      }
                    }}
                    className="sr-only"
                  />
                  <i className={`google-symbols text-[20px] ${selectedAccounts.length === accounts.length ? 'text-[#1A73E8]' : 'text-[#444746]'}`}>
                    {selectedAccounts.length === accounts.length ? 'check_box' : 'check_box_outline_blank'}
                  </i>
                </div>
                <span className="font-['Google_Sans_Text'] font-bold text-[14px] text-[#1A73E8]">
                  Select all
                </span>
              </label>

              {accounts.map(acc => (
                <label key={acc} className="flex flex-row items-center gap-[12px] px-[8px] py-[6px] hover:bg-[#F1F3F4] rounded-[4px] cursor-pointer select-none w-full">
                  <div className="relative flex items-center justify-center w-[20px] h-[20px]">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(acc)}
                      onChange={() => handleAccountToggle(acc)}
                      className="sr-only"
                    />
                    <i className={`google-symbols text-[20px] ${selectedAccounts.includes(acc) ? 'text-[#1A73E8]' : 'text-[#444746]'}`}>
                      {selectedAccounts.includes(acc) ? 'check_box' : 'check_box_outline_blank'}
                    </i>
                  </div>
                  <span className="font-['Google_Sans_Text'] font-normal text-[14px] text-[#1F1F1F]">
                    {acc}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center gap-[8px] mt-2 relative z-10">
        <button 
           className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-[#1A73E8] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors disabled:opacity-50"
           disabled={!company || selectedAccounts.length === 0}
           onClick={() => {
             setIsAccountMenuOpen(false);
             onSubmit(company, selectedAccounts);
           }}
        >
           <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-white">Submit</span>
        </button>

        {msg.companyDiagnosisWizardStatus === 'editing' && hasPreviousSubmission && onCancel && (
          <button 
             className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-transparent rounded-[100px] border border-[#C4C7C5] cursor-pointer hover:bg-black/5 transition-colors"
             onClick={() => onCancel()}
          >
             <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-[#1A73E8]">Cancel</span>
          </button>
        )}
      </div>
    </div>
  );
};

const CompanyDiagnosisClarificationCard = ({
  msg,
  onSubmit,
  onEdit
}: {
  msg: Message,
  onSubmit: (data: {
    userRole: 'AE' | 'AS';
    companyId: string;
    currency: string;
    region: string;
    intent: string;
    productSegment?: string;
    marketSegment?: string;
    granularitySegment?: string;
  }) => void,
  onEdit: () => void
}) => {
  const [userRole, setUserRole] = useState<'AE' | 'AS'>(msg.selectedUserRole || 'AE');
  const [companyId, setCompanyId] = useState(msg.selectedCompanyId || 'CO987654');
  const [currency, setCurrency] = useState(msg.selectedCurrency || 'USD');
  const [region, setRegion] = useState(msg.selectedRegion || 'US');
  const [intent, setIntent] = useState(msg.selectedIntent || 'Increase web traffic');
  
  const [wantsSegment, setWantsSegment] = useState(
    !!(msg.selectedProductSegment || msg.selectedMarketSegment || msg.selectedGranularitySegment)
  );
  const [productSegment, setProductSegment] = useState(msg.selectedProductSegment || '');
  const [marketSegment, setMarketSegment] = useState(msg.selectedMarketSegment || '');
  const [granularitySegment, setGranularitySegment] = useState(msg.selectedGranularitySegment || '');

  const intents = [
    'Increase web traffic',
    'Lead generation',
    'Drive brand awareness',
    'Promote app installs'
  ];

  const regions = ['Global', 'US', 'North America', 'EMEA', 'APAC', 'LATAM'];
  const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'];

  if (msg.companyDiagnosisClarificationStatus === 'submitted') {
    return (
      <div className="group flex flex-col items-start p-[12px_16px_16px] gap-[8px] w-full max-w-[388px] bg-[#E8F0FE] rounded-[16px] rounded-tr-[4px] mt-2 relative">
         <div className="flex flex-row items-center gap-[8px] w-full relative">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=40&h=40" alt="Samantha" className="w-[24px] h-[24px] rounded-full object-cover" />
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Samantha</span>
            <button 
               className="absolute right-0 top-0 bg-transparent border-none cursor-pointer hidden group-hover:flex items-center justify-center p-0 text-[#5F6368] hover:text-[#202124]"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            >
               <i className="google-symbols text-[18px]">edit</i>
            </button>
         </div>
         <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
            <strong>Clarified Setup:</strong>
            <ul className="list-disc pl-5 mt-1 mb-0">
              <li><strong>Role:</strong> {msg.selectedUserRole === 'AE' ? 'Account Executive (strategy)' : 'Account Strategist (execution)'}</li>
              <li><strong>Company ID:</strong> {msg.selectedCompanyId}</li>
              <li><strong>Currency:</strong> {msg.selectedCurrency}</li>
              <li><strong>Region:</strong> {msg.selectedRegion}</li>
              <li><strong>Intent:</strong> {msg.selectedIntent}</li>
              {(msg.selectedProductSegment || msg.selectedMarketSegment || msg.selectedGranularitySegment) && (
                <li>
                  <strong>Segmentation:</strong> {
                    [msg.selectedProductSegment, msg.selectedMarketSegment, msg.selectedGranularitySegment].filter(Boolean).join(', ')
                  }
                </li>
              )}
            </ul>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-[16px] gap-[16px] w-full max-w-full self-stretch bg-white border border-[#DADCE0] rounded-[16px] mt-2 shadow-sm relative z-30">
      <div className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1F1F1F] w-full">
        Let's clarify a few details before performance diagnosis:
      </div>

      {/* User Role Selector */}
      <div className="flex flex-col gap-[4px] w-full">
        <span className="font-['Google_Sans_Text'] font-medium text-[12px] leading-[16px] text-[#444746]">
          Are you reviewing this account as an Account Executive (strategy focus) or Account Strategist (execution focus)?
        </span>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value as 'AE' | 'AS')}
          className="h-[36px] px-[8px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
        >
          <option value="" disabled>Select role</option>
          <option value="AE">Account Executive (strategy focus)</option>
          <option value="AS">Account Strategist (execution focus)</option>
        </select>
      </div>

      {/* Basic Info Fields */}
      <div className="flex flex-col gap-[12px] w-full">
        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Company ID</span>
          <input
            type="text"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            placeholder="e.g. CO987654"
            className="h-[36px] px-[12px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
          />
        </div>

        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Currency</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-[36px] px-[8px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Target Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-[36px] px-[8px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Marketing Intent</span>
          <select
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="h-[36px] px-[8px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
          >
            {intents.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      {/* Segmentation Toggle */}
      <div className="flex flex-col gap-[8px] w-full border-t border-[#DADCE0] pt-3">
        <label className="flex flex-row items-center gap-[8px] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={wantsSegment}
            onChange={(e) => setWantsSegment(e.target.checked)}
            className="sr-only"
          />
          <i className={`google-symbols text-[20px] ${wantsSegment ? 'text-[#1A73E8]' : 'text-[#444746]'}`}>
            {wantsSegment ? 'check_box' : 'check_box_outline_blank'}
          </i>
          <span className="font-['Google_Sans_Text'] font-normal text-[13px] text-[#1F1F1F]">
            Slice data by specific dimension (segmentation)
          </span>
        </label>

        {wantsSegment && (
          <div className="flex flex-col gap-[8px] pl-[28px] w-full animate-fade-in">
            <div className="flex flex-col gap-[4px] w-full">
              <span className="font-['Google_Sans_Text'] font-medium text-[11px] text-[#5F6368]">Product Segment</span>
              <input
                type="text"
                value={productSegment}
                onChange={(e) => setProductSegment(e.target.value)}
                placeholder="Search, Video, Shopping, etc."
                className="h-[30px] px-[8px] w-full bg-white border border-[#DADCE0] rounded-[6px] font-['Google_Sans_Text'] text-[12px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>

            <div className="flex flex-col gap-[4px] w-full">
              <span className="font-['Google_Sans_Text'] font-medium text-[11px] text-[#5F6368]">Market or Country Segment</span>
              <input
                type="text"
                value={marketSegment}
                onChange={(e) => setMarketSegment(e.target.value)}
                placeholder="US, UK, EMEA, etc."
                className="h-[30px] px-[8px] w-full bg-white border border-[#DADCE0] rounded-[6px] font-['Google_Sans_Text'] text-[12px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>

            <div className="flex flex-col gap-[4px] w-full">
              <span className="font-['Google_Sans_Text'] font-medium text-[11px] text-[#5F6368]">Granularity Segment</span>
              <input
                type="text"
                value={granularitySegment}
                onChange={(e) => setGranularitySegment(e.target.value)}
                placeholder="Company ID, Ads Account ID, App ID, etc."
                className="h-[30px] px-[8px] w-full bg-white border border-[#DADCE0] rounded-[6px] font-['Google_Sans_Text'] text-[12px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
          </div>
        )}
      </div>

      <button
        className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-[#1A73E8] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors disabled:opacity-50 mt-2 w-full"
        disabled={!userRole}
        onClick={() => {
          onSubmit({
            userRole: userRole as 'AE' | 'AS',
            companyId,
            currency,
            region,
            intent,
            productSegment: wantsSegment ? productSegment : undefined,
            marketSegment: wantsSegment ? marketSegment : undefined,
            granularitySegment: wantsSegment ? granularitySegment : undefined
          });
        }}
      >
        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-white">Submit & Diagnose</span>
      </button>
    </div>
  );
};

const PitchDeckTailoringCard = ({
  msg,
  onSubmit,
  onEdit
}: {
  msg: Message,
  onSubmit: (data: {
    timeFrame: string;
    whyNow: string;
    constraints: string;
    landingPageUrl?: string;
    videoAssets?: string;
    extraDocs?: string;
  }) => void,
  onEdit: () => void
}) => {
  const [timeFrame, setTimeFrame] = useState(msg.selectedTimeFrame || 'Q3 2026');
  const [whyNow, setWhyNow] = useState(msg.selectedWhyNow || 'Shifting budget to Awareness');
  const [constraints, setConstraints] = useState(msg.selectedConstraints || 'Auto vs. Home focus');
  const [landingPageUrl, setLandingPageUrl] = useState(msg.selectedLandingPageUrl || '');
  const [videoAssets, setVideoAssets] = useState(msg.selectedVideoAssets || '');
  const [extraDocs, setExtraDocs] = useState(msg.selectedExtraDocs || '');

  if (msg.pitchDeckTailoringStatus === 'submitted') {
    return (
      <div className="group flex flex-col items-start p-[12px_16px_16px] gap-[8px] w-full max-w-full self-stretch bg-[#E8F0FE] rounded-[16px] rounded-tr-[4px] mt-2 relative">
         <div className="flex flex-row items-center gap-[8px] w-full relative">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=40&h=40" alt="Samantha" className="w-[24px] h-[24px] rounded-full object-cover" />
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Samantha</span>
            <button 
               className="absolute right-0 top-0 bg-transparent border-none cursor-pointer hidden group-hover:flex items-center justify-center p-0 text-[#5F6368] hover:text-[#202124]"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            >
               <i className="google-symbols text-[18px]">edit</i>
            </button>
         </div>
         <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
            <strong>Tailored Details:</strong>
            <ul className="list-disc pl-5 mt-1 mb-0">
              <li><strong>Time Frame:</strong> {msg.selectedTimeFrame}</li>
              <li><strong>Context:</strong> {msg.selectedWhyNow}</li>
              <li><strong>Constraints:</strong> {msg.selectedConstraints}</li>
              {msg.selectedLandingPageUrl && <li><strong>Landing Page:</strong> {msg.selectedLandingPageUrl}</li>}
              {msg.selectedVideoAssets && <li><strong>Video Assets:</strong> {msg.selectedVideoAssets}</li>}
              {msg.selectedExtraDocs && <li><strong>Strategy Docs:</strong> {msg.selectedExtraDocs}</li>}
            </ul>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-[16px] gap-[16px] w-full max-w-full self-stretch bg-white border border-[#DADCE0] rounded-[16px] mt-2 shadow-sm relative z-30">
      <div className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#1F1F1F] w-full">
        To ensure the final pitch deck is perfectly tailored, I have a few questions:
      </div>

      <div className="flex flex-col gap-[12px] w-full">
        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Time Frame</span>
          <span className="font-['Google_Sans_Text'] text-[11px] text-[#5F6368] leading-none">What is the target period for this pitch?</span>
          <input
            type="text"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            placeholder="e.g. Q3 2026, Full Year 2027"
            className="h-[36px] px-[12px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
          />
        </div>

        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Context & Outcomes</span>
          <span className="font-['Google_Sans_Text'] text-[11px] text-[#5F6368] leading-none">What is the specific "Why Now" for this pitch, and what is the primary goal?</span>
          <textarea
            value={whyNow}
            onChange={(e) => setWhyNow(e.target.value)}
            placeholder="e.g. shifting budget to Awareness, launching a new product"
            className="min-h-[60px] p-[8px_12px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] resize-none focus:outline-none focus:border-[#1A73E8]"
          />
        </div>

        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Constraints & Options</span>
          <span className="font-['Google_Sans_Text'] text-[11px] text-[#5F6368] leading-none">Are there any budget limits, specific products to focus on, or creative constraints?</span>
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g. Auto vs. Home focus, budget caps"
            className="min-h-[60px] p-[8px_12px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] resize-none focus:outline-none focus:border-[#1A73E8]"
          />
        </div>

        <div className="flex flex-col gap-[4px] w-full border-t border-[#DADCE0] pt-3">
          <span className="font-['Google_Sans_Text'] font-bold text-[12px] text-[#1F1F1F]">Optional Information</span>
        </div>

        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Landing Page URL</span>
          <input
            type="text"
            value={landingPageUrl}
            onChange={(e) => setLandingPageUrl(e.target.value)}
            placeholder="e.g. https://example.com/campaign"
            className="h-[36px] px-[12px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
          />
        </div>

        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">YouTube Video Assets</span>
          <input
            type="text"
            value={videoAssets}
            onChange={(e) => setVideoAssets(e.target.value)}
            placeholder="e.g. existing assets to analyze"
            className="h-[36px] px-[12px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
          />
        </div>

        <div className="flex flex-col gap-[4px] w-full">
          <span className="font-['Google_Sans_Text'] font-medium text-[12px] text-[#444746]">Internal Strategy Docs</span>
          <textarea
            value={extraDocs}
            onChange={(e) => setExtraDocs(e.target.value)}
            placeholder="e.g. brand notes, strategic plans"
            className="min-h-[60px] p-[8px_12px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] resize-none focus:outline-none focus:border-[#1A73E8]"
          />
        </div>
      </div>

      <button
        className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-[#1A73E8] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors w-full mt-2"
        onClick={() => {
          onSubmit({
            timeFrame,
            whyNow,
            constraints,
            landingPageUrl: landingPageUrl.trim() || undefined,
            videoAssets: videoAssets.trim() || undefined,
            extraDocs: extraDocs.trim() || undefined
          });
        }}
      >
        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-white">Submit & Continue</span>
      </button>
    </div>
  );
};

const PitchDeckNarrativeReviewCard = ({
  msg,
  onSubmit,
  onEdit
}: {
  msg: Message,
  onSubmit: (align: string) => void,
  onEdit: () => void
}) => {
  const [align, setAlign] = useState(msg.selectedNarrativeAlign || 'Yes');

  if (msg.pitchDeckNarrativeStatus === 'submitted') {
    return (
      <div className="group flex flex-col items-start p-[12px_16px_16px] gap-[8px] w-full max-w-full self-stretch bg-[#E8F0FE] rounded-[16px] rounded-tr-[4px] mt-2 relative">
         <div className="flex flex-row items-center gap-[8px] w-full relative">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=40&h=40" alt="Samantha" className="w-[24px] h-[24px] rounded-full object-cover" />
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Samantha</span>
            <button 
               className="absolute right-0 top-0 bg-transparent border-none cursor-pointer hidden group-hover:flex items-center justify-center p-0 text-[#5F6368] hover:text-[#202124]"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            >
               <i className="google-symbols text-[18px]">edit</i>
            </button>
         </div>
         <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
            <strong>Alignment Response:</strong> {msg.selectedNarrativeAlign}
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-[16px] gap-[16px] w-full max-w-full self-stretch bg-white border border-[#DADCE0] rounded-[16px] mt-2 shadow-sm relative z-30">
      <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#1F1F1F] w-full">
        <strong>Does this align with your goals?</strong>
      </div>
      
      <div className="flex flex-col gap-[12px] w-full">
        <select
          value={align}
          onChange={(e) => setAlign(e.target.value)}
          className="h-[36px] px-[8px] w-full bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] text-[13px] text-[#1F1F1F] focus:outline-none focus:border-[#1A73E8]"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <button
        className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-[#1A73E8] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors w-full mt-2"
        onClick={() => onSubmit(align)}
      >
        <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-white">Submit Alignment</span>
      </button>
    </div>
  );
};

const MeetingSelectionCard = ({ msg, onSubmit, onCancel, onEdit }: { msg: Message, onSubmit: (val: string) => void, onCancel: () => void, onEdit: () => void }) => {
  const [selected, setSelected] = useState<string | null>(msg.selectedMeeting || null);
  
  const meetings = [
    { title: "DV360 / Search Silver Leaf Labs Office Hours // Google", time: "Mar 20, 10:00 AM | 5 attendees" },
    { title: "Neary Brands // Google", time: "Mar 20, 11:00 AM | 4 attendees" },
    { title: "R1 Creative Shareout", time: "Mar 21, 9:30 AM | 6 attendees" },
    { title: "Apex Bi-weekly Connect", time: "Mar 21, 1:30 PM | 2 attendees" }
  ];

  if (msg.meetingSelectionStatus === 'submitted') {
    return (
      <div className="group flex flex-col items-start p-[12px_16px_16px] gap-[8px] w-full max-w-[388px] bg-[#E8F0FE] rounded-[16px] rounded-tr-[4px] mt-2 relative">
         <div className="flex flex-row items-center gap-[8px] w-full relative">
            <img src="https://picsum.photos/seed/samantha/24/24" alt="Samantha" className="w-[24px] h-[24px] rounded-full" />
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Samantha</span>
            <button 
               className="absolute right-0 top-0 bg-transparent border-none cursor-pointer hidden group-hover:flex items-center justify-center p-0 text-[#5F6368] hover:text-[#202124]"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            >
               <i className="google-symbols text-[18px]">edit</i>
            </button>
         </div>
         <div className="font-['Roboto'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
            <span className="font-bold">Selected:</span> {msg.selectedMeeting}
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-[12px_16px_16px] gap-[4px] w-full max-w-[388px] bg-[#FFFFFF] border border-[#DADCE0] rounded-[16px] mt-2">
      <div className="font-['Roboto'] font-bold text-[14px] leading-[20px] text-[#3C4043] w-full">
        Select a meeting:
      </div>
      <div className="flex flex-col items-start p-0 gap-[16px] w-full mt-2">
        <div className="flex flex-col items-start p-0 gap-[8px] w-full">
          {meetings.map((m, i) => (
             <div key={i} className="flex flex-row items-start p-0 w-full min-h-[48px] cursor-pointer" onClick={() => setSelected(m.title)}>
                <div className="flex flex-col justify-center items-center p-[8px] w-[36px] h-[36px] shrink-0">
                   <div className="w-[24px] h-[24px] relative flex items-center justify-center">
                     <i className={`google-symbols text-[24px] ${selected === m.title ? 'text-[#1A73E8]' : 'text-[#3C4043]'}`} style={{ fontVariationSettings: selected === m.title ? "'FILL' 1" : "'FILL' 0" }}>
                       {selected === m.title ? 'radio_button_checked' : 'radio_button_unchecked'}
                     </i>
                   </div>
                </div>
                <div className="flex flex-col justify-center items-start pt-[6px] w-[320px]">
                   <div className="font-['Google_Sans_Text'] font-bold text-[16px] leading-[24px] text-[#202124]">
                      {m.title}
                   </div>
                   <div className="font-['Roboto'] font-normal text-[12px] leading-[16px] tracking-[0.3px] text-[#5F6368]">
                      {m.time}
                   </div>
                </div>
             </div>
          ))}
        </div>
        <div className={`flex flex-row items-center w-full mt-2 ${msg.meetingSelectionStatus === 'editing' ? 'justify-end gap-[8px]' : 'justify-end'}`}>
          {msg.meetingSelectionStatus === 'editing' && (
             <button 
               className="flex flex-col justify-center items-center px-[12px] h-[36px] bg-transparent rounded-[100px] border-none cursor-pointer hover:bg-black/5 transition-colors"
               onClick={() => onCancel()}
             >
               <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-[#1A73E8]">Cancel</span>
             </button>
          )}
          <button 
             className="flex flex-col justify-center items-center px-[16px] h-[36px] bg-[#1A73E8] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors disabled:opacity-50"
             disabled={!selected}
             onClick={() => { if (selected) onSubmit(selected); }}
          >
             <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-[#FFFFFF]">Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const PitchDeckFollowUpCard = ({ 
  msg, 
  onSubmit, 
  onEdit 
}: { 
  msg: Message, 
  onSubmit: (divisionId: string, country: string) => void, 
  onEdit: () => void 
}) => {
  const [divisionId, setDivisionId] = useState(msg.selectedDivisionId || '');
  const [country, setCountry] = useState(msg.selectedCountry || '');

  const divisionOptions = ['12345', '67890', '11223', '44556'];
  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' }
  ];

  if (msg.pitchDeckSelectionStatus === 'submitted') {
    const selectedCountryLabel = countryOptions.find(opt => opt.value === msg.selectedCountry)?.label || msg.selectedCountry;
    return (
      <div className="group flex flex-col items-start p-[12px_16px_16px] gap-[8px] w-full max-w-[388px] bg-[#E8F0FE] rounded-[16px] rounded-tr-[4px] mt-2 relative">
         <div className="flex flex-row items-center gap-[8px] w-full relative">
            <img src="https://picsum.photos/seed/samantha/24/24" alt="Samantha" className="w-[24px] h-[24px] rounded-full" />
            <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Samantha</span>
            <button 
               className="absolute right-0 top-0 bg-transparent border-none cursor-pointer hidden group-hover:flex items-center justify-center p-0 text-[#5F6368] hover:text-[#202124]"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            >
               <i className="google-symbols text-[18px]">edit</i>
            </button>
         </div>
         <div className="font-['Roboto'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
            Selected: Division ID {msg.selectedDivisionId} and {selectedCountryLabel}
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-[16px] gap-[16px] w-full max-w-[388px] bg-[#FFFFFF] border border-[#DADCE0] rounded-[16px] mt-2 shadow-sm">
      <div className="font-['Google_Sans_Text'] font-normal text-[15px] leading-[22px] text-[#1F1F1F] w-full">
        Select the division ID and country you want to generate a pitch for. Then click submit to proceed.
      </div>
      
      <div className="flex flex-col gap-[12px] w-full">
        {/* Division ID Selector */}
        <div className="relative w-full">
          <select
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
            className="w-full h-[48px] px-[16px] bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[15px] text-[#1F1F1F] appearance-none cursor-pointer focus:outline-none focus:border-[#1A73E8]"
          >
            <option value="" disabled>Select a division ID</option>
            {divisionOptions.map(opt => (
              <option key={opt} value={opt}>Division ID {opt}</option>
            ))}
          </select>
          <div className="absolute right-[16px] top-[14px] pointer-events-none flex items-center text-[#444746]">
            <i className="google-symbols text-[24px]">arrow_drop_down</i>
          </div>
        </div>

        {/* Country Selector */}
        <div className="relative w-full">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-[48px] px-[16px] bg-white border border-[#74777F] rounded-[8px] font-['Google_Sans_Text'] font-normal text-[15px] text-[#1F1F1F] appearance-none cursor-pointer focus:outline-none focus:border-[#1A73E8]"
          >
            <option value="" disabled>Select a country</option>
            {countryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-[16px] top-[14px] pointer-events-none flex items-center text-[#444746]">
            <i className="google-symbols text-[24px]">arrow_drop_down</i>
          </div>
        </div>
      </div>

      <button 
         className="flex flex-row justify-center items-center px-[24px] h-[36px] bg-[#1A73E8] rounded-[100px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors disabled:opacity-50 mt-2"
         disabled={!divisionId || !country}
         onClick={() => onSubmit(divisionId, country)}
      >
         <span className="font-['Google_Sans'] font-medium text-[14px] leading-[18px] text-[#FFFFFF]">Submit</span>
      </button>
    </div>
  );
};

const DraftMeetingAgendaEmailCard = ({ 
  initialBodyText,
  onClose 
}: { 
  initialBodyText?: string,
  onClose: () => void 
}) => {
  const isPostPitchLyra = initialBodyText?.includes('Lyra Activewear') || initialBodyText?.includes('Demand Gen');
  const [recipients, setRecipients] = useState([
    'jondoe@acmecorp.com',
    'samsmith@acmecorp.com',
    'iam@acmecorp.com',
    'robertdu@acmecorp.com',
    'annasells@google.com'
  ]);
  const [subject, setSubject] = useState(
    isPostPitchLyra 
      ? 'Following up: Scaling your impact with Demand Gen & YouTube VAC' 
      : 'Acme Corp and Google meeting agenda today'
  );
  const [emailBody, setEmailBody] = useState(
    initialBodyText ||
`Hi team,

I want to share the agenda for today’s meeting at 3:00 PM PT. Looking forward to meeting everyone and discussing the following:
• Check in on action items assigned to the customer
• Ensure paths to resolution for the Ads disapprovals and stalled 1P data integration
• Pitch a budget increase to address budget constrained campaigns
• Share the 3 new product updates that they can benefit from - a price drop badge, and additional PMax logic.
Sincerely,
Mila`
  );

  return (
    <div className="flex flex-col items-start p-[24px] gap-[20px] w-full max-w-[800px] bg-[#FFFFFF] border border-[#DADCE0] rounded-[20px] shadow-md mt-3 relative self-stretch">
      {/* Gmail Logo / Header Row */}
      <div className="flex flex-row items-center gap-[12px] w-full">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_435_57859)">
            <path d="M3.33398 26.2569H8.00065V15.0979L1.33398 10.1748V24.2876C1.33398 25.3756 2.22898 26.2569 3.33398 26.2569Z" fill="#4285F4"/>
            <path d="M24 26.2569H28.6667C29.7717 26.2569 30.6667 25.3756 30.6667 24.2876V10.1748L24 15.0979V26.2569Z" fill="#34A853"/>
            <path d="M16 12.4721V21.0055L24 15.0978V6.56445L16 12.4721Z" fill="#EA4335"/>
            <path d="M24 6.56438V15.0977L30.6667 10.1746V7.549C30.6667 5.11536 27.845 3.72541 25.8667 5.18592L24 6.56438Z" fill="#FBBC04"/>
            <path d="M8 6.56445V15.0978L16 21.0055V12.4721L8 6.56445Z" fill="#EA4335"/>
            <path d="M1.33398 7.549V10.1746L8.00065 15.0977V6.56438L6.13398 5.18592C4.15565 3.72541 1.33398 5.11536 1.33398 7.549Z" fill="#C5221E"/>
          </g>
          <defs>
            <clipPath id="clip0_435_57859">
              <rect width="32" height="31.5077" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <span className="font-['Google_Sans'] font-medium text-[16px] leading-[24px] text-[#1F1F1F]">Gmail Draft</span>
      </div>

      {/* Recipient Fields */}
      <div className="flex flex-col gap-[12px] w-full border border-[#DADCE0] rounded-[12px] p-[16px] bg-white">
        <div className="flex flex-row flex-wrap items-center gap-[8px] w-full">
          <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#444746] w-[30px]">To</span>
          <div className="flex flex-row flex-wrap gap-[8px] flex-1">
            {recipients.map((email) => (
              <div key={email} className="box-border flex flex-row items-center p-[4px_12px] gap-[6px] h-[28px] bg-[#F1F3F4] border border-[#DADCE0] rounded-full">
                <span className="font-['Roboto'] font-normal text-[13px] leading-[16px] text-[#3C4043]">{email}</span>
                <i 
                  className="google-symbols text-[14px] leading-none text-[#5F6368] cursor-pointer hover:text-black"
                  onClick={() => setRecipients(recipients.filter(r => r !== email))}
                >
                  close
                </i>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject input */}
      <div className="box-border flex flex-row items-center p-[12px_16px] w-full bg-[#FFFFFF] border border-[#DADCE0] rounded-[12px]">
        <input 
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border-none outline-none font-['Google_Sans'] font-medium text-[15px] leading-[20px] text-[#1F1F1F] bg-transparent"
          placeholder="Subject"
        />
      </div>

      {/* Email Body Area */}
      <div className="box-border flex flex-row items-start p-[16px] w-full min-h-[240px] bg-[#FFFFFF] border border-[#DADCE0] rounded-[12px]">
        <textarea
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          className="w-full min-h-[220px] border-none outline-none font-['Google_Sans_Text'] font-normal text-[15px] leading-[22px] text-[#3C4043] bg-transparent resize-none"
          placeholder="Compose email..."
        />
      </div>

      {/* Footer Actions */}
      <div className="flex flex-row items-center justify-between w-full mt-[8px]">
        <button className="box-border flex flex-row justify-center items-center p-[0px_16px] gap-[6px] h-[36px] border border-[#ABABAB] rounded-full bg-transparent cursor-pointer hover:bg-[#F1F3F4]">
          <i className="google-symbols text-[18px] text-[#1A73E8]">edit</i>
          <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#1A73E8]">Edit in Gmail</span>
        </button>
        
        <div className="flex flex-row items-center gap-[16px]">
          <button 
            onClick={onClose}
            className="font-['Google_Sans'] font-medium text-[14px] leading-[20px] text-[#5F6368] hover:text-black cursor-pointer bg-transparent border-none"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="flex flex-row justify-center items-center p-[0px_24px] gap-[8px] h-[36px] rounded-full bg-[#1A73E8] text-white border-none cursor-pointer hover:bg-[#1557B0] shadow-sm"
          >
            <span className="font-['Google_Sans'] font-medium text-[14px] leading-[20px]">Send</span>
            <i className="google-symbols text-[18px] text-white">send</i>
          </button>
        </div>
      </div>
    </div>
  );
};

export const RightPanel = ({ 
  isCanvasOpen, 
  onGenerateCanvasStart,
  onGenerateCanvasComplete,
  onOpenCanvas,
  externalMessage,
  onExternalMessageHandled,
  focusedSection,
  focusedText,
  onClearFocus,
  onSubmitRefinement,
  onSourceClick
}: { 
  isCanvasOpen?: boolean, 
  onGenerateCanvasStart?: (type?: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides', company?: string) => void,
  onGenerateCanvasComplete?: () => void,
  onOpenCanvas?: (type?: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides', company?: string) => void,
  externalMessage?: ExternalMessage,
  onExternalMessageHandled?: () => void,
  focusedSection?: { id: string; title: string } | null,
  focusedText?: string | null,
  onClearFocus?: () => void,
  onSubmitRefinement?: (prompt: string) => void,
  onSourceClick?: (source: Source) => void
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>(initialChatMessages);
  const [inputText, setInputText] = useState('');
  const [editorKey, setEditorKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{ name: string; url: string; type: string; base64?: string } | null>(null);
  const [loadingStatementIndex, setLoadingStatementIndex] = useState(0);
  const [expandedCanvasSteps, setExpandedCanvasSteps] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecentExpanded, setIsRecentExpanded] = useState(true);
  const [isCanvasesExpanded, setIsCanvasesExpanded] = useState(true);
  const [canvases, setCanvases] = useState<SavedCanvas[]>([]);
  const [isAgentUpdateThinking, setIsAgentUpdateThinking] = useState(false);
  const [isActionItemsExpanded, setIsActionItemsExpanded] = useState(false);
  const [isDiagAccountsExpanded, setIsDiagAccountsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // If browser window has enough vertical height (e.g. 1100px)
      // so we can fit expanded cards without showing initial scrollbars:
      if (window.innerHeight >= 1100) {
        setIsActionItemsExpanded(true);
        setIsDiagAccountsExpanded(true);
      } else {
        setIsActionItemsExpanded(false);
        setIsDiagAccountsExpanded(false);
      }
    };

    // Run once on load
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const agentUpdateMsgRef = useRef<HTMLDivElement>(null);
  const [mentionState, setMentionState] = useState<{
    isOpen: boolean;
    query: string;
    category: string | null;
    atIndex: number;
  }>({
    isOpen: false,
    query: '',
    category: null,
    atIndex: -1
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLDivElement>(null);

  const loadingStatements = [
    { text: "Analyzing data...", logo: "ConnectAI" },
    { text: "Integrating MOMA data and files", logo: "MOMA" },
    { text: "Searching the web...", logo: "Google" },
    { text: "Searching Connect Sales", logo: "ConnectSales" },
    { text: "Generating Gmail Draft...", logo: "Gmail" },
    { text: "Analyzing Meeting Intelligence logs...", logo: "ConnectAI" },
    { text: "Finalizing unified brief...", logo: "ConnectAI" }
  ];

  const [openSources, setOpenSources] = useState<Record<string, boolean>>({});
  const [openThinking, setOpenThinking] = useState<Record<string, boolean>>({});

  const isAnyMeetingEditing = activeChatId && messagesByChat[activeChatId]
    ? messagesByChat[activeChatId].some(m => 
        m.meetingSelectionStatus === 'editing' || 
        m.meetingPrepWizardStatus === 'editing' || 
        m.focusAreasSelectionStatus === 'editing' ||
        m.companyDiagnosisWizardStatus === 'editing' ||
        m.pitchDeckSelectionStatus === 'editing' ||
        m.pitchDeckTailoringStatus === 'editing' ||
        m.pitchDeckNarrativeStatus === 'editing'
      )
    : false;

  const getPlanSteps = (type?: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides') => {
    if (type === 'prepare') {
      return [
        "Summarize company performance data",
        "Analyze past meetings for action items",
        "Check for any account issues and open cases",
        "Identify any relevant external trends and insights",
        "Generate pitch recommendations",
        "Suggest meeting agenda based on findings"
      ];
    }
    if (type === 'slides') {
      return [
        "Gather brand insights, historical spend, and industry benchmark data",
        "Gather background information and recent news about the brand",
        "Collecting audience data",
        "Preparing a strategic narrative"
      ];
    }
    if (type === 'gap') {
      return [
        "Analyze Sales Target & Pipeline Gap",
        "Diagnose Customer Sentiment & Friction",
        "Verify Pitch Implementation",
        "Detect KPI Anomalies & Red Flags",
        "Identify Share of Wallet Trends",
        "Synthesize Scorecard & Recommendations"
      ];
    }
    return [
      "Detect critical actions",
      "Determine growth opportunities",
      "Generate executive summary",
      "Finalizing generating canvas content"
    ];
  };

  const getInitialPlanSteps = (type?: 'diagnose' | 'prepare' | 'gap' | 'sales' | 'slides') => {
    if (type === 'prepare') {
      return [
        "Review recent performance metrics",
        "Analyze current product adoption",
        "Identify upsell opportunities",
        "Generate meeting agenda",
        "Create talking points for objections"
      ];
    }
    if (type === 'slides') {
      return [
        "Gather brand insights, historical spend, and industry benchmark data",
        "Gather background information and recent news about the brand",
        "Collect audience data",
        "Prepare a strategic narrative"
      ];
    }
    if (type === 'gap') {
      return [
        "Analyze Sales Target & Pipeline Gap",
        "Diagnose Customer Sentiment & Friction",
        "Verify Pitch Implementation",
        "Detect KPI Anomalies & Red Flags",
        "Identify Share of Wallet Trends",
        "Synthesize Scorecard & Recommendations"
      ];
    }
    return [
      "Detect critical actions",
      "Determine growth opportunities",
      "Generate executive summary",
      "Finalizing generating canvas content"
    ];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    if (!isAnyMeetingEditing) {
      scrollToBottom();
    }
  }, [messagesByChat, activeChatId, isLoading, isAnyMeetingEditing]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStatementIndex(0);
      interval = setInterval(() => {
        setLoadingStatementIndex((prev) => Math.min(prev + 1, 4));
      }, 3000);
    } else {
      setLoadingStatementIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) {
        setIsAttachmentMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  useEffect(() => {
    if (externalMessage) { 
      handleSendMessage(externalMessage.text || '', true, externalMessage);
      setIsHistoryOpen(false);
      

      if (onExternalMessageHandled) {
        onExternalMessageHandled();
      }
    }
  }, [externalMessage]);

  useEffect(() => {
    if (inputText === '' && textareaRef.current) {
      if ('value' in textareaRef.current) {
        (textareaRef.current as any).style.height = 'auto';
      }
    }
  }, [inputText]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract just the base64 data part
        const base64Data = base64String.split(',')[1];
        setSelectedAttachment({
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          base64: base64Data
        });
        setIsAttachmentMenuOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (text: string, useFastModel: boolean = false, extMsg?: ExternalMessage) => {
    if (!text.trim() && !selectedAttachment) return;

    let currentChatId = activeChatId;

    if (!currentChatId) {
      const newId = Date.now().toString();
      const newChat: ChatItem = {
        id: newId,
        title: text.slice(0, 30) + (text.length > 30 ? '...' : 'Attachment'),
        group: 'Today',
        isPinned: false,
      };
      setChats(prev => [newChat, ...prev]);
      setMessagesByChat(prev => ({ ...prev, [newId]: [] }));
      setActiveChatId(newId);
      currentChatId = newId;
    }

    const userMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: extMsg?.type === 'date_update' ? `Update date range to: ${extMsg.text}` : text,
      attachment: selectedAttachment || undefined
    };
    
    setMessagesByChat(prev => ({
      ...prev,
      [currentChatId!]: [...(prev[currentChatId!] || []), userMsg]
    }));
    
    const currentAttachment = selectedAttachment;
    setInputText('');
    setEditorKey(k => k + 1);
    setSelectedAttachment(null);
    setIsLoading(true);

    const isForecastNotesPrompt = 
      text.toLowerCase().includes('forecast notes') || 
      text.toLowerCase().includes('sales outlook numbers');

    if (isForecastNotesPrompt) {
      setIsLoading(false);
      setIsAgentUpdateThinking(true);
      
      setTimeout(() => {
        setIsAgentUpdateThinking(false);
        setMessagesByChat(prevMsgs => {
          const targetChatId = currentChatId || 'default';
          const existingChat = prevMsgs[targetChatId] || [];
          const updateMsg: Message = {
            id: 'msg_agent_update_' + Date.now(),
            sender: 'ai',
            text: '',
            isAgentUpdate: true
          };
          return {
            ...prevMsgs,
            [targetChatId]: [...existingChat, updateMsg]
          };
        });
        setTimeout(() => {
          agentUpdateMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 3000);
    }

    const isDraftEmailPrompt = 
      text.toLowerCase().includes('draft meeting agenda email') ||
      text.toLowerCase().includes('draft a follow-up email') ||
      text.toLowerCase().includes('draft follow up email') ||
      text.toLowerCase().includes('write email') ||
      text.toLowerCase().includes('generate email') ||
      text.toLowerCase().includes('write an email') ||
      text.toLowerCase().includes('generate an email') ||
      text.toLowerCase().includes('post-pitch');

    if (isDraftEmailPrompt) {
      setIsExpanded(true);
      setIsLoading(true);
      
      let targetCompany = 'Acme Corp';
      if (text.toLowerCase().includes('neary brands') || text.toLowerCase().includes('neary')) {
        targetCompany = 'Neary Brands';
      } else if (text.toLowerCase().includes('nike')) {
        targetCompany = 'Nike';
      } else if (text.toLowerCase().includes('acme')) {
        targetCompany = 'Acme Corp';
      }

      const isPostPitchLyra = text.toLowerCase().includes('lyra') && text.toLowerCase().includes('post-pitch');
      
      if (isPostPitchLyra) {
        setLoadingStatementIndex(4);
        setIsLoading(true);
        setTimeout(() => {
          const postPitchEmailText = `Hi Jon,

It was great speaking with you earlier this week about Lyra Activewear's performance goals. I wanted to follow up on our discussion regarding Demand Gen and YouTube Video Action Campaigns (VAC) and address a couple of the key objections raised.

1. Creative Asset Requirements
I understand the concern around the volume of creative needed. The good news is that these AI-driven formats are designed to be highly flexible. We can start by repurposing Lyra's existing high-performing social assets (images and short-form videos). Google’s smart tools can then automatically crop, resize, and optimize these assets for different YouTube placements.

2. Cross-Channel Attribution
Regarding your question on attribution—both Demand Gen and VAC are built to work across the "messy middle" of the customer journey. While traditional last-click models often undervalue these formats, we can utilize Data-Driven Attribution (DDA) and Conversion Lift studies to show the true incremental impact these campaigns have on Lyra's total Search and Direct conversions.

I’ve attached a one-pager on creative specs and a brief overview of our attribution methodology for your review.
Are you available for a 15-minute sync on June 2 to look at how we can implement this for your upcoming active wear campaign push?

Best regards,
Mila`;

          setMessagesByChat(prevMsgs => {
            const targetChatId = currentChatId || 'default';
            const existingChat = prevMsgs[targetChatId] || [];
            const emailMsg: Message = {
              id: 'msg_email_draft_' + Date.now(),
              sender: 'ai',
              text: '',
              isMeetingAgendaEmail: true,
              emailBodyText: postPitchEmailText
            };
            return {
              ...prevMsgs,
              [targetChatId]: [...existingChat, emailMsg]
            };
          });
          setIsLoading(false);
        }, 2500);
        return;
      }

      const emailPromise = generateEmailDraft(text, targetCompany);

      emailPromise.then((geminiEmail) => {
        setIsLoading(false);
        setMessagesByChat(prevMsgs => {
          const targetChatId = currentChatId || 'default';
          const existingChat = prevMsgs[targetChatId] || [];
          const emailMsg: Message = {
            id: 'msg_email_draft_' + Date.now(),
            sender: 'ai',
            text: '',
            isMeetingAgendaEmail: true,
            emailBodyText: geminiEmail
          };
          return {
            ...prevMsgs,
            [targetChatId]: [...existingChat, emailMsg]
          };
        });
      }).catch((err) => {
        console.error("Failed to generate email via Gemini", err);
        setIsLoading(false);
      });
      return;
    }

    if (text.toLowerCase().includes('growth planner report') || text.toLowerCase().includes('growth planner for acme corp')) {
      setIsExpanded(true);
      setTimeout(() => {
        const aiMsg: Message = {
          id: 'msg_growth_planner_' + Date.now(),
          sender: 'ai',
          text: '',
          isGrowthPlannerReport: true
        };
        setMessagesByChat(prev => ({
          ...prev,
          [currentChatId!]: [...(prev[currentChatId!] || []), aiMsg]
        }));
        setIsLoading(false);
      }, 1800);
      return;
    }

    if (focusedSection && onSubmitRefinement) {
      onSubmitRefinement(text);
      const refinedCard = focusedSection;
      setTimeout(() => {
        const aiMsg: Message = { 
          id: (Date.now() + 2).toString(), 
          sender: 'ai', 
          text: `I have successfully refined the **${refinedCard.title}** section based on your request: *"${text}"*.`,
          proofOfWork: {
            items: [
              { bold: 'Analyzed', text: `your prompt instruction: "${text}"` },
              { bold: 'Regenerated', text: `content for the ${refinedCard.title} section using Gemini AI` },
              { bold: 'Updated', text: 'the canvas card visualization and layout dynamically' }
            ]
          }
        };
        setMessagesByChat(prev => ({
          ...prev,
          [currentChatId!]: [...(prev[currentChatId!] || []), aiMsg]
        }));
        setIsLoading(false);
      }, 1200);
    }
    if (focusedSection || focusedText) {
      onClearFocus && onClearFocus();
    }

    if (extMsg?.type === 'date_update') {
      setTimeout(() => {
        const companyName = extMsg?.company || 'Acme Corp';
        const newRange = extMsg?.text || 'Jan 1 - today';
        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: `I have successfully updated the **${companyName} Diagnosis Canvas** based on the new date range selection: **${newRange}**.`,
          proofOfWork: {
            items: [
              { bold: 'Updated', text: `date range scope to "${newRange}"` },
              { bold: 'Regenerated', text: `financial targets and attainment scores for ${companyName}` },
              { bold: 'Refreshed', text: 'YouTube spend anomaly metrics and potential blockers' }
            ]
          }
        };
        setMessagesByChat(prev => ({
          ...prev,
          [currentChatId!]: [...(prev[currentChatId!] || []), aiMsg]
        }));
        setIsLoading(false);
      }, 1500);
      return;
    }

    const matchCompanyDiagnosisPrompt = (t: string): { matched: boolean; company?: string } => {
      let clean = t.trim().toLowerCase().replace(/[?.]$/, '').trim();
      
      if (clean.endsWith('why are we missing the jbp')) {
        clean = clean.slice(0, -'why are we missing the jbp'.length).trim();
      }
      if (clean.endsWith('this quarter')) {
        clean = clean.slice(0, -'this quarter'.length).trim();
      }
      if (clean.endsWith('performance')) {
        clean = clean.slice(0, -'performance'.length).trim();
      }
      clean = clean.replace(/[?.]$/, '').trim();

      const patterns = [
        /^help me diagnose(?:\s+(.+))?$/,
        /^diagnose(?:\s+(.+))?$/,
        /^how is(?:\s+(.+?))?\s+performing$/,
        /^perform a company diagnosis for(?:\s+(.+))?$/,
        /^run a performance diagnosis for(?:\s+(.+))?$/,
        /^generate a company diagnosis canvas(?:\s+for\s+(.+))?$/,
        /^create a diagnosis canvas for(?:\s+(.+))?$/,
        /^create a company diagnosis for(?:\s+(.+))?$/,
        /^help me understand(?:\s+(.+))?$/
      ];

      for (const pattern of patterns) {
        const match = clean.match(pattern);
        if (match) {
          const captured = match[1]?.trim();
          if (captured) {
            const knownCompanies = [
              'Nike', 'Acme Corp', 'Veloce Motorworks', 'Kinetix Performance', 
              'Lyra Activewear', 'Apex Drifter', 'LuminaGrid US Residential', 
              'CopperQuill Local', 'Ironbound B2B', 'Ironbound local', 'VelvetIris Brand',
              'Neary Brands', 'Apex Inc.'
            ];
            const foundKnown = knownCompanies.find(c => c.toLowerCase() === captured.toLowerCase());
            return { matched: true, company: foundKnown || captured };
          }
          return { matched: true };
        }
      }
      return { matched: false };
    };

    const diagMatch = matchCompanyDiagnosisPrompt(text);

    if (
      extMsg?.type === 'diagnose' || 
      text.toLowerCase().trim() === 'diagnose companies' || 
      text.toLowerCase().includes('diagnose the top 5 declining companies') ||
      diagMatch.matched
    ) {
      setTimeout(() => {
        const targetCompany = extMsg?.company || diagMatch.company;
        const isDirectDiagnose = !!targetCompany;
        
        if (isDirectDiagnose) {
          const aiMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            sender: 'ai', 
            text: '',
            isCompanyDiagnosisClarification: true,
            companyDiagnosisClarificationStatus: 'pending',
            selectedDiagCompany: targetCompany,
            selectedDiagAccounts: []
          };
          setMessagesByChat(prev => ({
            ...prev,
            [currentChatId!]: [...prev[currentChatId!], aiMsg]
          }));
        } else {
          const aiMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            sender: 'ai', 
            text: '',
            isCompanyDiagnosisWizard: true,
            companyDiagnosisWizardStatus: 'pending',
            skipCompany: false,
            selectedDiagCompany: ''
          };
          setMessagesByChat(prev => ({
            ...prev,
            [currentChatId!]: [...prev[currentChatId!], aiMsg]
          }));
        }
        setIsLoading(false);
      }, 1500);
      return;
    }

    if (extMsg?.type === 'prepare' || text.toLowerCase().trim() === 'prepare for a meeting' || text.toLowerCase().trim() === 'help me prepare for my upcoming meeting') {
      setTimeout(() => {
        const isDirectPrepare = extMsg?.type === 'prepare' && extMsg?.company;
        
        if (isDirectPrepare) {
          const targetCompany = extMsg.company;
          let targetMeeting = `${targetCompany} // Upcoming Meeting`;
          if (targetCompany === 'Nike') {
            targetMeeting = 'Nike // Q1 Performance sync Wed May 27 2026';
          } else if (targetCompany === 'Acme Corp') {
            targetMeeting = 'Acme Corp // Google Bi-Weekly sync Wed May 27 2026 at 1:00 PM PT';
          } else if (targetCompany === 'Neary Brands') {
            targetMeeting = 'Neary Brands // Google sync at 1:00 PM today';
          } else if (targetCompany === 'Veloce Motorworks') {
            targetMeeting = 'Veloce Motorworks // Google QBR Wed May 27 2026';
          } else if (targetCompany === 'Silver Leaf Labs') {
            targetMeeting = 'Silver Leaf Labs // DV360 / Search Office Hours';
          } else if (targetCompany === 'Apex Inc.') {
            targetMeeting = 'Apex Inc. // Apex Bi-weekly Connect';
          } else if (targetCompany === 'Lyra Activewear') {
            targetMeeting = 'Lyra Activewear // Lyra Activewear Bi-weekly Connect';
          }

          const aiMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            sender: 'ai', 
            text: '',
            isFocusAreasSelection: true,
            focusAreasSelectionStatus: 'pending',
            selectedPrepCompany: targetCompany,
            selectedPrepMeeting: targetMeeting,
            skipMeeting: true
          };
          setMessagesByChat(prev => ({
            ...prev,
            [currentChatId!]: [...prev[currentChatId!], aiMsg]
          }));
        } else {
          const aiMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            sender: 'ai', 
            text: '',
            isMeetingPrepWizard: true,
            meetingPrepWizardStatus: 'pending'
          };
          setMessagesByChat(prev => ({
            ...prev,
            [currentChatId!]: [...prev[currentChatId!], aiMsg]
          }));
        }
        setIsLoading(false);
      }, 1500);
      return;
    }

    if (extMsg?.type === 'gap' || text.toLowerCase().includes('gap to target')) {
      setTimeout(() => {
        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: `I can help you diagnose and plan your gap to target.`,
          isAgentPlan: true,
          agentPlanType: 'gap',
          company: extMsg?.company || 'Acme Corp'
        };
        setMessagesByChat(prev => ({
          ...prev,
          [currentChatId!]: [...prev[currentChatId!], aiMsg]
        }));
        setIsLoading(false);
      }, 2000);
      return;
    }

    if (extMsg?.type === 'slides' || text.toLowerCase().includes('pitch deck') || text.toLowerCase().includes('slide deck') || text.toLowerCase().includes('create slides')) {
      setTimeout(() => {
        const companyName = extMsg?.company || 'Acme Corp';
        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: '',
          isPitchDeckFollowUp: true,
          pitchDeckSelectionStatus: 'pending',
          company: companyName
        };
        setMessagesByChat(prev => ({
          ...prev,
          [currentChatId!]: [...prev[currentChatId!], aiMsg]
        }));
        setIsLoading(false);
      }, 1200);
      return;
    }

    try {
      const history = messagesByChat[currentChatId!] || [];
      const contents = history.map(msg => {
        const parts: any[] = [];
        if (msg.text) parts.push({ text: msg.text });
        if (msg.attachment?.base64) {
          parts.push({
            inlineData: {
              data: msg.attachment.base64,
              mimeType: msg.attachment.type
            }
          });
        }
        return {
          role: msg.sender === 'user' ? 'user' : 'model',
          parts
        };
      });
      
      const newParts: any[] = [];
      let promptText = text;
      if (focusedSection) {
        promptText = `[Target Card: ${focusedSection.title}] ${text}`;
      }
      if (text) newParts.push({ text: promptText });
      if (currentAttachment?.base64) {
        newParts.push({
          inlineData: {
            data: currentAttachment.base64,
            mimeType: currentAttachment.type
          }
        });
      }
      contents.push({ role: 'user', parts: newParts });

      const aiMsgId = (Date.now() + 1).toString();
      const initialAiMsg: Message = { 
        id: aiMsgId, 
        sender: 'ai', 
        text: '',
        thinkingText: ''
      };
      
      setMessagesByChat(prev => ({
        ...prev,
        [currentChatId!]: [...(prev[currentChatId!] || []), initialAiMsg]
      }));

      const companyName = 'Acme Corp'; // Default as fallback
      
      const stream = generateChatResponse(contents, companyName);
      
      let finalFullText = '';
      let finalThinkingText = '';
      
      for await (const chunk of stream) {
        finalFullText = chunk.text;
        finalThinkingText = chunk.thinking;
        
        setMessagesByChat(prev => {
          const chat = prev[currentChatId!];
          const updated = chat.map(m => 
            m.id === aiMsgId ? { ...m, text: chunk.text, thinkingText: chunk.thinking } : m
          );
          return { ...prev, [currentChatId!]: updated };
        });
      }
      
      // Extract sources from finalFullText
      const sourcesStartTag = '<sources>';
      const sourcesEndTag = '</sources>';
      const sourcesStartIdx = finalFullText.indexOf(sourcesStartTag);
      const sourcesEndIdx = finalFullText.indexOf(sourcesEndTag);
      
      let extractedSources: any[] = [];
      let cleanedText = finalFullText;

      if (sourcesStartIdx !== -1 && sourcesEndIdx !== -1 && sourcesEndIdx > sourcesStartIdx) {
        const sourcesJsonString = finalFullText.substring(sourcesStartIdx + sourcesStartTag.length, sourcesEndIdx).trim();
        cleanedText = (finalFullText.substring(0, sourcesStartIdx) + finalFullText.substring(sourcesEndIdx + sourcesEndTag.length)).trim();
        try {
          extractedSources = JSON.parse(sourcesJsonString);
        } catch (e) {
          console.error("Failed to parse sources JSON:", e);
        }
      }
      
      // Extract plan steps from cleanedText
      const planStepsStartTag = '<plan_steps>';
      const planStepsEndTag = '</plan_steps>';
      const planStepsStartIdx = cleanedText.indexOf(planStepsStartTag);
      const planStepsEndIdx = cleanedText.indexOf(planStepsEndTag);
      
      let extractedPlanSteps: string[] = [];
      
      if (planStepsStartIdx !== -1 && planStepsEndIdx !== -1 && planStepsEndIdx > planStepsStartIdx) {
        const planStepsJsonString = cleanedText.substring(planStepsStartIdx + planStepsStartTag.length, planStepsEndIdx).trim();
        cleanedText = (cleanedText.substring(0, planStepsStartIdx) + cleanedText.substring(planStepsEndIdx + planStepsEndTag.length)).trim();
        try {
          extractedPlanSteps = JSON.parse(planStepsJsonString);
        } catch (e) {
          console.error("Failed to parse plan steps JSON:", e);
        }
      }

      // Update the message with cleaned text, sources and plan steps
      setMessagesByChat(prev => {
        const chat = prev[currentChatId!];
        const updated = chat.map(m => 
          m.id === aiMsgId ? { 
            ...m, 
            text: cleanedText, 
            sources: extractedSources.length > 0 ? extractedSources : undefined, 
            scannedSourcesCount: extractedSources.length,
            planSteps: extractedPlanSteps.length > 0 ? extractedPlanSteps : undefined,
            isAgentPlan: extractedPlanSteps.length > 0 ? true : m.isAgentPlan
          } : m
        );
        return { ...prev, [currentChatId!]: updated };
      });

    } catch (error) {
      console.error('Error generating response:', error);
      const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Sorry, an error occurred while generating the response.' };
      setMessagesByChat(prev => ({
        ...prev,
        [currentChatId!]: [...(prev[currentChatId!] || []), errorMsg]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCanvasClick = (msgId: string) => {
    if (!activeChatId) return;
    
    const currentChat = messagesByChat[activeChatId];
    const msg = currentChat?.find(m => m.id === msgId);
    const planType = msg?.agentPlanType || 'diagnose';
    const msgCompany = msg?.company || 'Acme Corp';

    if (onGenerateCanvasStart) onGenerateCanvasStart(planType, msgCompany);

    setMessagesByChat(prev => {
      const chat = prev[activeChatId];
      return {
        ...prev,
        [activeChatId]: chat.map(m => 
          m.id === msgId ? { ...m, isGeneratingCanvas: true, canvasStep: 0 } : m
        )
      };
    });

    const totalSteps = planType === 'prepare' ? 6 : (planType === 'gap' ? 5 : (planType === 'slides' ? 5 : 4));

    let step = 0;
    const interval = setInterval(async () => {
      step++;
      
      if (step < totalSteps) {
        setMessagesByChat(prev => {
          const currentChat = prev[activeChatId];
          return {
            ...prev,
            [activeChatId]: currentChat.map(msg => 
              msg.id === msgId ? { ...msg, canvasStep: step } : msg
            )
          };
        });
      } else {
        clearInterval(interval);
        
        // Final step update for the canvas step
        setMessagesByChat(prev => {
          const currentChat = prev[activeChatId];
          return {
            ...prev,
            [activeChatId]: currentChat.map(msg => 
              msg.id === msgId ? { ...msg, canvasStep: step } : msg
            )
          };
        });

        // Use mock data to display the response immediately
        setMessagesByChat(prev => {
          const currentChat = prev[activeChatId];
          return {
            ...prev,
            [activeChatId]: [...currentChat, {
              id: (Date.now() + 1).toString(),
              sender: 'ai',
              text: 'Your canvas is ready!',
              proofOfWork: {
                items: planType === 'prepare' ? [
                  { bold: 'Summarized', text: 'company performance data from QTD revenue and recent account anomalies.' },
                  { bold: 'Created', text: 'meeting agenda based on past meetings and email conversations, key points and action items.' },
                  { bold: 'Crafted', text: 'suggested follow ups from the last recorded meeting on Mar 30, 2026.' },
                  { bold: 'Generated', text: 'pitch recommendations backed by projected outcomes and ROI forecasts.' }
                ] : planType === 'gap' ? [
                  { bold: 'Analyzed', text: 'Seller attainment against target tracking metrics.' },
                  { bold: 'Generated', text: 'Portfolio root cause analysis on declining segments.' },
                  { bold: 'Identified', text: 'Critical accounts driving underperformance.' },
                  { bold: 'Crafted', text: 'Role-specific action plan to close remaining gap.' },
                  { bold: 'Mapped', text: 'Priority growth areas for potential upsell targets.' }
                ] : planType === 'slides' ? [
                  { bold: 'Synthesized', text: 'brand positioning and strategic Q3 objectives.' },
                  { bold: 'Configured', text: 'full-funnel YouTube video marketing sequence.' },
                  { bold: 'Allocated', text: 'media budget splits with customized data visualization.' },
                  { bold: 'Created', text: '4-step product launch and optimization roadmap.' },
                  { bold: 'Finalized', text: 'pitch deck presentation slides with premium layout.' }
                ] : [
                  { bold: 'Analyzed', text: 'Sales Target & Pipeline Gap to identify critical revenue shortfalls.' },
                  { bold: 'Diagnosed', text: 'Customer Sentiment & Friction points across recent interactions.' },
                  { bold: 'Verified', text: 'Pitch Implementation and current product adoption metrics.' },
                  { bold: 'Synthesized', text: 'Scorecard & Recommendations into a unified executive summary.' }
                ]
              }
            }]
          };
        });

        setTimeout(() => {
          if (onGenerateCanvasComplete) onGenerateCanvasComplete();
        }, 1000);

        setCanvases(prev => {
          if (prev.some(c => c.id === msgId)) return prev;
          const newCanvas: SavedCanvas = {
            id: msgId,
            title: planType === 'prepare' ? `Meeting prep canvas with ${msgCompany}` : planType === 'gap' ? `Gap to target planning for portfolio` : planType === 'slides' ? `Pitch deck for ${msgCompany}` : `Company diagnosis canvas with ${msgCompany}`,
            type: planType,
            company: msgCompany
          };
          return [newCanvas, ...prev];
        });
      }
    }, 1500);
  };

  const handleMeetingSelectionSubmit = (msgId: string, selected: string) => {
    setMessagesByChat(prev => {
      const chat = prev[activeChatId || 'default'] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, meetingSelectionStatus: 'submitted' as const, selectedMeeting: selected } : m);
      return { ...prev, [(activeChatId || 'default')]: updated };
    });

    setIsLoading(true);
    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: `I can certainly help you prepare for your meeting with ${selected}. This is an operational meeting.`,
        isAgentPlan: true,
        agentPlanType: 'prepare',
        company: selected.split('//')[0].trim()
      };
      setMessagesByChat(prev => ({
        ...prev,
        [(activeChatId || 'default')]: [...prev[(activeChatId || 'default')], aiMsg]
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleCompanyDiagnosisWizardSubmit = (msgId: string, companyVal: string, accountsVal: string[]) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { 
        ...m, 
        companyDiagnosisWizardStatus: 'submitted' as const, 
        selectedDiagCompany: companyVal, 
        selectedDiagAccounts: accountsVal 
      } : m);
      return { ...prev, [activeId]: updated };
    });

    setIsLoading(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: '',
        isCompanyDiagnosisClarification: true,
        companyDiagnosisClarificationStatus: 'pending',
        selectedDiagCompany: companyVal,
        selectedDiagAccounts: accountsVal
      };
      setMessagesByChat(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), aiMsg]
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleCompanyDiagnosisWizardEdit = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, companyDiagnosisWizardStatus: 'editing' as const } : m);
      return { ...prev, [activeId]: updated };
    });
  };

  const handleCompanyDiagnosisWizardCancel = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, companyDiagnosisWizardStatus: 'submitted' as const } : m);
      return { ...prev, [activeId]: updated };
    });
  };

  const handleCompanyDiagnosisClarificationSubmit = (
    msgId: string,
    data: {
      userRole: 'AE' | 'AS';
      companyId: string;
      currency: string;
      region: string;
      intent: string;
      productSegment?: string;
      marketSegment?: string;
      granularitySegment?: string;
    }
  ) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { 
        ...m, 
        companyDiagnosisClarificationStatus: 'submitted' as const,
        selectedUserRole: data.userRole,
        selectedCompanyId: data.companyId,
        selectedCurrency: data.currency,
        selectedRegion: data.region,
        selectedIntent: data.intent,
        selectedProductSegment: data.productSegment,
        selectedMarketSegment: data.marketSegment,
        selectedGranularitySegment: data.granularitySegment
      } : m);
      return { ...prev, [activeId]: updated };
    });

    setIsLoading(true);
    setTimeout(() => {
      const targetCompany = messagesByChat[activeId]?.find(m => m.id === msgId)?.selectedDiagCompany || 'Acme Corp';
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I can certainly perform a deep dive into ${targetCompany}'s performance.`,
        isAgentPlan: true,
        agentPlanType: 'diagnose',
        company: targetCompany,
        planSteps: [
          "Analyze Sales Target & Pipeline Gap",
          "Diagnose Customer Sentiment & Friction",
          "Verify Pitch Implementation",
          "Detect KPI Anomalies & Red Flags",
          "Identify Share of Wallet Trends",
          "Synthesize Scorecard & Recommendations"
        ]
      };
      setMessagesByChat(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), aiMsg]
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleCompanyDiagnosisClarificationEdit = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, companyDiagnosisClarificationStatus: 'editing' as const } : m);
      return { ...prev, [activeId]: updated };
    });
  };


  const handleMeetingPrepWizardSubmit = (msgId: string, companyVal: string, meetingVal: string, meetingTypeVal: string, meetingGoalVal: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { 
        ...m, 
        meetingPrepWizardStatus: 'submitted' as const, 
        selectedPrepCompany: companyVal, 
        selectedPrepMeeting: meetingVal,
        selectedMeetingType: meetingTypeVal,
        selectedMeetingGoal: meetingGoalVal
      } : m);
      return { ...prev, [activeId]: updated };
    });

    setIsLoading(true);
    setTimeout(() => {
      const nextMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: '',
        isFocusAreasSelection: true,
        focusAreasSelectionStatus: 'pending',
        selectedPrepCompany: companyVal,
        selectedPrepMeeting: meetingVal,
        selectedMeetingType: meetingTypeVal,
        selectedMeetingGoal: meetingGoalVal
      };
      setMessagesByChat(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), nextMsg]
      }));
      setIsLoading(false);
    }, 1200);
  };

  const handleMeetingPrepWizardEdit = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, meetingPrepWizardStatus: 'editing' as const } : m);
      return { ...prev, [activeId]: updated };
    });
  };

  const handleMeetingPrepWizardCancel = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, meetingPrepWizardStatus: 'submitted' as const } : m);
      return { ...prev, [activeId]: updated };
    });
  };

  const handleFocusAreasSubmit = (msgId: string, selected: string[], otherVal: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { 
        ...m, 
        focusAreasSelectionStatus: 'submitted' as const, 
        selectedFocusAreas: selected, 
        meetingPrepOtherText: otherVal 
      } : m);
      return { ...prev, [activeId]: updated };
    });

    setIsLoading(true);
    setTimeout(() => {
      const currentChat = messagesByChat[activeId] || [];
      const focusMsg = currentChat.find(m => m.id === msgId);
      const wizardMsg = currentChat.find(m => m.isMeetingPrepWizard);
      const targetCompany = focusMsg?.selectedPrepCompany || wizardMsg?.selectedPrepCompany || 'Acme Corp';
      
      const allSteps = [
        "Summarize company performance data",
        "Analyze past meetings for action items",
        "Check for any account issues and open cases",
        "Identify any relevant external trends and insights",
        "Generate pitch recommendations",
        ...selected.map(item => {
          if (item.includes('insights')) return 'Include conversation insights from meeting transcripts';
          return item;
        }),
        "Suggest meeting agenda based on findings"
      ];

      const finalPlanMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I can certainly help you prepare for your meeting with ${targetCompany}.`,
        isAgentPlan: true,
        agentPlanType: 'prepare',
        company: targetCompany,
        planSteps: allSteps
      };

      setMessagesByChat(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), finalPlanMsg]
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleFocusAreasEdit = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, focusAreasSelectionStatus: 'editing' as const } : m);
      return { ...prev, [activeId]: updated };
    });
  };


  const handleMeetingSelectionCancel = (msgId: string) => {
    setMessagesByChat(prev => {
      const chat = prev[activeChatId || 'default'] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, meetingSelectionStatus: m.selectedMeeting ? 'submitted' as const : 'pending' as const } : m);
      return { ...prev, [(activeChatId || 'default')]: updated };
    });
  };

  const handleMeetingSelectionEdit = (msgId: string) => {
    setMessagesByChat(prev => {
      const chat = prev[activeChatId || 'default'] || [];
      const updated = chat.map(m => m.id === msgId ? { ...m, meetingSelectionStatus: 'editing' as const } : m);
      return { ...prev, [(activeChatId || 'default')]: updated };
    });
  };

  const generateNarrativeForCompany = (company: string, timeFrame: string, whyNow: string): string => {
    let industry = 'insurance';
    let competitorGap = '56% Awareness';
    let awarenessSpend = '9.7%';
    let industryAvg = '65.9%';
    let autoVsHome = 'Auto vs. Home';
    let aiDifferentiatorTitle = 'The AI Differentiator';
    let aiDifferentiatorText = 'Leverage Demand Gen to showcase Insurify’s industry-first ChatGPT integration.';
    let targetSegment = 'The Proactive Optimizer';

    if (company.toLowerCase().includes('nike') || company.toLowerCase().includes('lyra')) {
      industry = 'athletic apparel and sportswear';
      competitorGap = '42% Brand Awareness';
      awarenessSpend = '15.4%';
      industryAvg = '57.8%';
      autoVsHome = 'Running vs. Lifestyle';
      aiDifferentiatorTitle = 'The Customization Revolution';
      aiDifferentiatorText = `Leverage Demand Gen to showcase ${company}'s new AI-driven sneaker customization platform and custom fit scans.`;
      targetSegment = 'The Performance Athlete';
    } else if (company.toLowerCase().includes('acme') || company.toLowerCase().includes('kinetix')) {
      industry = 'enterprise SaaS and technology';
      competitorGap = '48% Share of Voice';
      awarenessSpend = '12.1%';
      industryAvg = '60.2%';
      autoVsHome = 'Core Platform vs. Add-on modules';
      aiDifferentiatorTitle = 'The GenAI Copilot Innovation';
      aiDifferentiatorText = `Leverage Demand Gen to highlight ${company}'s industry-leading generative AI software agent and natural language command integration.`;
      targetSegment = 'The Tech-Forward CTO';
    } else if (company.toLowerCase().includes('veloce')) {
      industry = 'electric vehicles and automotive';
      competitorGap = '50% Video Reach Gap';
      awarenessSpend = '8.5%';
      industryAvg = '58.5%';
      autoVsHome = 'EV Sedans vs. Utility SUVs';
      aiDifferentiatorTitle = 'The Next-Gen Autonomy Differentiator';
      aiDifferentiatorText = `Leverage Demand Gen to highlight ${company}'s state-of-the-art highway autopilot software and over-the-air system performance updates.`;
      targetSegment = 'The Eco-Conscious Tech Driver';
    }

    return `Context (Narrative Strategy):

Strategic Direction: Bridging the Awareness Gap to Fuel Future Growth

The Golden Thread: By closing the ${competitorGap} investment gap in ${timeFrame}, ${company} will capture the surge of cost-conscious buyers and secure its position as the premium, forward-looking leader in ${industry}.

The Strategic Argument Outline:

• The Performance Ceiling: ${company} is a performance powerhouse, currently allocating 90.3% of its budget to Consideration and Action. While this drives immediate results, the brand is likely hitting a saturation point by only targeting "hand-raisers" and ignoring the broader market.
  [Source: ScaleAgent - Full-Funnel Video Benchmarks]

• The ${timeFrame} Market Catalyst: Industry rates are projected to shift. This represents a critical window where consumers, feeling the pressure of economic changes and ${whyNow}, will actively seek alternatives.
  [Source: GoogleSearchAgent - Market Insights Report]

• The Awareness Deficit: The ${industry} average for Awareness spend is ${industryAvg}, yet ${company} invests only ${awarenessSpend}. Competitors are effectively owning the mental real estate of consumers long before they reach a search engine, creating a significant disadvantage for ${company}.
  [Source: ScaleAgent - Full-Funnel Video Benchmarks]

• The Solution - Own the Narrative: To capitalize on the market shift, ${company} must pivot toward Video Reach Campaigns (VRC). This will allow the brand to scale its unique value propositions to a massive audience of potential switchers.
  [Source: claims_and_facts.md - Video Reach Campaigns]

• ${aiDifferentiatorTitle}: ${aiDifferentiatorText} This visually-driven format is ideal for reaching "${targetSegment}"—tech-savvy consumers who value efficiency and modern comparison tools.
  [Source: claims_and_facts.md - Demand Gen]

Customer Relevance Map:
• Client Reality: ${company} is heavily performance-weighted but under-invested in brand.
• Market Shift: Premium rates and switching behaviors are driving a massive "alternative comparison" cycle.
• YouTube Solution:
  - Video Reach Campaigns (VRC): Recommended to bridge the ${competitorGap} gap and build brand equity before the ${timeFrame} renewal season.
  - Demand Gen: Recommended to highlight key AI/tech innovations to tech-forward audiences, differentiating ${company} from legacy competitors.

Measurement Strategy & Learning Agenda:
• Primary KPI: Brand Lift (specifically Ad Recall and Consideration) to measure the impact of the new Awareness investment.
• Secondary Metrics: Incremental Reach and Search Lift.
• Testing Hypothesis: "Increasing Awareness spend by 20% in ${timeFrame} will result in a 15% lower blended CPA by increasing the pool of high-intent users in the Consideration and Action funnels."`;
  };

  const handlePitchDeckSelectionSubmit = (msgId: string, divisionId: string, countryName: string) => {
    const activeId = activeChatId || 'default';
    
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(msg => 
        msg.id === msgId ? { 
          ...msg, 
          pitchDeckSelectionStatus: 'submitted' as const,
          selectedDivisionId: divisionId,
          selectedCountry: countryName
        } : msg
      );
      return { ...prev, [activeId]: updated };
    });

    const countryLabel = countryName === 'US' ? 'the US' : countryName;
    const userMsgText = `Division ID ${divisionId} and ${countryLabel}`;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText
    };

    setMessagesByChat(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), userMsg]
    }));

    setIsLoading(true);

    setTimeout(() => {
      setMessagesByChat(prev => {
        const currentChat = prev[activeId] || [];
        const parentMsg = currentChat.find(m => m.id === msgId);
        const companyName = parentMsg?.company || 'Acme Corp';

        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: '',
          isPitchDeckTailoring: true,
          pitchDeckTailoringStatus: 'pending',
          company: companyName,
          selectedDivisionId: divisionId,
          selectedCountry: countryName
        };

        return {
          ...prev,
          [activeId]: [...currentChat, aiMsg]
        };
      });
      setIsLoading(false);
    }, 1500);
  };

  const handlePitchDeckSelectionEdit = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(msg => 
        msg.id === msgId ? { ...msg, pitchDeckSelectionStatus: 'editing' as const } : msg
      );
      return { ...prev, [activeId]: updated };
    });
  };

  const handlePitchDeckTailoringSubmit = (
    msgId: string,
    data: {
      timeFrame: string;
      whyNow: string;
      constraints: string;
      landingPageUrl?: string;
      videoAssets?: string;
      extraDocs?: string;
    }
  ) => {
    const activeId = activeChatId || 'default';
    
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(msg => 
        msg.id === msgId ? { 
          ...msg, 
          pitchDeckTailoringStatus: 'submitted' as const,
          selectedTimeFrame: data.timeFrame,
          selectedWhyNow: data.whyNow,
          selectedConstraints: data.constraints,
          selectedLandingPageUrl: data.landingPageUrl,
          selectedVideoAssets: data.videoAssets,
          selectedExtraDocs: data.extraDocs
        } : msg
      );
      return { ...prev, [activeId]: updated };
    });

    setIsLoading(true);

    setTimeout(() => {
      setMessagesByChat(prev => {
        const currentChat = prev[activeId] || [];
        const parentMsg = currentChat.find(m => m.id === msgId);
        const companyName = parentMsg?.company || 'Acme Corp';
        
        const narrative = generateNarrativeForCompany(companyName, data.timeFrame, data.whyNow);

        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: narrative,
          isPitchDeckNarrativeReview: true,
          pitchDeckNarrativeStatus: 'pending',
          company: companyName,
          selectedTimeFrame: data.timeFrame,
          selectedWhyNow: data.whyNow,
          selectedConstraints: data.constraints
        };

        return {
          ...prev,
          [activeId]: [...currentChat, aiMsg]
        };
      });
      setIsLoading(false);
    }, 2000);
  };

  const handlePitchDeckTailoringEdit = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(msg => 
        msg.id === msgId ? { ...msg, pitchDeckTailoringStatus: 'editing' as const } : msg
      );
      return { ...prev, [activeId]: updated };
    });
  };

  const handlePitchDeckNarrativeSubmit = (msgId: string, alignValue: string) => {
    const activeId = activeChatId || 'default';
    
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(msg => 
        msg.id === msgId ? { 
          ...msg, 
          pitchDeckNarrativeStatus: 'submitted' as const,
          selectedNarrativeAlign: alignValue
        } : msg
      );
      return { ...prev, [activeId]: updated };
    });

    setIsLoading(true);

    setTimeout(() => {
      setMessagesByChat(prev => {
        const currentChat = prev[activeId] || [];
        const parentMsg = currentChat.find(m => m.id === msgId);
        const companyName = parentMsg?.company || 'Acme Corp';

        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: `I can certainly suggest a narrative and outline before creating a pitch deck for ${companyName}.`,
          isAgentPlan: true,
          agentPlanType: 'slides',
          company: companyName,
          planSteps: [
            "Gather brand insights, historical spend, and industry benchmark data",
            "Gather background information and recent news about the brand",
            "Collect audience data",
            "Prepare a strategic narrative"
          ]
        };

        return {
          ...prev,
          [activeId]: [...currentChat, aiMsg]
        };
      });
      setIsLoading(false);
    }, 1500);
  };

  const handlePitchDeckNarrativeEdit = (msgId: string) => {
    const activeId = activeChatId || 'default';
    setMessagesByChat(prev => {
      const chat = prev[activeId] || [];
      const updated = chat.map(msg => 
        msg.id === msgId ? { ...msg, pitchDeckNarrativeStatus: 'editing' as const } : msg
      );
      return { ...prev, [activeId]: updated };
    });
  };

  const [chats, setChats] = useState<ChatItem[]>([
    { id: '1', title: 'Draft pitch for Performance Max', group: 'Today', isPinned: false },
    { id: '2', title: 'Prepare for Nike QBR', group: 'Today', isPinned: false },
    { id: '3', title: 'Create value prop for YouTube', group: 'Today', isPinned: false },
    { id: '4', title: 'Generate script for cold call', group: 'Last 7 days', isPinned: false },
    { id: '5', title: 'Objection handling for budget', group: 'Last 7 days', isPinned: false },
    { id: '6', title: 'Strategize upsell for Q4', group: 'Last 7 days', isPinned: false },
    { id: '7', title: 'Fix Merchant Center suspension', group: 'Last 7 days', isPinned: false },
  ]);

  const togglePin = (id: string) => {
    setChats(chats.map(chat => chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat));
  };

  const pinnedChats = chats.filter(c => c.isPinned);
  const todayChats = chats.filter(c => !c.isPinned && c.group === 'Today');
  const last7DaysChats = chats.filter(c => !c.isPinned && c.group === 'Last 7 days');

  const renderChatItem = (chat: ChatItem) => {
    const isActive = chat.id === activeChatId;
    return (
      <div 
        key={chat.id}
        onClick={() => setActiveChatId(chat.id)}
        className={`px-2 py-2.5 rounded-lg cursor-pointer text-[13px] flex items-center justify-between group relative text-[#202124] ${isActive ? 'bg-[#F1F3F4]' : 'hover:bg-[#f1f3f4]'}`}
      >
        <span className="truncate pr-2">{chat.title}</span>
        <div className="relative flex items-center shrink-0">
          {chat.isPinned && <i className="google-symbols text-[16px] mr-1 text-[#5F6368]">keep</i>}
          <div className={`flex items-center justify-center w-6 h-6 rounded-full hover:bg-[rgba(32,33,36,0.08)] ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity group/menu`}>
            <i className="google-symbols text-[#5F6368] text-[18px]">more_vert</i>
            <div className="absolute right-0 top-full pt-1 z-50 hidden group-hover/menu:block min-w-[120px]">
              <div className="bg-white border border-[#E8EAED] shadow-[0_2px_6px_rgba(0,0,0,0.15)] rounded-md py-1">
                <div 
                  className="px-3 py-1.5 hover:bg-[#f1f3f4] text-[13px] text-[#202124] flex items-center gap-2 font-normal"
                  onClick={(e) => { e.stopPropagation(); togglePin(chat.id); }}
                >
                  <i className="google-symbols text-[16px]">{chat.isPinned ? 'keep_off' : 'keep'}</i>
                  {chat.isPinned ? 'Unpin' : 'Pin'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* History Drawer */}
      <div 
        className={`fixed w-[320px] bg-white flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isCanvasOpen 
            ? `top-0 bottom-0 rounded-none border-r border-[#E8EAED] shadow-lg z-[65] ${isHistoryOpen ? (isExpanded ? 'left-[900px] opacity-100' : 'left-[420px] opacity-100') : 'left-0 opacity-0 pointer-events-none'}`
            : `top-[88px] bottom-4 rounded-[24px] border border-[rgba(1,44,111,0.1)] shadow-lg z-20 ${isHistoryOpen ? (isExpanded ? 'right-[924px] opacity-100' : 'right-[444px] opacity-100') : 'right-4 opacity-0 pointer-events-none'}`
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col bg-white">
          <button 
            onClick={() => setActiveChatId(null)}
            className="flex items-center gap-2 text-[#1A73E8] bg-transparent border-none cursor-pointer hover:bg-[#f1f3f4] rounded-lg w-fit px-2 py-1.5 mb-4"
          >
            <i className="google-symbols text-[20px]">edit_square</i>
            <span className="text-[14px] font-medium">New chat</span>
          </button>

          <div 
            onClick={() => setIsRecentExpanded(!isRecentExpanded)}
            className="flex items-center justify-between mb-2 px-2 py-1 cursor-pointer hover:bg-[#f1f3f4] rounded-lg"
          >
            <h2 className="text-[18px] font-medium text-[#202124] m-0 select-none">Recent</h2>
            <i className={`google-symbols text-[#5F6368] text-[20px] transition-transform duration-200 ${isRecentExpanded ? '' : 'rotate-180'}`}>keyboard_arrow_up</i>
          </div>
          
          {isRecentExpanded && (
            <div className="flex flex-col">
              {pinnedChats.length > 0 && (
                <div className="mb-2">
                  {pinnedChats.map(renderChatItem)}
                </div>
              )}

              {todayChats.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mt-2 mb-1 px-2">
                    <span className="text-[12px] font-bold text-[#202124]">Today</span>
                    <div className="h-[1px] bg-[#E8EAED] flex-1"></div>
                  </div>
                  {todayChats.map(renderChatItem)}
                </>
              )}

              {last7DaysChats.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mt-4 mb-1 px-2">
                    <span className="text-[12px] font-bold text-[#202124]">Last 7 days</span>
                    <div className="h-[1px] bg-[#E8EAED] flex-1"></div>
                  </div>
                  {last7DaysChats.map(renderChatItem)}
                </>
              )}
            </div>
          )}

          <div 
            onClick={() => setIsCanvasesExpanded(!isCanvasesExpanded)}
            className="flex items-center justify-between mt-6 mb-2 px-2 py-1 cursor-pointer hover:bg-[#f1f3f4] rounded-lg"
          >
            <h2 className="text-[18px] font-medium text-[#202124] m-0 select-none">Canvases</h2>
            <i className={`google-symbols text-[#5F6368] text-[20px] transition-transform duration-200 ${isCanvasesExpanded ? '' : 'rotate-180'}`}>keyboard_arrow_up</i>
          </div>

          {isCanvasesExpanded && (
            <div className="flex flex-col">
              {canvases.map(canvas => (
                <div 
                  key={canvas.id}
                  onClick={() => onOpenCanvas?.(canvas.type, canvas.company)}
                  className="px-2 py-2.5 hover:bg-[#f1f3f4] rounded-lg cursor-pointer text-[#202124] text-[13px]"
                >
                  {canvas.title}
                </div>
              ))}
              {canvases.length === 0 && (
                <div className="px-2 py-2 text-[#5F6368] text-[13px]">No canvases generated yet.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Connect AI Panel */}
      <div className={`fixed ${isExpanded ? 'w-[900px]' : 'w-[420px]'} bg-white flex flex-col shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isCanvasOpen ? 'top-0 bottom-0 left-0 rounded-none border-r border-[#E8EAED] z-[70]' : `top-[88px] bottom-4 right-4 rounded-[24px] border border-[rgba(1,44,111,0.1)] ${isExpanded ? 'z-[60]' : 'z-30'}`}`}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-2 py-3 h-[84px] shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`bg-transparent border-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-[rgba(32,33,36,0.08)] transition-colors ${isHistoryOpen ? 'bg-[rgba(32,33,36,0.08)]' : ''}`}
            >
              <i className="google-symbols text-[#575B5F] text-[20px]">menu</i>
            </button>
            <div className="flex items-center justify-center">
              <svg width="155" height="36" viewBox="0 0 155 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50.6684 27.1163C48.0877 27.1163 45.9284 26.2463 44.1923 24.5082C42.4712 22.77 41.6116 20.6007 41.6116 18C41.6116 15.3994 42.4712 13.2394 44.1923 11.5163C45.9134 9.76129 48.0708 8.88379 50.6684 8.88379C53.266 8.88379 55.4328 9.83441 57.0715 11.7357L55.4646 13.2957C54.2155 11.7844 52.6161 11.0288 50.6684 11.0288C48.7207 11.0288 47.1213 11.6794 45.8235 12.9788C44.5256 14.2782 43.9001 15.9357 43.9001 18C43.9001 20.0644 44.5406 21.7369 45.8235 23.0213C47.1213 24.3207 48.7376 24.9713 50.6684 24.9713C52.6966 24.9713 54.4589 24.1182 55.9516 22.4119L57.5828 23.9963C56.755 24.9882 55.7399 25.755 54.5395 26.3007C53.339 26.8444 52.0487 27.1163 50.6684 27.1163Z" fill="#3C4043"/>
            <path d="M58.446 20.7545C58.446 18.9188 59.0229 17.3982 60.1746 16.1963C61.3433 14.9945 62.8115 14.3926 64.5813 14.3926C66.3511 14.3926 67.8119 14.9945 68.9637 16.1963C70.1323 17.4001 70.7166 18.9188 70.7166 20.7545C70.7166 22.5901 70.1323 24.1257 68.9637 25.3126C67.8119 26.5145 66.3511 27.1163 64.5813 27.1163C62.8115 27.1163 61.3433 26.5145 60.1746 25.3126C59.0229 24.1107 58.446 22.5901 58.446 20.7545ZM60.6859 20.7545C60.6859 22.0388 61.0586 23.0795 61.8058 23.8745C62.5531 24.6713 63.4782 25.0688 64.5813 25.0688C65.6844 25.0688 66.6096 24.6713 67.3568 23.8745C68.1022 23.0776 68.4767 22.0388 68.4767 20.7545C68.4767 19.4701 68.1022 18.4557 67.3568 17.6588C66.5946 16.847 65.6675 16.4401 64.5813 16.4401C63.4951 16.4401 62.5681 16.847 61.8058 17.6588C61.0586 18.4557 60.6859 19.487 60.6859 20.7545Z" fill="#3C4043"/>
            <path d="M72.3066 14.7826H74.4491V16.4401H74.5465C74.8874 15.8551 75.4099 15.3676 76.1159 14.9776C76.8219 14.5876 77.5561 14.3926 78.3202 14.3926C79.781 14.3926 80.9046 14.8107 81.6912 15.647C82.4778 16.4832 82.873 17.6738 82.873 19.217V26.7245H80.6331V19.3632C80.5844 17.4132 79.6031 16.4382 77.6872 16.4382C76.7939 16.4382 76.0485 16.8001 75.4473 17.522C74.8461 18.2457 74.5465 19.1101 74.5465 20.1188V26.7245H72.3066V14.7807V14.7826Z" fill="#3C4043"/>
            <path d="M85.0474 14.7826H87.1898V16.4401H87.2872C87.6281 15.8551 88.1506 15.3676 88.8566 14.9776C89.5627 14.5876 90.2968 14.3926 91.0609 14.3926C92.5217 14.3926 93.6454 14.8107 94.4319 15.647C95.2185 16.4832 95.6137 17.6738 95.6137 19.217V26.7245H93.3738V19.3632C93.3251 17.4132 92.3438 16.4382 90.4279 16.4382C89.5346 16.4382 88.7892 16.8001 88.188 17.522C87.5869 18.2457 87.2872 19.1101 87.2872 20.1188V26.7245H85.0474V14.7807V14.7826Z" fill="#3C4043"/>
            <path d="M103.153 27.1163C101.4 27.1163 99.9565 26.5145 98.8197 25.3126C97.6829 24.1107 97.1155 22.5901 97.1155 20.7545C97.1155 18.9188 97.668 17.4188 98.771 16.2076C99.8741 14.9963 101.286 14.3926 103.007 14.3926C104.728 14.3926 106.184 14.9645 107.23 16.1101C108.277 17.2557 108.802 18.8607 108.802 20.9251L108.777 21.1688H99.404C99.4359 22.3388 99.8254 23.282 100.573 23.9963C101.32 24.7107 102.211 25.0688 103.251 25.0688C104.68 25.0688 105.8 24.3545 106.611 22.9238L108.607 23.8988C108.071 24.9076 107.328 25.6951 106.378 26.2632C105.429 26.8313 104.354 27.1163 103.151 27.1163H103.153ZM99.5745 19.3163H106.416C106.35 18.4876 106.013 17.8013 105.404 17.2576C104.796 16.7138 103.981 16.442 102.959 16.442C102.114 16.442 101.389 16.7026 100.781 17.222C100.172 17.7413 99.7692 18.4407 99.5745 19.3182V19.3163Z" fill="#3C4043"/>
            <path d="M115.93 27.1163C114.16 27.1163 112.692 26.5145 111.523 25.3126C110.371 24.077 109.794 22.5582 109.794 20.7545C109.794 18.9507 110.371 17.3982 111.523 16.1963C112.692 14.9945 114.16 14.3926 115.93 14.3926C117.147 14.3926 118.211 14.6963 119.119 15.3076C120.027 15.917 120.709 16.757 121.164 17.8295L119.119 18.6826C118.486 17.1882 117.374 16.4401 115.784 16.4401C114.761 16.4401 113.877 16.8545 113.13 17.6832C112.399 18.512 112.034 19.5357 112.034 20.7545C112.034 21.9732 112.399 22.997 113.13 23.8257C113.877 24.6545 114.761 25.0688 115.784 25.0688C117.422 25.0688 118.576 24.3207 119.241 22.8263L121.237 23.6795C120.799 24.752 120.114 25.5938 119.179 26.2032C118.246 26.8126 117.162 27.1182 115.93 27.1182V27.1163Z" fill="#3C4043"/>
            <path d="M127.43 26.921C126.457 26.921 125.649 26.621 125.007 26.0191C124.367 25.4172 124.037 24.581 124.02 23.5085V16.8297H121.926V14.7822H124.02V11.126H126.26V14.7822H129.181V16.8297H126.26V22.7772C126.26 23.5741 126.413 24.1141 126.723 24.3991C127.032 24.6841 127.38 24.8247 127.769 24.8247C127.947 24.8247 128.123 24.8041 128.294 24.7647C128.464 24.7235 128.622 24.671 128.768 24.6054L129.474 26.6041C128.889 26.8141 128.208 26.921 127.429 26.921H127.43Z" fill="#3C4043"/>
            <path d="M138.094 26.7259H135.611L142.184 9.27344H144.716L151.29 26.7259H148.807L147.127 21.9972H139.798L138.094 26.7259ZM143.402 12.0278L140.553 19.9009H146.348L143.499 12.0278H143.402Z" fill="#3C4043"/>
            <path d="M155 26.7259H152.76V9.27344H155V26.7259Z" fill="#3C4043"/>
            <g clipPath="url(#clip0_7049_231752)">
            <path d="M24.2509 3.18359H11.7069C10.3023 3.18359 9.00256 3.93271 8.30026 5.15003L2.03014 16.0122C1.32784 17.2296 1.32784 18.7278 2.03014 19.9451L8.30213 30.8073C9.00443 32.0246 10.3023 32.7738 11.7087 32.7738H24.2509C25.6554 32.7738 26.9552 32.0246 27.6575 30.8073L33.9295 19.9451C34.6318 18.7278 34.6318 17.2296 33.9295 16.0122L27.6575 5.15003C26.9552 3.93271 25.6573 3.18359 24.2509 3.18359Z" fill="url(#paint0_linear_7049_231752)"/>
            <path d="M10.3397 32.2512L34.1523 18.503C34.3321 18.3981 34.4538 18.2033 34.4538 17.9805C34.4538 18.6528 34.2796 19.3251 33.9332 19.9263L27.6406 30.826C26.9458 32.0302 25.6592 32.7718 24.2695 32.7718H11.6844C10.9896 32.7718 10.321 32.5864 9.73853 32.2493C9.93142 32.3617 10.1599 32.3542 10.3416 32.2493L10.3397 32.2512Z" fill="#1A73E8"/>
            <path d="M15.7314 23.2226C15.6565 23.2226 15.5872 23.1982 15.5254 23.1477C15.4636 23.0971 15.4187 23.0353 15.3943 22.9604C15.1827 22.1233 14.8643 21.3367 14.4392 20.6007C14.0141 19.8647 13.4972 19.1905 12.8848 18.5781C12.2724 17.9657 11.5982 17.4488 10.8621 17.0236C10.1261 16.5985 9.33957 16.2801 8.50243 16.0685C8.42751 16.0442 8.36571 15.9992 8.31515 15.9374C8.26458 15.8756 8.24023 15.8063 8.24023 15.7314C8.24023 15.6565 8.26458 15.5872 8.31515 15.5254C8.36571 15.4636 8.42751 15.4187 8.50243 15.3943C9.33957 15.1827 10.1261 14.8643 10.8621 14.4392C11.5982 14.0141 12.2724 13.4972 12.8848 12.8848C13.4972 12.2724 14.0141 11.5982 14.4392 10.8621C14.8643 10.1261 15.1827 9.33957 15.3943 8.50243C15.4187 8.42751 15.4636 8.36571 15.5254 8.31515C15.5872 8.26458 15.6565 8.24023 15.7314 8.24023C15.8063 8.24023 15.8719 8.26458 15.9281 8.31515C15.9842 8.36571 16.0254 8.42751 16.0498 8.50243C16.2745 9.33957 16.5985 10.1261 17.0236 10.8621C17.4488 11.5982 17.9657 12.2724 18.5781 12.8848C19.1905 13.4972 19.8647 14.0141 20.6007 14.4392C21.3367 14.8643 22.1233 15.1827 22.9604 15.3943C23.0353 15.4187 23.0971 15.4636 23.1477 15.5254C23.1982 15.5872 23.2226 15.6565 23.2226 15.7314C23.2226 15.8063 23.1982 15.8756 23.1477 15.9374C23.0971 15.9992 23.0353 16.0442 22.9604 16.0685C22.1233 16.2801 21.3367 16.5985 20.6007 17.0236C19.8647 17.4488 19.1905 17.9657 18.5781 18.5781C17.9657 19.1905 17.4488 19.8647 17.0236 20.6007C16.5985 21.3367 16.2801 22.1233 16.0685 22.9604C16.0442 23.0353 15.9992 23.0971 15.9374 23.1477C15.8756 23.1982 15.8063 23.2226 15.7314 23.2226Z" fill="white"/>
            </g>
            <defs>
            <linearGradient id="paint0_linear_7049_231752" x1="11.6526" y1="23.1401" x2="25.0505" y2="12.2086" gradientUnits="userSpaceOnUse">
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
            <clipPath id="clip0_7049_231752">
            <rect width="35.9577" height="35.9577" fill="white"/>
            </clipPath>
            </defs>
          </svg>
        </div>
        </div>
        <div className="flex items-center gap-1 min-w-[98px] justify-end">
          <button
            onClick={() => setActiveChatId(null)}
            className="bg-transparent border-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-[rgba(32,33,36,0.08)] transition-colors flex-none grow-0 relative"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 right-0 top-0 bottom-0 m-auto text-[#5F6368]">
              <g clipPath="url(#clip0_2428_19103)">
              <path d="M17 33C16.45 33 15.975 32.8083 15.575 32.425C15.1917 32.025 15 31.55 15 31V17C15 16.45 15.1917 15.9833 15.575 15.6C15.975 15.2 16.45 15 17 15H25.925L23.925 17H17V31H31V24.05L33 22.05V31C33 31.55 32.8 32.025 32.4 32.425C32.0167 32.8083 31.55 33 31 33H17ZM21 27V22.75L30.175 13.575C30.375 13.375 30.6 13.225 30.85 13.125C31.1 13.025 31.35 12.975 31.6 12.975C31.8667 12.975 32.1167 13.025 32.35 13.125C32.6 13.225 32.825 13.375 33.025 13.575L34.425 15C34.6083 15.2 34.75 15.425 34.85 15.675C34.95 15.9083 35 16.15 35 16.4C35 16.65 34.95 16.9 34.85 17.15C34.7667 17.3833 34.625 17.6 34.425 17.8L25.25 27H21ZM33.025 16.4L31.625 15L33.025 16.4ZM23 25H24.4L30.2 19.2L29.5 18.5L28.775 17.8L23 23.575V25ZM29.5 18.5L28.775 17.8L29.5 18.5L30.2 19.2L29.5 18.5Z" fill="#5F6368"/>
              </g>
              <defs>
              <clipPath id="clip0_2428_19103">
              <rect width="48" height="48" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-transparent border-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-full hover:bg-[rgba(32,33,36,0.08)]">
            <i className="google-symbols text-[#5F6368] text-[24px]">{isExpanded ? 'collapse_content' : 'expand_content'}</i>
          </button>
        </div>
      </div>

      {/* Convo Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {activeChatId && messagesByChat[activeChatId] ? (
          <div className="flex flex-col gap-4 py-4">
            {messagesByChat[activeChatId].map((msg) => {
              const isAnyMeetingEditing = messagesByChat[activeChatId].some(m => 
                m.meetingSelectionStatus === 'editing' || 
                m.meetingPrepWizardStatus === 'editing' || 
                m.focusAreasSelectionStatus === 'editing' ||
                m.companyDiagnosisWizardStatus === 'editing' ||
                m.companyDiagnosisClarificationStatus === 'editing' ||
                m.pitchDeckSelectionStatus === 'editing' ||
                m.pitchDeckTailoringStatus === 'editing' ||
                m.pitchDeckNarrativeStatus === 'editing'
              );
              const isThisMsgEditing = 
                msg.meetingSelectionStatus === 'editing' || 
                msg.meetingPrepWizardStatus === 'editing' || 
                msg.focusAreasSelectionStatus === 'editing' ||
                msg.companyDiagnosisWizardStatus === 'editing' ||
                msg.companyDiagnosisClarificationStatus === 'editing' ||
                msg.pitchDeckSelectionStatus === 'editing' ||
                msg.pitchDeckTailoringStatus === 'editing' ||
                msg.pitchDeckNarrativeStatus === 'editing';
              const opacityClass = isAnyMeetingEditing && !isThisMsgEditing ? 'opacity-10 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300';
              
              return (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end w-full' : 'justify-start w-full'} ${opacityClass}`}>
                {msg.isAgentUpdate ? (
                  <div ref={agentUpdateMsgRef} className="w-full">
                    <AgentUpdateMessage onOpenCanvas={() => onOpenCanvas && onOpenCanvas('sales', 'Nike')} />
                  </div>
                ) : msg.sender === 'ai' ? (
                  <div className={`flex flex-col items-start p-[8px_0px_8px_8px] gap-[16px] w-full max-w-[85%] ${(!msg.text && !msg.thinkingText && !msg.isAgentPlan && !msg.isPitchDeckFollowUp && !msg.isPitchDeckTailoring && !msg.isPitchDeckNarrativeReview && !msg.isMeetingAgendaEmail && !msg.isMeetingPrepWizard && !msg.isFocusAreasSelection && !msg.isCompanyDiagnosisWizard && !msg.isCompanyDiagnosisClarification && !msg.isGrowthPlannerReport) ? 'hidden' : ''}`}>
                    {/* Header */}
                    <div className="flex flex-row items-center p-0 gap-[8px] w-full h-[32px]">
                      <div className="relative w-[32px] h-[32px] flex-none">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.1862 2.125H7.81373C6.87623 2.125 6.00873 2.625 5.53998 3.4375L1.35498 10.6875C0.88623 11.5 0.88623 12.5 1.35498 13.3125L5.54123 20.5625C6.00998 21.375 6.87623 21.875 7.81498 21.875H16.1862C17.1237 21.875 17.9912 21.375 18.46 20.5625L22.6462 13.3125C23.115 12.5 23.115 11.5 22.6462 10.6875L18.46 3.4375C17.9912 2.625 17.125 2.125 16.1862 2.125Z" fill="url(#paint0_linear_4213_26959_msg)"/>
                            <path d="M6.90125 21.5265L22.795 12.3502C22.915 12.2802 22.9963 12.1502 22.9963 12.4502 22.88 12.899 22.6488 13.3002L18.4487 20.5752C17.985 21.379 17.1262 21.874 16.1987 21.874H7.79875C7.335 21.874 6.88875 21.7502 6.5 21.5252C6.62875 21.6002 6.78125 21.5952 6.9025 21.5252L6.90125 21.5265Z" fill="#1A73E8"/>
                            <path d="M10.5 15.5C10.45 15.5 10.4038 15.4837 10.3625 15.45C10.3213 15.4162 10.2912 15.375 10.275 15.325C10.1337 14.7662 9.92125 14.2413 9.6375 13.75C9.35375 13.2587 9.00875 12.8087 8.6 12.4C8.19125 11.9912 7.74125 11.6463 7.25 11.3625C6.75875 11.0788 6.23375 10.8663 5.675 10.725C5.625 10.7088 5.58375 10.6787 5.55 10.6375C5.51625 10.5962 5.5 10.55 5.5 10.5C5.5 10.45 5.51625 10.4038 5.55 10.3625C5.58375 10.3213 5.625 10.2912 5.675 10.275C6.23375 10.1337 6.75875 9.92125 7.25 9.6375C7.74125 9.35375 8.19125 9.00875 8.6 8.6C9.00875 8.19125 9.35375 7.74125 9.6375 7.25C9.92125 6.75875 10.1337 6.23375 10.275 5.675C10.2912 5.625 10.3213 5.58375 10.3625 5.55C10.4038 5.51625 10.45 5.5 10.5 5.5C10.55 5.5 10.5938 5.51625 10.6313 5.55C10.6688 5.58375 10.6962 5.625 10.7125 5.675C10.8625 6.23375 11.0788 6.75875 11.3625 7.25C11.6463 7.74125 11.9912 8.19125 12.4 8.6C12.8087 9.00875 13.2587 9.35375 13.75 9.6375C14.2413 9.92125 14.7662 10.1337 15.325 10.275C15.375 10.2912 15.4162 10.3213 15.45 10.3625C15.4837 10.4038 15.5 10.45 15.5 10.5C15.5 10.55 15.4837 10.5962 15.45 10.6375C15.4162 10.6787 15.375 10.7088 15.325 10.725C14.7662 10.8663 14.2413 11.0788 13.75 11.3625C13.2587 11.6463 12.8087 11.9912 12.4 12.4C11.9912 12.8087 11.6463 13.2587 11.3625 13.75C11.0788 14.2413 10.8663 14.7662 10.725 15.325C10.7088 15.375 10.6787 15.4162 10.6375 15.45C10.5962 15.4837 10.55 15.5 10.5 15.5Z" fill="white"/>
                            <defs>
                              <linearGradient id="paint0_linear_4213_26959_msg" x1="7.77748" y1="15.445" x2="16.72" y2="8.14875" gradientUnits="userSpaceOnUse">
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
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-row items-center p-0 gap-[4px] h-[32px]">
                        {msg.thinkingText ? (
                          <button 
                            onClick={() => setOpenThinking(prev => ({...prev, [msg.id]: !prev[msg.id]}))}
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
                    </div>
                    
                    {/* Message Body */}
                    <div className="flex flex-col items-start p-[0px_0px_24px] gap-[8px] w-full">
                      {msg.thinkingText && openThinking[msg.id] && (
                        <div className="border-l-2 border-[#E8EAED] pl-4 ml-1 mb-2 font-mono text-[13px] leading-[24px] text-[#4C4D50] whitespace-pre-wrap w-[90%]">
                          {msg.thinkingText}
                        </div>
                      )}
                      {msg.isAgentPlan ? (
                        msg.isGeneratingCanvas ? (
                           msg.canvasStep! >= 4 ? (
                            <div className={`flex flex-col items-start py-1 w-full bg-white border border-[#D3E3FD] rounded-[16px] overflow-hidden transition-all duration-300 ${expandedCanvasSteps[msg.id] ? 'h-auto pb-4' : 'h-[56px]'}`}>
                              <div 
                                className="flex flex-row items-center gap-1 w-full h-[48px] cursor-pointer shrink-0"
                                onClick={() => setExpandedCanvasSteps(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                              >
                                <div className="flex flex-row items-center w-full h-[48px]">
                                  <div className="flex flex-row items-start p-1 w-[48px] h-[48px] rounded-[128px]">
                                    <div className="w-[40px] h-[40px] relative">
                                      <div className="absolute w-[40px] h-[40px] left-0 top-0 rounded-[100px]" />
                                      <div className="absolute inset-0 flex items-center justify-center text-[#4C4D50] font-['Google_Symbols'] text-[24px]">
                                        check
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col justify-center items-start flex-1 h-[20px]">
                                    <div className="flex flex-col justify-center items-start w-full h-[20px]">
                                      <div className="w-full h-[20px] font-['Google_Sans_Text'] font-medium text-[16px] leading-[20px] text-[#1D1B20] truncate">
                                        {msg.agentPlanType === 'prepare' ? 'Meeting prep canvas' : 
                                         msg.agentPlanType === 'slides' ? 'Slide deck canvas' :
                                         msg.agentPlanType === 'gap' ? 'Gap to target planning canvas' :
                                         'Company diagnosis canvas'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-row items-start p-1 w-[48px] h-[48px] rounded-[128px]">
                                    <div className="w-[40px] h-[40px] relative">
                                      <div className="absolute w-[40px] h-[40px] left-0 top-0 rounded-[100px]" />
                                      <div className="absolute inset-0 flex items-center justify-center text-[#4C4D50] font-['Google_Symbols'] text-[24px]">
                                        {expandedCanvasSteps[msg.id] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
 
                              <div className="flex flex-col items-start py-2 w-full flex-1 opacity-100 transition-opacity duration-300">
                                {getPlanSteps(msg.agentPlanType).map((text, index) => (
                                  <div key={index} className="flex flex-row items-start px-4 py-1.5 gap-4 w-full min-h-[36px]">
                                    <div className="w-[24px] h-[24px] flex items-center justify-center flex-none">
                                      <i className="google-symbols text-[#1A73E8] text-[24px]">check</i>
                                    </div>
                                    <span className="font-['Google_Sans_Text'] font-normal text-[15px] leading-[20px] text-[#1D1B20] pt-[2px]">
                                      {text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className={`flex flex-col items-start py-1 pb-4 w-full bg-white border border-[#D3E3FD] rounded-[16px] h-auto`}>
                              <style>{`
                                @keyframes wave-loader {
                                  0% { transform: translateX(-100%); }
                                  100% { transform: translateX(356px); }
                                }
                                .animate-wave {
                                  animation: wave-loader 1.5s infinite linear;
                                }
                              `}</style>
                              <div className="flex flex-row justify-between items-center pl-4 gap-1 w-full h-[48px]">
                                <div className="flex flex-row items-center mx-auto w-full h-[48px]">
                                  <span className="font-['Google_Sans_Text'] font-medium text-[16px] leading-[24px] flex items-center text-[#1D1B20]">
                                    {msg.agentPlanType === 'slides' ? 'Generate a pitch deck' : 
                                     msg.agentPlanType === 'prepare' ? 'Generating meeting prep' :
                                     'Generating canvas'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12">
                                  <i className="google-symbols text-[#444746] text-[24px]">keyboard_arrow_up</i>
                                </div>
                              </div>
 
                              <div className="flex flex-col items-start px-4 w-full h-[4px]">
                                <div className="relative w-full h-[4px] bg-[#C2E7FF] rounded-[4px] overflow-hidden">
                                  <div className="absolute h-[4px] w-[118.67px] bg-[#0B57D0] rounded-[4px] animate-wave" />
                                </div>
                              </div>
 
                              <div className="flex flex-col items-start py-2 w-full flex-1">
                                {getPlanSteps(msg.agentPlanType).map((text, index) => {
                                  const step = msg.canvasStep || 0;
                                  const isCompleted = step > index;
                                  const isActive = step === index;
 
                                  return (
                                    <div key={index} className="flex flex-row items-start px-4 py-1.5 gap-4 w-full min-h-[36px]">
                                      <div className="w-[24px] h-[24px] flex items-center justify-center flex-none">
                                        {isCompleted ? (
                                          <i className="google-symbols text-[#1A73E8] text-[24px]">check</i>
                                        ) : isActive ? (
                                          <svg className="animate-spin w-[20px] h-[20px] text-[#1A73E8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#C2E7FF" strokeWidth="3"></circle>
                                            <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                        ) : (
                                          <div className="w-[20px] h-[20px] rounded-full border-[3px] border-[#C2E7FF]" />
                                        )}
                                      </div>
                                      <span className={`font-['Google_Sans_Text'] font-normal text-[15px] leading-[20px] pt-[2px] ${isActive || isCompleted ? 'text-[#1D1B20]' : 'text-[#9AA0A6]'}`}>
                                        {text}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col gap-[16px] w-full">
                            <div className="font-['Google_Sans'] font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#3C4043] whitespace-pre-wrap w-full px-[16px]">
                              <AIResponseText text={msg.text} msg={msg} onSourceClick={onSourceClick} />
                            </div>
                            
                            <div className="flex flex-col items-start p-[16px] gap-[8px] w-full bg-[#F1F3F4] rounded-[16px]">
                              <div className="font-['Google_Sans_Text'] font-bold text-[14px] leading-[20px] text-[#3C4043]">
                                These are the steps I will take:
                              </div>
                              <ul className="m-0 pl-5 font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043] list-disc">
                                {(msg.planSteps || getInitialPlanSteps(msg.agentPlanType)).map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="font-['Google_Sans_Text'] italic font-normal text-[14px] leading-[20px] text-[#3C4043] px-[16px]">
                              This may take few minutes to complete
                            </div>

                            <div className="flex flex-col gap-[8px] px-[16px]">
                              <div className="font-['Google_Sans_Text'] font-bold text-[14px] leading-[20px] text-[#1F1F1F]">
                                How would you like to proceed?
                              </div>
                              <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043]">
                                You can also <strong>edit the plan</strong> but typing into Connect AI and asking to change or modify the steps.
                              </div>
                            </div>

                            <button 
                              onClick={() => handleGenerateCanvasClick(msg.id)}
                              className="flex flex-row justify-center items-center px-[12px] h-[36px] bg-[#3271EA] rounded-[100px] text-white font-['Google_Sans'] font-medium text-[14px] leading-[20px] border-none cursor-pointer hover:bg-[#1557B0] transition-colors w-fit mx-[16px]"
                            >
                              {msg.agentPlanType === 'prepare' ? 'Generate meeting prep canvas' : 
                               msg.agentPlanType === 'slides' ? 'Generate pitch slide deck' :
                               msg.agentPlanType === 'gap' ? 'Generate gap analysis canvas' :
                               'Generate canvas'}
                            </button>
                          </div>
                        )
                      ) : (
                        <>
                          <div className="font-['Google_Sans'] font-normal text-[14px] leading-[20px] tracking-[0.2px] text-[#3C4043] whitespace-pre-wrap w-full px-[16px]">
                            <AIResponseText text={msg.text} msg={msg} onSourceClick={onSourceClick} />
                          </div>

                          {msg.isMeetingSelection && (
                            <div className="px-[16px] w-full flex">
                              <MeetingSelectionCard 
                                msg={msg} 
                                onSubmit={(val) => handleMeetingSelectionSubmit(msg.id, val)}
                                onCancel={() => handleMeetingSelectionCancel(msg.id)}
                                onEdit={() => handleMeetingSelectionEdit(msg.id)}
                              />
                            </div>
                          )}

                          {msg.isMeetingPrepWizard && (
                            <div className="px-[16px] w-full flex">
                              <MeetingPrepWizardCard 
                                msg={msg}
                                onSubmit={(companyVal, meetingVal, typeVal, goalVal) => handleMeetingPrepWizardSubmit(msg.id, companyVal, meetingVal, typeVal, goalVal)}
                                onCancel={() => handleMeetingPrepWizardCancel(msg.id)}
                                onEdit={() => handleMeetingPrepWizardEdit(msg.id)}
                              />
                            </div>
                          )}

                          {msg.isCompanyDiagnosisWizard && (
                            <div className="px-[16px] w-full flex">
                              <CompanyDiagnosisWizardCard 
                                msg={msg}
                                onSubmit={(companyVal, accountsVal) => handleCompanyDiagnosisWizardSubmit(msg.id, companyVal, accountsVal)}
                                onCancel={() => handleCompanyDiagnosisWizardCancel(msg.id)}
                                onEdit={() => handleCompanyDiagnosisWizardEdit(msg.id)}
                              />
                            </div>
                          )}

                          {msg.isCompanyDiagnosisClarification && (
                            <div className="px-[16px] w-full flex">
                              <CompanyDiagnosisClarificationCard 
                                msg={msg}
                                onSubmit={(data) => handleCompanyDiagnosisClarificationSubmit(msg.id, data)}
                                onEdit={() => handleCompanyDiagnosisClarificationEdit(msg.id)}
                              />
                            </div>
                          )}

                          {msg.isFocusAreasSelection && (
                            <div className="px-[16px] w-full flex">
                              <FocusAreasSelectionCard 
                                msg={msg}
                                onSubmit={(selected, otherVal) => handleFocusAreasSubmit(msg.id, selected, otherVal)}
                                onEdit={() => handleFocusAreasEdit(msg.id)}
                              />
                            </div>
                          )}

                          {msg.isPitchDeckFollowUp && (
                            <div className="px-[16px] w-full flex">
                              <PitchDeckFollowUpCard 
                                msg={msg} 
                                onSubmit={(div, count) => handlePitchDeckSelectionSubmit(msg.id, div, count)}
                                onEdit={() => handlePitchDeckSelectionEdit(msg.id)}
                              />
                            </div>
                          )}

                          {msg.isPitchDeckTailoring && (
                            <div className="px-[16px] w-full flex">
                              <PitchDeckTailoringCard 
                                msg={msg} 
                                onSubmit={(data) => handlePitchDeckTailoringSubmit(msg.id, data)}
                                onEdit={() => handlePitchDeckTailoringEdit(msg.id)}
                              />
                            </div>
                          )}

                          {msg.isPitchDeckNarrativeReview && (
                            <div className="px-[16px] w-full flex">
                              <PitchDeckNarrativeReviewCard 
                                msg={msg} 
                                onSubmit={(alignVal) => handlePitchDeckNarrativeSubmit(msg.id, alignVal)}
                                onEdit={() => handlePitchDeckNarrativeEdit(msg.id)}
                              />
                            </div>
                          )}

                          {msg.isMeetingAgendaEmail && (
                             <div className="px-[16px] w-full flex">
                               <DraftMeetingAgendaEmailCard 
                                 initialBodyText={msg.emailBodyText}
                                 onClose={() => {
                                   setMessagesByChat(prevMsgs => {
                                     const targetChatId = activeChatId || 'default';
                                     const existingChat = prevMsgs[targetChatId] || [];
                                     return {
                                       ...prevMsgs,
                                       [targetChatId]: existingChat.filter(m => m.id !== msg.id)
                                     };
                                   });
                                 }}
                               />
                             </div>
                           )}

                           {msg.isGrowthPlannerReport && (
                             <div className="px-[16px] w-full flex">
                               <GrowthPlannerCard 
                                 onOpenPlanner={() => handleSendMessage('Open Growth Planner', true)}
                                 onEditCanvas={() => {
                                   setIsExpanded(false);
                                   onOpenCanvas?.('gap', 'Acme Corp');
                                 }}
                               />
                             </div>
                           )}
                          
                          {msg.proofOfWork && (
                            <div className="flex flex-col items-start px-[16px] mt-2 w-full">
                              <div className="font-['Google_Sans_Text'] font-bold text-[14px] leading-[20px] text-[#1F1F1F] mb-2">
                                Proof of work:
                              </div>
                              <ul className="m-0 pl-5 font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#3C4043] list-disc flex flex-col gap-1">
                                {msg.proofOfWork.items.map((item, idx) => (
                                  <li key={idx}>
                                    <strong>{item.bold}</strong> {item.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Actions + Source */}
                          {msg.sources && msg.sources.length > 0 ? (
                            <div className="flex flex-col w-full gap-2 mt-2 px-[16px] pb-[16px]">
                              <div className="flex flex-row items-center justify-between w-full">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenSources(prev => ({ ...prev, [msg.id]: !prev[msg.id] }));
                                  }}
                                  className="flex items-center gap-1 text-[#1a73e8] font-['Google_Sans_Text'] font-medium text-[15px] bg-transparent border-none cursor-pointer p-[8px] hover:bg-black/5 rounded-[4px] ml-[-8px] relative z-10 pointer-events-auto"
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
                                <div className="flex flex-col gap-3 mt-1">
                                  {msg.sources.map((src: any) => (
                                    <button
                                      key={src.id}
                                      onClick={() => {
                                        if (src.type === 'link' && src.pageId) {
                                          if (onSourceClick) onSourceClick(src);
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
                          ) : (
                            <div className="flex flex-col w-full gap-2 mt-2 px-[16px] pb-[16px]">
                              <div className="flex flex-row items-center justify-end w-full">
                                <div className="flex items-center gap-4 text-[#5f6368]">
                                  <i className="google-symbols text-[20px] cursor-pointer hover:text-[#3C4043]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>share</i>
                                  <i className="google-symbols text-[20px] cursor-pointer hover:text-[#3C4043]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>thumb_up</i>
                                  <i className="google-symbols text-[20px] cursor-pointer hover:text-[#3C4043]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>thumb_down</i>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start p-[12px_16px_16px] gap-[4px] w-full max-w-[85%] bg-[#E7F0FE] rounded-[16px] rounded-tr-[4px]">
                    <div className="flex flex-row justify-between items-center py-[8px] px-0 gap-[8px] w-full h-[32px]">
                      <div className="flex flex-row items-center gap-[8px]">
                        <img src="https://picsum.photos/seed/mila/24/24" alt="Mila" className="w-[24px] h-[24px] rounded-full" />
                        <span className="font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#3C4043]">Mila</span>
                      </div>
                      <span className="font-['Google_Sans_Text'] font-normal text-[12px] leading-[16px] text-[#5F6368]">Just now</span>
                    </div>
                    {msg.attachment && (
                      <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 mb-2 border border-[#E8EAED] w-fit">
                        <i className="google-symbols text-[#EA4335] text-[18px]">image</i>
                        <span className="text-[13px] text-[#3C4043] truncate max-w-[200px]">{msg.attachment.name}</span>
                      </div>
                    )}
                    <div className="font-['Google_Sans_Text'] font-normal text-[14px] leading-[20px] text-[#202124] whitespace-pre-wrap w-full">
                      {msg.text}
                    </div>
                    {msg.attachment && msg.attachment.type.startsWith('image/') && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-[#E8EAED] bg-white w-full">
                        <img src={msg.attachment.url} alt={msg.attachment.name} className="max-w-full h-auto" />
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-[#E8EAED]">
                          <i className="google-symbols text-[#EA4335] text-[18px]">image</i>
                          <span className="text-[13px] text-[#3C4043] truncate">{msg.attachment.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              );
            })}
            {isLoading && (
              <div className="flex flex-row items-center p-0 gap-[16px] w-full h-[32px] mt-2 mb-2">
                <div className="relative w-[32px] h-[32px] flex-none">
                  <style>{`
                    .gpi-circular-loader {
                      animation: gpi-rotate 2s linear infinite;
                    }
                    .gpi-loader-path {
                      stroke-dasharray: 1, 200;
                      stroke-dashoffset: 0;
                      animation: gpi-dash 1.5s ease-in-out infinite;
                      stroke-linecap: round;
                    }
                    @keyframes gpi-rotate {
                      100% { transform: rotate(360deg); }
                    }
                    @keyframes gpi-dash {
                      0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
                      50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
                      100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
                    }
                  `}</style>
                  <svg className="gpi-circular-loader absolute inset-0 w-full h-full text-[#1A73E8]" viewBox="25 25 50 50">
                    <circle className="gpi-loader-path" cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {loadingStatements[loadingStatementIndex].logo === 'ConnectAI' && (
                      <ConnectAILogo className="w-[22px] h-[22px]" />
                    )}
                    {loadingStatements[loadingStatementIndex].logo === 'MOMA' && (
                      <MomaLogo className="w-[22px] h-[22px]" />
                    )}
                    {loadingStatements[loadingStatementIndex].logo === 'Google' && (
                      <GoogleLogo className="w-[22px] h-[22px]" />
                    )}
                    {loadingStatements[loadingStatementIndex].logo === 'Gmail' && (
                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.33398 26.2569H8.00065V15.0979L1.33398 10.1748V24.2876C1.33398 25.3756 2.22898 26.2569 3.33398 26.2569Z" fill="#4285F4"/>
                        <path d="M24 26.2569H28.6667C29.7717 26.2569 30.6667 25.3756 30.6667 24.2876V10.1748L24 15.0979V26.2569Z" fill="#34A853"/>
                        <path d="M16 12.4721V21.0055L24 15.0978V6.56445L16 12.4721Z" fill="#EA4335"/>
                        <path d="M24 6.56438V15.0977L30.6667 10.1746V7.549C30.6667 5.11536 27.845 3.72541 25.8667 5.18592L24 6.56438Z" fill="#FBBC04"/>
                        <path d="M8 6.56445V15.0978L16 21.0055V12.4721L8 6.56445Z" fill="#EA4335"/>
                        <path d="M1.33398 7.549V10.1746L8.00065 15.0977V6.56438L6.13398 5.18592C4.15565 3.72541 1.33398 5.11536 1.33398 7.549Z" fill="#C5221E"/>
                      </svg>
                    )}
                    {loadingStatements[loadingStatementIndex].logo === 'ConnectSales' && (
                      <div className="w-[22px] h-[22px] overflow-hidden flex items-center justify-start">
                        <img src="https://static.corp.google.com/greentea/images/rebrand/lockup_sales_prod.svg" className="h-[22px] max-w-none object-left object-cover" alt="Connect Sales" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-row items-center p-0 gap-[4px] h-[32px] flex-none">
                  <div className="h-[20px] font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] flex items-center text-[#1F1F1F] flex-none whitespace-nowrap">
                    {loadingStatements[loadingStatementIndex].text}
                  </div>
                  <div className="w-[24px] h-[24px] flex-none relative">
                    <i className="google-symbols absolute inset-0 text-[24px] leading-[24px] flex items-center text-center text-[#1F1F1F]" style={{ fontVariationSettings: "'FILL' 0, 'GRAD' 0, 'ROND' 100" }}>keyboard_arrow_down</i>
                  </div>
                </div>
              </div>
            )}
            {isAgentUpdateThinking && (
              <div ref={agentUpdateMsgRef} className="flex flex-row items-center p-0 gap-[16px] w-full h-[32px] mt-2 mb-2">
                <div className="relative w-[32px] h-[32px] flex-none">
                  <style>{`
                    .gpi-circular-loader {
                      animation: gpi-rotate 2s linear infinite;
                    }
                    .gpi-loader-path {
                      stroke-dasharray: 1, 200;
                      stroke-dashoffset: 0;
                      animation: gpi-dash 1.5s ease-in-out infinite;
                      stroke-linecap: round;
                    }
                    @keyframes gpi-rotate {
                      100% { transform: rotate(360deg); }
                    }
                    @keyframes gpi-dash {
                      0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
                      50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
                      100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
                    }
                  `}</style>
                  <svg className="gpi-circular-loader absolute inset-0 w-full h-full text-[#1A73E8]" viewBox="25 25 50 50">
                    <circle className="gpi-loader-path" cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ConnectAILogo className="w-[22px] h-[22px]" />
                  </div>
                </div>
                <div className="flex flex-row items-center p-0 gap-[4px] h-[32px] flex-none">
                  <div className="h-[20px] font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] flex items-center text-[#1F1F1F] flex-none whitespace-nowrap">
                    Updating forecast notes
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* User intro */}
            <div className="py-4 flex flex-col gap-1">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" 
                alt="Jenny Profile" 
                className="w-[60px] h-[60px] rounded-full mb-1 object-cover" 
              />
              <h2 className="text-[28px] leading-[35px] font-medium text-[#3C4043] m-0 tracking-[-0.011em]">
                Hi <span className="bg-[linear-gradient(90deg,#1A73E8_0%,#AF95FF_100%)] text-transparent bg-clip-text">Jenny</span> 👋
              </h2>
              <h2 className="text-[28px] leading-[35px] font-medium text-[#3C4043] m-0 tracking-[-0.011em]">
                You have <span className="bg-[linear-gradient(90deg,#1A73E8_0%,#AF95FF_100%)] text-transparent bg-clip-text">2 action items</span> and <span className="bg-[linear-gradient(90deg,#1a73e8_0%,#648ffd_100%)] text-transparent bg-clip-text">3 accounts</span> require your attention.
              </h2>
            </div>

            {/* Figma Welcome Summary Cards */}
            <div className="flex flex-col gap-[12px] w-full mb-[16px]">
              {/* Action Items Card */}
              <div className="flex flex-col items-start p-[16px] gap-[12px] w-full bg-[#F0F4FC] rounded-[16px] border border-[#E1E8F5] overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => setIsActionItemsExpanded(!isActionItemsExpanded)}
                  className="flex flex-row items-center justify-between w-full cursor-pointer select-none"
                >
                  <div className="font-['Google_Sans'] font-medium text-[16px] leading-[24px] text-[#1F1F1F]">
                    Action items
                  </div>
                  <i className="google-symbols text-[#5F6368] text-[22px] transition-transform duration-300" style={{ transform: isActionItemsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    keyboard_arrow_down
                  </i>
                </div>
                
                {isActionItemsExpanded && (
                  <div className="flex flex-col gap-[10px] w-full text-[13px] leading-[18px] text-[#3C4043] font-['Google_Sans_Text'] border-t border-[#E1E8F5] pt-[12px] opacity-100 transition-opacity duration-300">
                    <div>
                      <strong>Acme Corp</strong> has requested a growth planner report. Due May 31 2026.{' '}
                      <button 
                        onClick={() => handleSendMessage('Generate growth planner report for Acme Corp', true)}
                        className="text-[#1A73E8] bg-transparent border-none p-0 font-medium cursor-pointer hover:underline inline"
                      >
                        Generate now
                      </button>
                    </div>
                    <div className="border-t border-[#E1E8F5] pt-[8px]">
                      <strong>Lyra Activewear</strong> is waiting on the post-pitch follow up regarding Demand Gen and YouTube Video Action campaigns. Address specific customer objections regarding creative asset requirements and cross channel attribution.{' '}
                      <button 
                        onClick={() => handleSendMessage('Generate post-pitch follow up email draft to Lyra Activewear regarding Demand Gen and YouTube Video Action campaigns. Address specific customer objections regarding creative asset requirements and cross channel attribution.', true)}
                        className="text-[#1A73E8] bg-transparent border-none p-0 font-medium cursor-pointer hover:underline inline text-left"
                      >
                        Generate post-pitch follow up email
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Accounts requiring attention Card */}
              <div className="flex flex-col items-start p-[16px] gap-[12px] w-full bg-[#F0F4FC] rounded-[16px] border border-[#E1E8F5] overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => setIsDiagAccountsExpanded(!isDiagAccountsExpanded)}
                  className="flex flex-row items-center justify-between w-full cursor-pointer select-none"
                >
                  <div className="font-['Google_Sans'] font-medium text-[16px] leading-[24px] text-[#1F1F1F]">
                    Accounts that require attention
                  </div>
                  <i className="google-symbols text-[#5F6368] text-[22px] transition-transform duration-300" style={{ transform: isDiagAccountsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    keyboard_arrow_down
                  </i>
                </div>

                {isDiagAccountsExpanded && (
                  <div className="flex flex-col gap-[10px] w-full text-[13px] leading-[18px] text-[#3C4043] font-['Google_Sans_Text'] border-t border-[#E1E8F5] pt-[12px] opacity-100 transition-opacity duration-300">
                    <div>
                      <strong>Apex Drifter</strong> 7d change has declined -$13.2k with a w/w -24.6% due to budget decrease.
                    </div>
                    <div className="border-t border-[#E1E8F5] pt-[8px]">
                      <strong>Kinetix Performance</strong> paused campaign and is seeing a -$3.2k 7d change with a w/w -21.7%.
                    </div>
                    <div className="border-t border-[#E1E8F5] pt-[8px]">
                      <button 
                        onClick={() => handleSendMessage('Diagnose companies', true)}
                        className="text-[#1A73E8] bg-transparent border-none p-0 font-medium cursor-pointer hover:underline"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Prompt Cards matching Figma exactly */}
            <div className="flex flex-col gap-[2px]">
              <div 
                className="bg-[#F8F9FA] rounded-t-[8px] rounded-b-[2px] p-[4px_16px] flex items-center gap-4 cursor-pointer hover:bg-[#f1f3f4] transition-colors min-h-[56px]"
                onClick={() => handleSendMessage('Prepare for a meeting', true)}
              >
                <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] shrink-0">
                  <i className="google-symbols text-[24px]">calendar_today</i>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[#1A73E8] font-medium text-[14px] leading-[20px] m-0">Prepare for a meeting</h3>
                </div>
              </div>

              <div 
                className="bg-[#F8F9FA] rounded-[2px] p-[4px_16px] flex items-center gap-4 cursor-pointer hover:bg-[#f1f3f4] transition-colors min-h-[56px]"
                onClick={() => handleSendMessage('Diagnose companies', true)}
              >
                <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] shrink-0">
                  <i className="google-symbols text-[24px]">trending_up</i>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[#1A73E8] font-medium text-[14px] leading-[20px] m-0">Diagnose companies</h3>
                </div>
              </div>

              <div 
                className="bg-[#F8F9FA] rounded-b-[8px] rounded-t-[2px] p-[4px_16px] flex items-center gap-4 cursor-pointer hover:bg-[#f1f3f4] transition-colors min-h-[56px]"
                onClick={() => handleSendMessage('Update forecast notes', true)}
              >
                <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] shrink-0">
                  <i className="google-symbols text-[24px]">edit</i>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[#1A73E8] font-medium text-[14px] leading-[20px] m-0">Update forecast notes</h3>
                </div>
              </div>
            </div>


            {/* Auto-injected messages on default screen */}
            {isAgentUpdateThinking && (
              <div ref={agentUpdateMsgRef} className="flex flex-row items-center p-0 gap-[16px] w-full h-[32px] mt-2 mb-2">
                <div className="relative w-[32px] h-[32px] flex-none">
                  <style>{`
                    .gpi-circular-loader {
                      animation: gpi-rotate 2s linear infinite;
                    }
                    .gpi-loader-path {
                      stroke-dasharray: 1, 200;
                      stroke-dashoffset: 0;
                      animation: gpi-dash 1.5s ease-in-out infinite;
                      stroke-linecap: round;
                    }
                    @keyframes gpi-rotate {
                      100% { transform: rotate(360deg); }
                    }
                    @keyframes gpi-dash {
                      0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
                      50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
                      100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
                    }
                  `}</style>
                  <svg className="gpi-circular-loader absolute inset-0 w-full h-full text-[#1A73E8]" viewBox="25 25 50 50">
                    <circle className="gpi-loader-path" cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ConnectAILogo className="w-[22px] h-[22px]" />
                  </div>
                </div>
                <div className="flex flex-row items-center p-0 gap-[4px] h-[32px] flex-none">
                  <div className="h-[20px] font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] flex items-center text-[#1F1F1F] flex-none whitespace-nowrap">
                    Updating forecast notes
                  </div>
                </div>
              </div>
            )}
            {messagesByChat['default'] && messagesByChat['default'].map((msg) => (
              <div key={msg.id} className="flex justify-start w-full mt-4">
                {msg.isAgentUpdate && (
                  <div ref={agentUpdateMsgRef} className="w-full">
                    <AgentUpdateMessage onOpenCanvas={() => onOpenCanvas && onOpenCanvas('sales', 'Nike')} />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#E8F0FE] rounded-t-[28px] p-[12px] pb-[13px] shrink-0">
        <div className="bg-white border border-[#C4C7C5] rounded-[24px] p-2 flex flex-col gap-2 relative">
          {(!focusedSection && focusedText) && (
            <div className="flex items-center gap-1.5 bg-[#1A73E8] text-white rounded-full px-3.5 py-1.5 mx-2 mt-2 w-fit shadow-sm select-none">
              <i className="google-symbols text-[18px] text-white mr-0.5">pen_spark</i>
              <span className="text-[13px] font-semibold text-white font-['Google_Sans_Text'] leading-none">
                Refining: {focusedText && focusedText.length > 18 ? focusedText.slice(0, 18) + '...' : focusedText}
              </span>
              <button 
                className="bg-transparent border-none flex items-center justify-center cursor-pointer text-white hover:text-gray-200 ml-1.5 p-0 shrink-0"
                onClick={onClearFocus}
              >
                <i className="google-symbols text-[16px] leading-none">close</i>
              </button>
            </div>
          )}
          {selectedAttachment && (
            <div className="flex items-center gap-2 bg-[#E8F0FE] rounded-full px-3 py-1.5 mx-2 mt-2 w-fit">
              <i className="google-symbols text-[#EA4335] text-[18px]">image</i>
              <span className="text-[13px] text-[#3C4043] truncate max-w-[200px]">{selectedAttachment.name}</span>
              <button 
                className="bg-transparent border-none flex items-center justify-center cursor-pointer text-[#5F6368] hover:text-[#202124] ml-1 p-0"
                onClick={() => setSelectedAttachment(null)}
              >
                <i className="google-symbols text-[16px]">close</i>
              </button>
            </div>
          )}
          {focusedSection && (
            <div className="flex items-center gap-1.5 bg-[#1A73E8] text-white rounded-full px-3.5 py-1.5 mx-2 mt-2 w-fit shadow-sm select-none">
              <i className="google-symbols text-[18px] text-white mr-0.5">pen_spark</i>
              <span className="text-[13px] font-semibold text-white font-['Google_Sans_Text'] leading-none">
                Refining: {focusedSection.title}
              </span>
              <button 
                className="bg-transparent border-none flex items-center justify-center cursor-pointer text-white hover:text-gray-200 ml-1.5 p-0 shrink-0"
                onClick={onClearFocus}
              >
                <i className="google-symbols text-[16px] leading-none">close</i>
              </button>
            </div>
          )}
          
          <div className="relative w-full flex flex-row items-center gap-1 p-1">
            {mentionState.isOpen && (
              <MentionMenu 
                category={mentionState.category}
                query={mentionState.query}
                onSelectCategory={(categoryId) => setMentionState(prev => ({ ...prev, category: categoryId }))}
                onSelectItem={(item) => {
                  if (!textareaRef.current) return;
                  const selection = window.getSelection();
                  if (!selection || selection.rangeCount === 0) return;
                  const range = selection.getRangeAt(0);
                  
                  if (range.startContainer.nodeType === Node.TEXT_NODE) {
                    const textNode = range.startContainer;
                    const textBeforeCursor = textNode.textContent?.slice(0, range.startOffset) || '';
                    const lastAtPos = textBeforeCursor.lastIndexOf('@');
                    
                    if (lastAtPos !== -1) {
                      range.setStart(textNode, lastAtPos);
                      range.deleteContents();
                      
                      const chip = document.createElement('span');
                      chip.contentEditable = 'false';
                      chip.className = "inline-flex flex-row items-center p-[1px_0px] gap-1 w-max h-6 bg-[#E8F0FE] rounded-full mx-1 cursor-default align-middle";
                      
                      const iconContainer = document.createElement('div');
                      iconContainer.className = "flex items-center justify-center w-5 h-5 ml-0.5 text-[#5f6368] shrink-0";
                      
                      const catId = mentionState.category;
                      if (catId === 'accounts') {
                        iconContainer.innerHTML = `<img src="https://www.gstatic.com/images/branding/product/1x/avatar_square_blue_24dp.png" alt="account" class="w-4 h-4 rounded-full"/>`;
                      } else if (catId === 'google_drive') {
                        const isDoc = item.title?.toLowerCase().includes('doc');
                        const isSheet = item.title?.toLowerCase().includes('sheet');
                        const isSlide = item.title?.toLowerCase().includes('slide') || item.title?.toLowerCase().includes('deck') || item.title?.toLowerCase().includes('pitch');
                        
                        let iconUrl = "https://www.gstatic.com/images/branding/product/1x/drive_2020q4_24dp.png"; // default drive
                        if (isDoc) iconUrl = "https://www.gstatic.com/images/branding/product/1x/docs_2020q4_24dp.png";
                        else if (isSheet) iconUrl = "https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_24dp.png";
                        else if (isSlide) iconUrl = "https://www.gstatic.com/images/branding/product/1x/slides_2020q4_24dp.png";

                        iconContainer.innerHTML = `<img src="${iconUrl}" alt="drive icon" class="w-4 h-4"/>`;
                      } else if (catId === 'meetings') {
                        iconContainer.innerHTML = `<img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_24dp.png" alt="calendar" class="w-4 h-4"/>`;
                      } else if (catId === 'emails') {
                        iconContainer.innerHTML = `<img src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_24dp.png" alt="gmail" class="w-4 h-4"/>`;
                      } else {
                        const iconName = item.icon || 'description';
                        iconContainer.innerHTML = `<i class="google-symbols text-[18px] text-[#4285F4]">${iconName}</i>`;
                      }

                      const label = document.createElement('span');
                      label.className = "font-['Google_Sans_Text'] font-medium text-[14px] leading-[20px] text-[#4C4D50] mr-2";
                      label.textContent = item.title;

                      chip.appendChild(iconContainer);
                      chip.appendChild(label);
                      
                      range.insertNode(chip);
                      
                      range.setStartAfter(chip);
                      range.setEndAfter(chip);
                      const spaceNode = document.createTextNode('\u00A0');
                      range.insertNode(spaceNode);
                      range.setStartAfter(spaceNode);
                      range.setEndAfter(spaceNode);
                      selection.removeAllRanges();
                      selection.addRange(range);
                      
                      setInputText(textareaRef.current.innerText);
                    }
                  }
                  setMentionState({ isOpen: false, query: '', category: null, atIndex: -1 });
                  textareaRef.current.focus();
                }}
              />
            )}
            <div
              key={editorKey}
              ref={textareaRef}
              contentEditable={!isLoading}
              suppressContentEditableWarning
              data-placeholder="Type the @ symbol to select a company..." 
              className="flex-1 bg-transparent border-none outline-none text-[16px] leading-[24px] text-[#5E5E5E] px-3 pt-2 pb-0 min-h-[32px] max-h-[168px] overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-[#9AA0A6] empty:before:pointer-events-none"
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
              }}
              onInput={(e) => {
                const target = e.target as HTMLDivElement;
                const text = target.innerText;
                setInputText(text);

                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;
                const range = selection.getRangeAt(0);

                if (range.startContainer.nodeType === Node.TEXT_NODE) {
                  const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || '';
                  const lastAtPos = textBeforeCursor.lastIndexOf('@');
                  if (lastAtPos !== -1 && (lastAtPos === 0 || textBeforeCursor[lastAtPos - 1] === ' ' || textBeforeCursor[lastAtPos - 1] === '\n' || textBeforeCursor[lastAtPos - 1] === '\u00A0')) {
                     const query = textBeforeCursor.slice(lastAtPos + 1);
                     setMentionState(prev => ({
                       ...prev,
                       isOpen: true,
                       query,
                       atIndex: lastAtPos,
                     }));
                  } else {
                     setMentionState({ isOpen: false, query: '', category: null, atIndex: -1 });
                  }
                } else {
                  setMentionState({ isOpen: false, query: '', category: null, atIndex: -1 });
                }
              }}
              onKeyDown={(e) => {
                if (mentionState.isOpen) {
                  if (e.key === 'Escape') {
                    setMentionState({ isOpen: false, query: '', category: null, atIndex: -1 });
                    return;
                  }
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e.currentTarget.innerText);
                  setInputText('');
                }
              }}
            />
          </div>
          <div className="flex justify-between items-center w-full h-[40px] relative" ref={attachmentMenuRef}>
            <button 
              className="bg-transparent border-none w-10 h-10 flex items-center justify-center text-[#575B5F] cursor-pointer hover:bg-[rgba(32,33,36,0.08)] rounded-full shrink-0"
              onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
            >
              <i className="google-symbols text-[20px]">add</i>
            </button>
            
            {/* Attachment Menu */}
            {isAttachmentMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] py-2 min-w-[200px] z-50 border border-[#E8EAED]">
                <button 
                  className="w-full bg-transparent border-none flex items-center gap-3 px-4 py-2.5 hover:bg-[#F1F3F4] cursor-pointer text-[#3C4043] text-[14px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="google-symbols text-[20px] text-[#5F6368]">upload_file</i>
                  File upload
                </button>
                <button 
                  className="w-full bg-transparent border-none flex items-center gap-3 px-4 py-2.5 hover:bg-[#F1F3F4] cursor-pointer text-[#3C4043] text-[14px]"
                  onClick={() => {
                    // Mock Google Drive picker by just opening the file input for now
                    fileInputRef.current?.click();
                  }}
                >
                  <i className="google-symbols text-[20px] text-[#5F6368]">add_to_drive</i>
                  Attach from Google Drive
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect}
              accept="image/*"
            />

            <button 
              className={`border-none w-10 h-10 flex items-center justify-center rounded-full shrink-0 transition-colors ${(inputText.trim() || selectedAttachment) && !isLoading ? 'bg-transparent text-[#1B1C1D] cursor-pointer hover:bg-[#e8f0fe]' : 'bg-transparent text-[#1B1C1D] cursor-default opacity-50'}`}
              onClick={() => handleSendMessage(inputText)}
              disabled={(!inputText.trim() && !selectedAttachment) || isLoading}
            >
              <i className="google-symbols text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</i>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

