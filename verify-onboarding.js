#!/usr/bin/env node

/**
 * CareSupport Onboarding Verification Script
 * 
 * This script verifies that all onboarding components are properly set up
 * and the flow is ready for testing.
 */

const fs = require('fs');
const path = require('path');

class OnboardingVerification {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      checks: [],
    };
  }

  checkFile(filePath, description) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        this.results.passed++;
        this.results.checks.push({ file: filePath, status: 'EXISTS', description });
        console.log(`✅ ${description}: ${filePath}`);
        return true;
      } else {
        this.results.failed++;
        this.results.checks.push({ file: filePath, status: 'MISSING', description });
        console.log(`❌ ${description}: ${filePath} - FILE NOT FOUND`);
        return false;
      }
    } catch (error) {
      this.results.failed++;
      this.results.checks.push({ file: filePath, status: 'ERROR', description, error: error.message });
      console.log(`❌ ${description}: ${filePath} - ERROR: ${error.message}`);
      return false;
    }
  }

  checkComponent(filePath, componentName, description) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for component export
        const hasDefaultExport = content.includes('export default') || content.includes('export { default }');
        const hasNamedExport = content.includes(`export { ${componentName} }`) || content.includes(`export const ${componentName}`);
        
        if (hasDefaultExport || hasNamedExport) {
          this.results.passed++;
          this.results.checks.push({ file: filePath, status: 'VALID', description });
          console.log(`✅ ${description}: ${filePath} - Component properly exported`);
          return true;
        } else {
          this.results.failed++;
          this.results.checks.push({ file: filePath, status: 'NO_EXPORT', description });
          console.log(`❌ ${description}: ${filePath} - No proper export found`);
          return false;
        }
      } else {
        this.results.failed++;
        this.results.checks.push({ file: filePath, status: 'MISSING', description });
        console.log(`❌ ${description}: ${filePath} - FILE NOT FOUND`);
        return false;
      }
    } catch (error) {
      this.results.failed++;
      this.results.checks.push({ file: filePath, status: 'ERROR', description, error: error.message });
      console.log(`❌ ${description}: ${filePath} - ERROR: ${error.message}`);
      return false;
    }
  }

  async verifyOnboardingSetup() {
    console.log('🔍 Verifying CareSupport Onboarding Setup...\n');

    // Check main onboarding structure
    console.log('📁 Checking Main Structure:');
    this.checkFile('app/onboarding-caresupport/layout.tsx', 'Main Onboarding Layout');
    this.checkFile('app/onboarding-caresupport/components/onboarding-header.tsx', 'Onboarding Header');
    this.checkFile('app/onboarding-caresupport/components/onboarding-footer.tsx', 'Onboarding Footer');
    
    console.log('\n📋 Checking Steps Structure:');
    this.checkFile('app/onboarding-caresupport/steps/layout.tsx', 'Steps Layout');
    this.checkFile('app/onboarding-caresupport/steps/page.tsx', 'Steps Page');
    this.checkFile('app/onboarding-caresupport/steps/store.tsx', 'Steps Store (Jotai)');
    this.checkFile('app/onboarding-caresupport/steps/header.tsx', 'Steps Header');

    console.log('\n🔧 Checking Individual Steps:');
    this.checkComponent('app/onboarding-caresupport/steps/step-account.tsx', 'OnboardingStepAccount', 'Step 1: Account Setup');
    this.checkComponent('app/onboarding-caresupport/steps/step-care-recipient.tsx', 'OnboardingStepCareRecipient', 'Step 2: Care Recipient');
    this.checkComponent('app/onboarding-caresupport/steps/step-care-team.tsx', 'OnboardingStepCareTeam', 'Step 3: Care Team');
    this.checkComponent('app/onboarding-caresupport/steps/step-scheduling.tsx', 'OnboardingStepScheduling', 'Step 4: Scheduling');
    this.checkComponent('app/onboarding-caresupport/steps/step-permissions.tsx', 'OnboardingStepPermissions', 'Step 5: Permissions');
    this.checkComponent('app/onboarding-caresupport/steps/step-review.tsx', 'OnboardingStepReview', 'Step 6: Review');

    console.log('\n🎨 Checking UI Components:');
    this.checkFile('components/ui/tabs.tsx', 'Tabs UI Component');
    this.checkFile('components/recurring-pattern-selector.tsx', 'Recurring Pattern Selector');

    console.log('\n📊 Checking Types:');
    this.checkFile('app/onboarding-caresupport/steps/types/onboarding.ts', 'Onboarding Types');

    await this.generateReport();
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.passed + this.results.failed,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: this.results.passed + this.results.failed > 0 
          ? `${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`
          : '0%',
      },
      checks: this.results.checks,
    };

    // Save report to file
    const reportPath = path.join(__dirname, 'verification-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Display summary
    console.log('\n📊 VERIFICATION RESULTS SUMMARY');
    console.log('================================');
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`📈 Success Rate: ${report.summary.successRate}`);
    console.log(`📄 Report saved to: ${reportPath}`);
    
    if (this.results.failed > 0) {
      console.log('\n🔴 FAILED CHECKS:');
      this.results.checks
        .filter(check => check.status !== 'VALID' && check.status !== 'EXISTS')
        .forEach((check, index) => {
          console.log(`${index + 1}. ${check.description}: ${check.status}`);
          if (check.error) {
            console.log(`   Error: ${check.error}`);
          }
        });
    }

    // Overall result
    if (report.summary.failed === 0) {
      console.log('\n🎉 ALL VERIFICATIONS PASSED! Onboarding setup is complete and ready for testing.');
      console.log('\n🚀 Next Steps:');
      console.log('1. Run: node test-onboarding-simple.js');
      console.log('2. Follow: test-onboarding-manual.md');
      console.log('3. Test at: http://localhost:3000/onboarding-caresupport/steps');
    } else {
      console.log('\n⚠️  Some verifications failed. Please fix the issues above before testing.');
    }

    return report;
  }
}

// Run the verification if this script is executed directly
if (require.main === module) {
  const verification = new OnboardingVerification();
  verification.verifyOnboardingSetup().catch(console.error);
}

module.exports = OnboardingVerification;
