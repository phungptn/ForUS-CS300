import React, { useState, useContext, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.scss";
import { instance } from "../../api/config";
import EditorContext from "./context";

const TITLE_MAX_LENGTH = 128;

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
  if (thread.body != body) {
    try {
      const response = await instance.put(`/thread/${thread._id}`, {
        body: body
      });
      if (response.status === 200) {
        setThread(
          {
            ...thread,
            body: body
          }
        );
      }
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

async function updateComment(thread, setThread, comment, body) {
  const recursivelyUpdateReplies = (comments) => {
    return comments.map((c) => {
      if (c._id === comment._id) {
        return { ...c, body: body, updatedAt: new Date() - 1000 };
      } else if (c.reply && c.reply._id === comment._id) {
        return { ...c, reply: { ...c.reply, body: body } };
      } else {
        return c;
      }
    });
  };

  if (comment.body != body) {
    try {
      const response = await instance.put(`/comment/${comment._id}`, {
        body: body
      });
      if (response.status === 200) {
        const updatedComments = recursivelyUpdateReplies(thread.comments);

        const updatedThread = { ...thread, comments: updatedComments };

        setThread(updatedThread);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
}

function TitleInput({ title, setTitle }) {
  return (
    <div className="d-flex align-items-center bg-dark text-light rounded-4 mb-4 border">
      <textarea
        id="titleInput"
        type="text"
        className="form-control bg-dark text-light rounded-start-4 rounded-end-0 border-start-0 border-top-0 border-bottom-0"
        placeholder="Tiêu đề"
        style={{ resize: "none" }}
        value={title}
        maxLength={TITLE_MAX_LENGTH}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
          setTitle(e.target.value);
        }}
      />
      <small className="d-block text-end" style={{marginInline: '0.75rem', fontWeight: 'bold'}}>
        {title.length}/{TITLE_MAX_LENGTH}
      </small>
    </div>
  );
}

export default function Editor() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { type, state, setState, replyTo, oldBody, update, comment } = useContext(EditorContext);

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

  useEffect(() => {
    if (type === 'updateThread' || type === 'updateComment') {
      setBody(oldBody);
    }
  }, [type, oldBody]);

  return (
    <>
      {type === 'createThread' && <TitleInput title={title} setTitle={setTitle} />}
      <div>
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
                updateThread(state, setState, body); update();
              }
              else if (type === "createComment") {
                createComment(state._id, state.box, body, replyTo);
              }
              else if (type === "updateComment") {
                updateComment(state, setState, comment, body); update();
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
      </div>
    </>
  );
}
