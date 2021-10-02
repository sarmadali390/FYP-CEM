const express = require("express");

// Router

const router = express.Router();

router.post("/", async (req, res) => {
  // console.log(req.body);
  const inputLength = req.body;
  console.log(inputLength);
  // console.log(inputLength.followup0);
});

module.exports = router;
