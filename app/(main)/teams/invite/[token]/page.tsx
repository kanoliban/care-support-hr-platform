'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RiMailLine, RiUserAddLine, RiCheckLine, RiArrowLeftLine } from '@remixicon/react';

import Header from '@/app/(main)/header';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import * as Divider from '@/components/ui/divider';

interface InvitationData {
  token: string;
  email: string;
  name: string;
  profileId: string;
  profileName: string;
  teamMemberCategory: string;
  careRole: string;
  careAssignment: string;
  role: string;
  invitedBy: string;
  customMessage?: string;
  expiresAt: string;
}

export default function InvitationAcceptancePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [invitation, setInvitation] = React.useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [step, setStep] = React.useState<'view' | 'accept'>('view');

  // Additional form data for acceptance
  const [acceptData, setAcceptData] = React.useState({
    phone: '',
    address: '',
    schedule: '',
    availabilityType: '',
    emergencyContact: '',
    emergencyPhone: '',
    careNotes: '',
    skills: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof typeof acceptData, string>>>({});

  // Mock invitation data (in real app, this would be fetched from API)
  React.useEffect(() => {
    const fetchInvitation = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock invitation data
        const mockInvitation: InvitationData = {
          token,
          email: 'sarah.johnson@example.com',
          name: 'Sarah Johnson',
          profileId: 'robs-care-team',
          profileName: "Rob's Care Team",
          teamMemberCategory: 'professional',
          careRole: 'Primary PCA',
          careAssignment: "Rob's Care",
          role: 'member',
          invitedBy: 'Marta Snow',
          customMessage: 'Hi Sarah! We\'d love to have you join our care team for Rob. Your experience with spinal cord injury care would be invaluable.',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        };
        
        setInvitation(mockInvitation);
      } catch (error) {
        console.error('Error fetching invitation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const handleAcceptDataChange = (field: keyof typeof acceptData, value: string) => {
    setAcceptData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateAcceptData = (): boolean => {
    const newErrors: Partial<Record<keyof typeof acceptData, string>> = {};

    if (!acceptData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!acceptData.schedule.trim()) {
      newErrors.schedule = 'Schedule is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAcceptInvitation = async () => {
    if (!validateAcceptData()) {
      return;
    }

    setIsAccepting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Accepting invitation:', {
        ...invitation,
        ...acceptData,
        acceptedAt: new Date().toISOString(),
      });
      
      // In real app, this would:
      // 1. Validate invitation token
      // 2. Create user account if needed
      // 3. Add user to care profile with specified role
      // 4. Send confirmation emails
      // 5. Redirect to care profile dashboard
      
      alert(`Welcome to ${invitation?.profileName}! You've successfully joined the care team.`);
      
      // Redirect to the care profile (in real app, would redirect to profile dashboard)
      router.push('/teams');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Failed to accept invitation. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineInvitation = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Declining invitation:', invitation?.token);
      
      alert('Invitation declined. Thank you for your time.');
      router.push('/');
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header
          icon={
            <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiMailLine className='size-6 text-text-sub-600' />
            </div>
          }
          title="Loading Invitation..."
          description="Please wait while we load your invitation details."
          contentClassName='hidden'
        />
        <div className='px-4 lg:px-8 py-8'>
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </>
    );
  }

  if (!invitation) {
    return (
      <>
        <Header
          icon={
            <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiMailLine className='size-6 text-text-sub-600' />
            </div>
          }
          title="Invitation Not Found"
          description="This invitation may have expired or is invalid."
          contentClassName='hidden'
        />
        <div className='px-4 lg:px-8 py-8'>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-800 font-medium mb-2">Invitation Not Found</div>
              <div className="text-red-600 text-sm mb-4">
                This invitation may have expired, been used, or is invalid.
              </div>
              <Button.Root variant="neutral" mode="stroke" onClick={() => router.push('/')}>
                Go Home
              </Button.Root>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiMailLine className='size-6 text-text-sub-600' />
          </div>
        }
        title="Team Invitation"
        description={`You've been invited to join ${invitation.profileName}`}
        contentClassName='hidden'
      />

      <div className='px-4 lg:px-8 py-8'>
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-text-sub-600 hover:text-text-strong-950 transition-colors"
            >
              <RiArrowLeftLine className="size-4" />
              Back to Home
            </button>
          </div>

          {/* Invitation Card */}
          <div className="bg-white rounded-lg border border-stroke-soft-200 p-6">
            {step === 'view' ? (
              <InvitationView
                invitation={invitation}
                onAccept={() => setStep('accept')}
                onDecline={handleDeclineInvitation}
              />
            ) : (
              <InvitationAccept
                invitation={invitation}
                acceptData={acceptData}
                onAcceptDataChange={handleAcceptDataChange}
                errors={errors}
                isAccepting={isAccepting}
                onAccept={handleAcceptInvitation}
                onBack={() => setStep('view')}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Invitation View Component
function InvitationView({
  invitation,
  onAccept,
  onDecline
}: {
  invitation: InvitationData;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <RiMailLine className="size-5 text-primary-600" />
          <div className="text-label-lg font-medium">You're Invited!</div>
        </div>
        <div className="text-text-sub-600 text-sm">
          {invitation.invitedBy} has invited you to join <span className="font-medium">{invitation.profileName}</span>
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Invitation Details */}
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-blue-800 font-medium mb-2">Invitation Details</div>
          <div className="space-y-2 text-sm text-blue-700">
            <div><span className="font-medium">Your Role:</span> {invitation.careRole}</div>
            <div><span className="font-medium">Care Focus:</span> {invitation.careAssignment}</div>
            <div><span className="font-medium">Category:</span> {invitation.teamMemberCategory}</div>
            <div><span className="font-medium">Permissions:</span> {invitation.role}</div>
          </div>
        </div>

        {invitation.customMessage && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-gray-800 font-medium mb-2">Personal Message</div>
            <div className="text-gray-600 text-sm">{invitation.customMessage}</div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="text-amber-800 text-sm">
            <span className="font-medium">Expires:</span> {new Date(invitation.expiresAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button.Root 
          variant="neutral" 
          mode="stroke" 
          onClick={onDecline}
          className="flex-1"
        >
          Decline
        </Button.Root>
        <Button.Root 
          variant="primary" 
          mode="filled" 
          onClick={onAccept}
          className="flex-1"
        >
          <RiCheckLine className="size-4 mr-2" />
          Accept Invitation
        </Button.Root>
      </div>
    </div>
  );
}

// Invitation Accept Component
function InvitationAccept({
  invitation,
  acceptData,
  onAcceptDataChange,
  errors,
  isAccepting,
  onAccept,
  onBack
}: {
  invitation: InvitationData;
  acceptData: {
    phone: string;
    address: string;
    schedule: string;
    availabilityType: string;
    emergencyContact: string;
    emergencyPhone: string;
    careNotes: string;
    skills: string;
  };
  onAcceptDataChange: (field: keyof typeof acceptData, value: string) => void;
  errors: Partial<Record<keyof typeof acceptData, string>>;
  isAccepting: boolean;
  onAccept: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <RiUserAddLine className="size-5 text-primary-600" />
          <div className="text-label-lg font-medium">Complete Your Profile</div>
        </div>
        <div className="text-text-sub-600 text-sm">
          Add a few more details to complete your team member profile
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="accept-phone">Phone Number *</Label.Root>
            <Input.Root
              id="accept-phone"
              type="tel"
              value={acceptData.phone}
              onChange={(e) => onAcceptDataChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <div className="text-xs text-red-600">{errors.phone}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="accept-address">Address</Label.Root>
            <Input.Root
              id="accept-address"
              value={acceptData.address}
              onChange={(e) => onAcceptDataChange('address', e.target.value)}
              placeholder="123 Main St, City, State 12345"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="accept-schedule">Schedule *</Label.Root>
            <Input.Root
              id="accept-schedule"
              value={acceptData.schedule}
              onChange={(e) => onAcceptDataChange('schedule', e.target.value)}
              placeholder="e.g., Mon-Fri 9-5, On-call, Weekends only"
              className={errors.schedule ? 'border-red-500' : ''}
            />
            {errors.schedule && (
              <div className="text-xs text-red-600">{errors.schedule}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="accept-availability">Availability Type</Label.Root>
            <Select.Root
              value={acceptData.availabilityType}
              onValueChange={(value) => onAcceptDataChange('availabilityType', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select availability type" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Flexible">Flexible</Select.Item>
                <Select.Item value="Fixed">Fixed</Select.Item>
                <Select.Item value="On-call">On-call</Select.Item>
                <Select.Item value="Part-time">Part-time</Select.Item>
                <Select.Item value="Full-time">Full-time</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="accept-emergency-contact">Emergency Contact</Label.Root>
            <Input.Root
              id="accept-emergency-contact"
              value={acceptData.emergencyContact}
              onChange={(e) => onAcceptDataChange('emergencyContact', e.target.value)}
              placeholder="Emergency contact person"
            />
          </div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="accept-emergency-phone">Emergency Phone</Label.Root>
            <Input.Root
              id="accept-emergency-phone"
              type="tel"
              value={acceptData.emergencyPhone}
              onChange={(e) => onAcceptDataChange('emergencyPhone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label.Root htmlFor="accept-skills">Skills & Qualifications</Label.Root>
          <Input.Root
            id="accept-skills"
            value={acceptData.skills}
            onChange={(e) => onAcceptDataChange('skills', e.target.value)}
            placeholder="e.g., PCA Certified, Physical Therapy, Medication Management"
          />
        </div>

        <div className="space-y-2">
          <Label.Root htmlFor="accept-care-notes">Care Notes & Instructions</Label.Root>
          <Textarea.Root
            id="accept-care-notes"
            value={acceptData.careNotes}
            onChange={(e) => onAcceptDataChange('careNotes', e.target.value)}
            placeholder="Any special instructions, preferences, or important notes..."
            rows={3}
          />
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button.Root variant="neutral" mode="stroke" onClick={onBack}>
          Back
        </Button.Root>
        <Button.Root 
          variant="primary" 
          mode="filled" 
          onClick={onAccept}
          disabled={isAccepting}
          className="flex-1"
        >
          <RiCheckLine className="size-4 mr-2" />
          {isAccepting ? 'Joining Team...' : 'Join Team'}
        </Button.Root>
      </div>
    </div>
  );
}
