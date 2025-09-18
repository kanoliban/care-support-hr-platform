import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Users,
  Calendar,
  CreditCard,
  Shield,
  ClipboardList,
  FileText,
  Building2,
  Database,
  Link as LinkIcon,
  Settings,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { 
    icon: Calendar, 
    label: 'Schedule', 
    path: '/schedule',
    hasSubmenu: true,
    submenuItems: [
      { label: 'Calendar', path: '/schedule' },
      { label: 'Client Schedule', path: '/schedule/clients' },
      { label: 'Caregiver Schedule', path: '/schedule/caregivers' }
    ]
  },
  { 
    icon: Users, 
    label: 'Clients', 
    path: '/clients',
    hasSubmenu: true,
    submenuItems: [
      { label: 'All Clients', path: '/clients' },
      { label: 'Schedule', path: '/clients/schedule' },
      { label: 'Care Plans', path: '/clients/care-plans' },
      { label: 'Incidents', path: '/clients/incidents' },
      { label: 'Consents', path: '/clients/consents' }
    ]
  },
  { 
    icon: Users, 
    label: 'Caregivers', 
    path: '/caregivers',
    hasSubmenu: true,
    submenuItems: [
      { label: 'All Caregivers', path: '/caregivers' },
      { label: 'Schedule', path: '/caregivers/schedule' },
      { label: 'Credentials', path: '/caregivers/credentials' },
      { label: 'Training', path: '/caregivers/training' }
    ]
  },
  { 
    icon: CreditCard, 
    label: 'Billing', 
    path: '/billing',
    isDisabled: false,
    comingSoon: false
  },
  { 
    icon: Shield, 
    label: 'Compliance', 
    path: '/compliance',
    hasSubmenu: true,
    submenuItems: [
      { label: 'Frameworks', path: '/compliance' },
      { label: 'Controls', path: '/compliance/controls' },
      { label: 'Policies', path: '/compliance/policies' },
      { label: 'Documents', path: '/compliance/documents' },
      { label: 'Audits', path: '/compliance/audits' }
    ]
  },
  { icon: FileText, label: 'Reports', path: '/reports' },
  {
    icon: BookOpen,
    label: 'Resources',
    path: '/resources',
    hasSubmenu: true,
    submenuItems: [
      { label: 'Getting Started', path: '/resources/getting-started' },
      { label: 'Knowledge Base', path: '/resources/knowledge-base' },
      { label: 'Resource Library', path: '/resources/library' },
      { label: 'Community Guide', path: '/resources/community' }
    ]
  },
  { 
    icon: Settings, 
    label: 'Admin', 
    path: '/admin',
    hasSubmenu: true,
    submenuItems: [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Users & Roles', path: '/admin/users' },
      { label: 'System Settings', path: '/admin/settings' },
      { label: 'Integrations', path: '/admin/integrations' },
      { label: 'Audit Logs', path: '/admin/logs' },
      { label: 'Advanced Compliance', path: '/admin/compliance' }
    ]
  }
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(
    location.pathname.startsWith('/compliance') ? '/compliance' : null
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isInSection = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isSubmenuItemActive = (path: string) => {
    if (path === '/compliance' && location.pathname === '/compliance') {
      return true;
    }
    if (path === '/compliance/policies' && location.pathname.startsWith('/compliance/policies/')) {
      return true;
    }
    return location.pathname === path;
  };

  const handleMenuClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (item.isDisabled) {
      return;
    }

    if (item.hasSubmenu) {
      setExpandedMenu(expandedMenu === item.path ? null : item.path);
      if (!expandedMenu || expandedMenu !== item.path) {
        navigate(item.path);
      }
    } else {
      navigate(item.path);
    }
  };

  const handleSubmenuClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedMenu(null);
    }
  };

  return (
    <aside 
      className={`bg-claude-card border-r border-gray-200 transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'w-16' : 'w-64'}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className={`text-xl font-bold italic transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
          aria-label="CareSupport.com Home"
        >
          CareSupport.com
        </a>
        <button 
          onClick={toggleCollapse}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="p-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Help..."
              className="w-full pl-8 pr-4 py-2 bg-claude bg-opacity-50 rounded-md text-sm"
              aria-label="Search help"
            />
            <span className="absolute right-3 top-2 text-gray-400 text-sm">⌘+K</span>
          </div>
        </div>
      )}

      <nav className="mt-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={(e) => handleMenuClick(item, e)}
              className={`w-full text-left flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-claude ${
                isCollapsed ? 'justify-center' : ''
              } ${isInSection(item.path) ? 'bg-claude bg-opacity-75' : ''} ${
                item.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-expanded={item.hasSubmenu ? expandedMenu === item.path : undefined}
              aria-disabled={item.isDisabled}
              role="menuitem"
            >
              <item.icon 
                size={20} 
                className={isInSection(item.path) ? 'text-purple-600' : 'text-gray-700'} 
                aria-hidden="true"
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.comingSoon && (
                    <span className="text-xs bg-claude bg-opacity-50 text-gray-600 px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  )}
                  {item.hasSubmenu && (
                    expandedMenu === item.path ? 
                    <ChevronDown size={16} className="ml-auto" aria-hidden="true" /> :
                    <ChevronRight size={16} className="ml-auto" aria-hidden="true" />
                  )}
                </>
              )}
            </button>
            {!isCollapsed && item.hasSubmenu && item.submenuItems && expandedMenu === item.path && (
              <div 
                className="ml-4 border-l border-gray-200"
                role="menu"
                aria-label={`${item.label} submenu`}
              >
                {item.submenuItems.map((subItem: any, subIndex: number) => (
                  <button
                    key={subIndex}
                    onClick={(e) => handleSubmenuClick(subItem.path, e)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-claude ${
                      isSubmenuItemActive(subItem.path) 
                        ? 'bg-claude bg-opacity-75 text-purple-600' 
                        : 'text-gray-700'
                    }`}
                    role="menuitem"
                  >
                    <span className="text-sm">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;