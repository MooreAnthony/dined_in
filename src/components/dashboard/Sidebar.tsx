import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Building2,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Loader2,
  ChevronDown,
  Mail,
  MessageSquare,
  MapPin,
  UserPlus,
  Plug,
  Tag,
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAccounts } from '../../hooks/useAccounts';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  path: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  ariaLabel?: string;
}

interface SettingsMenuItem extends MenuItem {
  children?: MenuItem[];
}

const mainMenuItems: MenuItem[] = [
  { path: '/dashboard', icon: Home, label: 'Home', ariaLabel: 'Dashboard home' },
  { path: '/dashboard/bookings', icon: Calendar, label: 'Bookings', ariaLabel: 'Manage bookings' },
  { path: '/dashboard/contacts', icon: Users, label: 'Contacts', ariaLabel: 'Manage contacts' },
  { path: '/dashboard/diary', icon: Calendar, label: 'Diary', ariaLabel: 'Manage service' },
];

const settingsMenuItems: SettingsMenuItem[] = [
  {
    path: '/dashboard/settings',
    icon: Settings,
    label: 'Settings',
    ariaLabel: 'System settings',
    children: [
      { path: '/dashboard/settings/locations', icon: MapPin, label: 'Locations', ariaLabel: 'Location settings' },
      { path: '/dashboard/settings/emails', icon: Mail, label: 'Emails', ariaLabel: 'Email settings' },
      { path: '/dashboard/settings/sms', icon: MessageSquare, label: 'SMS', ariaLabel: 'SMS settings' },
      { path: '/dashboard/settings/tags', icon: Tag, label: 'Tags', ariaLabel: 'Tag management' },
      { path: '/dashboard/settings/roles', icon: Shield, label: 'Roles', ariaLabel: 'Role management' },
      { path: '/dashboard/settings/users', icon: UserPlus, label: 'Users', ariaLabel: 'User management' },
      { path: '/dashboard/settings/api-users', icon: Plug, label: 'API Users', ariaLabel: 'API user management' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { accounts, selectedAccount, setSelectedAccount, isLoading } = useAccounts();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [expandedSettings, setExpandedSettings] = useState(false);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !isCollapsed) {
      onToggle();
    }
  }, [isCollapsed, onToggle]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle smooth transitions
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 200);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleMouseEnter = (path: string) => {
    if (isCollapsed) {
      setHoveredItem(path);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => (
    <Link
      key={item.path}
      to={item.path}
      role="menuitem"
      aria-label={item.ariaLabel}
      aria-current={location.pathname === item.path ? 'page' : undefined}
      onMouseEnter={() => handleMouseEnter(item.path)}
      onMouseLeave={handleMouseLeave}
      className={`
        flex items-center px-4 py-3 rounded-lg transition-all duration-200
        group relative
        ${isChild ? 'ml-6' : ''}
        ${location.pathname === item.path
          ? 'bg-dark-accent text-white'
          : 'text-dark-text-secondary hover:bg-dark-accent/10 hover:text-dark-text-primary'
        }
        focus:outline-none focus:ring-2 focus:ring-dark-accent/50
      `}
    >
      <div className={`
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        ${isCollapsed ? 'w-full' : 'w-auto'}
      `}>
        <item.icon className={`
          transition-all duration-200
          ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
        `} />
      </div>
      <span className={`
        ml-4 transition-all duration-200 whitespace-nowrap
        ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
      `}>
        {item.label}
      </span>

      {isCollapsed && hoveredItem === item.path && (
        <div
          role="tooltip"
          className={`
            absolute left-full ml-2 px-3 py-2 bg-dark-secondary
            rounded-md text-dark-text-primary text-sm whitespace-nowrap
            shadow-lg border border-dark-border z-50
            animate-fadeIn
          `}
        >
          {item.label}
        </div>
      )}
    </Link>
  );

  const renderSettingsMenuItem = (item: SettingsMenuItem) => (
    <div key={item.path}>
      <button
        onClick={() => setExpandedSettings(!expandedSettings)}
        className={`
          w-full flex items-center px-4 py-3 rounded-lg
          text-dark-text-secondary hover:bg-dark-accent/10 hover:text-dark-text-primary
          transition-all duration-200 group relative
          ${location.pathname.startsWith(item.path) ? 'bg-dark-accent/10' : ''}
        `}
      >
        <div className={`
          flex items-center justify-center
          transition-all duration-200 ease-in-out
          ${isCollapsed ? 'w-full' : 'w-5 h-5'}
        `}>
          <item.icon className={`
            transition-all duration-200
            ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
          `} />
        </div>
        {!isCollapsed && <div className="flex items-center justify-between flex-1 ml-4">
          <span>{item.label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              expandedSettings ? 'rotate-180' : ''
            }`}
          />
        </div>}
      </button>
      
      {!isCollapsed && expandedSettings && item.children && (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => renderMenuItem(child, true))}
        </div>
      )}
    </div>
  );

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={`
        fixed left-0 top-0 h-screen bg-dark-secondary border-r border-dark-border
        transition-all duration-200 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isTransitioning ? 'overflow-hidden' : ''}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-8 bg-dark-accent text-white p-1 rounded-full shadow-lg 
          hover:bg-dark-accent/90 focus:outline-none focus:ring-2 focus:ring-dark-accent/50 
          transition-transform duration-200 ease-in-out"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div 
        className="flex items-center justify-center h-16 border-b border-dark-border"
        role="banner"
      >
        <span className={`
          text-xl font-bold text-dark-accent transition-all duration-200
          ${isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
        `}>
          Dined In
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-8">
        <ul className="space-y-2 px-4" role="menu">
          {mainMenuItems.map((item) => (
            <li key={item.path} role="menuitem">
              {renderMenuItem(item)}
            </li>
          ))}
          
          {/* Settings Section */}
          <li role="menuitem" className="mt-4">
            {settingsMenuItems.map(renderSettingsMenuItem)}
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="absolute bottom-0 w-full border-t border-dark-border bg-dark-secondary">
        <div className="p-4">
          {/* Account Switcher */}
          <div className="relative mb-2">
            <button
              aria-label="Switch account"
              aria-expanded={isAccountsOpen}
              aria-haspopup="listbox"
              onClick={() => setIsAccountsOpen(!isAccountsOpen)}
              className={`
                w-full flex items-center px-4 py-3 rounded-lg
                hover:bg-dark-accent/10 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-dark-accent/50
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <div className="w-8 h-8 rounded-full bg-dark-accent/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-dark-accent" />
              </div>
              {!isCollapsed && (
                <div className="ml-4 flex-1 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-sm font-medium text-dark-text-primary truncate max-w-[150px]">
                      {isLoading ? 'Loading...' : selectedAccount?.name}
                    </div>
                    <div className="text-xs text-dark-text-secondary">
                      {isLoading ? '' : selectedAccount?.role}
                    </div>
                  </div>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-dark-text-muted" />
                  ) : (
                    <ChevronDown className={`
                      w-4 h-4 text-dark-text-muted transition-transform duration-200
                      ${isAccountsOpen ? 'rotate-180' : ''}
                    `} />
                  )}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {!isCollapsed && isAccountsOpen && (
              <div
                className="absolute bottom-full left-0 w-full mb-1 bg-dark-secondary border 
                  border-dark-border rounded-lg shadow-dark-lg overflow-hidden"
                role="listbox"
                aria-label="Select account"
              >
                {accounts.length === 0 && !isLoading ? (
                  <div className="px-4 py-3 text-sm text-dark-text-secondary">
                    No accounts found
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        role="option"
                        aria-selected={selectedAccount?.id === account.id ? true : false}
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsAccountsOpen(false);
                        }}
                        className={`
                          w-full flex items-center px-4 py-2 text-left
                          hover:bg-dark-accent/10 transition-colors duration-200
                          ${selectedAccount?.id === account.id ? 'bg-dark-accent/5' : ''}
                        `}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-dark-text-primary truncate">
                            {account.name}
                          </div>
                          <div className="text-xs text-dark-text-secondary">
                            {account.role}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            aria-label="View profile"
            className={`
              w-full flex items-center px-4 py-3 rounded-lg
              hover:bg-dark-accent/10 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-dark-accent/50
              ${isCollapsed ? 'justify-center' : ''}
            `}
            onClick={() => navigate('/dashboard/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-dark-accent/20 flex items-center justify-center">
              <User className="w-5 h-5 text-dark-accent" />
            </div>
            <div className={`
              ml-4 transition-all duration-200 text-left
              ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
            `}>
              <div className="text-sm font-medium text-dark-text-primary">
                
              </div>
              <div className="text-xs text-dark-text-secondary">View Profile</div>
            </div>
          </button>

          <button
            aria-label="Sign out"
            onClick={handleSignOut}
            className={`
              w-full flex items-center px-4 py-3 rounded-lg mt-2
              text-red-400 hover:bg-red-400/10 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-red-400/50
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            <span className={`
              ml-4 transition-all duration-200
              ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
            `}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};