 // // nodemailer code here
      // // Step 01
      // let transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   // host: "smtp.gmail.com",
      //   // port: 465,
      //   // secure: true,
      //   // port: 465,
      //   // secure: true,
      //   // logger:true,
      //   // debug:true,
      //   // secureConnection: false,
      //   // host: "box1109.bluehost.com",
      //   auth: {
      //     user: process.env.EMAIL,
      //     pass: process.env.PASSWORD,
      //   },
      // });
      // // Step 02
      // let mailOptions = {
      //   from: EMAIL,
      //   to: email,
      //   subject: "Account Activation Link",
      //   html: `
      //   <h1>Please use the following link to Activate your account</h1>
      //   <p>${CLIENT_URL}/auth/activate/${token}</p>
      //   <hr>
      //   <p> This email may contain sensitive information</p>
      //   <p>${CLIENT_URL}</p>`,
      // };

      // console.log(email)

      // Step 03
      // transporter.sendMail(mailOptions, function (err, data) {
      //   if (err) {
      //     console.log("error occurs", err);
      //   } else {
      //     console.log("email sent");
      //   }
      // });