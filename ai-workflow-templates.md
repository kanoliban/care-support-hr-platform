# AI Workflow Templates - Care Support Platform

## 🚀 Reusable Prompt Templates

### 1. Component Development Template

```
**Task**: Create a new [COMPONENT_NAME] component for the Care Support platform.

**Context**: 
- Framework: Next.js 14.2.5 with TypeScript
- Styling: Tailwind CSS with custom design system
- UI Library: Radix UI primitives + custom components
- State: Jotai atoms for global state, React Context for component trees

**Requirements**:
- [SPECIFIC_REQUIREMENTS]
- Follow established patterns in components/ui/
- Implement proper TypeScript interfaces
- Include accessibility attributes (ARIA labels, keyboard navigation)
- Use existing design system colors and spacing
- Handle loading and error states gracefully

**Verification Steps**:
1. Run `npm run lint` - must pass with no errors
2. Run `npm run build` - TypeScript compilation must succeed  
3. Test in browser - verify functionality works
4. Test keyboard navigation - ensure full accessibility
5. Check responsive design - mobile and desktop views

**Files to Reference**:
- components/ui/ for base components
- components/big-calendar.tsx for complex component patterns
- lib/careContext.tsx for state management patterns
```

### 2. Feature Enhancement Template

```
**Task**: Enhance [FEATURE_NAME] with [SPECIFIC_ENHANCEMENT].

**Current State**: [DESCRIBE_CURRENT_IMPLEMENTATION]
**Target State**: [DESCRIBE_DESIRED_OUTCOME]

**Technical Requirements**:
- Maintain backward compatibility
- Follow existing architecture patterns
- Preserve accessibility features
- Optimize for performance
- Include proper error handling

**Implementation Plan**:
1. Analyze current implementation in [FILE_PATH]
2. Identify required changes without breaking existing functionality
3. Implement enhancement with proper TypeScript types
4. Add comprehensive error handling and loading states
5. Test all user flows to ensure no regressions

**Verification Checklist**:
- [ ] Existing functionality still works
- [ ] New enhancement functions correctly
- [ ] No performance regressions
- [ ] Accessibility maintained
- [ ] Code quality standards met
```

### 3. Bug Fix Template

```
**Task**: Fix [BUG_DESCRIPTION] in [COMPONENT/FEATURE].

**Bug Details**:
- **Location**: [FILE_PATH]
- **Symptoms**: [WHAT_USER_SEES]
- **Expected Behavior**: [WHAT_SHOULD_HAPPEN]
- **Reproduction Steps**: [HOW_TO_REPRODUCE]

**Investigation Steps**:
1. Analyze the problematic code in [FILE_PATH]
2. Identify root cause of the issue
3. Check for similar issues in related components
4. Verify the fix doesn't introduce new problems

**Fix Requirements**:
- Address root cause, not just symptoms
- Maintain existing functionality
- Include proper error handling
- Add tests if applicable
- Document the fix

**Verification**:
- [ ] Bug is resolved
- [ ] No new issues introduced
- [ ] Related functionality still works
- [ ] Performance not impacted
```

## 🔄 Background Agent Workflows

### 1. Code Quality Agent

**Prompt**: 
```
Act as a code quality agent for the Care Support platform. Your job is to:

1. **Analyze** the current codebase for quality issues
2. **Identify** patterns that could be improved
3. **Suggest** specific refactoring opportunities
4. **Prioritize** improvements by impact and effort

Focus on:
- TypeScript type safety improvements
- Component reusability opportunities  
- Performance optimization potential
- Accessibility enhancements
- Code consistency issues

Provide specific file paths and line numbers for issues found.
```

### 2. Performance Agent

**Prompt**:
```
Act as a performance optimization agent. Analyze the Care Support platform for:

1. **Bundle Size**: Identify large dependencies or unused imports
2. **Runtime Performance**: Find slow components or inefficient patterns
3. **Memory Usage**: Check for potential memory leaks
4. **Network Requests**: Optimize API calls and data fetching

Provide specific recommendations with:
- File paths and line numbers
- Before/after metrics where possible
- Implementation priority
- Risk assessment for changes
```

### 3. Accessibility Agent

**Prompt**:
```
Act as an accessibility specialist for the Care Support platform. Audit the codebase for:

1. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
2. **Screen Reader Support**: Verify proper ARIA labels and descriptions
3. **Color Contrast**: Check WCAG AA compliance
4. **Focus Management**: Ensure logical tab order and focus indicators

Provide specific fixes with:
- Component names and file paths
- Exact code changes needed
- Testing instructions
- Priority levels for fixes
```

## 🎯 Specialized Workflows

### 1. Calendar Enhancement Workflow

```
**Context**: Working on the calendar system (components/big-calendar.tsx)

**Common Tasks**:
- Add new event types
- Implement new recurring patterns  
- Enhance drag & drop functionality
- Add time zone support
- Improve event consolidation logic

**Verification Steps**:
1. Test drag & drop rescheduling
2. Verify recurring event generation
3. Check overnight event handling
4. Validate keyboard navigation
5. Test mobile responsiveness

**Key Files**:
- components/big-calendar.tsx
- components/recurring-pattern-selector.tsx
- types/care-events.ts
```

### 2. Team Management Workflow

```
**Context**: Working on team management (app/(main)/teams/)

**Common Tasks**:
- Add new team member fields
- Implement new permission levels
- Enhance care responsibility tracking
- Improve inline wizard functionality
- Add team member search/filtering

**Verification Steps**:
1. Test inline wizard flows
2. Verify permission system works
3. Check care responsibility assignment
4. Validate form validation
5. Test keyboard navigation

**Key Files**:
- app/(main)/teams/
- components/unified-request-form.tsx
- lib/permissionContext.tsx
```

### 3. Onboarding Enhancement Workflow

```
**Context**: Working on onboarding system (app/onboarding-caresupport/)

**Common Tasks**:
- Add new onboarding steps
- Implement conditional logic
- Enhance step validation
- Improve user experience
- Add new role-based paths

**Verification Steps**:
1. Test complete onboarding flow
2. Verify conditional logic works
3. Check step navigation
4. Validate state persistence
5. Test keyboard accessibility

**Key Files**:
- app/onboarding-caresupport/steps/
- lib/careContext.tsx
- hooks/use-tab-observer.ts
```

## 🔧 Command Templates

### 1. Development Commands

```bash
# Start development with full context
cd /Users/libankano/care-support-hr-platform && npm run dev

# Run quality checks
npm run lint && npm run build && npm run format:write

# Test specific functionality
node test-onboarding-e2e.js
node test-calendar-functionality.js
```

### 2. Component Creation Commands

```bash
# Create new component with proper structure
mkdir -p components/[component-name]
touch components/[component-name]/index.tsx
touch components/[component-name]/types.ts
touch components/[component-name]/styles.ts
```

### 3. Testing Commands

```bash
# Run comprehensive tests
npm run lint
npm run build  
npm run format:write
npm run dev
# Then manually test in browser
```

## 📊 Parallel Agent Coordination

### 1. Feature Development Team

**Agent 1 - Component Specialist**:
- Focus: UI components and user interface
- Scope: components/ directory
- Deliverables: Reusable components with proper TypeScript

**Agent 2 - Integration Specialist**:  
- Focus: Page integration and routing
- Scope: app/ directory
- Deliverables: Working pages with proper navigation

**Agent 3 - State Specialist**:
- Focus: State management and data flow
- Scope: lib/ and hooks/ directories  
- Deliverables: Proper state management patterns

### 2. Quality Assurance Team

**Agent 1 - Code Quality**:
- Focus: Linting, formatting, TypeScript
- Scope: Entire codebase
- Deliverables: Clean, consistent code

**Agent 2 - Testing**:
- Focus: Manual testing and verification
- Scope: User flows and functionality
- Deliverables: Tested features with no regressions

**Agent 3 - Performance**:
- Focus: Bundle size, runtime performance
- Scope: Performance-critical components
- Deliverables: Optimized, fast-loading features

## 🎯 Success Metrics

### Code Quality Metrics
- **Linting**: 0 errors, 0 warnings
- **TypeScript**: 100% type coverage
- **Build**: Successful compilation
- **Performance**: Lighthouse score > 90

### User Experience Metrics  
- **Accessibility**: Full keyboard navigation
- **Responsiveness**: Works on all screen sizes
- **Performance**: < 2s first load, < 500ms navigation
- **Functionality**: All user flows work correctly

### Development Metrics
- **Reusability**: Components follow DRY principles
- **Maintainability**: Clear, documented code
- **Consistency**: Follows established patterns
- **Scalability**: Architecture supports growth

---

**Remember**: These templates are designed to help AI agents work more effectively on the Care Support platform. Each template provides the context, requirements, and verification steps needed for successful implementation.
