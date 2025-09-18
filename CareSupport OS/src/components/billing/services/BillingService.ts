import { Claim, Payment, DenialReason, Report } from '../types';
import { EDIService } from './EDIService';

export class BillingService {
  /**
   * Generate claims or invoices from shifts
   */
  static generateClaims(shifts: any[], groupBy: 'payer' | 'client'): Claim[] {
    // Group shifts
    const grouped = shifts.reduce((acc, shift) => {
      const key = groupBy === 'payer' ? shift.payerId : shift.clientId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(shift);
      return acc;
    }, {});

    // Generate claims
    return Object.entries(grouped).map(([key, groupShifts]: [string, any[]]) => {
      const firstShift = groupShifts[0];
      const totalAmount = groupShifts.reduce((sum, s) => sum + s.amount, 0);

      // Determine if this should be a claim or invoice
      const type = ['Medicaid', 'Medicare', 'Private Insurance'].includes(firstShift.payerType)
        ? 'claim'
        : 'invoice';

      // For Medicaid/Medicare, include form type
      const formType = type === 'claim' && ['Medicaid', 'Medicare'].includes(firstShift.payerType)
        ? 'CMS-1500'
        : 'Custom';

      return {
        id: `CLM-${Math.random().toString(36).substr(2, 9)}`,
        type,
        shiftIds: groupShifts.map(s => s.id),
        clientId: firstShift.clientId,
        clientName: firstShift.client,
        payerId: firstShift.payerId,
        payerName: firstShift.payer,
        payerType: firstShift.payerType,
        amount: totalAmount,
        status: 'Ready' as const,
        formType,
        formData: formType === 'CMS-1500' ? this.generateCMS1500Data(groupShifts) : undefined
      };
    });
  }

  /**
   * Submit claims to payer
   */
  static async submitClaims(claims: Claim[]): Promise<void> {
    // Group claims by payer and type
    const grouped = claims.reduce((acc, claim) => {
      const key = `${claim.payerType}-${claim.type}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(claim);
      return acc;
    }, {} as Record<string, Claim[]>);

    // Submit each group appropriately
    for (const [key, groupClaims] of Object.entries(grouped)) {
      const [payerType, type] = key.split('-');

      if (type === 'claim' && ['Medicaid', 'Medicare'].includes(payerType)) {
        // Generate EDI file
        const ediContent = EDIService.generate837P(groupClaims);
        
        // Submit EDI file
        // In a real app, this would make an API call
        console.log('Submitting EDI file:', ediContent);
      } else {
        // Handle other submission methods (e.g., API, portal upload)
        console.log('Submitting claims via alternate method:', groupClaims);
      }
    }
  }

  /**
   * Process ERA file
   */
  static processERA(content: string): Payment[] {
    return EDIService.parse835(content);
  }

  /**
   * Generate CMS-1500 form data
   */
  private static generateCMS1500Data(shifts: any[]) {
    const firstShift = shifts[0];
    
    return {
      // Box 1: Medicare/Medicaid/Tricare/Champva/Group Health Plan/FECA/Other
      box1: firstShift.payerType === 'Medicare',
      
      // Box 1a: Insured's ID Number
      box1a: firstShift.clientId,
      
      // Box 2: Patient's Name
      box2: firstShift.client,
      
      // Box 24: Service Lines
      serviceLines: shifts.map(shift => ({
        date: shift.date,
        placeOfService: '12', // Home
        procedureCode: 'G0156', // Home Health Aide Service
        charges: shift.amount,
        units: shift.hours,
        renderingProvider: shift.caregiverId
      }))
    };
  }

  /**
   * Generate billing reports
   */
  static generateReport(type: Report['type'], dateRange: Report['dateRange']): Report {
    return {
      id: `RPT-${Math.random().toString(36).substr(2, 9)}`,
      name: type,
      type,
      dateRange,
      data: {},
      generatedAt: new Date().toISOString()
    };
  }
}