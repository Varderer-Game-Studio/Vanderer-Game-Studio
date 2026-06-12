import React from 'react';
export const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className = '', children }) => (
  <section id={id} className={`relative py-28 px-6 ${className}`}>
    <div className="mx-auto max-w-content">{children}</div>
  </section>
);
