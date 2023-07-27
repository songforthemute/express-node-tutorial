const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

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

app.use("/", indexRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
    res.status(404).send("404 Not Found");
});

const multer = require("multer");
const fs = require("fs");

try {
    fs.readdirSync("uploads");
} catch (error) {
    console.error("uploads 폴더가 없어, uploads 폴더를 생성합니다. ");
    fs.mkdirSync("uploads");
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(
                null,
                path.basename(file.originalname, ext) + Date.now() + ext
            );
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

app.get("/upload", (req, res) => {
    res.sendFile(path.join(__dirname, "multipart.html"));
});

app.post(
    "/upload",
    upload.fields([{ name: "image1" }, { name: "image2" }]),
    (req, res) => {
        console.log(req.files, req.body);
        res.send("ok");
    }
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
