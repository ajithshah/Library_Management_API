const router = require("express").Router();
const User = require("../model/user");
const Admin = require("../model/admin");
const bcrypt = require("bcryptjs");

const JWT = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Login Success");
});

router.post("/userregister", async (req, res) => {
  const users = await User.findOne({ email: req.body.email });
  if (users) return res.status(400).send("Email already exist!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashedPassword,
    address: req.body.address,
    roles: req.body.roles,
    joined_date: req.body.joined_date,
  });

  try {
    const savedUser = await user.save();
    res.status(200).send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send({ status: "Failed", msg: err });
  }
});

router.post("/adminregister", async (req, res) => {
  const admins = await Admin.findOne(
    { email: req.body.email },
    { password: 0 }
  );
  if (admins) return res.status(400).send("Email already exist!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashedPassword,
    phone_no: req.body.phone_no,
  });

  try {
    const savedAdmin = await admin.save();
    res.status(200).send({ user: savedAdmin._id });
  } catch (err) {
    res.status(400).send({ status: "Failed", msg: err });
  }
});

router.post("/userlogin", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Email");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(200).send("Invalid password");

  const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  let role;
  if (user.roles) role = "librarian";
  else role = "user";
  res.json({
    "access token": token,
    user_name: user.first_name + " " + user.last_name,
    user_id: user._id,
    role: role,
  });
});

router.post("/adminlogin", async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(400).send("Invalid Email");

  const validPass = await bcrypt.compare(req.body.password, admin.password);
  if (!validPass) return res.status(200).send("Invalid password");
  const adm = await Admin.findOne({ email: req.body.email }, { password: 0 });

  const token = JWT.sign({ _id: admin._id }, process.env.TOKEN_SECRET);
  res.json({
    "access token": token,
    user_name: admin.first_name + " " + admin.last_name,
    admin_id: admin._id,
    role: "admin",
  });
});

module.exports = router;
