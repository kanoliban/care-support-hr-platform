'use client';

import * as React from 'react';
import { RiCheckLine } from '@remixicon/react';

import { cn } from '@/utils/cn';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperDirection = 'forward' | 'backward' | 'none';

export interface StepperChangeDetails {
  nextValue: string;
  previousValue: string | null;
  direction: StepperDirection;
}

interface StepperContextValue {
  value: string | undefined;
  orientation: StepperOrientation;
  items: string[];
  registerItem: (value: string) => void;
  unregisterItem: (value: string) => void;
  requestValueChange: (value: string) => Promise<void>;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

const useStepperContext = (component: string) => {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error(`${component} must be used within Stepper`);
  }
  return context;
};

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  orientation?: StepperOrientation;
  onValueChange?: (details: StepperChangeDetails) => void;
  onValidate?: (details: StepperChangeDetails) => boolean | Promise<boolean>;
}

export function Stepper({
  value,
  defaultValue,
  orientation = 'horizontal',
  onValueChange,
  onValidate,
  className,
  children,
  ...props
}: StepperProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const [items, setItems] = React.useState<string[]>([]);

  const currentValue = isControlled ? value : internalValue;

  React.useEffect(() => {
    if (!isControlled) return;
    setInternalValue(value);
  }, [isControlled, value]);

  React.useEffect(() => {
    if (currentValue || items.length === 0) return;
    const firstItem = defaultValue ?? items[0];
    if (!firstItem) return;
    setInternalValue(firstItem);
    onValueChange?.({
      nextValue: firstItem,
      previousValue: null,
      direction: 'forward',
    });
    // we intentionally omit onValidate for initial sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue, items, defaultValue]);

  const registerItem = React.useCallback((itemValue: string) => {
    setItems((prev) => (prev.includes(itemValue) ? prev : [...prev, itemValue]));
  }, []);

  const unregisterItem = React.useCallback((itemValue: string) => {
    setItems((prev) => prev.filter((item) => item !== itemValue));
  }, []);

  const requestValueChange = React.useCallback(
    async (nextValue: string) => {
      if (!items.includes(nextValue)) return;
      const previousValue = currentValue ?? null;
      if (previousValue === nextValue) return;

      const previousIndex = previousValue ? items.indexOf(previousValue) : -1;
      const nextIndex = items.indexOf(nextValue);

      let direction: StepperDirection = 'none';
      if (previousIndex !== -1 && nextIndex !== -1) {
        direction = nextIndex > previousIndex ? 'forward' : 'backward';
      }

      const details: StepperChangeDetails = {
        nextValue,
        previousValue,
        direction,
      };

      if (onValidate) {
        const result = await onValidate(details);
        if (!result) return;
      }

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(details);
    },
    [currentValue, isControlled, items, onValidate, onValueChange],
  );

  const contextValue = React.useMemo<StepperContextValue>(
    () => ({
      value: currentValue,
      orientation,
      items,
      registerItem,
      unregisterItem,
      requestValueChange,
    }),
    [currentValue, orientation, items, registerItem, unregisterItem, requestValueChange],
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        className={cn(
          'flex gap-6',
          orientation === 'horizontal' ? 'w-full flex-col' : 'flex-row',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

interface StepperListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StepperList({ className, children, ...props }: StepperListProps) {
  const { orientation } = useStepperContext('StepperList');
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal'
          ? 'flex-row items-center'
          : 'flex-col items-start gap-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface StepperItemContextValue {
  value: string;
  status: 'active' | 'completed' | 'inactive';
  index: number;
  isLast: boolean;
}

const StepperItemContext = React.createContext<StepperItemContextValue | null>(
  null,
);

const useStepperItemContext = (component: string) => {
  const context = React.useContext(StepperItemContext);
  if (!context) {
    throw new Error(`${component} must be used within StepperItem`);
  }
  return context;
};

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function StepperItem({ value, className, children, ...props }: StepperItemProps) {
  const { registerItem, unregisterItem, items, value: activeValue } =
    useStepperContext('StepperItem');

  React.useEffect(() => {
    registerItem(value);
    return () => unregisterItem(value);
  }, [registerItem, unregisterItem, value]);

  const index = items.indexOf(value);
  const activeIndex = activeValue ? items.indexOf(activeValue) : -1;
  const status: StepperItemContextValue['status'] =
    activeIndex === index
      ? 'active'
      : activeIndex > index
        ? 'completed'
        : 'inactive';

  const contextValue = React.useMemo<StepperItemContextValue>(
    () => ({
      value,
      status,
      index,
      isLast: index === items.length - 1,
    }),
    [value, status, index, items.length],
  );

  return (
    <StepperItemContext.Provider value={contextValue}>
      <div
        data-status={status}
        className={cn('flex items-center gap-3', className)}
        {...props}
      >
        {children}
      </div>
    </StepperItemContext.Provider>
  );
}

interface StepperTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {}

export function StepperTrigger({ className, children, ...props }: StepperTriggerProps) {
  const { requestValueChange } = useStepperContext('StepperTrigger');
  const { value, status } = useStepperItemContext('StepperTrigger');

  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      await requestValueChange(value);
    },
    [props, requestValueChange, value],
  );

  return (
    <button
      type="button"
      data-state={status}
      className={cn(
        'flex items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 text-left transition',
        status === 'active' && 'bg-primary-alpha-10 border-primary-base text-primary-base',
        status === 'completed' && 'text-text-sub-600 hover:text-text-strong-950',
        status === 'inactive' && 'text-text-sub-600 hover:text-text-strong-950',
        className,
      )}
      {...props}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StepperIndicator({ className, ...props }: StepperIndicatorProps) {
  const { status, index } = useStepperItemContext('StepperIndicator');

  return (
    <div
      data-state={status}
      className={cn(
        'flex size-8 items-center justify-center rounded-full border text-label-sm transition',
        status === 'active' && 'border-primary-base bg-primary-base text-static-white',
        status === 'completed' && 'border-primary-base bg-primary-base text-static-white',
        status === 'inactive' && 'border-stroke-soft-200 bg-bg-white-0 text-text-sub-600',
        className,
      )}
      {...props}
    >
      {status === 'completed' ? <RiCheckLine className="size-4" /> : index + 1}
    </div>
  );
}

interface StepperTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StepperTitle({ className, ...props }: StepperTitleProps) {
  const { status } = useStepperItemContext('StepperTitle');
  return (
    <div
      data-state={status}
      className={cn('text-label-sm font-medium text-text-strong-950', className)}
      {...props}
    />
  );
}

interface StepperDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StepperDescription({ className, ...props }: StepperDescriptionProps) {
  return (
    <div
      className={cn('text-paragraph-xs text-text-sub-600', className)}
      {...props}
    />
  );
}

interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StepperSeparator({ className, ...props }: StepperSeparatorProps) {
  const { orientation } = useStepperContext('StepperSeparator');
  const { isLast } = useStepperItemContext('StepperSeparator');

  if (isLast) return null;

  return (
    <div
      aria-hidden
      className={cn(
        orientation === 'horizontal'
          ? 'h-px flex-1 bg-stroke-soft-200'
          : 'mt-4 h-10 w-px bg-stroke-soft-200',
        className,
      )}
      {...props}
    />
  );
}

interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

export function StepperContent({
  value,
  className,
  forceMount = false,
  children,
  ...props
}: StepperContentProps) {
  const { value: activeValue } = useStepperContext('StepperContent');
  const isActive = activeValue === value;

  if (!forceMount && !isActive) {
    return null;
  }

  return (
    <div
      data-state={isActive ? 'active' : 'inactive'}
      hidden={!isActive}
      className={cn(isActive ? 'block' : 'hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function composeEventHandlers<
  E extends React.SyntheticEvent,
  Handler extends ((event: E) => void) | undefined,
>(
  originalEventHandler?: Handler,
  ourEventHandler?: Handler,
) {
  return function handler(event: E) {
    originalEventHandler?.(event);
    if (!event.defaultPrevented) {
      ourEventHandler?.(event);
    }
  };
}

interface StepperPrevNextBaseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function StepperPrevTrigger({
  asChild = false,
  className,
  children,
  ...props
}: StepperPrevNextBaseProps) {
  const { value, items, requestValueChange } = useStepperContext('StepperPrevTrigger');
  const currentIndex = value ? items.indexOf(value) : -1;
  const prevValue = currentIndex > 0 ? items[currentIndex - 1] : null;

  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!prevValue) return;
      await requestValueChange(prevValue);
    },
    [prevValue, requestValueChange],
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: composeEventHandlers(children.props.onClick, (event) => {
        event.preventDefault();
        if (!prevValue) return;
        handleClick(event as React.MouseEvent<HTMLButtonElement>);
      }),
      'data-disabled': prevValue ? undefined : '',
      disabled: prevValue ? children.props.disabled : true,
    });
  }

  return (
    <button
      type="button"
      disabled={!prevValue}
      className={className}
      {...props}
      onClick={composeEventHandlers(props.onClick, (event) => {
        event.preventDefault();
        if (!prevValue) return;
        handleClick(event);
      })}
    >
      {children}
    </button>
  );
}

export function StepperNextTrigger({
  asChild = false,
  className,
  children,
  ...props
}: StepperPrevNextBaseProps) {
  const { value, items, requestValueChange } = useStepperContext('StepperNextTrigger');
  const currentIndex = value ? items.indexOf(value) : -1;
  const nextValue =
    currentIndex !== -1 && currentIndex < items.length - 1
      ? items[currentIndex + 1]
      : null;

  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!nextValue) return;
      await requestValueChange(nextValue);
    },
    [nextValue, requestValueChange],
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: composeEventHandlers(children.props.onClick, (event) => {
        event.preventDefault();
        if (!nextValue) return;
        handleClick(event as React.MouseEvent<HTMLButtonElement>);
      }),
      'data-disabled': nextValue ? undefined : '',
      disabled: nextValue ? children.props.disabled : true,
    });
  }

  return (
    <button
      type="button"
      disabled={!nextValue}
      className={className}
      {...props}
      onClick={composeEventHandlers(props.onClick, (event) => {
        event.preventDefault();
        if (!nextValue) return;
        handleClick(event);
      })}
    >
      {children}
    </button>
  );
}

export const StepperComponents = {
  Root: Stepper,
  List: StepperList,
  Item: StepperItem,
  Trigger: StepperTrigger,
  Indicator: StepperIndicator,
  Title: StepperTitle,
  Description: StepperDescription,
  Separator: StepperSeparator,
  Content: StepperContent,
  PrevTrigger: StepperPrevTrigger,
  NextTrigger: StepperNextTrigger,
};

export type StepperComponent = typeof StepperComponents;
