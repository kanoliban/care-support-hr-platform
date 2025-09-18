import React from 'react';
import { components } from '../../styles/theme';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helpText?: string;
}

function FormField({ 
  label, 
  error, 
  required, 
  children, 
  helpText 
}: FormFieldProps) {
  const id = React.useId();
  
  return (
    <div className="space-y-1">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
        {required && <span className="text-status-error-DEFAULT ml-1">*</span>}
      </label>
      
      {helpText && (
        <p className="text-sm text-neutral-500">{helpText}</p>
      )}
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? `${id}-error` : undefined,
        className: `${components.input.base} ${error ? components.input.error : ''}`
      })}
      
      {error && (
        <p 
          id={`${id}-error`}
          className="mt-1 text-sm text-status-error-DEFAULT"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;