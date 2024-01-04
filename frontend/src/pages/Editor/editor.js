import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.scss';




export default function Editor( { oldText } ) {
  const [text, setText] = useState('');
  
  const handleChange = (html) => {
    setText(html);
  }

  const modules = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'code-block', { 'color': [] }, { 'background': [] }],
      [{ 'indent': '-1'}, { 'indent': '+1' }, { 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }
  
  if (oldText) {
    setText(oldText);
  }

  return (
    <>
      <ReactQuill theme="snow" value={text} onChange={handleChange} modules={modules} placeholder='Nội dung'/>
      <div className='d-flex justify-content-end mt-4'>
        <button className='btn btn-warning' onClick={() => {console.log(text)}}>Submit</button>
      </div>
    </>
  );
}

