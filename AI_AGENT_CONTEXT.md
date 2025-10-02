# AI Agent Context Guide - Care Support HR Platform

## 🎯 Project Overview
This is a Next.js 14.2.5 care coordination platform with three distinct transformation layers:
1. **Original HR Template** - Base AlignUI template
2. **Care Support HR Platform** - Current production system
3. **CareSupport OS** - Desktop command center transformation

## 🏗️ Architecture Context

### Technology Stack
- **Framework**: Next.js 14.2.5 with App Router
- **Language**: TypeScript (strict mode)  
- **Styling**: Tailwind CSS with custom design system
- **UI**: Radix UI primitives + custom components
- **State**: Jotai atoms + React Context
- **Icons**: Remix Icons
- **Charts**: Recharts
- **Animations**: Framer Motion

### Key Design Principles
1. **Eliminate Redundancy**: Build from first principles, avoid duplicate functionality
2. **Consistency**: Unified UI components across all features  
3. **Accessibility**: WCAG-compliant with full keyboard navigation
4. **Progressive Disclosure**: Smart step-by-step flows based on user choices

## 📁 Critical File Structure

### Core Components (Always Reference)
```
components/
├── big-calendar.tsx              # Main calendar with drag & drop
├── unified-request-form.tsx      # 3-step request creation wizard  
├── care-event-dialog.tsx        # Event creation/editing modal
├── recurring-pattern-selector.tsx # Recurring event patterns
└── ui/                          # Reusable UI primitives
```

### Key Pages (User Flows)
```
app/(main)/
├── calendar/                    # Advanced scheduling system
├── teams/                       # Team management with inline wizards
├── settings/                    # Comprehensive settings pages
└── onboarding-caresupport/      # Complete onboarding flow
```

### State Management
- **Jotai Atoms**: Global state (onboarding, user preferences)
- **React Context**: Care events, permissions, team data
- **Local State**: Component-specific state with useState

## 🔧 Development Patterns

### Component Architecture
```typescript
// Always follow this pattern for new components
interface ComponentProps {
  // Strongly typed props
  onAction?: (data: ActionData) => void;
  className?: string;
}

export const ComponentName = ({ onAction, className }: ComponentProps) => {
  // 1. State management
  // 2. Event handlers  
  // 3. Render logic
  // 4. Accessibility attributes
};
```

### Form Validation Pattern
```typescript
// Always implement real-time validation
const [errors, setErrors] = useState<Record<string, string>>({});

const validateField = (field: string, value: string) => {
  // Validation logic
  setErrors(prev => ({ ...prev, [field]: error }));
};
```

### Accessibility Requirements
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: WCAG AA compliance

## 🎨 Design System Rules

### Color Palette
- **Primary**: Blue tones for interactive elements
- **Success**: Green for positive actions  
- **Warning**: Yellow for caution
- **Error**: Red for destructive actions
- **Background**: White and light gray variations

### Spacing System
- Use Tailwind spacing scale: `space-1` through `space-8`
- Consistent padding: `p-4` for containers, `p-2` for elements
- Margin patterns: `mb-4` for sections, `mb-2` for elements

### Typography
- **Headings**: `text-xl`, `text-lg`, `text-base` with `font-semibold`
- **Body**: `text-sm` for regular text, `text-xs` for labels
- **Code**: `font-mono` for technical content

## 🔄 Common Workflows

### Adding New Care Responsibilities
1. Update `care-responsibilities-selector.tsx`
2. Add to appropriate category in the data structure
3. Ensure proper validation and error handling
4. Test keyboard navigation and screen reader support

### Creating New Calendar Features  
1. Extend `big-calendar.tsx` component
2. Update event data types in `types/care-events.ts`
3. Implement drag & drop if needed
4. Add proper accessibility attributes

### Building New Onboarding Steps
1. Create step component in `app/onboarding-caresupport/steps/`
2. Update step navigation logic
3. Implement conditional routing based on user choices
4. Add validation and error states

## 🧪 Testing Requirements

### Before Any Commit
1. **Linter**: Run `npm run lint` - must pass with no errors
2. **Type Check**: TypeScript compilation must succeed
3. **Browser Test**: Manual testing in Chrome/Firefox
4. **Keyboard Test**: Full keyboard navigation works
5. **Screen Reader**: Test with VoiceOver/NVDA

### Component Testing Checklist
- [ ] Props are properly typed
- [ ] Error states are handled gracefully  
- [ ] Loading states provide feedback
- [ ] Accessibility attributes are present
- [ ] Responsive design works on mobile/desktop

## 🚨 Common Pitfalls to Avoid

### State Management
- ❌ Don't use useState for global state
- ✅ Use Jotai atoms for shared state
- ✅ Use React Context for component trees

### Component Design  
- ❌ Don't create duplicate functionality
- ✅ Reuse existing UI components
- ✅ Follow established patterns

### Accessibility
- ❌ Don't skip keyboard navigation
- ✅ Test with screen readers
- ✅ Ensure proper focus management

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production  
npm run lint         # Run ESLint
npm run format:write # Format code with Prettier

# Testing
node test-onboarding-e2e.js    # Run E2E tests
cat test-onboarding-manual.md  # Manual testing guide
```

## 📊 Performance Expectations

- **First Load**: < 2 seconds
- **Navigation**: < 500ms  
- **Event Creation**: < 1 second
- **Calendar Rendering**: < 300ms
- **Lighthouse Score**: 90+ across all categories

## 🎯 Current Focus Areas

### Phase 1.1 ✅ Complete
- Event interaction and management
- Drag & drop rescheduling
- CRUD operations

### Phase 1.2 ✅ Complete  
- Complete onboarding system
- Progressive disclosure
- Role-based configuration

### Phase 1.3 ✅ Complete
- Design system consistency
- Component reusability
- Responsive improvements

### Next Priorities
- Advanced calendar features (time zones, conflicts)
- Backend integration (database, auth)
- Mobile app development

## 🤝 Collaboration Guidelines

### Code Reviews
- Focus on accessibility and user experience
- Ensure consistent design patterns
- Verify performance implications
- Check for proper error handling

### Documentation
- Update this context guide when adding new patterns
- Document complex business logic
- Include usage examples for new components
- Maintain architecture documentation

---

**Remember**: This platform serves real care coordinators managing complex care teams. Every feature should reduce cognitive load and improve coordination efficiency.
