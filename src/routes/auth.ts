const route = require("express").Router();
const User = require("../models/User.ts");
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js")


//REGISTER
route.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptojs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }

});

//LOGIN
route.post('/login', async (req, res) => {

  const { username, password } = req.body;

  if (!username) {
    return res.status(422).json("Wrong username");
  }

  if (!password) {
    return res.status(422).json("Wrong password");
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(404).json("User not found");
  }
  
  const hashedPassword = cryptojs.AES.decrypt(
    user.password,
    process.env.PASS_SEC
  );
  const originalPassword = hashedPassword.toString(cryptojs.enc.Utf8);

  if(password != originalPassword){
    return res.status(422).json("Wrong password");
  }

  try {
    const secret = process.env.JWT_SEC;

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin
      },
      secret
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, token });
  } 
  catch (error) {
    res.status(500).json(error);
  }

});

module.exports = route;
