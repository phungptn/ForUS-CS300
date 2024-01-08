import { React, useEffect, useContext, createContext } from "react";
import "./modal.css";

export function DeleteModal({
  isOpen,
  handleClose,
  handleDelete,
  modalTitle,
  modalContent,
}) {
  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <div
        className="react-modal-overlay"
        style={{ display: isOpen ? "block" : "none" }}
        onClick={handleClose}
      >
        <div
          className={`modal fade react-modal-style ${isOpen ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="react-modal-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                class="modal-content"
                style={{ background: "#1D76C6", border: "1px solid #46A5FA" }}
              >
                <div
                  class="modal-header"
                  style={{ borderBottom: "1px solid #46A5FA" }}
                >
                  <h1
                    className="modal-title fs-5 text-white"
                    id="deleteModalLabel"
                  >
                    {modalTitle}
                  </h1>
                  <button
                    type="button"
                    className="btn text-white"
                    onClick={handleClose}
                  >
                    x
                  </button>
                </div>
                <div className="modal-body text-white">{modalContent}</div>
                <div
                  class="modal-footer"
                  style={{ borderTop: "1px solid #46A5FA" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClose}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ReportModal({ isOpen, handleClose, handleDelete, modalTitle }) {
  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <div
        className="react-modal-overlay"
        style={{ display: isOpen ? "block" : "none" }}
        onClick={handleClose}
      >
        <div
          className={`modal fade react-modal-stye ${isOpen ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="react-modal-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                class="modal-content"
                style={{ background: "#1D76C6", border: "1px solid #46A5FA" }}
              >
                <div
                  class="modal-header"
                  style={{ borderBottom: "1px solid #46A5FA" }}
                >
                  <h1
                    className="modal-title fs-5 text-white"
                    id="deleteModalLabel"
                  >
                    {modalTitle}
                  </h1>
                  <button
                    type="button"
                    className="btn text-white"
                    onClick={handleClose}
                  >
                    x
                  </button>
                </div>
                <div className="modal-body text-white">
                  <b>Nội dung báo cáo:</b>
                  <textarea
                    id="report-content-textarea"
                    style={{ width: "100%" }}
                    rows="12"
                  ></textarea>
                </div>
                <div
                  class="modal-footer"
                  style={{ borderTop: "1px solid #46A5FA" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClose}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Báo cáo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ReportCardModal({ isOpen, handleClose, report }) {
  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      handleClose();
    }
  };

  const handleDelete = async () => {};

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <div
        className="react-modal-overlay"
        style={{ display: isOpen ? "block" : "none" }}
        onClick={handleClose}
      >
        <div
          className={`modal fade react-modal-stye ${isOpen ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              class="modal-content"
              style={{ background: "#1D76C6", border: "1px solid #46A5FA" }}
            >
              <div
                class="modal-header"
                style={{ borderBottom: "1px solid #46A5FA" }}
              >
                <h1
                  className="modal-title fs-5 text-white"
                  id="deleteModalLabel"
                >
                  Nội dung báo cáo
                </h1>
                <button
                  type="button"
                  className="btn text-white"
                  onClick={handleClose}
                >
                  x
                </button>
              </div>
              <div className="modal-body text-white">
                <p>Something...</p>
              </div>
              <div
                class="modal-footer"
                style={{ borderTop: "1px solid #46A5FA" }}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleClose}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleDelete}
                >
                  Mark As Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CreateNotificationModal({
  isOpen,
  onCancel,
  onConfirm,
  title,
  body,
  onTitleChange,
  onBodyChange,
}) {
  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      onCancel();
    }
  };

  const handleSendNotification = async () => {
    onConfirm();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="react-modal-overlay"
          style={{ display: isOpen ? "block" : "none" }}
          onClick={onCancel}
        >
          <div
            className={`modal fade react-modal-stye ${isOpen ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{ display: isOpen ? "block" : "none" }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content"
                style={{ background: "#1D76C6", border: "1px solid #46A5FA" }}
              >
                <div
                  className="modal-header"
                  style={{ borderBottom: "1px solid #46A5FA" }}
                >
                  <h1
                    className="modal-title fs-5 text-white"
                    id="deleteModalLabel"
                  >
                    Create Notification
                  </h1>
                  <button
                    type="button"
                    className="btn text-white"
                    onClick={onCancel}
                  >
                    x
                  </button>
                </div>
                <div className="modal-body text-white">
                  <div className="mb-3">
                    <label htmlFor="notificationTitle" className="form-label">
                      Title:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="notificationTitle"
                      value={title}
                      onChange={onTitleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notificationBody" className="form-label">
                      Body:
                    </label>
                    <textarea
                      className="form-control"
                      id="notificationBody"
                      rows="4"
                      value={body}
                      onChange={onBodyChange}
                    />
                  </div>
                </div>
                <div
                  className="modal-footer"
                  style={{ borderTop: "1px solid #46A5FA" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSendNotification}
                  >
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const ModalContext = createContext();

export const Modal = ({ children, isOpen, onClose }) => {
  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div
      className="react-modal-overlay"
      style={{ display: isOpen ? "block" : "none" }}
      onClick={onClose}
    >
      <div
        className={`modal fade react-modal-style ${isOpen ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="react-modal-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              class="modal-content"
              style={{ background: "#1D76C6", border: "1px solid #46A5FA" }}
            >
              <ModalContext.Provider value={{ onClose }}>
                {children}
              </ModalContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DismissButton = ({ children, className }) => {
  const { onClose } = useContext(ModalContext);

  return (
    <button type="button" className={className} onClick={onClose}>
      {children}
    </button>
  );
};

const ModalHeader = ({ children }) => {
  return (
    <div className="react-modal-header">
      <div className="react-modal-title">{children}</div>
      <DismissButton className="btn-close">x</DismissButton>
    </div>
  );
};

const ModalBody = ({ children }) => {
  return <div className="react-modal-body">{children}</div>;
};

const ModalFooter = ({ children }) => {
  return <div className="react-modal-footer">{children}</div>;
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.DismissButton = DismissButton;
