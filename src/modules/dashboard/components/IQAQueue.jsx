import React, { useState } from 'react';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';

const SampleItem = ({ id, apprentice, assessor, evidenceTitle, date, onClick }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{evidenceTitle}</h4>
          <p className="text-sm text-gray-600 mt-1">
            Apprentice: {apprentice} • Assessor: {assessor} • {date}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => onClick(id)}>
          Review
        </Button>
      </div>
    </div>
  );
};

const IQAQueue = () => {
  const [selectedSample, setSelectedSample] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Sample data - would come from API
  const sampleItems = [
    { 
      id: 1, 
      apprentice: 'John Smith', 
      assessor: 'Emma Watson', 
      evidenceTitle: 'Database design documentation', 
      date: '23 Mar 2024',
      assessorComments: 'Good demonstration of database normalization principles. Meets all criteria for K2.'
    },
    { 
      id: 2, 
      apprentice: 'Sarah Johnson', 
      assessor: 'David Clark', 
      evidenceTitle: 'Code testing report', 
      date: '22 Mar 2024',
      assessorComments: 'Comprehensive test coverage with good examples of unit and integration testing techniques.'
    },
    { 
      id: 3, 
      apprentice: 'Michael Brown', 
      assessor: 'Emma Watson', 
      evidenceTitle: 'User requirements document', 
      date: '20 Mar 2024',
      assessorComments: 'Clear documentation of functional requirements with well-structured use cases.'
    },
  ];
  
  const handleReviewClick = (id) => {
    setSelectedSample(sampleItems.find(item => item.id === id));
  };
  
  const handleApprove = () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSelectedSample(null);
      // Would update the sample list
    }, 1500);
  };
  
  const handleRaiseIssue = () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSelectedSample(null);
      // Would update the sample list
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IQA Dashboard</h1>
            <p className="text-gray-600">
              3 assessment samples requiring internal quality assurance
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Sampling Queue</h3>
              <Badge variant="primary">3 Pending</Badge>
            </div>
          }
          noPadding
        >
          {sampleItems.map(item => (
            <SampleItem 
              key={item.id} 
              {...item} 
              onClick={handleReviewClick}
            />
          ))}
        </Card>
        
        <Card title="Quality Assurance Review">
          {selectedSample ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedSample.evidenceTitle}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Apprentice: {selectedSample.apprentice}
                </p>
                <p className="text-sm text-gray-600">
                  Assessor: {selectedSample.assessor}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {selectedSample.date}
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-primary">
                <h5 className="font-medium text-gray-900 mb-1">Assessor Comments</h5>
                <p className="text-sm text-gray-700">
                  {selectedSample.assessorComments}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IQA Comments
                </label>
                <textarea 
                  className="input-field min-h-[100px]"
                  placeholder="Add your quality assurance comments here..."
                ></textarea>
              </div>
              
              <div className="flex space-x-3 pt-3">
                <Button
                  variant="success"
                  onClick={handleApprove}
                  loading={submitting}
                  className="flex-1"
                >
                  Confirm Quality
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRaiseIssue}
                  loading={submitting}
                  className="flex-1"
                >
                  Raise Issue
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Select a sample to review</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default IQAQueue;