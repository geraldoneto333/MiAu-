'use client';

import { ReactNode } from 'react';

interface ModalProps {
  id: string;
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ id, title, open, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div id={id} className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="btn-cancel" onClick={onClose} aria-label="Fechar">
            &times;
          </button>
        </div>
        {children}
        {footer && <div className="modal-actions">{footer}</div>}
      </div>
    </div>
  );
}
