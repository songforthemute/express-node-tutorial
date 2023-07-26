const express = require("express");
const path = require("path");

const app = express();

const PORT = "port";
const PORT_NUMBER = process.env.PORT || 3000;

// app.set(key, value), app.get(key) - map과 유사하게 동작.
app.set(PORT, PORT_NUMBER);

// app.get(url, router)
app.get("/", (req, res) => {
    // HTML 파일 응답
    return res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(app.get(PORT), () => {
    console.log(
        app.get(PORT),
        `번 포트에서 대기중입니다. ✅\n >> http://localhost:${PORT_NUMBER}/ <<\n`
    );
});
