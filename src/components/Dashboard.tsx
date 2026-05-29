import React from 'react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ChevronDown, MoreVertical, AlertTriangle, TrendingDown, ChevronRight, Briefcase, BarChart2
} from 'lucide-react';

const revenueData = [
  { name: 'Jan 1', revenue: 7.8, outlook: 0, target: 8.5, lastYear: 9.1 },
  { name: 'W2', revenue: 7.6, outlook: 0, target: 8.0, lastYear: 8.9 },
  { name: 'W3', revenue: 0, outlook: 7.0, target: 7.5, lastYear: 8.1 },
  { name: 'W4', revenue: 0, outlook: 7.6, target: 8.3, lastYear: 6.0 },
  { name: 'W5', revenue: 0, outlook: 7.0, target: 7.5, lastYear: 7.3 },
  { name: 'W6', revenue: 0, outlook: 8.0, target: 7.7, lastYear: 6.2 },
  { name: 'W7', revenue: 0, outlook: 7.8, target: 8.7, lastYear: 8.4 },
  { name: 'Mar 30', revenue: 0, outlook: 7.0, target: 7.6, lastYear: 6.1 }
];

const topMovingCompanies = [
  { 
    name: 'Mitsubishi Dealers', 
    parent: 'Mitsubishi OEM',
    change: '-$87.6k', 
    pct: '-0.6%', 
    reasons: [
      { type: 'anomaly', text: '3 daily anomalies', subtext: 'Nissan - Product +2', subtext2: '-$16.2k below expected' },
      { type: 'decline', text: '15 of 20 accounts declining', subtext: 'Nissan - Product +14', subtext2: '-$282.6k (-6%) 7d w/w' },
      { type: 'budget', text: 'Budget decreased +2', subtext: '6 campaigns decreased budget' }
    ]
  },
  { 
    name: 'Subaru Corporation', 
    parent: 'Subaru Corporation',
    change: '-$21.2k', 
    pct: '-1.2%', 
    reasons: [
      { type: 'anomaly', text: '3 daily anomalies', subtext: 'Nissan - Product +2', subtext2: '-$16.2k below expected' },
      { type: 'decline', text: '15 of 20 accounts declining', subtext: 'Nissan - Product +14', subtext2: '-$282.6k (-6%) 7d w/w' },
      { type: 'budget', text: 'Budget decreased +2', subtext: '6 campaigns decreased budget' }
    ]
  },
  { 
    name: 'Nissan Regional', 
    parent: 'Nissan OEM',
    change: '-$87.6k', 
    pct: '-0.6%', 
    reasons: [
      { type: 'anomaly', text: '3 daily anomalies', subtext: 'Nissan - Product +2', subtext2: '-$16.2k below expected' },
      { type: 'decline', text: '15 of 20 accounts declining', subtext: 'Nissan - Product +14', subtext2: '-$282.6k (-6%) 7d w/w' },
      { type: 'budget', text: 'Budget decreased +2', subtext: '6 campaigns decreased budget' }
    ]
  },
  { 
    name: 'Subaru Regional', 
    parent: 'Subaru Corporation',
    change: '-$87.6k', 
    pct: '-0.6%', 
    reasons: [
      { type: 'anomaly', text: '3 daily anomalies', subtext: 'Nissan - Product +2', subtext2: '-$16.2k below expected' },
      { type: 'decline', text: '15 of 20 accounts declining', subtext: 'Nissan - Product +14', subtext2: '-$282.6k (-6%) 7d w/w' },
      { type: 'budget', text: 'Budget decreased +2', subtext: '6 campaigns decreased budget' }
    ]
  },
  { 
    name: 'Nissan Global', 
    parent: 'Nissan OEM',
    change: '-$87.6k', 
    pct: '-0.6%', 
    reasons: [
      { type: 'anomaly', text: '3 daily anomalies', subtext: 'Nissan - Product +2', subtext2: '-$16.2k below expected' },
      { type: 'decline', text: '15 of 20 accounts declining', subtext: 'Nissan - Product +14', subtext2: '-$282.6k (-6%) 7d w/w' },
      { type: 'budget', text: 'Budget decreased +2', subtext: '6 campaigns decreased budget' }
    ]
  },
];

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Section */}
      <div className="flex gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Revenue trend</h2>
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-sm text-gray-500">Dates</span>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white">
                  QTD <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="text-sm text-gray-500">Products</span>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white">
                  All <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6 items-start">
            <div className="flex-1 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData} barCategoryGap="20%" margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid stroke="#e5e7eb" vertical={false} />
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
                    tick={{ fontSize: 12, fill: '#5E5E5E', fontFamily: 'Inter' }}
                    tickFormatter={(val) => `$${val.toFixed(1)}M`} 
                  />
                  <Tooltip />
                  
                  {/* Target dashes */}
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

                  {/* Revenue bar */}
                  <Bar dataKey="revenue" fill="#1a73e8" radius={[6, 6, 0, 0]} barSize={24} />
                  
                  {/* Outlook bar */}
                  <Bar dataKey="outlook" fill="#8ab4f8" radius={[6, 6, 0, 0]} barSize={24} />
                  
                  {/* Last Year line */}
                  <Line type="monotone" dataKey="lastYear" stroke="#FF7A00" strokeWidth={2.5} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="w-40 flex flex-col justify-center gap-4 pl-4 text-sm text-gray-600 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#1a73e8] rounded-[2px]"></div> 
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#8ab4f8] rounded-[2px]"></div> 
                <span>Finance outlook</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-[2px] bg-[#72777A]"></div> 
                <span>Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0 border-t-2 border-dashed border-[#FF7A00]"></div> 
                <span>Last year</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
            <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 bg-white">
              <i className="google-symbols text-[18px] text-[#1a73e8]">subdirectory_arrow_right</i>
              <span className="font-medium">Show revenue trend by product area</span>
            </button>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
              Deep dive <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="w-[400px] grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
            <div className="text-sm text-gray-600 mb-1">Q1 target</div>
            <div className="text-3xl font-medium text-gray-900 mb-1">$39.6M</div>
            <div className="text-xs text-gray-500">Gap to target: $5.6M</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
            <div className="text-sm text-gray-600 mb-1">Finance outlook</div>
            <div className="text-3xl font-medium text-red-600 mb-1 border-b-2 border-dotted border-red-300 inline-block w-max">94%</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              $37.2M • <TrendingDown className="w-3 h-3 text-red-500" /> <span className="text-red-500">-1.2pp w/w</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
            <div className="text-sm text-gray-600 mb-1">Sales outlook</div>
            <div className="text-3xl font-medium text-gray-900 mb-1">102%</div>
            <div className="text-xs text-gray-500">$40.4M</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
            <div className="text-sm text-gray-600 mb-1">QTD revenue</div>
            <div className="text-3xl font-medium text-gray-900 mb-1">$34.0M</div>
            <div className="text-xs flex items-center gap-1">
              <span className="text-green-600 flex items-center"><TrendingDown className="w-3 h-3 transform rotate-180 mr-0.5" /> +6.5% w/w</span>
              <span className="text-gray-400">•</span>
              <span className="text-red-500 flex items-center"><TrendingDown className="w-3 h-3 mr-0.5" /> -3.1% y/y</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
            <div className="text-sm text-gray-600 mb-1">Points won+live</div>
            <div className="text-3xl font-medium text-gray-900 mb-1">15858</div>
            <div className="text-xs text-gray-500">Q4 target 20651</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
            <div className="text-sm text-gray-600 mb-1">Points run rate</div>
            <div className="text-3xl font-medium text-gray-900 mb-1">117%</div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Top moving companies & accounts</h2>
          <div className="flex gap-3 mb-6">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50">
              All product areas <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50">
              7d w/w <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-6 border-b border-gray-200">
            <button className="pb-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Decliners</button>
            <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700">Risers</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-normal w-[250px]">Name</th>
                <th className="px-6 py-4 font-normal w-[100px] text-right">7d w/w</th>
                <th className="px-6 py-4 font-normal">Top reasons</th>
                <th className="px-6 py-4 font-normal w-[100px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topMovingCompanies.map((company, i) => (
                <tr key={i} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 text-gray-400"><Briefcase className="w-4 h-4" /></div>
                      <div>
                        <div className="text-xs text-gray-500">{company.parent}</div>
                        <div className="font-medium text-gray-900">{company.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-gray-900">{company.change}</div>
                    <div className="text-red-500 text-xs">{company.pct}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {company.reasons.map((reason, j) => (
                        <div key={j} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 flex-1 max-w-[220px]">
                          <div className="flex items-center gap-1.5 font-medium text-gray-900 text-xs mb-1">
                            {reason.type === 'anomaly' && <AlertTriangle className="w-3.5 h-3.5 text-gray-500" />}
                            {reason.type === 'decline' && <TrendingDown className="w-3.5 h-3.5 text-gray-500" />}
                            {reason.type === 'budget' && <BarChart2 className="w-3.5 h-3.5 text-gray-500" />}
                            <span className="border-b border-dotted border-gray-400">{reason.text}</span>
                          </div>
                          {reason.subtext && (
                            <div className="text-[10px] text-gray-600 flex items-center gap-1">
                              {reason.type !== 'budget' && <span className="bg-gray-200 text-gray-600 px-1 rounded text-[8px] font-bold">GA</span>}
                              {reason.subtext}
                            </div>
                          )}
                          {reason.subtext2 && (
                            <div className="text-[10px] text-red-500 mt-0.5">{reason.subtext2}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-medium flex items-center gap-1 hover:underline ml-auto">
                      Diagnose <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button className="text-blue-600 text-sm font-medium hover:underline">
            View 5 more
          </button>
        </div>
      </div>
    </div>
  );
}
