const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const [PORT, PORT_NUMBER] = ["port", process.env.PORT || 3000];
app.set(PORT, PORT_NUMBER);

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },

        name: "session-cookie",
    })
);

app.use((req, res, next) => {
    // 모든 요청에서 실행
    next();
});

app.get(
    "/",
    (req, res, next) => {
        // '/' URL의 GET 요청에서만 실행
        next();
    }
    // 에러 처리는 에러 처리 미들웨어로 전송!
    // (req, res) => {
    //     throw new Error("에러는 에러 처리 미들웨어로 전송.");
    // }
);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
});

// app.get(url, router)
app.get("/", (req, res) => {
    // HTML 파일 응답
    res.status(200).sendFile(path.join(__dirname, "/index.html"));
});

app.listen(app.get(PORT), () => {
    console.log(
        app.get(PORT),
        `번 포트에서 대기중입니다. ✅\n >> http://localhost:${PORT_NUMBER}/ <<\n`
    );
});
