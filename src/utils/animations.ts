// Animation utilities for Webflow-inspired effects

export interface AnimationConfig {
  duration: string;
  delay: string;
  easing: string;
}

// Fade in up animation
export const fadeInUp = (delay: number = 0): React.CSSProperties => ({
  animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
  opacity: 0,
});

// Fade in animation
export const fadeIn = (delay: number = 0): React.CSSProperties => ({
  animation: `fadeIn 0.4s ease-out ${delay}s forwards`,
  opacity: 0,
});

// Slide in from left
export const slideInLeft = (delay: number = 0): React.CSSProperties => ({
  animation: `slideInLeft 0.5s ease-out ${delay}s forwards`,
  opacity: 0,
});

// Slide in from right
export const slideInRight = (delay: number = 0): React.CSSProperties => ({
  animation: `slideInRight 0.5s ease-out ${delay}s forwards`,
  opacity: 0,
});

// Scale up animation
export const scaleUp = (delay: number = 0): React.CSSProperties => ({
  animation: `scaleUp 0.4s ease-out ${delay}s forwards`,
  opacity: 0,
  transform: 'scale(0.95)',
});

// Stagger delay calculator
export const getStaggerDelay = (index: number, baseDelay: number = 0, increment: number = 0.1): number => {
  return baseDelay + (index * increment);
};

// Hover lift effect
export const hoverLift: React.CSSProperties = {
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
};

// Apply hover lift with shadow
export const applyHoverLift = (
  element: HTMLElement,
  isDark: boolean,
  lift: number = 4,
  shadowIntensity: number = 0.15
) => {
  element.style.transform = `translateY(-${lift}px)`;
  element.style.boxShadow = isDark
    ? `0 ${lift * 2}px ${lift * 6}px rgba(0, 0, 0, ${shadowIntensity * 2})`
    : `0 ${lift * 2}px ${lift * 6}px rgba(0, 0, 0, ${shadowIntensity})`;
};

// Remove hover lift
export const removeHoverLift = (element: HTMLElement) => {
  element.style.transform = 'translateY(0)';
  element.style.boxShadow = 'none';
};

// CSS keyframes to be added to global styles
export const animationKeyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

// Page transition config
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// Card animation variants
export const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

// Smooth scroll to element
export const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

