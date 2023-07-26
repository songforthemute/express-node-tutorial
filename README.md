# Learn Express.js && Node.js

## 목차

-   [익스프레스 프로젝트 시작하기](#익스프레스-프로젝트-시작하기)
-   [미들웨어 사용하기](#미들웨어-사용하기)

---

## 익스프레스 프로젝트 시작하기

-   [프로젝트 초기 설정](#프로젝트-초기-설정)
-   [`package.json`](#packagejson)
-   [`app.js`](#appjs)

### 프로젝트 초기 설정

```shell
# package.json 생성
$ npm init

# express 설치
$ npm i express # yarn add express

# 변경 사항의 빠른 반영을 위한 자동 재시작을 도와주는 라이브러리
$ npm i -D nodemon # yarn add nodemon -D
```

-   `npm` 을 사용해서 패키지를 설치하면 `package-lock.json`이, `yarn`을 이용해서 패키지를 설치하면 `yarn.lock` 생성.
-   `nodemon`은 개발용으로만 사용. 배포 후에는 서버 코드가 변경될 일이 없으므로!

    -   [`nodemon` 사용하기 | Velopert](https://backend-intro.vlpt.us/1/03.html)
    -   [`nodemon` Github Repository](https://github.com/remy/nodemon)

### `package.json`

```json
{
    ...,
    "main": "app.js",
    "scripts": {
        "dev": "nodemon app",
    },
    ...,
}
```

-   `yarn dev`, `npm run dev` 스크립트로 서버 실행 가능.

### `app.js`

```javascript
const express = require("express");
const path = require("path");

const app = express();

// 서버 실행을 위한 포트 상수 정의
const PORT = "port";
const PORT_NUMBER = process.env.PORT || 3000;

app.set(PORT, PORT_NUMBER);

app.get("/", (req, res) => {
    // 단순 문자열 응답
    // res.send("hello express!");

    // path 모듈을 사용한 HTML 파일로 응답.
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(app.get(PORT), () => {
    console.log(app.get(PORT), "번 포트에서 대기중입니다.");
});
```

-   `app` 변수에 `express` 모듈 할당.
-   `app.set(key, value)`
    -   map처럼, 값 저장 가능.
-   `app.get(key)`
    -   map처럼, 저장된 값 조회 가능.
-   `app.get(url, router)`
    -   주소에 **get** 요청이 올 때 어떤 동작을 할 지 정의 가능.
    -   express에서는 `res.write`, `res.end` 대신, **`res.send`** 사용.
    -   get 메서드 외에도, post, put, patch, delete, options 메서드가 존재.
    -   **`res.sendFile()`**
        -   단순 문자열 대신 HTML로 응답할 수 있게 하는 메서드.
        -   `path` 모듈을 이용해 파일의 경로를 지정해야 함.
        -   _Ex._ `res.sendFile(path.join(__dirname, '/index.html'))`

---

## 미들웨어 사용하기

-   [미들웨어란?](#미들웨어란?)
-   [간단한 미들웨어](#간단한-미들웨어)
-   [에러 처리 미들웨어](#에러-처리-미들웨어)
-   [자주 사용하는 미들웨어](#자주-사용하는-미들웨어)
-   [미들웨어 활용하기](#미들웨어-활용하기)
-   [multer](#multer)

### 미들웨어란?

-   미들웨어는 익스프레스의 핵심.
-   요청과 응답의 중간에 위치하여 미들웨어라고 부름.
-   라우터와 에러 핸들러 또한 미들웨어의 일종.
-   미들웨어는 요청과 응답을 조작해, 기능을 추가하거나 악의적인 요청을 걸러내기도 함.

### 간단한 미들웨어

```javascript
// app.js
...
app.set(PORT, PORT_NUMBER);

app.use((req, res, next) => {
    console.log('모든 요청에서 실행.')
    next();
})

app.get("/", (req, res, next) => {
    console.log('/ URL의 GET 요청에서만 실행.')
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 전송.')
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
})

app.listen(app.get(PORT), () => {
    console.log(app.get(PORT), "번 포트에서 대기중입니다.");
});
...
```

-   미들웨어는 `app.use`와 함께 사용하며, 매개변수가 `req, res, next`인 함수를 요구.
-   미들웨어는 위에서 아래로 순서대로 실행되며, 요청과 응답 사이에 특별한 기능을 추가할 수 있음.
-   세 번째 매개변수 `next`는 다음 미들웨어로 넘어가는 함수로, 실행하지 않으면 다음 미들웨어가 실행되지 않음.
-   `app.use`나 `app.get`같은 라우터에 미들웨어를 여러 개 장착할 수 있음.
-   **미들웨어 실행에 대한 케이스**
    -   `app.use(middleware)` 모든 요청에서 미들웨어 실행.
    -   `app.use('/abc', middleware)` 'abc'로 시작하는 요청에서 미들웨어 실행.
    -   `app.post('/abc', middleware)` 'abc'로 시작하는 POST 요청에서 미들웨어 실행.

### 에러 처리 미들웨어

-   위의 코드에서, `app.get('/')`의 두 번째 미들웨어에서 에러가 발생하고, 이 에러는 아래의 에러 처리 미들웨어에 전달됨.
-   에러 처리 미들웨어의 매개변수는 `err, req, res, next`로 네 개.
    `err`: 에러에 관한 정보를 담고 있음.
    `res`: 응답 관련. `res.status(code)` 메서드를 이용해 HTTP 상태 코드를 지정할 수 있으며, 기본값은 200(성공).
-   에러 처리 미들웨어는 특별한 경우가 아니라면 최하단에 위치하는 것이 좋음.

### 자주 사용하는 미들웨어

-   [dotenv](#dotenv)
-   [morgan](#morgan)
-   [static](#static)
-   [body-parser](#body-parser)
-   [cookie-parser](#cookie-parser)
-   [express-session](#express-session)

```shell
$ npm i dotenv morgan cookie-parser express-session
# or
$ yarn add dotenv morgan cookie-parser express-session
```

```javascript
// app.js
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
...
```

#### dotenv

-   미들웨어는 아니나, `process.env`, 즉 환경 변수를 관리하기 위한 패키지.
-   `.env` 파일을 읽어, `process.env`로 관리.
-   _Ex._ `.env`에 환경 변수를 작성하기.
    ```env
    COOKIE_SECRET=cookiesecret
    ```

#### morgan

```javascript
app.use(morgan("dev"));
```

-   요청과 응답에 대한 정보를 콘솔에 기록하는 미들웨어.
-   `dev` 모드 기준, `GET / 500 7.409 ms - 50`는 차례대로 'HTTP 메서드', '주소', 'HTTP 상태 코드', '응답 속도', '응답 바이트'를 의미.
-   인수로 `dev` 외에도, `combined`, `common`, `short`, `tiny` 등을 넣을 수 있으며, 인수마다 출력되는 로그 형식이 다름.
-   개발 환경에서는 `dev`, 배포 환경에서는 `combined`가 주로 사용됨.

#### static

```javascript
// Standard
app.use("요청 경로", express.static("실제 경로"));

// Example
app.use("/", express.static(path.join(__dirname, "public")));
```

-   정적 파일들을 제공하는 라우터 역할을 하는 미들웨어.
-   기본적으로 제공되기에 따로 설치없이, express 객체에서 꺼내 장착.
-   이를테면 public 폴더를 생성하고 css, js, 이미지 파일 등을 폴더에 넣으면 브라우저에서 접근할 수 있게 됨.
    -   _Ex._ `public/styles/style.css` >>> `http://localhost:3000/styles/style.css`
-   정적 파일들을 알아서 제공해주므로, `fs.readFile()` 메서드를 사용해 파일을 직접 읽어서 전송할 필요가 없고, 만약 요청 경로에 해당하는 파일이 없다면 알아서 내부적으로 `next()`를 호출. 파일을 발견했다면 응답으로 파일을 보내기 때문에 다음 미들웨어는 호출되지 않음.

#### body-parser

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

-   요청(req)의 본문에 있는 데이터를 해석해서 `req.body` 객체로 만들어주는 미들웨어.
-   보통 폼 데이터나 AJAX 요청의 데이터를 처리.
-   단, 멀티파트(이미지, 동영상, 파일) 데이터는 처리하지 못하므로, 이 경우 multer 모듈을 사용해서 처리.
-   Express 4.16.0 버전에 body-parser 미들웨어의 일부 기능이 내장되어 JSON, URL-encoded 형식의 데이터를 처리할 때는 따로 설치할 필요가 없지만, Raw, Text 형식의 요청을 처리할 필요가 있다면 별개의 설치가 필요.

    -   _Cf 1._ URL-encoded는 주소 형식으로 데이터를 보내는 방식으로, 폼 전송 시 이 방식을 주로 사용. `urlencoded` 메서드의 `extended` 옵션이 `false`인 경우 Node의 querystring 모듈을 사용해 쿼리스트링을 해석하고, `true`인 경우 qs 모듈을 사용해 쿼리스트링을 해석. qs 모듈은 querystring 모듈을 확장한 npm 패키지.

    -   _Cf 2._ Raw는 요청의 본문이 버퍼 데이터, Text는 텍스트 데이터.

        ```shell
        $ npm i body-parser
        # or
        $ yarn add body-parser
        ```

        ```javascript
        const bodyParser = require("body-parser");
        app.use(bodyParser.raw());
        app.use(bodyParser.text());
        ```

#### cookie-parser

```javascript
app.use(cookieParser(비밀키));
```

-   요청에 동봉된 쿠키를 해석해, `req.cookies` 객체로 변환.
-   첫 번째 인수로 비밀 키를 넣어줄 수 있는데, 서명된 쿠키가 있는 경우, 제공한 비밀 키를 통해 해당 쿠키가 내 서버가 만든 쿠키임을 검증할 수 있음.
-   쿠키는 클라이언트에서 위조하기 쉬우므로 비밀 키를 통해 만들어낸 서명을 쿠키 값 뒤에 붙이며, 서명된 쿠키는 `req.signedCookies` 객체에 들어 있음.
-   _Cf._ 쿠키의 생성과 제거

    -   쿠키를 생성/제거하기 위해서는 `res.cookie(키, 값, 옵션)`, `res.clearCookie(키, 값, 옵션)` 메서드 사용.
    -   쿠키를 지우려면, 키, 값, 옵션이 정확히 일치해야 지워짐. 단, `expires`, `maxAge` 옵션은 일치하지 않아도 됨.
    -   쿠키 옵션으로는 `domain`, `expires`, `httpOnly`, `maxAge`, `path`, `secure` 등이 존재.
    -   `signed` 라는 쿠키 옵션은 이를 `true`로 설정하면, 쿠키 뒤에 서명이 붙으며 내 서버가 쿠키를 만들었다는 것을 검증할 수 있으므로 대부분의 경우 서명 옵션을 켜두는 것이 좋음.

        ```javascript
        res.cookie("name", "lee", {
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
            secure: true,
        });

        res.clearCookie("name", "lee", { httpOnly: true, secure: true });
        ```

#### express-session

```javascript
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

req.session.name = "lee"; // 세션 등록
req.sessionID; // 현재 세션 아이디 확인
req.session.destroy(); // 세션 모두 파괴
```

-   세션 관리용 미들웨어. 로그인 등의 이유로 세션을 구현하거나, 특정 사용자를 위한 데이터를 임시적으로 저장해둘 때 매우 유용. 세션은 사용자별로 `req.session` 객체 안에 유지됨.
-   express-session은 세션 관리 시 클라이언트에 쿠키(세션 쿠키)를 전송.
-   인수로 세션에 대한 설정을 받음.

    -   `name` 세션 쿠키의 이름. 기본값은 `connect.sid`.
    -   `secret` 쿠키를 안전하게 전송하기 위한 서명. cookie-parser의 `secret`과 같게 설정하는 것이 좋음.
    -   `resave` 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지에 대한 여부.
    -   `saveUninitialized` 세션에 저장할 내역이 없더라도, 처음부터 세션을 생성할지의 여부.
    -   `cookie` 세션 쿠키에 대한 설정. `maxAge`, `domain`, `expires`, `sameSite`, `httpOnly`, `secure` 등 일반적인 쿠키 옵션이 제공됨. 배포 시에는 https를 적용하고, `secure`도 true로 설정하는 것이 좋음.
    -   `store` 메모리에 세션을 저장하는 경우, 서버를 재시작하면 메모리가 초기화되어 세션이 모두 사라지기 때문에 배포 시에는 이 `store`에 데이터베이스를 연결하여 세션을 유지하는 것이 좋고, Redis를 주로 사용.

-   express-session으로 생성된 `req.session` 객체에 값을 대입하거나, 삭제해서 세션을 변경할 수 있음.

    -   `req.session.name = 'lee'` 세션 등록
    -   `req.sessionID'` 현재 세션 아이디 확인
    -   `req.session.destory()` 세션 모두 파괴
    -   `req.session.save()` 세션 저장. 일반적으로 요청이 끝날 때 자동으로 호출되므로 직접 호출하는 경우는 드뭄.

-   _Cf 1._ 세션 쿠키의 모양이 특이한데, express-session에서 서명한 쿠키 앞에는 's:'이 붙으며, 실제로는 `encodeURIComponent` 함수가 실행되어 's%3A'로 변환됨.
-   _Cf 2._ express-session 버전 1.5 이전에는 내부적으로 cookie-parser를 사용하고 있어, cookie-parser 미들웨어보다 뒤에 위치해야 했지만, 이후로는 사용하지 않게 되어 순서에 영향을 받지않음. 허나 현재 어떤 버전을 사용하고 있는지 모른다면 cookie-parser 미들웨어 뒤에 놓는 것이 안전.

### 미들웨어 활용하기

```javascript
app.use((req, res, next) => {
    console.log("모든 요청에 다 실행됩니다.");
    next();
});

app.use("/abc", (req, res, next) => {
    console.log("abc 요청에서만 실행됩니다.");
    next();
});
```

-   미들웨어는 `req, res, next`를 매개변수로 가지는 함수(에러 처리 미들웨어만 예외적으로 `err, req, res, next`)로서, `app.use`, `app.get`, `app.post` 등으로 장착.
-   특정한 주소의 요청에만 미들웨어를 실행시키려면, 첫 번째 인수로 해당 주소를 삽입.

```javascript
app.use(
    morgan("dev"),
    express.static("/", path.join(__dirname, "public")),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.COOKIE_SECRET)
);
```

-   동시에 여러 개의 미들웨어를 장착할 수도 있으며, 다음 미들웨어로 넘어가려면 `next` 함수를 호출해야하지만, 위 코드의 미들웨어들은 내부적으로 `next`를 호출하고 있으므로 연달아 쓸 수 있음.
-   `next`를 호출하지 않는 미들웨어는 `res.send`, `res.sendFile` 등의 메서드로 응답을 보내주어야 함. 따라서 정적 파일을 제공하는 경우, `express.json`, `express.urlencoded`, `cookieParser` 미들웨어는 실행되지 않음.
    -   이는 미들웨어 장착 순서에 따라 어떤 미들웨어는 실행되지 않을 수도 있음을 의미.
    -   만약 `next`도 호출하지 않고, 응답도 보내지 않는다면 클라이언트는 응답을 받지 못해서 무한히 대기하게 됨.
-   `next`에 인수를 넣을 수도 있는데, 이 경우 특수하게 동작함.
    -   `route`라는 문자열을 넣으면 다음 라우터의 미들웨어로 바로 이동하고, 그 외의 인수를 넣는다면 바로 에러 처리 미들웨어로 이동.

```javascript
app.use(
    (req, res, next) => {
        req.data = "임시 데이터 넣기";
        next();
    },
    (req, res, next) => {
        console.log(req.data); // 임시 데이터 넣기
        next();
    }
);
```

-   미들웨어 간에 데이터를 전달하려면, 세션을 사용하는 경우 `req.session` 객체에 데이터를 넣어도 되지만, 세션이 유지되는 동안에 데이터도 계속 유지된다는 단점이 존재.
-   그러므로 요청이 끝날 때까지만 데이터를 유지하고 싶다면, `req` 객체에 데이터를 넣어놓으면 됨.
-   _Cf._ `app.set`으로 Express에서 데이터를 저장할 수 있으나, `req` 객체에 데이터를 넣어 다음 미들웨어로 전달하는 이유는 `app.set`은 Express에서 전역적으로 사용되므로 사용자 개개인의 값을 넣기에 부적절하며, 앱 전체의 설정을 공유할 때 사용하고, `req` 객체는 요청을 보낸 사용자 개개인에게 귀속되므로 `req` 객체를 통해 개인 데이터를 전달하는 것이 좋음.

```javascript
app.use(morgan("dev"));
// Or
app.use((req, res, next) => {
    morgan("dev")(req, res, next);
});

// Example
app.use((req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        morgan("combined")(req, res, next);
    } else {
        morgan("dev")(req, res, next);
    }
});
```

-   미들웨어를 사용할 때 유용한 패턴으로, 미들웨어 안에 미들웨어를 넣는 방식.
-   이 패턴이 유용한 이유는 기존 미들웨어의 기능을 확장할 수 있으며, 위 코드처럼 분기 처리를 할 수도 있음.

### multer

```shell
$ npm i multer
# or
$ yarn add multer
```

-   이미지, 동영상 등을 비롯한 여러가지 파일들을 멀티파트 형식으로 업로드할 때 사용하는 미들웨어. 멀티파트 형식이란 위처럼, `enctype="multipart/form-data"`인 폼을 통해 업로드하는 데이터의 형식을 의미.

    ```html
    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="image" />
        <input type="text" name="title" />
        <button type="submit">업로드</button>
    </form>
    ```

-   멀티파트 형식으로 업로드하는 데이터는 개발자 도구 Network 탭에서 볼 수 있으며, 이러한 폼을 통해 업로드하는 파일은 body-parser로는 처리할 수 없고, 직접 파싱하기도 어려우므로, multer 미들웨어를 따로 사용해서 처리하면 편리.
