export const mockSessions = [
  {
    id: 'session-1',
    title: 'Draft pitch for Performance Max',
    group: 'Today',
    isPinned: false,
    messages: [
      { id: 'msg-1-1', role: 'user', content: 'I have a QBR with Nike next week. What are the key Google Ads products we should pitch to increase their direct-to-consumer sales?' },
      { id: 'msg-1-2', role: 'ai', content: 'For Nike\'s DTC push, **Performance Max (PMax)** and **Demand Gen** are critical.\n\n*   **Performance Max** will help them access all of Google\'s inventory from a single campaign, using AI to find converting customers across Search, YouTube, Display, Discover, Gmail, and Maps.\n*   **Demand Gen** is perfect for driving action on our most visual, entertaining surfaces (YouTube Shorts, Discover), capturing demand before consumers even start searching.' },
      { id: 'msg-1-3', role: 'user', content: 'How should I position PMax against their current heavy investment in standard Search?' },
      { id: 'msg-1-4', role: 'ai', content: 'Position PMax as a multiplier, not a replacement. Emphasize that PMax uses their existing Search success to find new converting customers across YouTube, Display, and Discover, unlocking inventory they are currently missing without cannibalizing their core Search terms.' }
    ]
  },
  {
    id: 'session-2',
    title: 'Prepare for Nike QBR',
    group: 'Today',
    isPinned: false,
    messages: [
      { id: 'msg-2-1', role: 'user', content: 'Target is seeing a drop in ROAS for their apparel category. What should we investigate?' },
      { id: 'msg-2-2', role: 'ai', content: 'A drop in ROAS for apparel could stem from several factors. I recommend investigating:\n1. **Auction Insights:** Are competitors like Walmart or Amazon bidding more aggressively?\n2. **Seasonality:** Is there a shift in consumer demand (e.g., transition from winter to spring apparel)?\n3. **Feed Health:** Are there disapprovals or missing attributes in their Google Merchant Center feed?\n4. **Target ROAS Targets:** Are their tROAS targets set too high, restricting volume?' },
      { id: 'msg-2-3', role: 'user', content: 'Can you give me an agenda for the QBR to address this?' },
      { id: 'msg-2-4', role: 'ai', content: 'Certainly. Here is a proposed agenda:\n\n1. **Q3 Performance Review** (Focus on Apparel trends).\n2. **Deep Dive:** Auction Insights & Competitor Analysis.\n3. **Strategic Pivot:** Testing tCPA for Clearance inventory.\n4. **Q4 Holiday Readiness & Next Steps.**' }
    ]
  },
  {
    id: 'session-3',
    title: 'Create value prop for YouTube',
    group: 'Today',
    isPinned: false,
    messages: [
      { id: 'msg-3-1', role: 'user', content: 'Sephora wants to drive more foot traffic to stores using Google Ads. What\'s the best approach?' },
      { id: 'msg-3-2', role: 'ai', content: 'To drive foot traffic, **Local Inventory Ads (LIA)** and **Performance Max for store goals** are the best solutions. LIA showcases in-store product availability to nearby shoppers searching on Google, while PMax for store goals promotes their physical locations across Google Maps, Search, YouTube, and the Display Network.' },
      { id: 'msg-3-3', role: 'user', content: 'How do I tie YouTube into this foot traffic strategy?' },
      { id: 'msg-3-4', role: 'ai', content: 'YouTube is a powerful upper-funnel driver for local action. You can use YouTube Video Action Campaigns with local extensions, allowing viewers to see store proximity and inventory right below the video, bridging the gap between inspiration and in-store purchase.' }
    ]
  },
  {
    id: 'session-4',
    title: 'Generate script for cold call',
    group: 'Last 7 days',
    isPinned: false,
    messages: [
      { id: 'msg-4-1', role: 'user', content: 'Wayfair\'s search volume is maxed out on core furniture terms. How do we find new queries?' },
      { id: 'msg-4-2', role: 'ai', content: 'To expand search queries beyond core terms, consider utilizing **Broad Match with Smart Bidding**. This combination allows Google\'s AI to match ads to a wider variety of relevant, long-tail queries that you might not have explicitly targeted, while Smart Bidding ensures you only pay for clicks likely to convert.' },
      { id: 'msg-4-3', role: 'user', content: 'I need a 30-second cold call script to pitch this to their new VP of Marketing.' },
      { id: 'msg-4-4', role: 'ai', content: '"Hi [Name], I\'m calling from Google. I noticed Wayfair is dominating core furniture terms, but our data shows you\'re missing out on 30% of long-tail, high-intent queries. I have a strategy using Broad Match paired with Smart Bidding that can capture this untapped volume without sacrificing your ROAS targets. Do you have 5 minutes next Tuesday to review the projections?"' }
    ]
  },
  {
    id: 'session-5',
    title: 'Objection handling for budget',
    group: 'Last 7 days',
    isPinned: false,
    messages: [
      { id: 'msg-5-1', role: 'user', content: 'We need to plan Best Buy\'s Black Friday Google Ads strategy. When should we start ramping up budgets?' },
      { id: 'msg-5-2', role: 'ai', content: 'For Black Friday, budget ramp-up should begin in early to mid-October. Consumers start researching holiday purchases earlier every year. By ramping up early, you build remarketing pools, gather conversion data to feed the Smart Bidding algorithms, and capture early-bird shoppers before CPCs peak in November.' },
      { id: 'msg-5-3', role: 'user', content: 'The client is pushing back on increasing the budget in October. How do I handle this objection?' },
      { id: 'msg-5-4', role: 'ai', content: 'Address the objection by explaining the "learning phase" and "early research" behavior. Tell them: "If we wait until November, CPCs will be at their peak and our algorithms won\'t have the historical data to bid efficiently. An October investment is actually buying cheaper data to ensure our November spend yields the highest possible ROAS."' }
    ]
  },
  {
    id: 'session-6',
    title: 'Strategize upsell for Q4',
    group: 'Last 7 days',
    isPinned: false,
    messages: [
      { id: 'msg-6-1', role: 'user', content: 'I need to upsell Acme Corp on Demand Gen for Q4. They currently only run Search.' },
      { id: 'msg-6-2', role: 'ai', content: 'To upsell Demand Gen, focus on the visual discovery aspect. Acme Corp can leverage their existing image and video assets to reach users on YouTube Shorts, Discover, and Gmail before they even start searching.' },
      { id: 'msg-6-3', role: 'user', content: 'What metrics should I highlight to prove it works?' },
      { id: 'msg-6-4', role: 'ai', content: 'Highlight Cost Per Action (CPA) and Conversion Rate compared to their social media campaigns. Demand Gen often provides a lower CPA than paid social because it leverages Google\'s deep audience intent signals.' }
    ]
  },
  {
    id: 'session-7',
    title: 'Fix Merchant Center suspension',
    group: 'Last 7 days',
    isPinned: false,
    messages: [
      { id: 'msg-7-1', role: 'user', content: 'My client\'s Merchant Center account was suspended for misrepresentation. How do we fix this?' },
      { id: 'msg-7-2', role: 'ai', content: 'Misrepresentation suspensions usually relate to missing contact info, unclear return policies, or misleading pricing. First, ensure their website has a clear footer with a physical address, email, and phone number.' },
      { id: 'msg-7-3', role: 'user', content: 'I checked and they have all that. What\'s the next step?' },
      { id: 'msg-7-4', role: 'ai', content: 'Next, review their checkout process. Ensure there are no hidden fees added at checkout and that the return policy is explicitly linked on every product page. Once verified, submit an appeal through the Merchant Center Diagnostics tab detailing the exact fixes made.' }
    ]
  },
  {
    id: 'session-8',
    title: 'Why is campaign limited by budget',
    group: 'Last 30 days',
    isPinned: false,
    messages: [
      { id: 'msg-8-1', role: 'user', content: 'My client\'s PMax campaign says "Limited by budget" but they aren\'t spending their full daily cap. Why?' },
      { id: 'msg-8-2', role: 'ai', content: 'This often happens when the campaign\'s Target ROAS or Target CPA is set too aggressively. The algorithm wants to spend, but it can\'t find enough auctions that meet the strict efficiency target.' },
      { id: 'msg-8-3', role: 'user', content: 'So should I lower the tROAS target?' },
      { id: 'msg-8-4', role: 'ai', content: 'Yes, try lowering the tROAS target by 10-15%. This gives the algorithm more breathing room to enter auctions, which should increase spend and overall conversion volume, removing the "Limited by budget" status.' }
    ]
  },
  {
    id: 'session-9',
    title: 'Troubleshoot conversion tags',
    group: 'Last 30 days',
    isPinned: false,
    messages: [
      { id: 'msg-9-1', role: 'user', content: 'The Google Ads conversion tag isn\'t firing on the client\'s Shopify checkout page.' },
      { id: 'msg-9-2', role: 'ai', content: 'For Shopify, ensure the Google Channel app is properly configured. If using a manual tag, check that the global site tag is in the `<head>` and the event snippet is on the order confirmation page.' },
      { id: 'msg-9-3', role: 'user', content: 'We are using Google Tag Manager.' },
      { id: 'msg-9-4', role: 'ai', content: 'In GTM, verify that the Conversion Linker tag is firing on all pages. Then, check the trigger for the Google Ads Conversion Tracking tag. Ensure it\'s set to fire on the specific Page View or Custom Event that corresponds to the Shopify "Thank You" page URL.' }
    ]
  },
  {
    id: 'session-10',
    title: 'Optimize low ad strength assets',
    group: 'Last 30 days',
    isPinned: false,
    messages: [
      { id: 'msg-10-1', role: 'user', content: 'My Responsive Search Ads have "Poor" ad strength. How do I improve them quickly?' },
      { id: 'msg-10-2', role: 'ai', content: 'To improve RSA ad strength, ensure you have at least 10-12 unique headlines and 3-4 descriptions. Make sure you are including your top-performing keywords in at least 2-3 headlines.' },
      { id: 'msg-10-3', role: 'user', content: 'The client has strict brand guidelines and won\'t let me change the headlines much.' },
      { id: 'msg-10-4', role: 'ai', content: 'If headlines are restricted, focus on unpinning them. Pinning too many assets restricts the algorithm\'s ability to test combinations, which artificially lowers the Ad Strength score. Try to leave at least 70% of your assets unpinned.' }
    ]
  },
  {
    id: 'session-11',
    title: 'Resolve policy violation errors',
    group: 'Last 30 days',
    isPinned: false,
    messages: [
      { id: 'msg-11-1', role: 'user', content: 'Our healthcare client\'s ads are getting disapproved for "Personalized Advertising".' },
      { id: 'msg-11-2', role: 'ai', content: 'Healthcare is a restricted category for personalized advertising (remarketing). You cannot use audience lists to target users based on health conditions or medical treatments.' },
      { id: 'msg-11-3', role: 'user', content: 'How can we still reach relevant users without remarketing?' },
      { id: 'msg-11-4', role: 'ai', content: 'Shift your strategy to contextual targeting. Use Custom Intent audiences based on relevant search terms, or target specific placements (websites and YouTube channels) that discuss general health and wellness topics related to their services.' }
    ]
  },
  {
    id: 'session-12',
    title: 'Summarize call with Acme Corp',
    group: 'Last 30 days',
    isPinned: false,
    messages: [
      { id: 'msg-12-1', role: 'user', content: 'Can you summarize the key takeaways from my call with Acme Corp regarding their Q3 performance?' },
      { id: 'msg-12-2', role: 'ai', content: 'Please provide the transcript or your notes from the call, and I will generate a summary of the key takeaways, action items, and next steps for the Q3 performance review.' },
      { id: 'msg-12-3', role: 'user', content: 'Notes: Search ROAS up 15%. PMax spend down 10% due to creative fatigue. Action: Need new video assets for PMax by next week.' },
      { id: 'msg-12-4', role: 'ai', content: '**Acme Corp Q3 Call Summary:**\n\n**Performance:**\n* Search campaigns performed well, with ROAS increasing by 15%.\n* Performance Max spend decreased by 10%, identified as an issue with creative fatigue.\n\n**Action Items:**\n* **Client/Agency:** Provide/produce new video assets for PMax campaigns.\n* **Deadline:** Next week.' }
    ]
  }
];
