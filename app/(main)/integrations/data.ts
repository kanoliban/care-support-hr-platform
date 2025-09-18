export const availableIntegrations: IntegrationItem[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync care schedules, appointments, and family events.',
    isActive: true,
    icon: ['/images/major-brands/google.svg'],
  },
  {
    id: 'apple-health',
    name: 'Apple Health',
    description: 'Track medications, appointments, and health metrics.',
    isActive: true,
    icon: ['/images/major-brands/apple.svg'],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Secure family and caregiver communication.',
    isActive: true,
    icon: ['/images/major-brands/whatsapp.svg'],
  },
];

export const upcomingIntegrations: IntegrationItem[] = [
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Share care documents, photos, and medical records.',
    isActive: false,
    icon: ['/images/major-brands/dropbox.svg'],
  },
  {
    id: 'epic-emr',
    name: 'Epic MyChart',
    description: 'Direct access to medical records and appointment scheduling.',
    isActive: false,
    icon: ['/images/major-brands/microsoft.svg'], // Enterprise software
  },
  {
    id: 'cerner-emr',
    name: 'Cerner EMR',
    description: 'Integration with hospital and clinic electronic records.',
    isActive: false,
    icon: ['/images/major-brands/microsoft-office.svg'], // Enterprise systems
  },
  {
    id: 'alexa-care',
    name: 'Alexa Care Hub',
    description: 'Voice-activated medication reminders and emergency alerts.',
    isActive: false,
    icon: [
      '/images/major-brands/amazon.svg',
      '/images/major-brands/amazon-white.svg',
    ], // Amazon Alexa
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch Health',
    description: 'Fall detection, heart monitoring, and emergency contacts.',
    isActive: false,
    icon: ['/images/major-brands/apple.svg'], // Apple ecosystem
  },
  {
    id: 'philips-lifeline',
    name: 'Philips Lifeline',
    description: 'Medical alert system integration and emergency response.',
    isActive: false,
    icon: ['/images/major-brands/stripe.svg'], // Medical/emergency services
  },
];

export type IntegrationItem = {
  id: string;
  icon: [string, string?];
  name: string;
  description?: string;
  isActive: boolean;
};

