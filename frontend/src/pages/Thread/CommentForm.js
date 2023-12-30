import React from 'react';

const CommentForm = ({ value, onChange, onSubmit }) => {
    return (
      <div className="d-flex flex-column align-items-end mt-2">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Add a comment..."
          value={value}
          onChange={onChange}
        />
        <button
            type="button"
            className="btn mt-2 btn-warning text-primary"
            style={{ fontWeight: 'bold' }}
            onClick={onSubmit}
        >
            Post reply 
            <span className="ms-2"><i className="bi bi-reply"></i></span>
        </button>
      </div>
    );
  };
  

export default CommentForm;