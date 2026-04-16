'use client';

import React from 'react';

interface ConfirmSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  confirmMessage: string;
}

/**
 * Componente cliente ligero para interceptar envíos de formularios Server Actions
 * con una alerta de confirmación nativa. Aisla la directiva "use client".
 */
export function ConfirmSubmitButton({ confirmMessage, children, ...props }: ConfirmSubmitButtonProps) {
  return (
    <button 
      {...props} 
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
        if (props.onClick) props.onClick(e);
      }}
    >
      {children}
    </button>
  );
}
