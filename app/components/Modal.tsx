import React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, message }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeButton} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
