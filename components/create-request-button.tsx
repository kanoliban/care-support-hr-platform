'use client';

import { RiAddLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

export function CreateRequestButton({ 
  className, 
  onClick 
}: { 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button.Root className={className} onClick={onClick}>
      <Button.Icon as={RiAddLine} />
      Create Request
    </Button.Root>
  );
}
