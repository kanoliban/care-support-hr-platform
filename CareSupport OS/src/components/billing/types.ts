import { z } from 'zod';

export type ClaimStatus = 
  | 'Ready'
  | 'Flagged'
  | 'Submitted'
  | 'Denied'
  | 'Partial'
  | 'Paid'
  | 'Voided';

export type PayerType = 
  | 'Medicaid'
  | 'Medicare'
  | 'Private Insurance'
  | 'Private Pay'
  | 'Other';

export type DenialCode = {
  code: string;
  description: string;
  category: 'Missing Info' | 'Invalid Data' | 'Coverage' | 'Compliance' | 'Other';
  action: string;
};

export type ComplianceFlag = {
  control: string;
  issue: string;
  status: 'Error' | 'Warning';
  resolution?: string;
};

export const ClaimSchema = z.object({
  id: z.string(),
  type: z.enum(['invoice', 'claim']),
  shiftIds: z.array(z.string()),
  clientId: z.string(),
  clientName: z.string(),
  payerId: z.string(),
  payerName: z.string(),
  payerType: z.enum(['Medicaid', 'Medicare', 'Private Insurance', 'Private Pay', 'Other']),
  amount: z.number(),
  status: z.enum(['Ready', 'Flagged', 'Submitted', 'Denied', 'Partial', 'Paid', 'Voided']),
  submittedDate: z.string().optional(),
  paidDate: z.string().optional(),
  paidAmount: z.number().optional(),
  denialCode: z.string().optional(),
  denialReason: z.string().optional(),
  complianceFlags: z.array(z.object({
    control: z.string(),
    issue: z.string(),
    status: z.enum(['Error', 'Warning']),
    resolution: z.string().optional()
  })).optional(),
  notes: z.string().optional(),
  formType: z.enum(['CMS-1500', 'UB-04', 'Custom']).optional(),
  formData: z.record(z.string(), z.any()).optional()
});

export type Claim = z.infer<typeof ClaimSchema>;

export const PaymentSchema = z.object({
  id: z.string(),
  payerId: z.string(),
  payerName: z.string(),
  amount: z.number(),
  date: z.string(),
  method: z.enum(['ACH', 'Check', 'Credit Card', 'Other']),
  reference: z.string(),
  claims: z.array(z.object({
    claimId: z.string(),
    amount: z.number(),
    adjustments: z.array(z.object({
      code: z.string(),
      description: z.string(),
      amount: z.number()
    })).optional()
  })),
  notes: z.string().optional()
});

export type Payment = z.infer<typeof PaymentSchema>;

export const DenialReasonSchema = z.object({
  code: z.string(),
  description: z.string(),
  category: z.enum(['Missing Info', 'Invalid Data', 'Coverage', 'Compliance', 'Other']),
  action: z.string(),
  complianceControl: z.string().optional()
});

export type DenialReason = z.infer<typeof DenialReasonSchema>;

export const ReportSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Denial Analysis', 'Revenue', 'Compliance Impact', 'Custom']),
  dateRange: z.object({
    start: z.string(),
    end: z.string()
  }),
  filters: z.record(z.string(), z.any()).optional(),
  data: z.record(z.string(), z.any()),
  generatedAt: z.string()
});

export type Report = z.infer<typeof ReportSchema>;