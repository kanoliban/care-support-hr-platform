'use client';

import React from 'react';
import { RiPlayFill, RiStopFill } from '@remixicon/react';
import * as Button from '@/components/ui/button';
import { useRealTimeSimulation } from '@/lib/careContext';

export default function RealTimeToggle({ className }: { className?: string }) {
  const { startRealTimeSimulation, stopRealTimeSimulation, isRealTimeActive } = useRealTimeSimulation();

  const handleToggle = () => {
    if (isRealTimeActive) {
      stopRealTimeSimulation();
    } else {
      startRealTimeSimulation();
    }
  };

  return (
    <Button.Root 
      variant='neutral' 
      mode='stroke' 
      size='small'
      onClick={handleToggle}
      className={`${isRealTimeActive ? 'bg-green-50 border-green-200 text-green-700' : ''} ${className || ''}`}
    >
      <Button.Icon as={isRealTimeActive ? RiStopFill : RiPlayFill} />
      {isRealTimeActive ? 'Stop Live Updates' : 'Start Live Updates'}
    </Button.Root>
  );
}
