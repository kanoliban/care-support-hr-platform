import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Users,
  Calendar,
  Settings,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  Phone,
  Clock,
  User,
  DollarSign,
  Shield,
  AlertTriangle
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Command Center', path: '/' },
  { 
    icon: Calendar, 
    label: 'Schedule', 
    path: '/schedule',
    hasSubmenu: true,
    submenuItems: [
      { label: 'Team Schedule', path: '/schedule' },
      { label: 'Coverage Gaps', path: '/schedule/gaps' }
    ]
  },
  { 
    icon: Users, 
    label: 'Care Team', 
    path: '/schedule/team',
    hasSubmenu: true,
    submenuItems: [
      { label: 'Team Directory', path: '/schedule/team' },
      { label: 'Contact Info', path: '/schedule/team/contacts' }
    ]
  },
  { 
    icon: Phone, 
    label: 'Quick Actions', 
    path: '/actions',
    hasSubmenu: true,
    submenuItems: [
      { label: 'Find Coverage', path: '/actions/coverage' },
      { label: 'Send Update', path: '/actions/update' },
      { label: 'Emergency Contacts', path: '/actions/emergency' }
    ]
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/settings',
    hasSubmenu: true,
    submenuItems: [
      { label: 'Care Profile', path: '/settings/care-profile' },
      { label: 'Care Standards', path: '/settings/care-standards' },
      { label: 'My Preferences', path: '/settings/preferences' },
      { label: 'Notifications', path: '/settings/notifications' },
      { label: 'Team Permissions', path: '/settings/permissions' },
      { label: 'Accessibility', path: '/settings/accessibility' }
    ]
  }
];

function CareCoordinationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleSubmenu = (path: string) => {
    setExpandedMenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const handleNavigation = (item: any) => {
    if (item.hasSubmenu && !isCollapsed) {
      toggleSubmenu(item.path);
    } else if (!item.isDisabled) {
      navigate(item.path);
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">CS</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">CareSupport</div>
              <div className="text-xs text-gray-500">Care Coordination OS</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        >
          {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isMenuExpanded = expandedMenus.includes(item.path);
          const isMenuActive = isActive(item.path);

          return (
            <div key={item.path}>
              {/* Main Menu Item */}
              <button
                onClick={() => handleNavigation(item)}
                disabled={item.isDisabled}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors
                  ${isMenuActive 
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  ${item.isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isMenuActive ? 'text-purple-700' : 'text-gray-500'} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </div>
                {!isCollapsed && item.hasSubmenu && (
                  <div className="flex items-center">
                    {isMenuExpanded ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu Items */}
              {!isCollapsed && item.hasSubmenu && isMenuExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenuItems?.map((subItem: any) => (
                    <button
                      key={subItem.path}
                      onClick={() => navigate(subItem.path)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                        ${location.pathname === subItem.path
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer - Rob's Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">Care Team Active</div>
              <div className="text-xs text-gray-500 truncate">All shifts covered today</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CareCoordinationSidebar;