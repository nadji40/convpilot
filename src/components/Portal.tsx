import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

export const Portal = ({ children }: PortalProps) => {
  const modalRoot = document.getElementById('modal-root');
  
  if (!modalRoot) {
    console.error('Modal root element not found');
    return null;
  }

  return createPortal(children, modalRoot);
};
