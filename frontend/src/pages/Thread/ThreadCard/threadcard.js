import "../card.css";
import { ThreadHorizontalVoteBar } from "../UserControl/usercontrol";
import { getTimePassed } from "../../../utils/getTimePassed";
import { useEffect, useState } from "react";
import { downloadImage } from "../../../utils/loadImage";
import TextRenderer from "../../Text/renderer";
import {
  UpdateThreadButton,
  DeleteThreadButton,
} from "../UserControl/usercontrol";
import Editor from "../../Editor/editor";
import EditorContext from "../../Editor/context";
import { useContext } from "react";
import { ThreadContext } from "../context";

export default function ({ thread }) {
  const [profilePicture, setProfilePicture] = useState(null);
  useEffect(() => {
    async function getProfilePicture() {
      const url = await downloadImage(
        "images/avatar/" + thread.author.avatarUrl
      );
      setProfilePicture(url);
    }
    getProfilePicture();
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);

  const handleUpdateClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const { setThread } = useContext(ThreadContext);

  return (
    <div className="card-bod m-0" style={{ margin: "20px 0" }}>
      <div className="row m-0 p-0 flex-grow-1">
        <div
          className="col-2 bg-card-secondary round-left d-flex flex-column align-items-center text-center"
          style={{ paddingTop: "20px", paddingLeft: "20px" }}
        >
          <img
            className="rounded-circle centered-and-cropped bg-dark"
            width={100}
            height={100}
            src={
              profilePicture
                ? profilePicture
                : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
            }
            alt="avatar"
          />
          <div className="username mt-2">
            {thread.author && thread.author.fullname}
          </div>
        </div>
        <div className="col-10 bg-card-primary round-right d-flex flex-column justify-content-between">
          <div
            className="row-12 d-flex justify-content-between"
            style={{
              margin: "0 20px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
              padding: "16px 0px 10px",
            }}
          >
            <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              <i className="bi bi-clock"></i> {getTimePassed(thread.createdAt)}
            </div>
            <div className="d-flex justify-content-between">
              {thread.isUpdater == 1 ? (
                <UpdateThreadButton setOnClick={handleUpdateClick} />
              ) : null}
              {thread.isDeleter == 1 ? (
                <DeleteThreadButton thread={thread} />
              ) : null}
            </div>
          </div>

          {isEditMode ? (
            // Render editor in edit mode
            <div
              className="justify-content-between"
              style={{ padding: "10px" }}
            >
              <EditorContext.Provider
                value={{
                  type: "updateThread",
                  state: thread,
                  setState: setThread,
                  oldBody: thread.body,
                  update: handleCancelEdit,
                }}
              >
                <Editor />
              </EditorContext.Provider>
            </div>
          ) : (
            <div style={{ padding: "0px 20px" }}>
              {/* Render thread body */}
              <div style={{ padding: "10px 0px 20px" }}>
                <TextRenderer input={thread.body} />
              </div>

              {/* Display updated timestamp */}
              <div
                className="py-0.5 px-0 m-0 d-flex flex-row-reverse justify-content-between text-right"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.8rem",
                }}
              >
                Chỉnh sửa lần cuối: {getTimePassed(thread.updatedAt)}
              </div>

              {/* Vote bar */}
              <div className="py-3 px-0 m-0 d-flex flex-row-reverse justify-content-stretch gap-4">
                <ThreadHorizontalVoteBar thread={thread} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
