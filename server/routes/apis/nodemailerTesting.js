const nodemailer = require("nodemailer");
// Step 01
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abdul82303@gmail.com",
    pass: "03448904093@webdeveloper.com",
  },
});

// Step 02
let mailOptions = {
  from: "abdul82303@gmail.com",
  to: "SammadBinFarooq@gmail.com",
  subject: "Testing and testing",
  text: "It works",
};

// Step 03
transporter.sendMail(mailOptions, function (err, data) {
  if (err) {
    console.log("error occurs", err);
  } else {
    console.log("email sent");
  }
});
