import React from 'react';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';

// Simple bar chart component
const BarChart = ({ data, height = 200, barColor = "#16529A" }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="pt-2">
      <div className="flex h-[200px] items-end space-x-2">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-primary rounded-t-sm transition-all duration-500 ease-out"
                style={{ 
                  height: `${percentage}%`,
                  backgroundColor: barColor,
                  minHeight: item.value > 0 ? '10px' : '0'
                }}
              ></div>
              <div className="text-xs text-gray-600 mt-1 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <div>0</div>
        <div>{maxValue} hours</div>
      </div>
    </div>
  );
};

// Gauge chart component
const GaugeChart = ({ percentage, size = 160, strokeWidth = 15 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Semi-circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const gradientId = "gaugeGradient";
  
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size / 2 + 10}
        viewBox={`0 0 ${size} ${size / 2 + 10}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E27426" />
            <stop offset="50%" stopColor="#E2C026" />
            <stop offset="100%" stopColor="#56BA86" />
          </linearGradient>
        </defs>
        
        {/* Background semi-circle */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} 
              A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress semi-circle */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} 
              A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2 + 5}
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#374151"
        >
          {percentage}%
        </text>
        
      </svg>
    </div>
  );
};

const EmployerDashboard = () => {
  // Sample data - would come from API
  const apprentices = [
    { id: 1, name: 'John Smith', standard: 'Software Developer', progress: 35, status: 'on-track' },
    { id: 2, name: 'Sarah Johnson', standard: 'Digital Marketer', progress: 62, status: 'on-track' },
    { id: 3, name: 'Michael Brown', standard: 'Business Administrator', progress: 48, status: 'at-risk' },
  ];
  
  const otjData = [
    { label: 'Oct', value: 42 },
    { label: 'Nov', value: 58 },
    { label: 'Dec', value: 34 },
    { label: 'Jan', value: 62 },
    { label: 'Feb', value: 48 },
    { label: 'Mar', value: 72 },
  ];
  
  const statusVariants = {
    'on-track': 'success',
    'at-risk': 'warning',
    'behind': 'danger'
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600">
              3 apprentices currently in training
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Apprentice Progress">
          <div className="divide-y divide-gray-100">
            {apprentices.map(apprentice => (
              <div key={apprentice.id} className="py-3 first:pt-1 last:pb-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{apprentice.name}</p>
                    <p className="text-sm text-gray-600">{apprentice.standard}</p>
                  </div>
                  <Badge variant={statusVariants[apprentice.status]}>
                    {apprentice.progress}% Complete
                  </Badge>
                </div>
                <div className="mt-2 bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${apprentice.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Off-The-Job vs Required">
          <div className="px-2">
            <BarChart data={otjData} barColor="#16529A" />
            <p className="text-sm text-gray-600 text-center mt-4">
              Monthly Off-The-Job training hours
            </p>
          </div>
        </Card>
        
        <Card title="Levy Budget Utilization">
          <div className="flex flex-col items-center">
            <GaugeChart percentage={72} />
            <div className="mt-4 text-center">
              <p className="text-lg font-medium text-gray-900">£10,800 / £15,000</p>
              <p className="text-sm text-gray-600">Annual apprenticeship levy spend</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Funding Alerts">
        <div className="divide-y divide-gray-100">
          <div className="py-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                ⚠️
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Michael Brown: OTJ hours below target</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Currently at 72% of expected Off-The-Job training hours for this period.
                </p>
              </div>
            </div>
          </div>
          
          <div className="py-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                ℹ️
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Levy payment due next month</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Next quarterly levy payment of £3,750 is due on April 15, 2024.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployerDashboard;