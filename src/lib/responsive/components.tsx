"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  useBreakpoint,
  useResponsiveValue,
  useResponsiveColumns,
} from "./hooks";
import { responsiveSpacing } from "./breakpoints";

/**
 * Responsive Container Component
 */
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  center?: boolean;
  fluid?: boolean;
  children: React.ReactNode;
}

export function Container({
  size = "xl",
  center = true,
  fluid = false,
  className,
  children,
  ...props
}: ContainerProps) {
  const containerClasses = cn(
    "w-full",
    {
      "mx-auto": center,
      "max-w-full": fluid || size === "full",
      "max-w-sm": size === "xs",
      "max-w-md": size === "sm",
      "max-w-2xl": size === "md",
      "max-w-4xl": size === "lg",
      "max-w-6xl": size === "xl",
      "max-w-7xl": size === "2xl",
    },
    className
  );

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
}

/**
 * Responsive Grid Component
 */
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  };
  children: React.ReactNode;
}

export function Grid({
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap,
  className,
  children,
  ...props
}: GridProps) {
  const currentCols = useResponsiveColumns(cols);
  const currentGap = useResponsiveValue(gap) || responsiveSpacing.gap.sm;

  const gridClasses = cn(
    "grid",
    {
      "grid-cols-1": currentCols === 1,
      "grid-cols-2": currentCols === 2,
      "grid-cols-3": currentCols === 3,
      "grid-cols-4": currentCols === 4,
      "grid-cols-5": currentCols === 5,
      "grid-cols-6": currentCols === 6,
    },
    className
  );

  return (
    <div className={gridClasses} style={{ gap: currentGap }} {...props}>
      {children}
    </div>
  );
}

/**
 * Responsive Flex Component
 */
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: {
    xs?: "row" | "col";
    sm?: "row" | "col";
    md?: "row" | "col";
    lg?: "row" | "col";
    xl?: "row" | "col";
    "2xl"?: "row" | "col";
  };
  wrap?: boolean;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  };
  children: React.ReactNode;
}

export function Flex({
  direction = { xs: "col", md: "row" },
  wrap = false,
  align = "start",
  justify = "start",
  gap,
  className,
  children,
  ...props
}: FlexProps) {
  const currentDirection = useResponsiveValue(direction) || "row";
  const currentGap = useResponsiveValue(gap) || responsiveSpacing.gap.sm;

  const flexClasses = cn(
    "flex",
    {
      "flex-row": currentDirection === "row",
      "flex-col": currentDirection === "col",
      "flex-wrap": wrap,
      "items-start": align === "start",
      "items-center": align === "center",
      "items-end": align === "end",
      "items-stretch": align === "stretch",
      "justify-start": justify === "start",
      "justify-center": justify === "center",
      "justify-end": justify === "end",
      "justify-between": justify === "between",
      "justify-around": justify === "around",
      "justify-evenly": justify === "evenly",
    },
    className
  );

  return (
    <div className={flexClasses} style={{ gap: currentGap }} {...props}>
      {children}
    </div>
  );
}

/**
 * Responsive Stack Component (Vertical layout)
 */
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  };
  align?: "start" | "center" | "end" | "stretch";
  children: React.ReactNode;
}

export function Stack({
  spacing,
  align = "stretch",
  className,
  children,
  ...props
}: StackProps) {
  const currentSpacing =
    useResponsiveValue(spacing) || responsiveSpacing.gap.md;

  const stackClasses = cn(
    "flex flex-col",
    {
      "items-start": align === "start",
      "items-center": align === "center",
      "items-end": align === "end",
      "items-stretch": align === "stretch",
    },
    className
  );

  return (
    <div className={stackClasses} style={{ gap: currentSpacing }} {...props}>
      {children}
    </div>
  );
}

/**
 * Responsive Spacer Component
 */
interface SpacerProps {
  size?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  };
  direction?: "horizontal" | "vertical";
}

export function Spacer({ size, direction = "vertical" }: SpacerProps) {
  const currentSize = useResponsiveValue(size) || responsiveSpacing.gap.md;

  if (direction === "horizontal") {
    return <div style={{ width: currentSize }} />;
  }

  return <div style={{ height: currentSize }} />;
}

/**
 * Responsive Show/Hide Component
 */
interface ShowProps {
  above?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  below?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  only?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  children: React.ReactNode;
}

export function Show({ above, below, only, children }: ShowProps) {
  const { current, isXs, isSm, isMd, isLg, isXl, is2Xl } = useBreakpoint();

  const breakpointValues = {
    xs: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    "2xl": 5,
  };

  const currentValue = breakpointValues[current];

  let shouldShow = true;

  if (only) {
    shouldShow = current === only;
  } else {
    if (above) {
      shouldShow = shouldShow && currentValue >= breakpointValues[above];
    }
    if (below) {
      shouldShow = shouldShow && currentValue <= breakpointValues[below];
    }
  }

  return shouldShow ? <>{children}</> : null;
}

/**
 * Responsive Hide Component
 */
interface HideProps {
  above?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  below?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  only?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  children: React.ReactNode;
}

export function Hide({ above, below, only, children }: HideProps) {
  return (
    <Show above={above} below={below} only={only}>
      <div style={{ display: "none" }}>{children}</div>
    </Show>
  );
}

/**
 * Responsive Padding Component
 */
interface PaddingProps extends React.HTMLAttributes<HTMLDivElement> {
  p?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  };
  px?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  };
  py?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  };
  children: React.ReactNode;
}

export function Padding({
  p,
  px,
  py,
  children,
  className,
  style,
  ...props
}: PaddingProps) {
  const currentP = useResponsiveValue(p);
  const currentPx = useResponsiveValue(px);
  const currentPy = useResponsiveValue(py);

  const paddingStyle = {
    ...(currentP && { padding: currentP }),
    ...(currentPx && { paddingLeft: currentPx, paddingRight: currentPx }),
    ...(currentPy && { paddingTop: currentPy, paddingBottom: currentPy }),
    ...style,
  };

  return (
    <div className={className} style={paddingStyle} {...props}>
      {children}
    </div>
  );
}
