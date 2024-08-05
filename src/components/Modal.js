import React, { useState, useEffect } from 'react';
import '../CSS/model.css';

const Modal = ({ isOpen, onClose, onSave, initialContent }) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  if (!isOpen) {
    return null;
  }

  return (  
    <div className="modal">
      <div className="modal-content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          cols="50"
        />
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
          <button onClick={() => onSave(content)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;


