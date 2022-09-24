const JWT = require("jsonwebtoken");
const Admin = require("../model/admin");
const User = require("../model/user");

module.exports = async function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");
  try {
    const verified = JWT.verify(token, process.env.TOKEN_SECRET);
    const admin = await Admin.findById(verified._id);
    if (admin) req.role = "admin";
    else {
      const members = await User.findById(verified._id);
      if (members) {
        if (members.roles) req.role = "librarian";
        else req.role = "user";
      }
    }
    req.member = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid member");
  }
};
