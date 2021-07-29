import React, { useRef } from 'react';

const Modal = ({ isOpen, toggleModal, children }) => {
    const modalRef = useRef(null);
    const handleCloseModal = (event) => {
        if (modalRef.current === event.target) {
            toggleModal();
        }
    }

    return (
       <div
        ref={ modalRef }
        onClick={ toggleModal === undefined ? (null) : (handleCloseModal) }
        className={`modal ${ isOpen ? "flex" : "hidden" }`}>
           <div className="modal-content">
               { children }
            </div>
       </div>
    );
}

export default Modal;