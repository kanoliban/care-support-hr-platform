'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RiArrowUpDownLine, RiCheckLine } from '@remixicon/react';
import { useSimplePermissions } from '@/lib/simple-permission-context';
import { cn } from '@/utils/cn';

export function SimpleProfileSwitcher() {
  const { currentProfile, availableProfiles, switchProfile } = useSimplePermissions();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentProfile) {
    return null;
  }

  const handleProfileSwitch = (profileId: string) => {
    switchProfile(profileId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Profile Display */}
      <div 
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Profile Logo */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-base text-white font-semibold text-sm">
          {currentProfile.name.charAt(0)}
        </div>
        
        {/* Profile Info */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {currentProfile.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {currentProfile.subtitle}
          </div>
        </div>
        
        {/* Dropdown Arrow */}
        <RiArrowUpDownLine 
          className={cn(
            "size-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            {availableProfiles.map((profile) => (
              <div
                key={profile.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                  profile.id === currentProfile.id 
                    ? "bg-primary-lighter text-primary-dark" 
                    : "hover:bg-gray-50"
                )}
                onClick={() => handleProfileSwitch(profile.id)}
              >
                {/* Profile Logo */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-base text-white font-semibold text-xs">
                  {profile.name.charAt(0)}
                </div>
                
                {/* Profile Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {profile.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {profile.subtitle}
                  </div>
                </div>
                
                {/* Checkmark for selected profile */}
                {profile.id === currentProfile.id && (
                  <RiCheckLine className="size-4 text-primary-base" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
