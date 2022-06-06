const express = require("express");
const router = express.Router();
const { tagsGet } = require("./tags.controllers");

router.get("/", tagsGet);

module.exports = router;
