import React, { useState, useMemo } from 'react';
import { 
  School, Users, DollarSign, User, Download, Edit, Eye, Plus,
  ArrowUpRight, Menu, Bell, LogOut, Shield, Home, Settings,
  FileText, Link, BarChart3, UserCheck, Search, ChevronDown,
  Calendar, TrendingUp, Activity, AlertCircle, X, Save, UserPlus,
  Building, Crown, GraduationCap, Database
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = ({ children, title, actions, activeTab, onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  // Define navigation items based on user role
  const sidebarItems = useMemo(() => {
    const baseItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
    ];

    // Role-specific navigation items
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return [
        ...baseItems,
        { id: 'schools', icon: Building, label: 'Schools Management' },
        { id: 'links', icon: Link, label: 'System Links' },
        { id: 'transactions', icon: Database, label: 'Global Transactions' },
        { id: 'analytics', icon: BarChart3, label: 'System Analytics' },
        { id: 'reports', icon: FileText, label: 'Admin Reports' },
        { id: 'settings', icon: Shield, label: 'System Settings' }
      ];
    } else if (user?.role === 'school' || user?.role === 'school_admin') {
      return [
        ...baseItems,
        { id: 'parents', icon: Users, label: 'Parents' },
        { id: 'students', icon: GraduationCap, label: 'Students' },
        { id: 'links', icon: Link, label: 'Parent-Student Links' },
        { id: 'transactions', icon: DollarSign, label: 'School Transactions' },
        { id: 'analytics', icon: TrendingUp, label: 'School Analytics' },
        { id: 'reports', icon: FileText, label: 'School Reports' },
        { id: 'settings', icon: Settings, label: 'School Settings' }
      ];
    }

    // Default fallback
    return baseItems;
  }, [user?.role]);

  // Enhanced role-based color themes with better differentiation
  const getThemeColors = () => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return {
        // Admin: Deep navy/indigo theme (corporate, authoritative)
        primary: 'slate-700',
        primaryLight: 'slate-50',
        primaryMedium: 'slate-100',
        primaryDark: 'slate-800',
        accent: 'indigo-600',
        accentLight: 'indigo-100',
        secondary: 'blue-900',
        gradient: 'from-slate-700 via-slate-800 to-blue-900',
        lightGradient: 'from-slate-50 via-blue-50 to-indigo-50',
        sidebarGradient: 'from-slate-900 to-blue-900',
        badge: 'bg-slate-100 text-slate-800 border border-slate-200',
        superAdminBadge: 'bg-indigo-100 text-indigo-900 border border-indigo-200',
        activeColor: 'slate-700',
        activeBg: 'slate-100',
        hoverBg: 'slate-50',
        iconBg: 'slate-200',
        borderColor: 'slate-200',
        textPrimary: 'slate-900',
        textSecondary: 'slate-600',
        shadowColor: 'slate-900/10'
      };
    } else if (user?.role === 'school' || user?.role === 'school_admin') {
      return {
        // School: Bright blue/cyan theme (friendly, educational)
        primary: 'blue-600',
        primaryLight: 'blue-50',
        primaryMedium: 'blue-100',
        primaryDark: 'blue-700',
        accent: 'cyan-500',
        accentLight: 'cyan-100',
        secondary: 'sky-600',
        gradient: 'from-blue-600 via-sky-600 to-cyan-500',
        lightGradient: 'from-blue-50 via-sky-50 to-cyan-50',
        sidebarGradient: 'from-blue-600 to-cyan-600',
        badge: 'bg-blue-100 text-blue-800 border border-blue-200',
        activeColor: 'blue-700',
        activeBg: 'blue-100',
        hoverBg: 'blue-50',
        iconBg: 'blue-200',
        borderColor: 'blue-200',
        textPrimary: 'blue-900',
        textSecondary: 'blue-700',
        shadowColor: 'blue-900/10'
      };
    }
    
    // Default theme
    return {
      primary: 'blue-600',
      primaryLight: 'blue-50',
      primaryMedium: 'blue-100',
      primaryDark: 'blue-700',
      accent: 'blue-500',
      gradient: 'from-blue-500 to-indigo-600',
      lightGradient: 'from-blue-50 to-indigo-50',
      badge: 'bg-blue-100 text-blue-700'
    };
  };

  const themeColors = getThemeColors();

  // Enhanced role-specific branding
  const getRoleBasedInfo = () => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return {
        defaultTitle: user?.role === 'super_admin' ? 'System Administration' : 'Admin Dashboard',
        userLabel: user?.displayName || 'Administrator',
        userRole: user?.role === 'super_admin' ? 'Super Administrator' : 'System Administrator',
        brandName: 'Admin Portal',
        brandSubtitle: 'System Management',
        roleIcon: user?.role === 'super_admin' ? Crown : Shield,
        dashboardType: 'administrative'
      };
    } else if (user?.role === 'school' || user?.role === 'school_admin') {
      return {
        defaultTitle: user?.schoolName ? `${user.schoolName} Portal` : 'School Dashboard',
        userLabel: user?.displayName || 'School Administrator',
        userRole: user?.schoolName || 'School Administrator',
        brandName: user?.schoolName || 'School Portal',
        brandSubtitle: 'Education Management',
        roleIcon: GraduationCap,
        dashboardType: 'educational'
      };
    }
    
    return {
      defaultTitle: 'Dashboard',
      userLabel: user?.displayName || 'User',
      userRole: user?.role || 'User',
      brandName: 'Portal',
      brandSubtitle: 'Management System',
      roleIcon: User,
      dashboardType: 'default'
    };
  };

  const roleInfo = getRoleBasedInfo();

  // Handle navigation with role-specific logic
  const handleNavigation = (itemId) => {
    if (onTabChange) {
      // For school users, we might need to pass additional context
      if (user?.role === 'school' || user?.role === 'school_admin') {
        onTabChange(itemId, { schoolId: user?.schoolId });
      } else {
        onTabChange(itemId);
      }
    }
  };

  // Get sidebar background based on role
  const getSidebarBackground = () => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return 'bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900';
    }
    return 'bg-white';
  };

  // Get text colors for sidebar based on role
  const getSidebarTextColors = () => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return {
        primary: 'text-white',
        secondary: 'text-slate-300',
        accent: 'text-slate-200',
        hover: 'text-white',
        active: 'text-white'
      };
    }
    return {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      accent: 'text-gray-500',
      hover: 'text-gray-900',
      active: `text-${themeColors.textPrimary}`
    };
  };

  const sidebarTextColors = getSidebarTextColors();
  const isAdminRole = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-20'} ${getSidebarBackground()} ${isAdminRole ? 'shadow-2xl' : 'shadow-lg bg-white'} border-r ${isAdminRole ? 'border-slate-700' : `border-${themeColors.borderColor}`} transition-all duration-300 ease-in-out flex flex-col relative z-10`}>
        
        {/* Enhanced Logo Section */}
        <div className={`${sidebarOpen ? 'p-6' : 'p-4'} border-b ${isAdminRole ? 'border-slate-700/50' : 'border-gray-100/80'} ${isAdminRole ? 'bg-slate-800/50' : `bg-gradient-to-r ${themeColors.lightGradient}`}`}>
          <div className={`flex items-center ${sidebarOpen ? 'gap-4' : 'justify-center'} transition-all duration-300`}>
           <div className={`${sidebarOpen ? 'w-24 h-24' : 'w-12 h-12'} rounded-xl overflow-hidden shadow-lg ${isAdminRole ? 'ring-2 ring-slate-600' : `ring-2 ring-${themeColors.primaryMedium}`} transition-all duration-300`}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-full object-cover" 
            />
          </div>

            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <roleInfo.roleIcon className={`w-4 h-4 ${sidebarTextColors.primary}`} />
                  <p className={`text-sm font-bold ${sidebarTextColors.primary} truncate`}>
                    {roleInfo.brandName}
                  </p>
                </div>
                <p className={`text-xs ${sidebarTextColors.secondary} font-medium`}>
                  {roleInfo.brandSubtitle}
                </p>
                {user?.role === 'super_admin' && (
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-semibold">SUPER ADMIN</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item, index) => (
            <div key={item.id} className="relative">
              <div
                onClick={() => handleNavigation(item.id)}
                className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-out cursor-pointer relative ${
                  activeTab === item.id
                    ? isAdminRole 
                      ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20'
                      : `bg-${themeColors.activeBg} text-${themeColors.activeColor} shadow-sm border border-${themeColors.borderColor}`
                    : isAdminRole
                      ? 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                      : `text-gray-600 hover:bg-${themeColors.hoverBg} hover:text-gray-800 border border-transparent`
                }`}
              >
                {/* Enhanced Active indicator */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full transition-all duration-300 ease-out ${
                  activeTab === item.id 
                    ? isAdminRole 
                      ? 'h-8 opacity-100 bg-gradient-to-b from-blue-400 to-cyan-400' 
                      : `h-8 opacity-100 bg-${themeColors.accent}`
                    : 'h-0 opacity-0'
                }`}></div>
                
                {/* Enhanced Icon container */}
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 ${
                  activeTab === item.id 
                    ? isAdminRole 
                      ? 'bg-white/20 text-white shadow-md' 
                      : `bg-${themeColors.iconBg} text-${themeColors.activeColor}`
                    : isAdminRole
                      ? 'text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200'
                      : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'
                }`}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                </div>
                
                {sidebarOpen && (
                  <span className={`font-semibold text-sm flex-1 text-left truncate transition-all duration-300 ${
                    activeTab === item.id 
                      ? isAdminRole ? 'text-white' : `text-${themeColors.activeColor}`
                      : isAdminRole ? 'text-slate-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                )}
                
                {!sidebarOpen && (
                  <div className={`absolute left-full ml-6 px-3 py-2 ${isAdminRole ? 'bg-slate-800 text-white' : 'bg-gray-900 text-white'} text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border ${isAdminRole ? 'border-slate-600' : 'border-gray-700'}`}>
                    {item.label}
                    <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 ${isAdminRole ? 'bg-slate-800' : 'bg-gray-900'} rotate-45`}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Enhanced User Profile Section */}
        <div className={`p-4 border-t ${isAdminRole ? 'border-slate-700/50 bg-slate-800/30' : 'border-gray-100/80'} ${!isAdminRole ? `bg-gradient-to-r ${themeColors.lightGradient}` : ''}`}>
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''} group cursor-pointer`}>
            <div className="relative">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 ${
                isAdminRole 
                  ? 'bg-gradient-to-br from-slate-600 to-blue-700 ring-2 ring-white/20' 
                  : `bg-gradient-to-br ${themeColors.gradient} ring-2 ring-white`
              }`}>
                <roleInfo.roleIcon className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 ${isAdminRole ? 'bg-emerald-400' : `bg-${themeColors.accent}`} border-2 ${isAdminRole ? 'border-slate-800' : 'border-white'} rounded-full`}></div>
            </div>
            
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${sidebarTextColors.primary} truncate`}>
                  {roleInfo.userLabel}
                </p>
                <p className={`text-xs ${sidebarTextColors.secondary} font-medium truncate`}>
                  {roleInfo.userRole}
                </p>
              </div>
            )}
            
            {!sidebarOpen && (
              <div className={`absolute left-full ml-6 px-3 py-2 ${isAdminRole ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-900 text-white border-gray-700'} text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border`}>
                {roleInfo.userLabel}
                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 ${isAdminRole ? 'bg-slate-800' : 'bg-gray-900'} rotate-45`}></div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Collapse Toggle */}
        <div className="absolute -right-3 top-8 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseDown={(e) => e.preventDefault()}
            className={`w-6 h-6 bg-white ${isAdminRole ? 'border-2 border-slate-300 hover:border-slate-400' : `border-2 border-${themeColors.primaryMedium} hover:border-${themeColors.primary}`} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 ${isAdminRole ? 'focus-visible:ring-slate-400/50' : `focus-visible:ring-${themeColors.primary}/50`}`}
          >
            <div className={`w-2 h-2 border-r-2 border-b-2 ${isAdminRole ? 'border-slate-600' : `border-${themeColors.primary}`} transform transition-transform duration-200 ${
              sidebarOpen ? 'rotate-135' : 'rotate-45'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Header */}
        <header className={`bg-white shadow-sm border-b ${isAdminRole ? 'border-slate-200' : `border-${themeColors.borderColor}`} backdrop-blur-sm`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <roleInfo.roleIcon className={`w-6 h-6 ${isAdminRole ? 'text-slate-700' : `text-${themeColors.primary}`}`} />
                <h1 className={`text-xl font-bold ${isAdminRole ? 'text-slate-900' : `text-${themeColors.textPrimary}`} tracking-tight`}>
                  {title || roleInfo.defaultTitle}
                </h1>
              </div>
              
              {/* Enhanced Role indicator badge */}
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                user?.role === 'super_admin' 
                  ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900 border border-indigo-200'
                  : isAdminRole
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : themeColors.badge
              }`}>
                {user?.role === 'super_admin' ? 'Super Admin' : 
                 user?.role === 'admin' ? 'Admin' :
                 user?.role === 'school' || user?.role === 'school_admin' ? 'School' : 'User'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {actions && (
                <div className="flex gap-3">{actions}</div>
              )}
              
              <button 
                onMouseDown={(e) => e.preventDefault()}
                className={`p-2.5 rounded-xl hover:bg-gray-50 relative transition-colors duration-200 group focus:outline-none focus-visible:ring-2 ${isAdminRole ? 'focus-visible:ring-slate-500/50' : `focus-visible:ring-${themeColors.primary}/50`}`}
              >
                <Bell className={`w-5 h-5 ${isAdminRole ? 'text-slate-600 group-hover:text-slate-900' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`} />
                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${isAdminRole ? 'bg-emerald-500' : `bg-${themeColors.accent}`} rounded-full ring-2 ring-white`}></span>
              </button>

              <button 
                onClick={logout}
                onMouseDown={(e) => e.preventDefault()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus-visible:ring-2 ${isAdminRole ? 'focus-visible:ring-slate-500/50' : `focus-visible:ring-${themeColors.primary}/50`}`}
              >
                <LogOut className={`w-4 h-4 ${isAdminRole ? 'text-slate-600 group-hover:text-slate-900' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`} />
                <span className={`text-sm ${isAdminRole ? 'text-slate-600 group-hover:text-slate-900' : 'text-gray-600 group-hover:text-gray-900'} font-semibold transition-colors`}>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Enhanced Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children || (
              <div className={`bg-white rounded-xl shadow-sm border ${isAdminRole ? 'border-slate-200' : `border-${themeColors.borderColor}`} p-8`}>
                <div className="flex items-center gap-3 mb-4">
                  <roleInfo.roleIcon className={`w-8 h-8 ${isAdminRole ? 'text-slate-600' : `text-${themeColors.primary}`}`} />
                  <h2 className={`text-xl font-bold ${isAdminRole ? 'text-slate-900' : `text-${themeColors.textPrimary}`}`}>
                    Welcome to {roleInfo.defaultTitle}
                  </h2>
                </div>
                <p className={`${isAdminRole ? 'text-slate-600' : 'text-gray-600'} mb-6`}>
                  Select a menu item from the sidebar to get started.
                </p>
                
                {(user?.role === 'school' || user?.role === 'school_admin') && user?.schoolName && (
                  <div className={`p-6 bg-gradient-to-r ${themeColors.lightGradient} rounded-lg border ${isAdminRole ? 'border-slate-200' : `border-${themeColors.borderColor}`} shadow-sm`}>
                    <div className="flex items-center gap-3 mb-2">
                      <School className={`w-5 h-5 ${themeColors.textPrimary}`} />
                      <p className={`text-lg font-bold text-${themeColors.textPrimary}`}>
                        {user.schoolName}
                      </p>
                    </div>
                    {user.schoolId && (
                      <p className={`text-sm text-${themeColors.textSecondary} font-medium`}>
                        School ID: {user.schoolId}
                      </p>
                    )}
                  </div>
                )}
                
                {(user?.role === 'admin' || user?.role === 'super_admin') && (
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-slate-700" />
                      <p className="text-lg font-bold text-slate-900">
                        System Administration
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      Manage schools, users, and system-wide settings
                    </p>
                    {user?.role === 'super_admin' && (
                      <div className="flex items-center gap-2 mt-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-semibold">Super Administrator Access</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };