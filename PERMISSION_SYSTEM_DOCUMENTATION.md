# CareSupport OS Permission System Documentation

## 🎯 Overview

The CareSupport OS implements a comprehensive permission architecture that enables multi-tenant care coordination with role-based access control. This system allows users to have different permission levels across multiple care profiles while maintaining precise UI consistency.

## 🏗️ Architecture

### Core Components

1. **SimplePermissionProvider** (`lib/simple-permission-context.tsx`)
   - Manages current care profile and user permissions
   - Provides context to entire application
   - Handles profile switching and permission calculations

2. **PermissionGate** (`components/permission-gate.tsx`)
   - Flexible component for conditional rendering
   - Supports both role-based and permission-based access control
   - Provides convenience components for common patterns

3. **ProfileSwitcher** (`components/profile-switcher.tsx`)
   - UI component for switching between care profiles
   - Displays current profile with avatar and context
   - Integrated into sidebar navigation

## 🔐 Permission Matrix

### User Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Owner** | Full access to care profile | All permissions enabled |
| **Admin** | Administrative access with limitations | Most permissions, no security management |
| **Member** | Limited access for care team members | Basic viewing, no management |
| **Viewer** | Read-only access | View-only permissions |

### Permission Types

```typescript
interface UserPermissions {
  canManageTeam: boolean;           // Add/remove care team members
  canViewSensitive: boolean;        // Access sensitive information
  canManageBilling: boolean;        // Manage billing and payments
  canDeleteProfile: boolean;        // Delete entire care profile
  canInviteMembers: boolean;        // Invite new team members
  canExportData: boolean;           // Export care data
  canManageOrganization: boolean;   // Manage organization settings
  canManageIntegrations: boolean;   // Manage care connections
  canManageSecurity: boolean;       // Manage security settings
}
```

### Settings Access Matrix

| Setting Section | Owner | Admin | Member | Viewer |
|-----------------|-------|-------|--------|--------|
| **General Settings** | ✅ | ✅ | ✅ | ✅ |
| **Profile Settings** | ✅ | ✅ | ✅ | ✅ |
| **Organization Settings** | ✅ | ✅ | ❌ | ❌ |
| **Notification Settings** | ✅ | ✅ | ✅ | ✅ |
| **Privacy & Security** | ✅ | ❌ | ❌ | ❌ |
| **Care Connections** | ✅ | ✅ | ❌ | ❌ |

### Tab-Level Permissions

#### Profile Settings Tabs
- **Profile Settings**: Public access
- **Contact Information**: Public access
- **Social Links**: Public access
- **Export Data**: Requires `canExportData`

#### Organization Settings Tabs
- **Organization Settings**: Requires `canManageOrganization`
- **Contact Information**: Requires `canManageOrganization`
- **Social Links**: Requires `canManageOrganization`
- **Export Data**: Requires `canExportData`

#### Privacy & Security Tabs
- **Change Password**: Public access (personal)
- **2FA Security**: Public access (personal)
- **Active Sessions**: Requires `canManageSecurity`
- **Delete Account**: Requires `canManageSecurity`

#### Care Connections Tabs
- **Integrations**: Requires `canManageIntegrations`
- **Upcoming**: Requires `canManageIntegrations`
- **Make a Suggestion**: Public access (feature requests)

## 🎨 UI Implementation

### Permission-Aware Navigation

The settings layout automatically filters navigation items based on user permissions:

```typescript
// Filter items based on user permissions
const items = allItems.filter(item => {
  if (!item.permission) return true; // Public access
  return userPermissions && userPermissions[item.permission as keyof typeof userPermissions];
});
```

### Dynamic Content

Headers and descriptions adapt based on the current care profile:

```typescript
const getHeaderTitle = () => {
  if (!currentProfile) return 'Care Settings';
  return `${currentProfile.name} Settings`;
};
```

### Component-Level Gating

Individual components use PermissionGate for fine-grained control:

```tsx
<CanExportData>
  <Button.Root mode='stroke' className='mt-1 w-full'>
    <Button.Icon as={RiShareForwardBoxLine} />
    Export
  </Button.Root>
</CanExportData>
```

## 🔧 Technical Implementation

### Context Usage

```typescript
import { useSimplePermissions } from '@/lib/simple-permission-context';

function MyComponent() {
  const { currentProfile, userPermissions, availableProfiles, switchProfile } = useSimplePermissions();
  
  // Use permissions for conditional rendering
  if (userPermissions?.canManageTeam) {
    // Show team management UI
  }
}
```

### Permission Checking Patterns

#### 1. Component-Level Gating
```tsx
import { PermissionGate } from '@/components/permission-gate';

<PermissionGate permission="canManageTeam">
  <TeamManagementUI />
</PermissionGate>
```

#### 2. Role-Based Access
```tsx
<PermissionGate role="owner">
  <OwnerOnlyFeatures />
</PermissionGate>
```

#### 3. Convenience Components
```tsx
import { CanManageOrganization, OwnerOnly } from '@/components/permission-gate';

<CanManageOrganization>
  <OrganizationSettings />
</CanManageOrganization>

<OwnerOnly>
  <BillingSettings />
</OwnerOnly>
```

### Mock Data Structure

```typescript
const mockProfiles: CareProfile[] = [
  {
    id: 'robs-care-team',
    name: "Rob's Care Team",
    subtitle: "Primary Care Coordination",
    userRole: 'owner',
    avatar: '/images/avatar/illustration/james.png'
  },
  {
    id: 'luanns-care-team',
    name: "Luann's Care Team",
    subtitle: "Family Care Support",
    userRole: 'admin',
    avatar: '/images/avatar/illustration/sophia.png'
  }
];
```

## 🚀 Usage Examples

### Adding New Permission

1. **Update Permission Interface**
```typescript
interface UserPermissions {
  // ... existing permissions
  canManageNewFeature: boolean;
}
```

2. **Update Role Definitions**
```typescript
case 'owner':
  return {
    // ... existing permissions
    canManageNewFeature: true,
  };
```

3. **Create Convenience Component**
```tsx
export function CanManageNewFeature({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGate permission="canManageNewFeature" fallback={fallback}>{children}</PermissionGate>;
}
```

4. **Use in Components**
```tsx
<CanManageNewFeature>
  <NewFeatureUI />
</CanManageNewFeature>
```

### Adding New Settings Section

1. **Define Permission Requirements**
```typescript
const newSettingsItem = {
  label: 'New Settings',
  href: '/settings/new-settings',
  permission: 'canManageNewFeature',
  role: null,
};
```

2. **Create Permission-Aware Page**
```typescript
export default function PageNewSettings() {
  const { userPermissions } = useSimplePermissions();
  
  const tabs = allTabs.filter(tab => {
    return userPermissions && userPermissions[tab.permission as keyof typeof userPermissions];
  });
  
  // ... rest of component
}
```

## 🔒 Security Considerations

### Client-Side vs Server-Side

**Important**: This implementation provides client-side permission filtering for UI/UX purposes. In production, all permission checks must be duplicated on the server-side for security.

### Best Practices

1. **Defense in Depth**: Never rely solely on client-side permission checks
2. **API Security**: Implement server-side permission validation for all API endpoints
3. **Data Filtering**: Filter data based on user permissions at the database level
4. **Audit Logging**: Log all permission-sensitive operations

### Production Checklist

- [ ] Implement server-side permission validation
- [ ] Add database-level permission filtering
- [ ] Set up audit logging for sensitive operations
- [ ] Configure proper CORS and authentication
- [ ] Implement rate limiting for sensitive endpoints
- [ ] Add comprehensive error handling

## 🧪 Testing

### Permission Testing Strategy

1. **Unit Tests**: Test permission logic in isolation
2. **Integration Tests**: Test permission-aware components
3. **E2E Tests**: Test complete user flows with different roles
4. **Security Tests**: Verify server-side permission enforcement

### Test Scenarios

```typescript
// Example test scenarios
describe('Permission System', () => {
  it('should show organization settings for owners', () => {
    // Test owner access
  });
  
  it('should hide organization settings for members', () => {
    // Test member restrictions
  });
  
  it('should allow profile switching', () => {
    // Test profile switching functionality
  });
});
```

## 📈 Future Enhancements

### Planned Features

1. **Dynamic Permissions**: Runtime permission updates without page refresh
2. **Permission Inheritance**: Hierarchical permission structures
3. **Time-Based Permissions**: Temporary permission grants
4. **Audit Dashboard**: Permission usage analytics
5. **Bulk Permission Management**: Batch permission updates

### Scalability Considerations

1. **Permission Caching**: Cache permission calculations for performance
2. **Lazy Loading**: Load permissions on-demand for large teams
3. **Database Optimization**: Optimize permission queries for scale
4. **CDN Integration**: Cache permission-aware UI components

## 🎯 Conclusion

The CareSupport OS permission system provides a robust foundation for multi-tenant care coordination. By combining flexible permission models with precise UI consistency, it enables seamless collaboration while maintaining security and usability.

The system is designed to scale with growing care teams and evolving requirements, providing a solid foundation for the future of care coordination technology.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: CareSupport OS Development Team
