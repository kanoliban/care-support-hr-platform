import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Shield,
  Eye,
  EyeOff,
  Edit3,
  Calendar,
  FileText,
  Phone,
  User,
  Lock,
  Save
} from 'lucide-react';
import { useCareCoordination } from '../../contexts/CareCoordinationContext';

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
}

interface RolePermissions {
  [role: string]: {
    [permissionId: string]: boolean;
  };
}

function PermissionsView() {
  const navigate = useNavigate();
  const careContext = useCareCoordination();
  const { careRecipient } = careContext;

  const permissions: Permission[] = [
    // Schedule & Coordination
    { id: 'view_schedule', name: 'View Schedule', description: 'See care schedule and shifts', icon: Calendar, category: 'schedule' },
    { id: 'edit_schedule', name: 'Edit Schedule', description: 'Add, modify, or remove scheduled care', icon: Edit3, category: 'schedule' },
    { id: 'view_gaps', name: 'View Coverage Gaps', description: 'See when care coverage is needed', icon: Eye, category: 'schedule' },
    { id: 'fill_gaps', name: 'Fill Coverage Gaps', description: 'Accept and fill uncovered shifts', icon: Shield, category: 'schedule' },
    
    // Care Information
    { id: 'view_care_profile', name: 'View Care Profile', description: 'Access care recipient profile and medical info', icon: User, category: 'care' },
    { id: 'edit_care_profile', name: 'Edit Care Profile', description: 'Update care recipient information', icon: Edit3, category: 'care' },
    { id: 'view_medical_info', name: 'View Medical Information', description: 'Access medications, conditions, and medical details', icon: FileText, category: 'care' },
    { id: 'edit_medical_info', name: 'Edit Medical Information', description: 'Update medical information and care plans', icon: Edit3, category: 'care' },
    
    // Communication
    { id: 'view_contacts', name: 'View Team Contacts', description: 'See contact information for team members', icon: Phone, category: 'communication' },
    { id: 'send_updates', name: 'Send Team Updates', description: 'Send messages and updates to the care team', icon: FileText, category: 'communication' },
    { id: 'emergency_contacts', name: 'Emergency Contacts', description: 'Access emergency contact information', icon: Shield, category: 'communication' },
    
    // Team Management
    { id: 'view_team', name: 'View Team Members', description: 'See who is part of the care team', icon: Users, category: 'team' },
    { id: 'invite_members', name: 'Invite Team Members', description: 'Add new people to the care team', icon: Users, category: 'team' },
    { id: 'manage_permissions', name: 'Manage Permissions', description: 'Control what team members can see and do', icon: Lock, category: 'team' }
  ];

  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({
    'coordinator': Object.fromEntries(permissions.map(p => [p.id, true])), // Full access
    'family_caregiver': {
      view_schedule: true,
      view_gaps: true,
      view_care_profile: true,
      view_medical_info: true,
      view_contacts: true,
      send_updates: true,
      emergency_contacts: true,
      view_team: true,
      edit_schedule: false,
      fill_gaps: true,
      edit_care_profile: false,
      edit_medical_info: false,
      invite_members: false,
      manage_permissions: false
    },
    'professional_caregiver': {
      view_schedule: true,
      view_gaps: true,
      fill_gaps: true,
      view_care_profile: true,
      view_medical_info: true,
      view_contacts: true,
      send_updates: true,
      emergency_contacts: true,
      view_team: true,
      edit_schedule: false,
      edit_care_profile: false,
      edit_medical_info: false,
      invite_members: false,
      manage_permissions: false
    },
    'community_supporter': {
      view_schedule: true,
      view_gaps: true,
      view_care_profile: true,
      view_contacts: false,
      view_team: true,
      fill_gaps: false,
      edit_schedule: false,
      edit_care_profile: false,
      view_medical_info: false,
      edit_medical_info: false,
      send_updates: false,
      emergency_contacts: false,
      invite_members: false,
      manage_permissions: false
    }
  });

  const roles = [
    { id: 'coordinator', name: 'Care Coordinator', description: 'Full access to all care coordination features', color: 'purple' },
    { id: 'family_caregiver', name: 'Family Caregiver', description: 'Family members providing care', color: 'blue' },
    { id: 'professional_caregiver', name: 'Professional Caregiver', description: 'Trained caregivers and healthcare professionals', color: 'green' },
    { id: 'community_supporter', name: 'Community Supporter', description: 'Friends, neighbors, and volunteers', color: 'orange' }
  ];

  const categories = [
    { id: 'schedule', name: 'Schedule & Coordination', icon: Calendar },
    { id: 'care', name: 'Care Information', icon: User },
    { id: 'communication', name: 'Communication', icon: Phone },
    { id: 'team', name: 'Team Management', icon: Users }
  ];

  const handlePermissionChange = (roleId: string, permissionId: string, granted: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: granted
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving permissions:', rolePermissions);
    alert('Team permissions saved successfully!');
  };

  const getRoleColor = (color: string) => {
    switch (color) {
      case 'purple': return 'text-purple-600 bg-purple-100';
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'green': return 'text-green-600 bg-green-100';
      case 'orange': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Users size={28} className="text-purple-600" />
              Team Permissions
            </h1>
            <p className="text-gray-600">Control what team members can see and do for {careRecipient.name}</p>
          </div>
        </header>

        <div className="max-w-6xl space-y-8">
          {/* Roles Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Care Team Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div key={role.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getRoleColor(role.color)}`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions Matrix */}
          {categories.map((category) => {
            const categoryPermissions = permissions.filter(p => p.category === category.id);
            const CategoryIcon = category.icon;
            
            return (
              <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <CategoryIcon size={20} className="text-gray-600" />
                  {category.name}
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 pr-4 font-medium text-gray-900">Permission</th>
                        {roles.map((role) => (
                          <th key={role.id} className="text-center py-3 px-2 font-medium text-gray-900 min-w-[120px]">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getRoleColor(role.color)}`}>
                              {role.name.split(' ')[0]}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {categoryPermissions.map((permission) => {
                        const PermissionIcon = permission.icon;
                        return (
                          <tr key={permission.id} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-4 pr-4">
                              <div className="flex items-start gap-3">
                                <PermissionIcon size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">{permission.name}</div>
                                  <div className="text-sm text-gray-600">{permission.description}</div>
                                </div>
                              </div>
                            </td>
                            {roles.map((role) => (
                              <td key={role.id} className="py-4 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={rolePermissions[role.id]?.[permission.id] || false}
                                  onChange={(e) => handlePermissionChange(role.id, permission.id, e.target.checked)}
                                  disabled={role.id === 'coordinator'} // Coordinators always have full access
                                  className="rounded"
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Privacy & Security Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Shield size={20} />
              Privacy & Security
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Medical information is only shared with team members who have been granted explicit access</p>
              <p>• Community supporters have limited access to protect privacy while still enabling help</p>
              <p>• Emergency contacts are available to all team members for safety reasons</p>
              <p>• Permission changes take effect immediately for all team members</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Save size={20} />
            Save Permissions
          </button>
        </div>
      </div>
    </main>
  );
}

export default PermissionsView;