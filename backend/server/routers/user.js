const express = require("express");
const { loginUser, logoutUser, registerUser, infoUser } = require("../controllers/user");

const router = express.Router();


router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser);
router.get("/info", infoUser);
router

module.exports = router;