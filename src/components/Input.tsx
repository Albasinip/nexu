import React from 'react';

export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        padding: "0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid var(--color-border)",
        outline: "none",
        width: "100%",
        ...props.style,
      }}
    />
  );
}
