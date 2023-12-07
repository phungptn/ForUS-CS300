const userUtil = require("../utils/users");
const bcrypt = require('bcrypt');
const userModel = require("../models/user");

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

const logoutUser = (req, res, next) => {
  let user = userUtil.findUserById(req.body.token);
  if (user == null) res.status(200).json({ message: "Invalid session" });
  else res.status(200).json({ message: "Logged out successfully." });
};

const registerUser = async (req, res, next) => {
  try {
    const user = await userUtil.findUserById(req.body.token);
    if (user.role != 'admin') 
      res.status(403).json({ error: "Access denied because you are not admin." });
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
  let user = await userUtil.findUserById(req.body.token);
  if (user == null) res.status(403).json({ error: "Invalid session." });
  else res.status(200).json({ message: "User info.", user });
};

module.exports = {
  loginUser,
  logoutUser,
  registerUser,
  infoUser,
};
