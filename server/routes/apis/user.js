// requiring npm packages
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const _ = require("lodash");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");
const mailgun = require("mailgun-js");
const api_key = "YOUR_API_KEY";
const DOMAIN = "YOUR_DOMAIN";

// get user defined modules
const User = require("../../model/User");
const { token } = require("morgan");
const { response } = require("express");
// get env data
const JWT_ACCOUNT_ACTIVATION = process.env.JWT_ACCOUNT_ACTIVATION;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// Router
const router = express.Router();
// Signup code goes here
router.post(
  "/signup",
  // validate data
  [
    check("name", "Name is required").not().isEmpty(),
    check("phone", "Phone Number is required").not().isEmpty(),
    check("email", "Valid Email is Required").isEmail(),
    check(
      "password",
      "Password length must be at least 5 characters long"
    ).isLength({ min: 5 }),
    check(
      "cpassword",
      "Confirm Password length must be at least 5 characters long"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, phone, email, password, cpassword } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        console.log("user in db");
        return res.status(400).json("user is already in database");
      }
      if (password !== cpassword) {
        console.log("Password don't match");
        return res.status(400).json("Password don't match");
      }
      // Generating jwt
      const token = jwt.sign(
        { name, phone, email, password, cpassword },
        JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: "10m",
        }
      );

      // mailgun code here
      const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
      const data = {
        from: "noreply@merauth.com",
        to: email,
        subject: "Account Activation Link",
        html: `
        <h1>Please use the following link to Activate your account</h1>
        <p>${CLIENT_URL}/auth/activate/${token}</p>
        <hr>
        <p> This email may contain sensitive information</p>
        <p>${CLIENT_URL}</p>`,
      };
      mg.messages().send(data, function (error, body) {
        if (error) {
          return res.json({
            message: error.message,
          });
        } else {
          console.log(body);
          console.log("Email Sent");
          return res.json(token);
        }
      });
     
    } catch (e) {
      console.log("server error");
      // return res.status(500).json("Server error");
    }
  }
);

// Activate Account
router.post("/account-activation", async (req, res) => {
  const { token } = req.body;
  try {
    if (token) {
      jwt.verify(token, JWT_ACCOUNT_ACTIVATION, async (error, decode) => {
        if (error) {
          console.log("jwt account activation error");
          return res.status(401).json({ error: "Expired link. Signup again" });
        }
        // console.log(decode);
        const { name, phone, email, password, cpassword } = jwt.decode(token);
        const user = new User({
          name,
          phone,
          email,
          password,
          cpassword,
        });
        // hash password before saving to database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.cpassword = await bcrypt.hash(cpassword, salt);
        await user.save();
        return res.json({ msg: "Data is saved successfullt...!" });
      });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
});

// signin
router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password is required & have at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // console.log(t);
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(404).json({ msg: "Invalid credentials" });
      }
      // generate a token and send to client
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log(user);
      const { _id, name } = user;
      // const {_id,name,email}=user;
      return res.json({
        token,
        // user: { _id, name, email, pa },

        user: { _id, name, email },
      });
    } catch (error) {
      res.status(500).json("Server Error");
    }
  }
);

// forget password
router.put("/forgot-password",[check("email", "Email is required").isEmail().not().isEmpty()],(req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "`User with that email does not exist",
      });
    }
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );
    const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
    const data = {
      from: "noreply@merauth.com",
      to: email,
      subject: "Password Reset Link",
      html: `
        <h1>Please use the following link to reset your password</h1>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <hr>
        <p> This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
    };
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log(`Reset password link error`, err);
        return res.status(400).json({
          error: `Database connection error on user password forgot request`,
        });
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({
              message: error.message,
            });
          }
          return res.json({
            message: `Email has sent to ${email} Follow the instruction to activate account`,
          });
        });
      }
    });
  });
});


// Reset Password
router.put(
  "/reset-password",
  [
    check("newPassword")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be valid email address"),
  ],
  (req, res) => {
    // Find the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }
    const { resetPasswordLink, newPassword } = req.body;
    console.log(resetPasswordLink);
    console.log(newPassword);

    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD,

        function (err, decoded) {
          if (err) {
            console.log("error occur in 367")
            return res.status(400).json({
              error: "Expired link. Try again",
            });
          }
          User.findOne({ resetPasswordLink }, (err, user) => {
            if (err || !user) {
              console.log("USER.findOne error in 374")
              return res.status(400).json({
                error: `Something went wrong. Try again later`,
              });
            }

            const updatedFields = {
              password: newPassword,
              resetPasswordLink: "",
            };
            user = _.extend(user, updatedFields);
            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: "Error resetting user password",
                });
              }
              res.json({
                message: "Great! Now you can login with your new password",
              });
            });
          });
        }
      );
    }
  }
);

// Login with google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/google-login", (req, res) => {
  // console.log("googl login backend")
  const { idToken } = req.body;
  // console.log("idToken",idToken)
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      console.log("Response", response);
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          // console.log("check user",user)
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name } = user;
            return res.json({
              token,
              user: { _id, email, name },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            let phone = +9;
            // console.log("password",password)
            user = new User({ name, email, phone, password });
            // console.log("new user", user)
            user.save((err, data) => {
              if (err) {
                console.log("Error Google login on user save", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                {
                  _id: data._id,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "7d",
                }
              );
              const { _id, email, name } = data;
              return res.json({
                token,
                user: { _id, email, name },
              });
            });
          }
        });
      } else {
        return res.status(400).jdon({
          error: "Google Login Failed Please Try again",
        });
      }
    });
});

// login with fb
router.post =
  ("/facebook-login",
  (req, res) => {
    console.log("Facebook Login Req body", req.body);
    const { userID, accessToken } = req.body;
    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
    return fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name } = data;
            return res.json({
              token,
              user: { _id, email, name },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            let phone = +9;
            user = new User({ name, email, password, phone });
            user.save((err, data) => {
              if (err) {
                console.log("Error Facebook login on user save", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                {
                  expiresIn: "7d",
                }
              );
              const { _id, email, name } = data;
              return res.json({
                token,
                user: { _id, email, name },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try Late",
        });
      });
  });

module.exports = router;
