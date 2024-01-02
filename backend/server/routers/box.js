const express = require("express");
const {
  readBox,
  renameBox,
  updateBoxDescription,
  deleteBox,
  isModerator,
  addModerator,
  removeModerator,
  getModeratorStatus,
  updateBoxAutoApprove,
  isBanned
} = require("../controllers/box");
const { createThread } = require("../controllers/thread");
const { isAdmin } = require("../controllers/user");
const router = express.Router();

router.get("/:box_id/is-moderator", getModeratorStatus);
router.get("/:box_id/:page", readBox);
router.post("/:box_id/thread", isBanned, createThread);
router.put("/:box_id/name", isModerator, renameBox);
router.put("/:box_id/description", isModerator, updateBoxDescription);
router.put("/:box_id/moderators", isAdmin, addModerator);
router.delete("/:box_id/moderators", isAdmin, removeModerator);
router.delete("/:box_id", isAdmin, deleteBox);
router.put("/:box_id/autoapprove", isModerator, updateBoxAutoApprove);

module.exports = router;
