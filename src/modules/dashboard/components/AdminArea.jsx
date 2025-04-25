import React, { useState } from 'react';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';

const AdminArea = () => {
  const [loading, setLoading] = useState(false);
  
  // Sample data - would come from API
  const orgData = {
    name: 'Hopwood Hall College',
    plan: 'pro',
    users: [
      { id: 1, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'admin' },
      { id: 2, name: 'David Wilson', email: 'david.wilson@example.com', role: 'assessor' },
      { id: 3, name: 'Emma Thompson', email: 'emma.thompson@example.com', role: 'iqa' },
      { id: 4, name: 'James Brown', email: 'james.brown@example.com', role: 'employer' },
    ],
    apprenticeCount: 12,
    recentActivity: [
      { id: 1, user: 'David Wilson', action: 'Approved evidence for John Smith', timestamp: '2 hours ago' },
      { id: 2, user: 'Emma Thompson', action: 'Sampled review for Sarah Johnson', timestamp: '5 hours ago' },
      { id: 3, user: 'Jane Smith', action: 'Added new apprentice Michael Brown', timestamp: '1 day ago' },
    ]
  };
  
  const handleSeedDemoData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seedDemoData', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to seed demo data');
      }
      
      const result = await response.json();
      console.log('Demo data seeded:', result);
      alert('Demo data successfully created!');
    } catch (error) {
      console.error('Error seeding demo data:', error);
      alert('Error creating demo data. See console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">
              {orgData.name} • {orgData.plan.charAt(0).toUpperCase() + orgData.plan.slice(1)} Plan
            </p>
          </div>
          <Button
            variant="primary"
            className="mt-4 sm:mt-0"
            loading={loading}
            onClick={handleSeedDemoData}
          >
            Create Demo Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card 
            title="User Management"
            footer={
              <Button variant="secondary" size="sm">
                Add New User
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orgData.users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Subscription Details">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="font-medium text-gray-900">{orgData.plan.charAt(0).toUpperCase() + orgData.plan.slice(1)} Plan</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Apprentices</p>
                <p className="font-medium text-gray-900">{orgData.apprenticeCount} / 25</p>
                <div className="mt-1 bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${(orgData.apprenticeCount / 25) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Billing Cycle</p>
                <p className="font-medium text-gray-900">Monthly (Next: April 15, 2024)</p>
              </div>
              
              <Button variant="secondary" className="w-full">
                Manage Subscription
              </Button>
            </div>
          </Card>
          
          <Card 
            title="Activity Log"
            className="mt-6"
            footer={
              <Button variant="ghost" size="sm" className="w-full">
                View Full Audit Trail
              </Button>
            }
          >
            <div className="space-y-3">
              {orgData.recentActivity.map(activity => (
                <div key={activity.id} className="text-sm">
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-gray-600">{activity.action}</p>
                  <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminArea;