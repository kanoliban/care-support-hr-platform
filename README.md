<p align="center">
  <img src="./logo.svg" height="96">
  <h3 align="center">Care Support HR Platform</h3>
  <p align="center">Comprehensive care team coordination and management system</p>
</p>

## Introduction

Care Support HR Platform is a modern Next.js application designed for coordinating care teams and managing care responsibilities. Built with TypeScript, Tailwind CSS, and a comprehensive component library, it provides a robust solution for care coordination, team management, and scheduling.

### Key Features

- **Team Management**: Add team members via invitation or manual entry
- **Care Coordination**: Manage care responsibilities and roles
- **Calendar Integration**: Schedule and track care events
- **Permission System**: Role-based access control
- **Responsive Design**: Modern UI with mobile support
- **Multiple Auth Styles**: Flexible authentication options
- **Settings Management**: Comprehensive configuration options

## Getting Started

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

## Pages

- [Home](http://localhost:3000)
- [Home (empty state widgets)](http://localhost:3000/home-empty-states)
- [Calendar](http://localhost:3000/calendar)
- [Integrations](http://localhost:3000/integrations)
- [Teams](http://localhost:3000/teams)
- [Onboarding](http://localhost:3000/onboarding)
- [Onboarding Steps](http://localhost:3000/onboarding/steps)
- [Login (style 1)](http://localhost:3000/login)
- [Register (style 1)](http://localhost:3000/register)
- [Reset Password (style 1)](http://localhost:3000/reset-password)
- [Verification (style 1)](http://localhost:3000/verification)
- [Login (style 2)](http://localhost:3000/login2)
- [Register (style 2)](http://localhost:3000/register2)
- [Reset Password (style 2)](http://localhost:3000/reset-password2)
- [Verification (style 2)](http://localhost:3000/verification2)
- [Login (style 3)](http://localhost:3000/login3)
- [Register (style 3)](http://localhost:3000/register3)
- [Reset Password (style 3)](http://localhost:3000/reset-password3)
- [Verification (style 3)](http://localhost:3000/verification3)
- [General Settings](http://localhost:3000/settings)
- [Profile Settings](http://localhost:3000/settings/profile-settings)
- [Company Settings](http://localhost:3000/settings/company-settings)
- [Notification Settings](http://localhost:3000/settings/notification-settings)
- [Privacy & Security](http://localhost:3000/settings/privacy-security)
- [Integrations](http://localhost:3000/settings/integrations)

## Technology Stack

- **Framework**: Next.js 14.2.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Remix Icons
- **State Management**: Jotai
- **Charts**: Recharts
- **Animations**: Framer Motion

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   └── onboarding/        # Onboarding flow
├── components/            # Reusable UI components
├── lib/                   # Utility libraries and contexts
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in this repository.
