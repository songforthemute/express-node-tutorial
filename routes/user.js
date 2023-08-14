const express = require("express");
const router = express.Router();

// GET /user 라우터
router.get("/", (req, res) => {
    const dictionary = {
        username: "kevin",
        job: "football athlete",
        team: "MCFC",
    };

    res.json(dictionary);
});

module.exports = router;
