import React, { ReactElement } from 'react';

const Modal = ({ isOpen, onClose, children }: {isOpen: boolean, onClose: ()=>void, children: ReactElement}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;