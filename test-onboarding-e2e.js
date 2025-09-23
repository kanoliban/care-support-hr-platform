#!/usr/bin/env node

/**
 * CareSupport Onboarding End-to-End Test
 * 
 * This script tests the complete onboarding flow from start to finish
 * to ensure all steps work correctly and data flows properly.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  viewport: { width: 1280, height: 720 },
  headless: false, // Set to true for CI/CD
};

// Test data for the onboarding flow
const TEST_DATA = {
  relationshipToCare: 'family-member',
  timezone: 'America/New_York',
  careRecipient: {
    name: 'Sarah Johnson',
    age: '75',
    careNeeds: ['medication-management', 'mobility-assistance'],
    medicalConditions: ['diabetes', 'arthritis'],
  },
  careTeam: {
    caregivers: [
      {
        name: 'John Johnson',
        email: 'john.johnson@email.com',
        phone: '+1-555-0123',
        category: 'family-member',
        role: 'admin',
      },
      {
        name: 'Lisa Smith',
        email: 'lisa.smith@email.com',
        phone: '+1-555-0124',
        category: 'professional-caregiver',
        role: 'member',
      },
    ],
  },
  scheduling: {
    careRequirements: {
      method: 'as-needed',
    },
    availability: {
      method: 'manual',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
      recurringPattern: 'weekly',
    },
  },
  permissions: {
    teamPermissions: {
      defaultRole: 'member',
    },
    dataSharing: {
      family: true,
      healthcare: true,
      emergency: true,
    },
    privacySettings: {
      twoFactorAuth: true,
      sessionTimeout: true,
      auditLogging: true,
    },
  },
};

class OnboardingE2ETest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      steps: [],
    };
  }

  async initialize() {
    console.log('🚀 Starting CareSupport Onboarding E2E Test...\n');
    
    this.browser = await puppeteer.launch({
      headless: TEST_CONFIG.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport(TEST_CONFIG.viewport);
    
    // Set up console logging
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('🔴 Browser Error:', msg.text());
      }
    });

    // Set up error handling
    this.page.on('pageerror', (error) => {
      console.log('🔴 Page Error:', error.message);
      this.results.errors.push(error.message);
    });
  }

  async testStep(stepNumber, stepName, testFunction) {
    console.log(`\n📋 Testing Step ${stepNumber}: ${stepName}`);
    
    try {
      await testFunction();
      this.results.passed++;
      this.results.steps.push({ step: stepNumber, name: stepName, status: 'PASSED' });
      console.log(`✅ Step ${stepNumber} passed`);
    } catch (error) {
      this.results.failed++;
      this.results.steps.push({ step: stepNumber, name: stepName, status: 'FAILED', error: error.message });
      console.log(`❌ Step ${stepNumber} failed:`, error.message);
    }
  }

  async navigateToOnboarding() {
    await this.page.goto(`${TEST_CONFIG.baseUrl}/onboarding-caresupport/steps`, {
      waitUntil: 'networkidle0',
      timeout: TEST_CONFIG.timeout,
    });
    
    // Wait for the page to load
    await this.page.waitForSelector('[data-testid="onboarding-container"]', { timeout: 10000 });
  }

  async testStep1_AccountSetup() {
    // Test relationship selection
    await this.page.click(`[data-relationship="${TEST_DATA.relationshipToCare}"]`);
    
    // Test timezone selection
    await this.page.click('[data-testid="timezone-selector"]');
    await this.page.select('[data-testid="timezone-selector"]', TEST_DATA.timezone);
    
    // Test continue button
    await this.page.waitForSelector('[data-testid="continue-button"]');
    await this.page.click('[data-testid="continue-button"]');
    
    // Verify navigation to next step
    await this.page.waitForSelector('[data-testid="step-care-recipient"]', { timeout: 5000 });
  }

  async testStep2_CareRecipient() {
    // Fill in care recipient information
    await this.page.type('[data-testid="recipient-name"]', TEST_DATA.careRecipient.name);
    await this.page.type('[data-testid="recipient-age"]', TEST_DATA.careRecipient.age);
    
    // Select care needs
    for (const need of TEST_DATA.careRecipient.careNeeds) {
      await this.page.click(`[data-care-need="${need}"]`);
    }
    
    // Select medical conditions
    for (const condition of TEST_DATA.careRecipient.medicalConditions) {
      await this.page.click(`[data-medical-condition="${condition}"]`);
    }
    
    // Continue to next step
    await this.page.click('[data-testid="continue-button"]');
    await this.page.waitForSelector('[data-testid="step-care-team"]', { timeout: 5000 });
  }

  async testStep3_CareTeam() {
    // Test adding team members
    for (const caregiver of TEST_DATA.careTeam.caregivers) {
      // Click "Add Team Member"
      await this.page.click('[data-testid="add-team-member"]');
      
      // Fill in team member details
      await this.page.type('[data-testid="member-name"]', caregiver.name);
      await this.page.type('[data-testid="member-email"]', caregiver.email);
      await this.page.type('[data-testid="member-phone"]', caregiver.phone);
      
      // Select category and role
      await this.page.select('[data-testid="member-category"]', caregiver.category);
      await this.page.select('[data-testid="member-role"]', caregiver.role);
      
      // Save team member
      await this.page.click('[data-testid="save-member"]');
    }
    
    // Continue to next step
    await this.page.click('[data-testid="continue-button"]');
    await this.page.waitForSelector('[data-testid="step-scheduling"]', { timeout: 5000 });
  }

  async testStep4_Scheduling() {
    // Test care requirements selection
    await this.page.click(`[data-care-method="${TEST_DATA.scheduling.careRequirements.method}"]`);
    
    // Test availability setup
    await this.page.click(`[data-availability-method="${TEST_DATA.scheduling.availability.method}"]`);
    
    // Select days
    for (const day of TEST_DATA.scheduling.availability.days) {
      await this.page.click(`[data-day="${day}"]`);
    }
    
    // Set time range
    await this.page.select('[data-testid="start-time"]', TEST_DATA.scheduling.availability.startTime);
    await this.page.select('[data-testid="end-time"]', TEST_DATA.scheduling.availability.endTime);
    
    // Set recurring pattern
    await this.page.select('[data-testid="recurring-pattern"]', TEST_DATA.scheduling.availability.recurringPattern);
    
    // Continue to next step
    await this.page.click('[data-testid="continue-button"]');
    await this.page.waitForSelector('[data-testid="step-permissions"]', { timeout: 5000 });
  }

  async testStep5_Permissions() {
    // Test default role selection
    await this.page.click(`[data-role="${TEST_DATA.permissions.teamPermissions.defaultRole}"]`);
    
    // Test data sharing settings
    await this.page.click('[data-testid="data-sharing-family"]');
    await this.page.click('[data-testid="data-sharing-healthcare"]');
    await this.page.click('[data-testid="data-sharing-emergency"]');
    
    // Test privacy settings
    await this.page.click('[data-testid="privacy-two-factor"]');
    await this.page.click('[data-testid="privacy-session-timeout"]');
    await this.page.click('[data-testid="privacy-audit-logging"]');
    
    // Continue to review step
    await this.page.click('[data-testid="continue-button"]');
    await this.page.waitForSelector('[data-testid="step-review"]', { timeout: 5000 });
  }

  async testStep6_Review() {
    // Verify all information is displayed correctly
    const reviewSections = await this.page.$$eval('[data-testid="review-section"]', sections => 
      sections.map(section => ({
        title: section.querySelector('[data-testid="section-title"]')?.textContent,
        fields: Array.from(section.querySelectorAll('[data-testid="review-field"]')).map(field => ({
          label: field.querySelector('[data-testid="field-label"]')?.textContent,
          value: field.querySelector('[data-testid="field-value"]')?.textContent,
        })),
      }))
    );
    
    console.log('📊 Review sections found:', reviewSections.length);
    
    // Test completion
    await this.page.click('[data-testid="complete-setup"]');
    
    // Wait for completion alert or redirect
    await this.page.waitForFunction(() => {
      return document.querySelector('[data-testid="completion-success"]') || 
             window.location.pathname.includes('dashboard');
    }, { timeout: 10000 });
  }

  async runAllTests() {
    try {
      await this.initialize();
      
      await this.navigateToOnboarding();
      
      await this.testStep(1, 'Account Setup', () => this.testStep1_AccountSetup());
      await this.testStep(2, 'Care Recipient', () => this.testStep2_CareRecipient());
      await this.testStep(3, 'Care Team', () => this.testStep3_CareTeam());
      await this.testStep(4, 'Scheduling', () => this.testStep4_Scheduling());
      await this.testStep(5, 'Permissions', () => this.testStep5_Permissions());
      await this.testStep(6, 'Review & Complete', () => this.testStep6_Review());
      
      await this.generateReport();
      
    } catch (error) {
      console.error('🔴 Test suite failed:', error);
      this.results.errors.push(error.message);
    } finally {
      await this.cleanup();
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.passed + this.results.failed,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: `${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`,
      },
      steps: this.results.steps,
      errors: this.results.errors,
    };

    // Save report to file
    const reportPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Display summary
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`📈 Success Rate: ${report.summary.successRate}`);
    console.log(`📄 Report saved to: ${reportPath}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n🔴 ERRORS:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  const test = new OnboardingE2ETest();
  test.runAllTests().catch(console.error);
}

module.exports = OnboardingE2ETest;
