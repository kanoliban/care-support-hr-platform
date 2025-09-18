# CareSupport OS - System Architecture

## 🎯 Overview

CareSupport OS is a **care coordination platform** that serves families AND their broader care network. It's built on the principle that **care coordination is fundamentally "HR for the most critical workforce"** - transforming an HR management template into a comprehensive care support system.

## 🏗️ Core Architectural Principles

### 1. **Family-Centric with Professional Integration**
- Primary users are families managing their own care
- Professional caregivers and healthcare providers are integrated as team members
- **NOT** a professional-only system - family control with professional support

### 2. **Profile-Based Multi-Tenant Architecture**
- **Care Profiles** are the primary data boundary (not user accounts)
- Each care profile represents a care coordination unit (family, care team, etc.)
- Users can have multiple roles across different care profiles
- **Profile switching** allows seamless role transitions

### 3. **Invitation-Only Onboarding**
- No open registration - controlled access only
- Invitation system supports both **links** and **codes**
- Family members invite other family members, caregivers, and professionals
- **Privacy and security** through controlled access

### 4. **Unified Interface with Permission-Based Access**
- Same interface for all users regardless of role
- **Permission-based access control** - users only see what they're authorized to see
- **Profile-scoped permissions** - same person, different permissions per profile
- **Seamless role switching** without separate interfaces

## 🏛️ System Architecture

```
CareSupport OS
├── Authentication Layer
│   ├── User Registration/Login
│   ├── Profile Selection (ProfileSwitcher)
│   └── Permission Resolution (profile-scoped)
├── Care Profile Layer (PRIMARY DATA BOUNDARY)
│   ├── Profile Creation (invitation-only)
│   ├── Member Invitation (link or code)
│   ├── Role Assignment (profile-scoped)
│   └── Permission Management (profile-scoped)
├── Care Coordination Layer
│   ├── Team Management (profile-scoped CRUD)
│   ├── Schedule Management (profile-scoped)
│   ├── Care Event Management (profile-scoped)
│   └── Communication Hub (profile-scoped)
└── Settings Layer
    ├── Profile Settings (profile-scoped)
    ├── Team Settings (profile-scoped)
    └── System Settings (global)
```

## 🔐 Permission Architecture

### **Role Hierarchy**
- **Owner**: Full control (family administrator)
- **Admin**: Management rights (family coordinator)
- **Member**: Care delivery (professional caregivers)
- **Viewer**: Read-only access (family observers)

### **Permission Scope**
- **Profile-scoped permissions** - same person, different permissions per profile
- **Contextual access** - what you can see/do depends on which profile you're in
- **Flexible role assignment** per care situation

### **Permission Types**
```typescript
interface UserPermissions {
  canManageTeam: boolean;
  canViewSensitive: boolean;
  canManageBilling: boolean;
  canDeleteProfile: boolean;
  canInviteMembers: boolean;
  canExportData: boolean;
  canManageOrganization: boolean;
  canManageIntegrations: boolean;
  canManageSecurity: boolean;
}
```

## 📊 Data Architecture

### **Data Boundaries**
- **Care Profiles** = Primary data boundary
- **User Accounts** = Authentication layer
- **Profile Data** = Care coordination data (teams, schedules, events)
- **System Data** = Global settings and configurations

### **Data Flow**
- **Profile-based data isolation** with controlled sharing
- **Cross-profile sharing** through explicit invitations/permissions
- **Family members** can access multiple profiles
- **Professional caregivers** typically access only assigned profiles

## 🚀 Onboarding Flow

### **1. Profile Creation**
- Primary family member creates initial care profile
- Sets up basic profile information and preferences
- Becomes the **Owner** of the profile

### **2. Member Invitation**
- Invites other family members via email
- Invites professional caregivers via email
- Each invitee receives **link or code** for registration

### **3. Role Assignment**
- Profile owner assigns roles to invited members
- **Role-specific permissions** are automatically configured
- **Profile-scoped access** is established

### **4. System Configuration**
- **Availability schedules** are set up
- **Care responsibilities** are assigned
- **Communication preferences** are configured
- **Integration settings** are established

## 🔄 User Experience Flow

### **Profile Switching**
- **ProfileSwitcher** in top-left corner
- Shows available profiles: "Rob's Care Team", "Luann's Care Team"
- **Seamless role transition** - same interface, different permissions
- **Contextual data** - only see data relevant to current profile

### **Permission-Based UI**
- **Sensitive information** hidden from unauthorized users
- **Action buttons** only visible to authorized users
- **Data fields** filtered based on permissions
- **Navigation items** restricted by role

## 🏢 System Boundaries

### **Team Management (CRUD Operations)**
- Add/Remove team members
- Basic contact information
- Role assignment
- Status management

### **Team Settings (Configuration)**
- Detailed permissions
- Availability schedules
- Care responsibilities
- Emergency contacts
- Care notes/instructions
- Integration settings

## 🔧 Technical Implementation

### **Frontend Architecture**
- **Next.js 14** with App Router
- **React 18** with hooks and context
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for components

### **State Management**
- **React Context** for global state
- **Profile Context** for current profile and permissions
- **Local state** for component-specific data
- **URL state** for navigation and routing

### **Component Architecture**
- **Reusable UI components** from design system
- **Permission-gated components** for access control
- **Profile-scoped components** for data isolation
- **Context-aware components** for role-based rendering

## 🎯 Key Features

### **Care Coordination**
- **Team management** with role-based permissions
- **Schedule management** with availability tracking
- **Care event management** with recurrence patterns
- **Communication hub** for team coordination

### **Profile Management**
- **Multi-profile support** for complex care situations
- **Role switching** without separate interfaces
- **Permission management** per profile
- **Invitation system** for team expansion

### **Settings & Configuration**
- **Profile-specific settings** for care preferences
- **Team settings** for member management
- **System settings** for global configurations
- **Integration settings** for external services

## 🚧 Future Considerations

### **Scalability**
- **Multi-tenant architecture** supports multiple care profiles
- **Profile-based data isolation** ensures security
- **Permission system** scales with team growth
- **Invitation system** supports team expansion

### **Integration**
- **Healthcare provider integration** for medical data
- **Insurance integration** for billing and coverage
- **Communication integration** for team coordination
- **Calendar integration** for schedule management

### **Security**
- **Profile-based access control** ensures data privacy
- **Permission-based UI** prevents unauthorized access
- **Invitation-only onboarding** maintains security
- **Role-based permissions** provide granular control

## 📝 Development Guidelines

### **Code Organization**
- **Profile-scoped components** for data isolation
- **Permission-gated components** for access control
- **Reusable components** from design system
- **Context-aware components** for role-based rendering

### **Data Management**
- **Profile-based data queries** for isolation
- **Permission-based data filtering** for security
- **Context-aware state management** for roles
- **URL-based navigation** for deep linking

### **Testing Strategy**
- **Permission-based testing** for access control
- **Profile-scoped testing** for data isolation
- **Role-based testing** for user experience
- **Integration testing** for system boundaries

---

## 🎯 Summary

CareSupport OS is designed as a **family-centric care coordination platform** with professional integration. The architecture emphasizes **profile-based data isolation**, **permission-based access control**, and **seamless role switching** to support complex care situations while maintaining security and usability.

The system is built on the principle that **care coordination is HR for the most critical workforce**, transforming traditional HR management concepts into a comprehensive care support system that serves families and their broader care network.
