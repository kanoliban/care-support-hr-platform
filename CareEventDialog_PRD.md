# Care Event Creation - Product Requirements Document

## 1. Product Overview

### 1.1 Purpose
The Care Event Creation feature enables care coordinators to quickly schedule and manage care activities through an intuitive dialog interface accessible from multiple locations within the CareSupport OS.

### 1.2 Success Metrics
- **Speed**: Users can create a care event in under 60 seconds
- **Accuracy**: 95% of events are created with complete information on first attempt
- **Adoption**: 80% of care coordinators use the feature within 2 weeks of deployment
- **Satisfaction**: 4.5+ user satisfaction score for event creation workflow

## 2. User Stories

### 2.1 Primary User Story
**As a** care coordinator  
**I want to** quickly create care events from multiple locations in the system  
**So that** I can efficiently schedule care activities without navigating through complex forms

### 2.2 Secondary User Stories
- **As a** care coordinator, **I want to** select multiple caregivers for a single event **so that** I can coordinate team-based care
- **As a** care coordinator, **I want to** see real-time feedback when events are created **so that** I know my actions were successful
- **As a** care coordinator, **I want to** use familiar UI patterns **so that** I don't need to learn new interfaces

## 3. Functional Requirements

### 3.1 Access Points
- **Calendar Page**: "Create Request" button in header
- **Dashboard**: "Create Request" button in Care Command Center header
- **Future**: Time slot clicks on calendar grid (Phase 2)

### 3.2 Core Features

#### 3.2.1 Event Creation Dialog
- **Trigger**: Click "Create Request" button
- **Behavior**: Modal dialog opens with current date/time pre-filled
- **Size**: Compact, wider layout (max-width: 32rem) to avoid screen overflow
- **Positioning**: Centered overlay with backdrop

#### 3.2.2 Form Fields
| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| Title | Text input | Yes | Empty | Min 1 character |
| Event Type | Button selection | Yes | "Care Shift" | Must select one |
| Date | Date picker | Yes | Current date | Valid date |
| Start Time | Time picker | Yes | Current time | Valid time format |
| End Time | Time picker | Yes | Start time + 1 hour | After start time |
| Care Recipient | Dropdown | No | Empty | Valid selection |
| Team Members | Multi-select grid | No | Empty | 0-10 selections |
| Location | Dropdown + Custom | No | Empty | Valid selection or text |
| Description | Textarea | No | Empty | Max 500 characters |

#### 3.2.3 Event Types
- **Care Shift**: Standard caregiving activities
- **Appointment**: Medical or therapy appointments
- *Future types*: Coverage Gap, Training, Availability (Phase 2)

#### 3.2.4 Team Member Selection
- **Interface**: 3-column button grid (matches existing "Current Shift" UI)
- **Behavior**: Toggle selection with visual feedback
- **Visual States**: 
  - Unselected: White background, gray border
  - Selected: Primary color background, darker text
  - Hover: Light gray background
- **Count Display**: "Team Members (X selected)" in label
- **Max Selections**: 10 caregivers per event

#### 3.2.5 Time Management
- **Date Selection**: Native date picker
- **Time Selection**: Separate start/end time inputs
- **Duration Logic**: End time auto-adjusts when start time changes
- **Validation**: End time must be after start time

#### 3.2.6 Location Handling
- **Predefined Options**: Home, Medical Center, Rehabilitation Center
- **Custom Option**: "Other" with text input field
- **Validation**: Required if "Other" selected

### 3.3 User Experience Features

#### 3.3.1 Visual Design
- **Design System**: Consistent with existing CareSupport UI
- **Typography**: 
  - Headers: `text-label-md`
  - Labels: `text-subheading-xs` (uppercase, tracked)
  - Input text: `text-label-sm`
- **Colors**: Primary palette with proper contrast
- **Spacing**: Consistent 4-unit spacing system
- **Corner Radius**: `rounded-lg` for inputs, `rounded-2xl` for dialog

#### 3.3.2 Interactions
- **Auto-focus**: Title field receives focus on open
- **Keyboard Navigation**: Tab order through all fields
- **Escape Key**: Closes dialog (cancel action)
- **Enter Key**: Submits form when in title field

#### 3.3.3 Feedback & Validation
- **Real-time Validation**: Title field validates on blur
- **Loading States**: Button shows "Creating..." during submission
- **Success Feedback**: Toast notification on successful creation
- **Error Handling**: Alert dialog for validation errors

### 3.4 Data Integration

#### 3.4.1 Data Sources
- **Care Recipients**: Mock data (Phase 1), API integration (Phase 2)
- **Team Members**: Mock data (Phase 1), live team data (Phase 2)
- **Locations**: Predefined list with custom option

#### 3.4.2 Data Persistence
- **Storage**: CareEventsContext for global state management
- **Events**: Stored in memory (Phase 1), database integration (Phase 2)
- **Notifications**: Real-time notification system for event updates

## 4. Technical Requirements

### 4.1 Architecture
- **Framework**: React with Next.js 14
- **State Management**: React Context API (CareEventsProvider)
- **UI Components**: AlignUI design system
- **Styling**: Tailwind CSS with custom design tokens

### 4.2 Component Structure
```
CareEventDialog
├── Header (Title + Close button)
├── Form Fields
│   ├── Title Input
│   ├── Event Type Buttons
│   ├── Date/Time Grid
│   ├── Care Recipient Dropdown
│   ├── Team Members Grid
│   ├── Location Dropdown + Custom
│   └── Description Textarea
└── Footer (Cancel + Create buttons)
```

### 4.3 Integration Points
- **BigCalendar**: Receives events for display
- **CareEventsProvider**: Global state management
- **CareNotifications**: Real-time feedback system
- **CreateRequestButton**: Trigger component

### 4.4 Performance Requirements
- **Dialog Open**: < 200ms
- **Form Submission**: < 2s
- **Bundle Size**: < 50KB additional

## 5. Non-Functional Requirements

### 5.1 Usability
- **Learning Curve**: < 5 minutes for new users
- **Error Rate**: < 5% incomplete submissions
- **Accessibility**: WCAG 2.1 AA compliance

### 5.2 Reliability
- **Uptime**: 99.9% availability
- **Error Handling**: Graceful degradation for API failures
- **Data Integrity**: No data loss during submission

### 5.3 Scalability
- **Team Size**: Support up to 50 team members
- **Event Volume**: Handle 1000+ events per day
- **Concurrent Users**: Support 100+ simultaneous users

## 6. Acceptance Criteria

### 6.1 Dialog Behavior
- [ ] Dialog opens when "Create Request" is clicked
- [ ] Dialog closes when "Cancel" or "X" is clicked
- [ ] Dialog closes after successful event creation
- [ ] Dialog maintains focus and keyboard navigation

### 6.2 Form Validation
- [ ] Title field is required and validates on blur
- [ ] Event type selection is required
- [ ] End time must be after start time
- [ ] Custom location requires text input
- [ ] Form shows loading state during submission

### 6.3 Team Member Selection
- [ ] Grid displays all available team members
- [ ] Click toggles selection with visual feedback
- [ ] Count updates in label text
- [ ] Multiple selections are preserved during form editing

### 6.4 Data Integration
- [ ] Event appears in calendar after creation
- [ ] Notification displays success message
- [ ] Form resets for next event creation
- [ ] Data persists across page refreshes

### 6.5 Visual Design
- [ ] Matches existing CareSupport UI patterns
- [ ] Responsive design works on mobile devices
- [ ] Proper contrast and accessibility compliance
- [ ] Consistent spacing and typography

## 7. Future Enhancements (Phase 2)

### 7.1 Advanced Features
- **Recurring Events**: Weekly/monthly recurrence patterns
- **Event Templates**: Pre-configured event types
- **Bulk Creation**: Multiple events at once
- **Drag & Drop**: Time slot assignment via calendar

### 7.2 Integration
- **API Integration**: Real care recipient and team member data
- **Calendar Sync**: External calendar integration
- **Notification System**: Email/SMS notifications
- **Reporting**: Event creation analytics

### 7.3 Mobile Optimization
- **Native Mobile App**: React Native implementation
- **Offline Support**: Local storage for offline creation
- **Touch Gestures**: Swipe and pinch interactions

## 8. Risk Assessment

### 8.1 Technical Risks
- **State Management Complexity**: Mitigated by using established Context pattern
- **Performance Impact**: Mitigated by lazy loading and code splitting
- **Browser Compatibility**: Mitigated by modern browser targeting

### 8.2 User Experience Risks
- **Feature Discoverability**: Mitigated by prominent button placement
- **Form Complexity**: Mitigated by progressive disclosure and validation
- **Mobile Usability**: Mitigated by responsive design testing

### 8.3 Business Risks
- **User Adoption**: Mitigated by user training and documentation
- **Data Accuracy**: Mitigated by validation and confirmation flows
- **Support Load**: Mitigated by intuitive design and error handling

## 9. Success Criteria

The Care Event Creation feature will be considered successful when:

1. **80% of care coordinators** use the feature within 2 weeks
2. **Average event creation time** is under 60 seconds
3. **95% of events** are created with complete information
4. **User satisfaction score** is 4.5+ out of 5
5. **Zero critical bugs** in production for 30 days
6. **Mobile usability score** is 90+ on Lighthouse

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Next Review**: January 2025
