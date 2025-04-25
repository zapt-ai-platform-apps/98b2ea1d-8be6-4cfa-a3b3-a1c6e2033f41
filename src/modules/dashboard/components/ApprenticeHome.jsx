import React, { useState } from 'react';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';
import { useNavigate } from 'react-router-dom';

const ProgressRing = ({ percentage, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
      </div>
    </div>
  );
};

const ApprenticeHome = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  // This would come from API in a real implementation
  const apprenticeData = {
    name: "John Smith",
    standard: "Software Developer",
    startDate: "Sept 2023",
    progress: 35,
    otjHours: 168,
    otjTarget: 720,
    otjPercentage: 23,
    pendingEvidence: 2,
    pendingActions: [
      { id: 1, type: 'evidence-rejected', title: 'Resubmit coding task evidence', deadline: '2 days' },
      { id: 2, type: 'otj-update', title: 'Weekly OTJ time logging', deadline: '1 day' }
    ],
    recentEvidence: [
      { id: 1, title: 'Team project documentation', status: 'approved', date: '15 Mar 2024' },
      { id: 2, title: 'Code review session recording', status: 'pending', date: '28 Feb 2024' },
      { id: 3, title: 'API integration screenshot', status: 'rejected', date: '14 Feb 2024' }
    ]
  };
  
  const handleUploadClick = () => {
    setUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      // Would navigate to upload success page or refresh evidence list
    }, 2000);
  };
  
  const statusVariants = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger'
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {apprenticeData.name}</h1>
            <p className="text-gray-600">
              {apprenticeData.standard} • Started {apprenticeData.startDate}
            </p>
          </div>
          <Button
            variant="primary"
            className="mt-4 sm:mt-0"
            onClick={handleUploadClick}
            loading={uploading}
          >
            Upload New Evidence
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Overall Progress">
          <div className="flex flex-col items-center justify-center p-4">
            <ProgressRing percentage={apprenticeData.progress} />
            <p className="mt-4 text-center text-gray-600">
              You're making good progress on your apprenticeship journey
            </p>
          </div>
        </Card>
        
        <Card title="Off-The-Job Hours">
          <div className="flex flex-col items-center justify-center p-4">
            <ProgressRing percentage={apprenticeData.otjPercentage} />
            <div className="mt-4 text-center">
              <p className="text-gray-900 font-medium">
                {apprenticeData.otjHours} / {apprenticeData.otjTarget} hours
              </p>
              <p className="text-gray-600 text-sm">
                Keep logging your learning time to stay on track
              </p>
            </div>
          </div>
        </Card>
        
        <Card title="Outstanding Actions">
          <div className="divide-y divide-gray-100">
            {apprenticeData.pendingActions.map(action => (
              <div key={action.id} className="py-3 first:pt-1 last:pb-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-danger mt-1">Due in {action.deadline}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/action/${action.id}`)}
                  >
                    Complete
                  </Button>
                </div>
              </div>
            ))}
            
            {apprenticeData.pendingActions.length === 0 && (
              <p className="py-4 text-center text-gray-500">No outstanding actions</p>
            )}
          </div>
        </Card>
        
        <Card 
          title="Recent Evidence"
          className="md:col-span-2"
          footer={
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-center"
              onClick={() => navigate('/evidence')}
            >
              View All Evidence
            </Button>
          }
        >
          <div className="divide-y divide-gray-100">
            {apprenticeData.recentEvidence.map(evidence => (
              <div key={evidence.id} className="py-3 first:pt-1 last:pb-1">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{evidence.title}</p>
                    <p className="text-sm text-gray-500 mt-1">Submitted: {evidence.date}</p>
                  </div>
                  <Badge variant={statusVariants[evidence.status]}>
                    {evidence.status.charAt(0).toUpperCase() + evidence.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApprenticeHome;