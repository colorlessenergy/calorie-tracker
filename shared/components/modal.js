import React, { useRef, useEffect } from 'react';

const Modal = ({ isOpen, toggleModal, children, outsideElements = null }) => {
    const modalRef = useRef(null);
    const handleCloseModal = (event) => {
        if (modalRef.current === event.target) {
            toggleModal();
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-is-open');
        } else {
            document.body.classList.remove('modal-is-open');
        }

        return () => {
            document.body.classList.remove('modal-is-open');
        }
    }, [ isOpen ]);

    return (
       <div
        ref={ modalRef }
        onClick={ toggleModal === undefined ? (null) : (handleCloseModal) }
        className={`modal ${ isOpen ? "flex flex-direction-column" : "hidden" }`}>
           <div className="modal-content modal-width">
               { children }
            </div>
            { outsideElements ? (
                <div className="modal-width">
                    { outsideElements }
                </div>
            ) : (null) }
       </div>
    );
}

export default Modal;