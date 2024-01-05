import React from 'react';
import EditorContext from '../../Editor/context';
import Editor from '../../Editor/editor';

const CommentForm = ({ thread, replyTo, setReplyToCommentId }) => {
    return (
      <EditorContext.Provider value={{ type: 'createComment', state: thread, replyTo: replyTo}}>
        <Editor />
      </EditorContext.Provider>
    );
  };
  

export default CommentForm;