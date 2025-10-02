# AI Agent Self-Verification Workflow

## 🔍 Pre-Implementation Verification

### 1. Code Analysis Checklist
Before making any changes, verify:
- [ ] **Component exists**: Check if similar functionality already exists
- [ ] **Dependencies**: Ensure all required imports are available
- [ ] **Type Safety**: Verify TypeScript types are properly defined
- [ ] **Accessibility**: Plan ARIA labels and keyboard navigation

### 2. Architecture Validation
- [ ] **State Management**: Use correct pattern (Jotai vs Context vs Local)
- [ ] **Component Hierarchy**: Follow established parent-child relationships
- [ ] **Design System**: Use existing UI components and patterns
- [ ] **Performance**: Consider impact on bundle size and runtime

## 🧪 Implementation Verification

### 1. Code Quality Checks
```bash
# Always run these commands after implementation
npm run lint                    # ESLint validation
npm run build                   # TypeScript compilation
npm run format:write           # Code formatting
```

### 2. Component Testing Protocol
```typescript
// For every new component, verify:
const ComponentTest = () => {
  // 1. Props validation
  // 2. Error boundary handling  
  // 3. Loading states
  // 4. Accessibility attributes
  // 5. Keyboard navigation
  // 6. Screen reader compatibility
};
```

### 3. Browser Testing Checklist
- [ ] **Chrome**: Full functionality works
- [ ] **Firefox**: Cross-browser compatibility
- [ ] **Mobile**: Responsive design verified
- [ ] **Keyboard**: Tab navigation works
- [ ] **Screen Reader**: VoiceOver/NVDA compatibility

## 🔄 Post-Implementation Verification

### 1. Integration Testing
```bash
# Run the development server and test
npm run dev
# Navigate to affected pages
# Test user flows end-to-end
# Verify no console errors
```

### 2. Performance Validation
- [ ] **Bundle Size**: Check for unnecessary imports
- [ ] **Runtime Performance**: Smooth interactions (60fps)
- [ ] **Memory Usage**: No memory leaks in components
- [ ] **Network Requests**: Optimize API calls

### 3. Accessibility Audit
```typescript
// Test with these tools:
// 1. Chrome DevTools Lighthouse
// 2. axe-core browser extension  
// 3. Keyboard-only navigation
// 4. Screen reader testing
```

## 🎯 Feature-Specific Verification

### Calendar Components
- [ ] **Drag & Drop**: Smooth rescheduling
- [ ] **Event Creation**: 3-step wizard works
- [ ] **Recurring Events**: Pattern generation correct
- [ ] **Time Zones**: Proper date handling
- [ ] **Overnight Events**: Midnight spanning logic

### Team Management
- [ ] **Inline Wizards**: Modal workflows function
- [ ] **Permission System**: Role-based access works
- [ ] **Care Responsibilities**: Multi-select functionality
- [ ] **Contact Management**: Form validation

### Onboarding System
- [ ] **Progressive Disclosure**: Conditional logic works
- [ ] **Step Navigation**: Back/forward functionality
- [ ] **State Persistence**: Data maintained across steps
- [ ] **Validation**: Real-time error handling

## 🚨 Error Handling Verification

### 1. Network Errors
```typescript
// Always implement proper error handling
const handleError = (error: Error) => {
  console.error('Component error:', error);
  // Show user-friendly message
  // Log to monitoring service
  // Provide recovery options
};
```

### 2. Validation Errors
```typescript
// Real-time validation feedback
const validateInput = (value: string) => {
  const errors = [];
  if (!value.trim()) errors.push('Required field');
  if (value.length < 2) errors.push('Too short');
  return errors;
};
```

### 3. Loading States
```typescript
// Always show loading feedback
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## 📊 Performance Monitoring

### 1. Bundle Analysis
```bash
# Analyze bundle size impact
npm run build
# Check for duplicate dependencies
# Verify tree shaking works
```

### 2. Runtime Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### 3. Memory Usage
- No memory leaks in components
- Proper cleanup in useEffect
- Efficient re-rendering patterns

## 🔧 Automated Verification Scripts

### 1. Pre-commit Hook
```bash
#!/bin/bash
# Run before every commit
npm run lint
npm run build
npm run test
echo "✅ All checks passed"
```

### 2. Component Validation
```typescript
// Add to each component
const ComponentValidation = {
  props: 'All props properly typed',
  accessibility: 'ARIA labels and keyboard support',
  performance: 'No unnecessary re-renders',
  errorHandling: 'Graceful error states'
};
```

### 3. Integration Testing
```bash
# Test critical user flows
node test-onboarding-e2e.js
node test-calendar-functionality.js
node test-team-management.js
```

## 🎯 Quality Gates

### Must Pass Before Merge
- [ ] **Linting**: No ESLint errors or warnings
- [ ] **TypeScript**: Compilation successful
- [ ] **Build**: Production build succeeds
- [ ] **Tests**: All automated tests pass
- [ ] **Accessibility**: Keyboard navigation works
- [ ] **Performance**: Lighthouse score > 90

### Should Pass for Production
- [ ] **Cross-browser**: Chrome, Firefox, Safari
- [ ] **Mobile**: Responsive design verified
- [ ] **Screen Reader**: VoiceOver/NVDA tested
- [ ] **Performance**: Core Web Vitals green
- [ ] **Security**: No XSS vulnerabilities

## 🚀 Continuous Improvement

### 1. Monitor Metrics
- Track bundle size over time
- Monitor performance regressions
- Analyze user interaction patterns
- Measure accessibility compliance

### 2. Refactor Opportunities
- Identify duplicate code patterns
- Optimize slow components
- Improve error handling
- Enhance user experience

### 3. Documentation Updates
- Update this verification guide
- Document new patterns
- Share learnings with team
- Improve onboarding for new developers

---

**Remember**: Self-verification is not just about catching bugs—it's about building confidence in the codebase and ensuring a great user experience for care coordinators managing complex care teams.
