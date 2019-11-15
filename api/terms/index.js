const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("Sent terms and conditions!");
    res.send("Hello");
});

module.exports = router;