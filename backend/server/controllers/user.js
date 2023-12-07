const userUtil = require("../utils/users");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const { generateToken, decodeToken } = require("../../config/jwtToken");

const loginUser = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    // check if user exists
    if (username == null || password == null)
      res.status(403).json({ error: "Missing username or password." });
    else if (req.body.token != null) {
      let user = await userUtil.findUserById(req.body.token);
      if (user != null) {
        res.status(403).json({ error: "Already logged in." });
        return;
      }
    }
    const user = await userModel.findOne({ username });
    if (user == null) res.status(403).json({ error: "Invalid username." });
    else {
      const validPassword = bcrypt.compare(password, user.passwordHash);
      if (!validPassword) res.status(403).json({ error: "Invalid password." });
      else {
        user.sessionStart = Date.now();
        user.lastAccessed = Date.now();
        await user.save();

        res.status(200).json({
          message: "Login successfully.",
          token: userUtil.getToken(user),
        });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const logoutUser = async (req, res, next) => {
  try {
    let user = await userUtil.findUserById(req.body.token);
    console.log(user);

    if (user == null) res.status(200).json({ message: "Invalid session" });
    else {
      user.sessionStart = null;
      user.lastAccessed = null;
      await user.save();
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({ message: "Logout successfully." });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const registerUser = async (req, res, next) => {
  try {
    const user = await userUtil.findUserById(req.body.token);
    if (user.role != "admin")
      res
        .status(403)
        .json({ error: "Access denied because you are not admin." });
    else {
      let { username, password } = req.body;
      let exists = await userModel.findOne({ username });
      if (exists != null)
        res.status(403).json({ error: "User already exists." });
      else {
        let newUser = new userModel();
        newUser.username = username;
        newUser.fullname = req.body.fullname;
        //      add session info
        newUser.sessionStart = Date.now();
        newUser.lastAccessed = Date.now();
        // generate password hash, with salt 10
        const salt = await bcrypt.genSalt(10);
        newUser.passwordHash = await bcrypt.hash(password, salt);
        // newUser.passwordHash = password;
        accessToken = generateToken(newUser);
        await newUser.save();

        res.status(200).json({
          message: "User created successfully.",
          access_token: accessToken,
          user: newUser,
        });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const infoUser = (req, res, next) => {
  let user = userUtil.findUserById(req.body.token);
  if (user == null) res.status(403).json({ error: "Invalid session." });
  else res.status(200).json({ message: "User info.", user });
};

module.exports = {
  loginUser,
  logoutUser,
  registerUser,
  infoUser,
};
