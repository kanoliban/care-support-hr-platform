import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Plus, Filter, ChevronDown,
  User, Shield, Clock, AlertCircle, MoreHorizontal,
  Lock, Mail
} from 'lucide-react';

// Mock data for demonstration
const users = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-04-15 09:30',
    permissions: ['scheduling', 'billing', 'compliance']
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Billing Manager',
    status: 'Active',
    lastLogin: '2024-04-15 10:15',
    permissions: ['billing']
  },
  {
    id: 'user-003',
    name: 'Mike Davis',
    email: 'mike.d@example.com',
    role: 'Scheduler',
    status: 'Locked',
    lastLogin: '2024-04-14 16:45',
    permissions: ['scheduling']
  }
];

const roles = [
  { name: 'Admin', description: 'Full system access' },
  { name: 'Billing Manager', description: 'Manage billing and claims' },
  { name: 'Scheduler', description: 'Manage schedules and assignments' },
  { name: 'Compliance Officer', description: 'Monitor compliance and audits' }
];

function UserManagementView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-4">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </button>
        </div>

        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">User & Role Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts and access permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus size={16} />
              Add User
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Users</div>
            <div className="text-2xl font-semibold">{users.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Active Users</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-green-600">
                {users.filter(u => u.status === 'Active').length}
              </div>
              <User size={20} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Locked Accounts</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-red-600">
                {users.filter(u => u.status === 'Locked').length}
              </div>
              <Lock size={20} className="text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Pending Invites</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-yellow-600">2</div>
              <Mail size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Role
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Status
              <ChevronDown size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-medium mb-4">Available Roles</h2>
          <div className="grid grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.name} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{role.name}</h3>
                  <button className="text-purple-600 hover:text-purple-700 text-sm">
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default UserManagementView;