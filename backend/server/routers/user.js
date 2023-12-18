const express = require("express");
const { loginUser, logoutUser, registerUser, infoUser, forgotPassword, resetPassword, updateProfile } = require("../controllers/user");

const router = express.Router();


router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser);
router.get("/info", infoUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.patch("/update-profile", updateProfile);


module.exports = router;