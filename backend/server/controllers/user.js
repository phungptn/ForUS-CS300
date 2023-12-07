const userUtil = require("../utils/users");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const loginUser = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    // check if user exists
    if (username == null || password == null) return res.status(403).json({ error: "Missing username or password." });
    
    if (await userUtil.userByIdExists(req.body.token)) return res.status(403).json({ error: "Already logged in." });

    const user = await userUtil.findUserByCredentials(username, password);
    if (user == null) return res.status(403).json({ error: "Invalid username or password." });
    
    res.status(200).json({
      message: "Login successfully.",
      token: await userUtil.getToken(user),
    });

  }
  catch (e) {
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
      let { username, password, fullname } = req.body;
      if (username == null || password == null || fullname == null) return res.status(403).json({ error: "Missing required fields." });

      let exists = await userModel.findOne({ username })
      if (exists != null) return res.status(403).json({ error: "User already exists." });
      
      let newUser = new userModel();
      newUser.username = username;
      newUser.fullname = fullname;
//      add session info
      // generate password hash, with salt 10
      const salt = await bcrypt.genSalt(10);
      newUser.passwordHash = await bcrypt.hash(password, salt);
      // newUser.passwordHash = password;
      await newUser.save();

      res
        .status(200)
        .json({
          message: "User created successfully.",
          access_token: await userUtil.getToken(newUser),
          username, fullname, password
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const infoUser = async (req, res, next) => {
  try {
    let user = await userUtil.findUserById(req.body.token);
    if (user == null) res.status(403).json({ error: "Invalid session." });
    else {
      res.status(200).json({
        message: "User info.",
        user: user,
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Forgot password and reset password
const forgotPassword = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (username == null) {
      res.status(403).json({ error: "Missing username." });
      return;
    } else if (req.body.token != null) {
      let user = await userUtil.findUserById(req.body.token);
      if (user != null) {
        res.status(403).json({ error: "Already logged in." });
        return;
      }
    }

    const user = await userModel.findOne({ username });
    if (user == null) res.status(403).json({ error: "Invalid username." });
    else {
      // Send email to user
      const resetPasswordToken = userUtil.getResetPasswordToken(user);
      const html = `<h1>Forgot password</h1>
    <p>Click <a href="http://localhost:3000/reset-password/${resetPasswordToken}">here</a> to reset your password.</p>`;
    const info = await sendEmail({ email: user.email, html });
      console.log(info);
      res.status(200).json({
        success: info.response?.includes("OK") ? true : false,
        mes: info.response?.includes("OK")
          ? "Email sent successfully"
          : "Something went wrong",
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// This code is not completed yet
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (token == null || password == null) {
      res.status(403).json({ error: "Missing token or password." });
      return;
    } else if (req.body.token != null) {
      let user = await userUtil.findUserById(req.body.token);
      if (user != null) {
        res.status(403).json({ error: "Already logged in." });
        return;
      }
    }

    const user = await userUtil.findUserById(token);
    if (user == null) res.status(403).json({ error: "Invalid token." });
    else {
      // generate password hash, with salt 10
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
      await user.save();

      res.status(200).json({
        message: "Password reset successfully.",
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  loginUser,
  logoutUser,
  registerUser,
  infoUser,
  forgotPassword,
  resetPassword,
};
