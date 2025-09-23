#!/usr/bin/env node

/**
 * CareSupport Onboarding Simple Test
 * 
 * This script performs basic validation of the onboarding flow
 * by checking if all pages load correctly and forms are accessible.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
};

class SimpleOnboardingTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      tests: [],
    };
  }

  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.setTimeout(TEST_CONFIG.timeout, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async testEndpoint(endpoint, expectedStatus = 200) {
    const url = `${TEST_CONFIG.baseUrl}${endpoint}`;
    const testName = `GET ${endpoint}`;
    
    try {
      console.log(`🧪 Testing: ${testName}`);
      
      const response = await this.makeRequest(url);
      
      if (response.statusCode === expectedStatus) {
        this.results.passed++;
        this.results.tests.push({ name: testName, status: 'PASSED' });
        console.log(`✅ ${testName} - Status: ${response.statusCode}`);
        
        // Check if it's a React page (contains React-specific content)
        if (response.body.includes('__next') || response.body.includes('react')) {
          console.log(`   📄 React page detected`);
        }
        
        return true;
      } else {
        throw new Error(`Expected status ${expectedStatus}, got ${response.statusCode}`);
      }
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: testName, status: 'FAILED', error: error.message });
      console.log(`❌ ${testName} - Error: ${error.message}`);
      return false;
    }
  }

  async testOnboardingFlow() {
    console.log('🚀 Starting CareSupport Onboarding Simple Test...\n');
    
    const endpoints = [
      // Main onboarding pages
      { path: '/onboarding-caresupport/steps', name: 'Onboarding Steps' },
      { path: '/onboarding-caresupport', name: 'Onboarding Landing' },
      { path: '/onboarding-caresupport/join-team', name: 'Join Team' },
      { path: '/onboarding-caresupport/create-team', name: 'Create Team' },
      
      // Auth pages
      { path: '/login', name: 'Login Page' },
      { path: '/register', name: 'Register Page' },
      
      // Main pages
      { path: '/', name: 'Home Page' },
    ];

    // Test all endpoints
    for (const endpoint of endpoints) {
      await this.testEndpoint(endpoint.path);
    }

    // Test specific onboarding step content
    await this.testOnboardingContent();
    
    await this.generateReport();
  }

  async testOnboardingContent() {
    console.log('\n📋 Testing Onboarding Content...');
    
    try {
      const response = await this.makeRequest(`${TEST_CONFIG.baseUrl}/onboarding-caresupport/steps`);
      
      if (response.statusCode === 200) {
        // Check for key onboarding elements
        const contentChecks = [
          { name: 'Step 1: Account Setup', pattern: /What best describes your relationship/i },
          { name: 'Step 2: Care Recipient', pattern: /Tell us about the person/i },
          { name: 'Step 3: Care Team', pattern: /Build your care team/i },
          { name: 'Step 4: Scheduling', pattern: /Set up your schedule/i },
          { name: 'Step 5: Permissions', pattern: /Configure Permissions/i },
          { name: 'Step 6: Review', pattern: /Review Your Setup/i },
        ];

        for (const check of contentChecks) {
          if (response.body.match(check.pattern)) {
            this.results.passed++;
            this.results.tests.push({ name: `Content: ${check.name}`, status: 'PASSED' });
            console.log(`✅ ${check.name} content found`);
          } else {
            this.results.failed++;
            this.results.tests.push({ name: `Content: ${check.name}`, status: 'FAILED' });
            console.log(`❌ ${check.name} content not found`);
          }
        }

        // Check for React hydration
        if (response.body.includes('__next_f')) {
          this.results.passed++;
          this.results.tests.push({ name: 'React Hydration', status: 'PASSED' });
          console.log(`✅ React hydration detected`);
        } else {
          this.results.failed++;
          this.results.tests.push({ name: 'React Hydration', status: 'FAILED' });
          console.log(`❌ React hydration not detected`);
        }

        // Check for CSS loading
        if (response.body.includes('_next/static/css')) {
          this.results.passed++;
          this.results.tests.push({ name: 'CSS Loading', status: 'PASSED' });
          console.log(`✅ CSS loading detected`);
        } else {
          this.results.failed++;
          this.results.tests.push({ name: 'CSS Loading', status: 'FAILED' });
          console.log(`❌ CSS loading not detected`);
        }

      } else {
        throw new Error(`Failed to load onboarding page: ${response.statusCode}`);
      }
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: 'Onboarding Content Test', status: 'FAILED', error: error.message });
      console.log(`❌ Onboarding content test failed: ${error.message}`);
    }
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
      tests: this.results.tests,
      errors: this.results.errors,
    };

    // Save report to file
    const reportPath = path.join(__dirname, 'test-results-simple.json');
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

    // Overall result
    if (report.summary.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Onboarding flow is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the results above.');
    }

    return report;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  const test = new SimpleOnboardingTest();
  test.testOnboardingFlow().catch(console.error);
}

module.exports = SimpleOnboardingTest;
