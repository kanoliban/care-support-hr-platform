# CareSupport OS - Permission Architecture

## 🎯 **Overview**

The CareSupport OS implements a **multi-tenant permission architecture** similar to SaaS team products (Slack, GitHub, Notion). Instead of hardcoded roles, the system uses **profile-centric permissions** where users can have different access levels across different care profiles.

## 🏗️ **Core Architecture**

### **1. Care Profiles (Multi-Tenant Organizations)**

Each care profile represents a complete care ecosystem with its own team, permissions, and data isolation.

```
Care Profile: "Rob's Care"
├── Owner: Rob Wudlick
├── Admins: Marta Wudlick, Luann Wudlick
├── Members: Jim, Jennifer, Sarah, etc.
└── Settings: Permissions, Billing, Integrations

Care Profile: "Mom's Care"  
├── Owner: Luann Wudlick
├── Admins: Rob Wudlick, Marta Wudlick
├── Members: Different nurses, PCAs
└── Settings: Permissions, Billing, Integrations
```

### **2. Permission Levels**

#### **Owner (Profile Owner)**
- **Full access** to everything
- **Can manage** all permissions
- **Can delete** the profile
- **Can manage** billing
- **Can invite/remove** team members

#### **Admin (Family Administrator)**
- **Can manage** team members
- **Can create/edit** schedules
- **Can view** all data
- **Cannot delete** profile or manage billing
- **Can invite** new members

#### **Member (Care Provider)**
- **Can view** assigned schedules
- **Can update** their availability
- **Can log** care activities
- **Cannot manage** team or view sensitive data
- **Can view** team member contact info

#### **Viewer (Family Observer)**
- **Can view** schedules only
- **Can see** team member availability
- **Cannot make** any changes
- **Read-only** access

## 🔄 **The Chain of Possibilities**

### **Scenario 1: Rob as Profile Owner**
```
Rob logs into "Rob's Care Profile":
├── Header: "My Care Team"
├── Actions: [Add Team Member] [Manage Permissions] [Settings]
├── View: Full admin dashboard
└── Context: "People who help with my care"
```

### **Scenario 2: Marta as Family Admin**
```
Marta logs into "Rob's Care Profile":
├── Header: "Rob's Care Team"
├── Actions: [Add Team Member] [Export Schedule] [View Reports]
├── View: Admin dashboard (no billing/settings)
└── Context: "People who help with Rob's care"
```

### **Scenario 3: Jim as Care Provider**
```
Jim logs into "Rob's Care Profile":
├── Header: "Rob's Care Team"
├── Actions: [View My Schedule] [Update Availability] [Log Care]
├── View: Provider dashboard
└── Context: "Team members for Rob's care"
```

### **Scenario 4: Cross-Profile Access**
```
Marta logs into "Mom's Care Profile":
├── Header: "Mom's Care Team"
├── Actions: [Add Team Member] [Export Schedule]
├── View: Admin dashboard for Mom's care
└── Context: "People who help with Mom's care"
```

## 🚀 **The Revolutionary Insight**

### **Multi-Role Capability**

**Rob can have multiple roles across profiles:**

```
Rob's Permissions:
├── "Rob's Care" Profile: Owner (full access)
├── "Mom's Care" Profile: Admin (manage team)
├── "Community Care" Profile: Member (provide care)
└── "Neighbor's Care" Profile: Viewer (observe only)
```

### **Dynamic UI Based on Context**

```
When Rob is in "Rob's Care Profile":
├── He sees: "My Care Team"
├── He can: Manage everything
└── He feels: "This is my care"

When Rob is in "Mom's Care Profile":
├── He sees: "Mom's Care Team"
├── He can: Manage team, view schedules
└── He feels: "I'm helping with Mom's care"
```

## 💻 **Technical Implementation**

### **Permission Context Hook**

```typescript
const useCareProfileContext = () => {
  const { currentProfile, userPermissions } = useAuth();
  
  return {
    profileName: currentProfile.name,
    userRole: userPermissions.role,
    canManageTeam: userPermissions.canManageTeam,
    canViewSensitive: userPermissions.canViewSensitive,
    headerText: userRole === 'owner' ? 'My Care Team' : `${currentProfile.name}'s Care Team`,
    availableActions: getActionsForRole(userPermissions.role)
  };
};
```

### **Dynamic Component Rendering**

```typescript
const CareTeamHeader = () => {
  const { headerText, userRole, availableActions } = useCareProfileContext();
  
  return (
    <div>
      <h1>{headerText}</h1>
      <div className="actions">
        {availableActions.map(action => (
          <Button key={action.id} {...action} />
        ))}
      </div>
    </div>
  );
};
```

### **Profile Switching UX**

```typescript
const ProfileSwitcher = () => {
  const { availableProfiles, currentProfile, switchProfile } = useAuth();
  
  return (
    <Select value={currentProfile.id} onValueChange={switchProfile}>
      {availableProfiles.map(profile => (
        <SelectItem key={profile.id} value={profile.id}>
          {profile.name} ({profile.userRole})
        </SelectItem>
      ))}
    </Select>
  );
};
```

## 🗄️ **Backend Architecture**

### **Database Schema**

#### **Care Profiles Table**
```sql
CREATE TABLE care_profiles (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Profile Members Table**
```sql
CREATE TABLE profile_members (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES care_profiles(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'member', 'viewer'
  permissions JSONB, -- Granular permissions
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(profile_id, user_id)
);
```

#### **Permissions Table**
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES care_profiles(id),
  user_id UUID REFERENCES users(id),
  can_manage_team BOOLEAN DEFAULT FALSE,
  can_view_sensitive BOOLEAN DEFAULT FALSE,
  can_manage_billing BOOLEAN DEFAULT FALSE,
  can_delete_profile BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **API Endpoints**

#### **Profile Management**
```
GET    /api/profiles                    # List user's accessible profiles
POST   /api/profiles                    # Create new profile
GET    /api/profiles/:id                # Get profile details
PUT    /api/profiles/:id                # Update profile
DELETE /api/profiles/:id                # Delete profile (owner only)
```

#### **Member Management**
```
GET    /api/profiles/:id/members        # List profile members
POST   /api/profiles/:id/members        # Invite new member
PUT    /api/profiles/:id/members/:userId # Update member permissions
DELETE /api/profiles/:id/members/:userId # Remove member
```

#### **Permission Management**
```
GET    /api/profiles/:id/permissions    # Get user's permissions
PUT    /api/profiles/:id/permissions    # Update permissions
```

## 🔐 **Security & Data Isolation**

### **Profile-Level Data Isolation**

- **All data** is scoped to specific care profiles
- **API requests** must include profile context
- **Database queries** automatically filter by profile
- **Cross-profile access** is explicitly controlled

### **Permission Validation**

```typescript
const validatePermission = (profileId: string, userId: string, action: string) => {
  const userPermissions = getUserPermissions(profileId, userId);
  return userPermissions.canPerformAction(action);
};
```

### **Context-Aware Data Access**

```typescript
const getCareEvents = (profileId: string, userId: string) => {
  const permissions = getUserPermissions(profileId, userId);
  
  if (permissions.canViewSensitive) {
    return getAllCareEvents(profileId);
  } else {
    return getUserCareEvents(profileId, userId);
  }
};
```

## 🎨 **UI/UX Implications**

### **Dynamic Headers**
- **Owner**: "My Care Team"
- **Admin**: "{Profile Name}'s Care Team"
- **Member**: "{Profile Name}'s Care Team"

### **Context-Aware Actions**
- **Owner**: Full management capabilities
- **Admin**: Team management (no billing)
- **Member**: Personal schedule management
- **Viewer**: Read-only access

### **Profile Switching**
- **Dropdown** in navigation header
- **Shows role** for each profile
- **Maintains context** across switches

## 🔄 **Permission Inheritance & Conflicts**

### **Resolution Strategy**
1. **Profile-specific permissions** override global roles
2. **Owner permissions** cannot be overridden
3. **Admin permissions** can be modified by owners
4. **Member permissions** are inherited from profile defaults

### **Cross-Profile Access**
- **Users can be members** of multiple profiles
- **Permissions are isolated** per profile
- **No permission inheritance** across profiles
- **Explicit invitation** required for each profile

## 📊 **Data Models**

### **Care Profile Interface**
```typescript
interface CareProfile {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members: ProfileMember[];
  settings: ProfileSettings;
}
```

### **Profile Member Interface**
```typescript
interface ProfileMember {
  id: string;
  profileId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: UserPermissions;
  invitedBy: string;
  joinedAt: Date;
}
```

### **User Permissions Interface**
```typescript
interface UserPermissions {
  canManageTeam: boolean;
  canViewSensitive: boolean;
  canManageBilling: boolean;
  canDeleteProfile: boolean;
  canInviteMembers: boolean;
  canExportData: boolean;
}
```

## 🚀 **Implementation Phases**

### **Phase 1: Core Architecture**
1. **Database schema** implementation
2. **Basic permission system** setup
3. **Profile creation** and management
4. **Member invitation** system

### **Phase 2: Permission Engine**
1. **Permission validation** middleware
2. **Context-aware data access**
3. **Profile switching** functionality
4. **Dynamic UI rendering**

### **Phase 3: Advanced Features**
1. **Granular permissions** system
2. **Permission inheritance** rules
3. **Audit logging** for permission changes
4. **Advanced security** measures

### **Phase 4: UI/UX Polish**
1. **Profile switcher** component
2. **Permission management** interface
3. **Context-aware** navigation
4. **Responsive design** for all roles

## 🎯 **Key Benefits**

### **For Care Recipients (like Rob)**
- **Full control** over their own care
- **Can manage** their care team
- **Can help** with family members' care
- **Flexible role** based on context

### **For Family Members**
- **Appropriate access** based on relationship
- **Can manage** multiple care profiles
- **Clear boundaries** between profiles
- **Flexible permissions** as needs change

### **For Care Providers**
- **Focused access** to relevant profiles
- **Clear permissions** for each profile
- **No confusion** about access levels
- **Secure data** isolation

### **For the System**
- **Scalable architecture** for growth
- **Secure data** isolation
- **Flexible permission** system
- **Future-proof** design

## 🔮 **Future Enhancements**

### **Advanced Permission Features**
- **Time-based permissions** (temporary access)
- **Location-based permissions** (home vs. hospital)
- **Emergency permissions** (override system)
- **Audit trails** for all permission changes

### **Integration Capabilities**
- **SSO integration** with healthcare systems
- **API access** for third-party tools
- **Webhook notifications** for permission changes
- **Mobile app** support

### **Analytics & Reporting**
- **Permission usage** analytics
- **Access pattern** reporting
- **Security audit** reports
- **Compliance** monitoring

---

## 📝 **Notes**

This architecture provides a **revolutionary approach** to care coordination by:

1. **Eliminating hardcoded roles** in favor of dynamic permissions
2. **Enabling multi-profile access** for complex care situations
3. **Providing context-aware interfaces** that adapt to user permissions
4. **Ensuring data security** through profile-level isolation
5. **Supporting flexible care relationships** that evolve over time

The system is designed to be **intuitive for families** while providing **enterprise-grade security** and **scalability** for healthcare organizations.
