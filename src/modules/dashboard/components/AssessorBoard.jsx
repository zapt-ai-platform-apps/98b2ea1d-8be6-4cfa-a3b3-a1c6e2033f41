import React, { useState } from 'react';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';

const Evidence = ({ id, apprentice, title, type, date, onClick }) => {
  const typeIcons = {
    photo: '📷',
    video: '🎥',
    pdf: '📄'
  };
  
  return (
    <div className="border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {apprentice} • {date} • <span className="inline-block">{typeIcons[type] || '📄'} {type}</span>
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => onClick(id)}>
          Review
        </Button>
      </div>
    </div>
  );
};

const AssessorBoard = () => {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  
  // Sample data - would come from API
  const evidenceItems = [
    { id: 1, apprentice: 'John Smith', title: 'Database design documentation', type: 'pdf', date: '2 hours ago' },
    { id: 2, apprentice: 'Sarah Johnson', title: 'User testing video session', type: 'video', date: '5 hours ago' },
    { id: 3, apprentice: 'John Smith', title: 'Code review screenshots', type: 'photo', date: '1 day ago' },
    { id: 4, apprentice: 'Sarah Johnson', title: 'Project planning document', type: 'pdf', date: '2 days ago' },
  ];
  
  const handleReviewClick = (id) => {
    setSelectedEvidence(evidenceItems.find(item => item.id === id));
  };
  
  const handleApproveEvidence = () => {
    setReviewing(true);
    // Simulate API call
    setTimeout(() => {
      setReviewing(false);
      setSelectedEvidence(null);
      // Would update the evidence list
    }, 1500);
  };
  
  const handleRejectEvidence = () => {
    setReviewing(true);
    // Simulate API call
    setTimeout(() => {
      setReviewing(false);
      setSelectedEvidence(null);
      // Would update the evidence list
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessor Dashboard</h1>
            <p className="text-gray-600">
              4 pending evidence items requiring review
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Evidence Inbox</h3>
              <Badge variant="primary">4 New</Badge>
            </div>
          }
          noPadding
        >
          {evidenceItems.map(item => (
            <Evidence 
              key={item.id} 
              {...item} 
              onClick={handleReviewClick}
            />
          ))}
        </Card>
        
        <Card title="Evidence Review">
          {selectedEvidence ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedEvidence.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Apprentice: {selectedEvidence.apprentice}
                </p>
                <p className="text-sm text-gray-600">
                  Submitted: {selectedEvidence.date}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {selectedEvidence.type}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <textarea 
                  className="input-field min-h-[100px]"
                  placeholder="Add your review comments here..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Knowledge, Skills, and Behaviors
                </label>
                <select className="input-field">
                  <option value="">Select KSB to link</option>
                  <option value="ks1">K1: Software development lifecycle</option>
                  <option value="ks2">K2: Database systems and design</option>
                  <option value="s1">S1: Create logical and maintainable code</option>
                  <option value="b1">B1: Works independently and takes responsibility</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-3">
                <Button
                  variant="success"
                  onClick={handleApproveEvidence}
                  loading={reviewing}
                  className="flex-1"
                >
                  Approve & Sign
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRejectEvidence}
                  loading={reviewing}
                  className="flex-1"
                >
                  Request Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Select an evidence item to review</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AssessorBoard;