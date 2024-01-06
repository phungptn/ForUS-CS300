import React, { useState, useContext } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.scss";
import { instance } from "../../api/config";
import EditorContext from "./context";

const ALLOWED = ["box", "thread", "comment"];

async function createThread(box_id, title, body) {
  try {
    const response = await instance.post(`/box/${box_id}/thread`, {
      title: title,
      body: body,
    });
    const thread_id = response.data.thread_id;
    window.location.href = `/thread/${thread_id}`;
  }
  catch (error) {
    if (error.response.status === 400) {
      if (error.response.data.code === 1) {
        alert('Chỉ được phép thêm tối đa 1 hình ảnh');
      }
    }
    console.log(error);
  }
}

async function updateThread(thread, setThread, body) {
  try {
    const response = await instance.put(`/thread/${thread.thread_id}`, {
      body: body
    });
    setThread(
      {
        ...thread,
        body: body
      }
    );
  }
  catch (error) {
    if (error.response.status === 400) {
      if (error.response.data.code === 1) {
        alert('Chỉ được phép thêm tối đa 1 hình ảnh');
      }
    }
    console.log(error);
  }
}

async function createComment(thread_id, box_id, body, replyTo) {
  try {
    await instance.post(`/thread/${thread_id}/comment`, {
      body: body,
      replyTo: replyTo,
      box_id: box_id,
    });
    window.location.reload();
  }
  catch (error) {
    console.log(error);
  }
}

async function updateComment(comment, setComment, body) {
  try {
    const response = await instance.put(`/comment/${comment.comment_id}`, {
      body: body
    });
    setComment(
      {
        ...comment,
        body: body
      }
    );
  }
  catch (error) {
    console.log(error);
  }
}

function TitleInput({ title, setTitle }) {
  return (
    <input
      id="titleInput"
      type="text"
      className="form-control bg-dark text-light rounded-4 mb-4"
      placeholder="Tiêu đề"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
      }}
      disabled={oldTitle ? true : false}
      readOnly={oldTitle ? true : false}
    />
  );
}

export default function Editor() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { type, state, setState, replyTo, oldBody } = useContext(EditorContext);

  const handleChange = (html) => {
    setBody(html);
  };

  const INSERT_TOOLBAR = type === 'createThread' || type === 'updateThread' ? ['link', 'image'] : ['link'];

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      [
        "bold",
        "italic",
        "underline",
        "strike",
        "code-block",
        { color: [] },
        { background: [] },
      ],
      [
        { indent: "-1" },
        { indent: "+1" },
        { list: "ordered" },
        { list: "bullet" },
        { align: [] },
      ],
      INSERT_TOOLBAR,
      ["clean"],
    ],
  };

  if (type === 'updateThread' || type === 'updateComment') {
    setBody(oldBody);
  }

  return (
    <>
      {type === 'createThread' && <TitleInput title={title} setTitle={setTitle} />}
      <ReactQuill
        theme="snow"
        value={body}
        onChange={handleChange}
        modules={modules}
        placeholder="Nội dung"
        id="editor"
      />
      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-warning text-primary"
          style={{ fontWeight: "bold" }}
          onClick={() => {
            if (type === "createThread") {
              createThread(state._id, title, body);
            }
            else if (type === "updateThread") {
              updateThread(state, setState, body);
            }
            else if (type === "createComment") {
              createComment(state._id, state.box, body, replyTo);
            }
            else if (type === "updateComment") {
              updateComment(state, setState, body);
            }
          }}
        >
          {
            type === "createThread" ? "Đăng bài" :
              type === "createComment" ? "Gửi bình luận" :
                type === "updateThread" ? "Lưu thay đổi" :
                  "Lưu thay đổi"
          }
          <span className="ms-2">
            {type === "createThread" ? <i className="bi bi-pencil-square"></i> :
              type === "createComment" ? <i className="bi bi-reply"></i> :
                type === "updateThread" ? <i className="bi bi-pencil-square"></i> :
                  <i className="bi bi-pencil-square"></i>}
          </span>
        </button>
      </div>
    </>
  );
}
