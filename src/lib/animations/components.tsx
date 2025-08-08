"use client";

import React from "react";
import {
  motion,
  AnimatePresence,
  HTMLMotionProps,
  Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView, useMotionPreference } from "./hooks";
import {
  fadeVariants,
  scaleVariants,
  slideVariants,
  staggerVariants,
  staggerChildVariants,
  specialEffects,
  microInteractions,
  transitions,
} from "./presets";

/**
 * Base animated wrapper component
 */
interface AnimatedWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?:
    | "fade"
    | "scale"
    | "slideLeft"
    | "slideRight"
    | "slideUp"
    | "slideDown";
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
  threshold?: number;
  className?: string;
}

export function AnimatedWrapper({
  children,
  variant = "fade",
  delay = 0,
  duration,
  triggerOnce = true,
  threshold = 0.1,
  className,
  ...props
}: AnimatedWrapperProps) {
  const { ref, isInView, hasBeenInView } = useInView({ threshold });
  const { shouldAnimate } = useMotionPreference();

  const getVariants = (): Variants => {
    switch (variant) {
      case "scale":
        return scaleVariants;
      case "slideLeft":
        return slideVariants.fromLeft;
      case "slideRight":
        return slideVariants.fromRight;
      case "slideUp":
        return slideVariants.fromTop;
      case "slideDown":
        return slideVariants.fromBottom;
      default:
        return fadeVariants;
    }
  };

  const shouldTrigger = triggerOnce ? hasBeenInView : isInView;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={shouldAnimate ? getVariants() : undefined}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate && shouldTrigger ? "visible" : "hidden"}
      transition={{
        delay,
        duration: duration || transitions.smooth.duration,
        ...transitions.smooth,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fade in animation component
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnce?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration,
  className,
  triggerOnce = true,
}: FadeInProps) {
  return (
    <AnimatedWrapper
      variant="fade"
      delay={delay}
      duration={duration}
      className={className}
      triggerOnce={triggerOnce}
    >
      {children}
    </AnimatedWrapper>
  );
}

/**
 * Scale in animation component
 */
export function ScaleIn({
  children,
  delay = 0,
  duration,
  className,
  triggerOnce = true,
}: FadeInProps) {
  return (
    <AnimatedWrapper
      variant="scale"
      delay={delay}
      duration={duration}
      className={className}
      triggerOnce={triggerOnce}
    >
      {children}
    </AnimatedWrapper>
  );
}

/**
 * Slide in animation component
 */
interface SlideInProps extends FadeInProps {
  direction?: "left" | "right" | "up" | "down";
}

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration,
  className,
  triggerOnce = true,
}: SlideInProps) {
  const variantMap = {
    left: "slideLeft",
    right: "slideRight",
    up: "slideUp",
    down: "slideDown",
  } as const;

  return (
    <AnimatedWrapper
      variant={variantMap[direction]}
      delay={delay}
      duration={duration}
      className={className}
      triggerOnce={triggerOnce}
    >
      {children}
    </AnimatedWrapper>
  );
}

/**
 * Stagger children animation component
 */
interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  childDelay?: number;
  className?: string;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  childDelay = 0.2,
  className,
}: StaggerChildrenProps) {
  const { ref, isInView } = useInView();
  const { shouldAnimate } = useMotionPreference();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={shouldAnimate ? staggerVariants : undefined}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate && isInView ? "visible" : "hidden"}
      transition={{
        staggerChildren: staggerDelay,
        delayChildren: childDelay,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={shouldAnimate ? staggerChildVariants : undefined}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Animated button component
 */
interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: "default" | "subtle";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function AnimatedButton({
  children,
  variant = "default",
  className,
  onClick,
  disabled,
  type = "button",
}: AnimatedButtonProps) {
  const { shouldAnimate } = useMotionPreference();
  const variants =
    variant === "subtle"
      ? microInteractions.buttonSubtle
      : microInteractions.button;

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      variants={shouldAnimate ? variants : undefined}
      initial={shouldAnimate ? "rest" : false}
      whileHover={shouldAnimate ? "hover" : undefined}
      whileTap={shouldAnimate ? "tap" : undefined}
    >
      {children}
    </motion.button>
  );
}

/**
 * Animated card component
 */
interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function AnimatedCard({
  children,
  className,
  hoverEffect = true,
  ...props
}: AnimatedCardProps) {
  const { shouldAnimate } = useMotionPreference();

  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl border shadow-sm overflow-hidden",
        className
      )}
      variants={
        shouldAnimate && hoverEffect ? microInteractions.card : undefined
      }
      initial={shouldAnimate ? "rest" : false}
      whileHover={shouldAnimate && hoverEffect ? "hover" : undefined}
      whileTap={shouldAnimate && hoverEffect ? "tap" : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated icon component
 */
interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  hoverRotate?: boolean;
}

export function AnimatedIcon({
  children,
  className,
  hoverRotate = true,
}: AnimatedIconProps) {
  const { shouldAnimate } = useMotionPreference();

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      variants={
        shouldAnimate && hoverRotate ? microInteractions.icon : undefined
      }
      initial={shouldAnimate ? "rest" : false}
      whileHover={shouldAnimate && hoverRotate ? "hover" : undefined}
      whileTap={shouldAnimate && hoverRotate ? "tap" : undefined}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magical appear animation component (anime-style)
 */
interface MagicalAppearProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function MagicalAppear({
  children,
  delay = 0,
  className,
}: MagicalAppearProps) {
  const { ref, isInView } = useInView();
  const { shouldAnimate } = useMotionPreference();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={shouldAnimate ? specialEffects.magicalAppear : undefined}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate && isInView ? "visible" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Power up animation component
 */
export function PowerUp({
  children,
  delay = 0,
  className,
}: MagicalAppearProps) {
  const { ref, isInView } = useInView();
  const { shouldAnimate } = useMotionPreference();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={shouldAnimate ? specialEffects.powerUp : undefined}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate && isInView ? "visible" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Floating animation component
 */
interface FloatingProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function Floating({
  children,
  className,
  amplitude = 5,
  duration = 3,
}: FloatingProps) {
  const { shouldAnimate } = useMotionPreference();

  return (
    <motion.div
      className={className}
      animate={
        shouldAnimate
          ? {
              y: [-amplitude, amplitude, -amplitude],
            }
          : undefined
      }
      transition={
        shouldAnimate
          ? {
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * Pulse animation component
 */
interface PulseProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export function Pulse({
  children,
  className,
  scale = 1.05,
  duration = 2,
}: PulseProps) {
  const { shouldAnimate } = useMotionPreference();

  return (
    <motion.div
      className={className}
      animate={
        shouldAnimate
          ? {
              scale: [1, scale, 1],
            }
          : undefined
      }
      transition={
        shouldAnimate
          ? {
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * Shake animation component (for errors)
 */
interface ShakeProps {
  children: React.ReactNode;
  className?: string;
  trigger?: boolean;
  amplitude?: number;
}

export function Shake({
  children,
  className,
  trigger = false,
  amplitude = 2,
}: ShakeProps) {
  const { shouldAnimate } = useMotionPreference();

  return (
    <motion.div
      className={className}
      animate={
        shouldAnimate && trigger
          ? {
              x: [-amplitude, amplitude, -amplitude, amplitude, 0],
            }
          : {}
      }
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Page transition wrapper
 */
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slide" | "scale";
}

export function PageTransition({
  children,
  className,
  variant = "fade",
}: PageTransitionProps) {
  const { shouldAnimate } = useMotionPreference();

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  const getVariants = () => {
    switch (variant) {
      case "slide":
        return {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
        };
      case "scale":
        return {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.1, opacity: 0 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      className={className}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={transitions.smooth}
    >
      {children}
    </motion.div>
  );
}

/**
 * Presence animation wrapper for conditional rendering
 */
interface PresenceProps {
  children: React.ReactNode;
  show: boolean;
  mode?: "wait" | "sync";
}

export function Presence({ children, show, mode = "wait" }: PresenceProps) {
  return <AnimatePresence mode={mode}>{show && children}</AnimatePresence>;
}
