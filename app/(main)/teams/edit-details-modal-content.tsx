import * as Label from '@/components/ui/label';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import * as Divider from '@/components/ui/divider';

interface EditDetailsModalContentProps {
  editFormData: any;
  handleFormFieldChange: (field: string, value: string) => void;
  formErrors: any;
}

export function EditDetailsModalContent({ 
  editFormData, 
  handleFormFieldChange, 
  formErrors 
}: EditDetailsModalContentProps) {
  return (
    <div className='space-y-6'>
                {/* Care Team Member Information */}
                <div className='space-y-4'>
                  <div className='text-label-sm'>Care Team Member Information</div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label.Root htmlFor='edit-name'>Name *</Label.Root>
            <Input.Root
              id='edit-name'
              value={editFormData.name}
              onChange={(e) => handleFormFieldChange('name', e.target.value)}
              placeholder="e.g., Marta Snow (Sister), Sarah Johnson (PCA), Dr. Smith (Therapist)"
              className={formErrors.name ? 'border-red-500' : ''}
            />
            {formErrors.name && (
              <div className='text-xs text-red-600'>{formErrors.name}</div>
            )}
          </div>
          
          <div className='space-y-2'>
            <Label.Root htmlFor='edit-email'>Email Address *</Label.Root>
            <Input.Root
              id='edit-email'
              type='email'
              value={editFormData.email}
              onChange={(e) => handleFormFieldChange('email', e.target.value)}
              placeholder="Enter email address"
              className={formErrors.email ? 'border-red-500' : ''}
            />
            {formErrors.email && (
              <div className='text-xs text-red-600'>{formErrors.email}</div>
            )}
          </div>
        </div>
      </div>

      <Divider.Root variant='line-spacing' />

                {/* Care Responsibilities */}
                <div className='space-y-4'>
                  <div className='text-label-sm'>Care Responsibilities</div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label.Root htmlFor='edit-care-role'>What They Help With *</Label.Root>
            <Input.Root
              id='edit-care-role'
              value={editFormData.careRole}
              onChange={(e) => handleFormFieldChange('careRole', e.target.value)}
              placeholder="e.g., Family Coordinator, Primary PCA, Physical Therapist"
              className={formErrors.careRole ? 'border-red-500' : ''}
            />
            {formErrors.careRole && (
              <div className='text-xs text-red-600'>{formErrors.careRole}</div>
            )}
          </div>
          
          <div className='space-y-2'>
            <Label.Root htmlFor='edit-care-assignment'>Care Focus *</Label.Root>
            <Input.Root
              id='edit-care-assignment'
              value={editFormData.careAssignment}
              onChange={(e) => handleFormFieldChange('careAssignment', e.target.value)}
              placeholder="e.g., Rob's Care, Physical Therapy, Medication Management"
              className={formErrors.careAssignment ? 'border-red-500' : ''}
            />
            {formErrors.careAssignment && (
              <div className='text-xs text-red-600'>{formErrors.careAssignment}</div>
            )}
          </div>
        </div>
        
        <div className='space-y-2'>
          <Label.Root htmlFor='edit-assignment-description'>Assignment Description</Label.Root>
          <Input.Root
            id='edit-assignment-description'
            value={editFormData.assignmentDescription}
            onChange={(e) => handleFormFieldChange('assignmentDescription', e.target.value)}
            placeholder="e.g., Family Administration & General Care"
          />
        </div>
      </div>

      <Divider.Root variant='line-spacing' />

      {/* Schedule & Status */}
      <div className='space-y-4'>
        <div className='text-label-sm'>Schedule & Status</div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label.Root htmlFor='edit-schedule'>Schedule Details *</Label.Root>
            <Input.Root
              id='edit-schedule'
              value={editFormData.schedule}
              onChange={(e) => handleFormFieldChange('schedule', e.target.value)}
              placeholder="e.g., On-call, Weekdays 9-5"
              className={formErrors.schedule ? 'border-red-500' : ''}
            />
            {formErrors.schedule && (
              <div className='text-xs text-red-600'>{formErrors.schedule}</div>
            )}
          </div>
          
          <div className='space-y-2'>
            <Label.Root htmlFor='edit-availability-type'>Availability Type</Label.Root>
            <Select.Root value={editFormData.availabilityType} onValueChange={(value) => handleFormFieldChange('availabilityType', value)}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='Flexible'>Flexible</Select.Item>
                <Select.Item value='Fixed'>Fixed</Select.Item>
                <Select.Item value='On-call'>On-call</Select.Item>
                <Select.Item value='Part-time'>Part-time</Select.Item>
                <Select.Item value='Full-time'>Full-time</Select.Item>
                <Select.Item value='Professional'>Professional Services</Select.Item>
                <Select.Item value='Volunteer'>Volunteer</Select.Item>
                <Select.Item value='Emergency'>Emergency Contact</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

    </div>
  );
}
