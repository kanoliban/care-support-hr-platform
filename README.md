<p align="center">
    <img src="./logo.svg" height="96">
  <h3 align="center">Care Support HR Platform</h3>
  <p align="center">Comprehensive care team coordination and management system</p>
</p>

## Introduction

Care Support HR Platform is a modern Next.js application designed for coordinating care teams and managing care responsibilities. Built with TypeScript, Tailwind CSS, and a comprehensive component library, it provides a robust solution for care coordination, team management, scheduling, and seamless onboarding experiences.

## ✨ Key Features

### 🚀 **Complete Onboarding System**
- **Progressive Disclosure Flow**: Smart team setup (Create New Team vs Join Existing Team)
- **Role-Based Configuration**: Different paths for care recipients, family members, professionals, and coordinators
- **Care Team Building**: Invite team members via email or add manually with comprehensive role assignment
- **Scheduling Setup**: Configure availability and care requirements with recurring patterns
- **Permissions & Privacy**: Granular access controls and privacy settings
- **Review & Complete**: Comprehensive review step with inline editing capabilities

### 📅 **Advanced Calendar System**
- **Dual View Support**: Week and Month views with seamless switching
- **Drag & Drop Scheduling**: Reschedule events with visual feedback and confirmation
- **Event Management**: Create, edit, delete, and view detailed event information
- **Recurring Events**: Full support for complex recurring patterns
- **Overnight Event Handling**: Smart consolidation of events spanning midnight
- **Real-time Updates**: Immediate visual feedback for all calendar operations

### 👥 **Unified Team Management**
- **Inline Wizard System**: 3-step wizard for adding team members without page navigation
- **Comprehensive Edit Modal**: Full-featured editing with role, permissions, and contact management
- **Quick Edit Capabilities**: Fast inline editing for common changes
- **Permission Management**: Granular role-based access control (Member, Admin, Viewer)
- **Care Responsibilities**: Detailed assignment and tracking of care tasks

### 📝 **Request Management System**
- **Unified Request Form**: 3-step wizard for creating care requests
- **Smart Categorization**: Common request types with custom options
- **Recurring Requests**: Support for recurring care needs
- **Team Assignment**: Flexible assignment to specific team members or "open to anyone"
- **Custom Person Support**: Add external contacts with invitation capabilities

### 🎨 **Design System Excellence**
- **Consistent UI Patterns**: Cohesive design language across all components
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Accessibility**: Full keyboard navigation and screen reader support
- **Visual Feedback**: Loading states, hover effects, and transition animations
- **Component Reusability**: Modular components following DRY principles

## 🛠 Technology Stack

- **Framework**: Next.js 14.2.5 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Remix Icons for consistent iconography
- **State Management**: Jotai for atomic state management
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth transitions
- **Date Handling**: date-fns for robust date manipulation
- **Form Management**: Custom form components with validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kanoliban/care-support-hr-platform.git
cd care-support-hr-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## 📱 Application Pages

### Core Features
- **[Home Dashboard](http://localhost:3000)** - Main application dashboard
- **[Calendar](http://localhost:3000/calendar)** - Advanced scheduling with drag & drop
- **[Teams](http://localhost:3000/teams)** - Team management and coordination
- **[Integrations](http://localhost:3000/integrations)** - Third-party integrations

### Onboarding System
- **[Care Support Onboarding](http://localhost:3000/onboarding-caresupport/steps)** - Complete onboarding flow
- **[Legacy Onboarding](http://localhost:3000/onboarding)** - Original onboarding system

### Authentication
- **[Login](http://localhost:3000/login)** - User authentication
- **[Register](http://localhost:3000/register)** - User registration
- **[Reset Password](http://localhost:3000/reset-password)** - Password recovery

### Settings & Configuration
- **[General Settings](http://localhost:3000/settings)** - Application settings
- **[Profile Settings](http://localhost:3000/settings/profile-settings)** - User profile management
- **[Company Settings](http://localhost:3000/settings/company-settings)** - Organization configuration
- **[Notification Settings](http://localhost:3000/settings/notification-settings)** - Communication preferences
- **[Privacy & Security](http://localhost:3000/settings/privacy-security)** - Security and privacy controls
- **[Integrations](http://localhost:3000/settings/integrations)** - Third-party service connections

## 🏗 Project Structure

```
├── app/                           # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   └── layout.tsx            # Auth layout with carousel
│   ├── (main)/                   # Main application pages
│   │   ├── calendar/             # Calendar with drag & drop
│   │   ├── teams/                # Team management
│   │   ├── settings/             # Settings pages
│   │   └── layout.tsx            # Main app layout
│   └── onboarding-caresupport/   # New comprehensive onboarding
│       └── steps/                # Individual onboarding steps
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   │   ├── stepper.tsx           # Vertical stepper component
│   │   ├── tabs.tsx              # Tab navigation
│   │   └── ...                   # Other UI primitives
│   ├── big-calendar.tsx          # Main calendar component
│   ├── recurring-pattern-selector.tsx # Recurring event patterns
│   └── unified-request-form.tsx  # Request creation form
├── lib/                          # Utility libraries and contexts
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
└── utils/                        # Utility functions
```

## 🎯 Key Components

### Onboarding System
- **Progressive Disclosure**: Smart step-by-step flow based on user choices
- **Conditional Logic**: Different paths for team creation vs joining
- **State Management**: Jotai atoms for persistent onboarding state
- **Validation**: Real-time validation with helpful error messages
- **Keyboard Support**: Full keyboard navigation support

### Calendar System
- **Event Consolidation**: Smart grouping of consecutive events
- **Drag & Drop**: Reschedule events with visual feedback
- **Recurring Events**: Complex recurring pattern support
- **Overnight Handling**: Proper handling of events spanning midnight
- **View Switching**: Seamless week/month view transitions

### Team Management
- **Inline Wizards**: Modal-based workflows without page navigation
- **Permission System**: Role-based access (Member, Admin, Viewer)
- **Care Responsibilities**: Detailed task assignment and tracking
- **Contact Management**: Comprehensive contact and emergency information

## 🧪 Testing

The project includes comprehensive testing utilities:

- **End-to-End Tests**: Complete onboarding flow testing
- **Keyboard Navigation**: Full keyboard accessibility testing
- **Component Testing**: Individual component validation
- **Integration Testing**: Cross-component interaction testing

Run tests:
```bash
# Manual testing guide
cat test-onboarding-manual.md

# Automated testing
node test-onboarding-e2e.js
```

## 🚀 Recent Updates

### Phase 1.1: Event Interaction and Management ✅
- ✅ Clickable events with detailed information
- ✅ Context menus for quick actions
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Drag and drop rescheduling with visual feedback
- ✅ Recurring event deletion with multiple options

### Phase 1.2: Onboarding System ✅
- ✅ Complete 6-step onboarding flow
- ✅ Progressive disclosure with conditional logic
- ✅ Team setup (Create vs Join) with smart routing
- ✅ Role-based configuration paths
- ✅ Comprehensive review step with inline editing
- ✅ Keyboard navigation and accessibility

### Phase 1.3: Design System Consistency ✅
- ✅ Unified component patterns across all pages
- ✅ Consistent spacing, typography, and color schemes
- ✅ Responsive design improvements
- ✅ Visual feedback and loading states
- ✅ Component reusability and DRY principles

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in this repository.

---

**Built with ❤️ for better care coordination**