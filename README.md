# Learn Express.js && Node.js

**_Thanks to zerocho :D_**

## 목차

-   [익스프레스 프로젝트 시작하기](#익스프레스-프로젝트-시작하기)
    -   [프로젝트 초기 설정](#프로젝트-초기-설정)
    -   [`package.json`](#packagejson)
    -   [`app.js`](#appjs)
-   [미들웨어 사용하기](#미들웨어-사용하기)
    -   [미들웨어란?](#미들웨어란?)
    -   [간단한 미들웨어](#간단한-미들웨어)
    -   [에러 처리 미들웨어](#에러-처리-미들웨어)
    -   [자주 사용하는 미들웨어](#자주-사용하는-미들웨어)
        -   [dotenv](#dotenv)
        -   [morgan](#morgan)
        -   [static](#static)
        -   [body-parser](#body-parser)
        -   [cookie-parser](#cookie-parser)
        -   [express-session](#express-session)
    -   [미들웨어 활용하기](#미들웨어-활용하기)
    -   [멀티파트를 위한 multer](#멀티파트를-위한-multer)
        -   [multer 설치와 필요성](#multer-설치와-필요성)
        -   [multer 개요](#multer-개요)
        -   [단일 파일 업로드](#단일-파일-업로드)
        -   [복수의 파일 업로드](#복수의-파일-업로드)
        -   [multer 활용 예제](#multer-활용-예제)
-   [라우팅 분리하기](#라우팅-분리하기)
    -   [라우팅 분리 개요](#라우팅-분리-개요)
    -   [간단한 라우팅 분리](#간단한-라우팅-분리)
    -   [`next` 함수를 응용한 라우터 점프](#next-함수를-응용한-라우터-점프)
    -   [동적 라우팅](#동적-라우팅)
    -   [라우터 활용 팁](#라우터-활용-팁)
-   [`req`, `res` 객체 살펴보기](#req-res-객체-살펴보기)
-   [Sequelize ORM](#sequelize-orm)
    -   [Query Method](#query-method)
        -   [INSERT 함수](#insert-함수)
        -   [SELECT 함수](#select-함수)
        -   [UPDATE 함수](#update-함수)
        -   [DELETE 함수](#delete-함수)
-   [`Passport.js`로 인증하기](#passportjs로-인증하기)
-   [발견한 오류 목록](#발견한-오류-목록)
    -   [프런트엔드 서버에서 쿠키 발급이 안되는 이슈](#프런트엔드-서버에서-쿠키-발급이-안되는-이슈)
    -   [Error: req#logout requires a callback function](#error-reqlogout-requires-a-callback-function)

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
-   [멀티파트를 위한 multer](#멀티파트를-위한-multer)

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
    -   `err`: 에러에 관한 정보를 담고 있음.
    -   `res`: 응답 관련. `res.status(code)` 메서드를 이용해 HTTP 상태 코드를 지정할 수 있으며, 기본값은 200(성공).
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

### 멀티파트를 위한 multer

-   [multer 설치와 필요성](#multer-설치와-필요성)
-   [multer 개요](#multer-개요)
-   [단일 파일 업로드](#단일-파일-업로드)
-   [복수의 파일 업로드](#복수의-파일-업로드)
-   [multer 활용 예제](#multer-활용-예제)

#### multer 설치와 필요성

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

-   멀티파트 형식으로 업로드하는 데이터는 개발자 도구 Network 탭에서 볼 수 있음.
-   이러한 폼을 통해 업로드하는 파일은 body-parser로는 처리할 수 없고, 직접 파싱하기도 어려우므로, multer 미들웨어를 따로 사용해서 처리하면 편리.

#### multer 개요

```javascript
const multer = require("multer");

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
```

-   `storage` 어디에(`destination`) 어떤 이름으로(`filename`) 저장할지 지정.
    -   `destination`, `filename` 함수의 매개변수
        -   `req` 요청에 대한 정보를 담고 있는 객체.
        -   `file` 업로드한 파일에 대한 정보를 담고 있는 객체.
        -   `done` 가공한 데이터를 넘겨줄 함수. 첫 번째 인수로는 에러가 있다면 에러를 넣고, 두 번째 인수로는 실제 경로나 파일 이름을 받음.
-   `limits` 업로드에 대한 제한 사항 설정.
    -   `fileSize` 바이트 단위의 파일 크기 속성.
-   _Cf._ 위 코드처럼 활용하기 위해서 `uploads` 폴더가 존재해야 하는데 아래처럼 해결 할 수 있음.

    ```javascript
    const fs = require("fs");

    try {
        fs.readdirSync("uploads");
    } catch (error) {
        console.log("uploads 폴더가 없어, uploads 폴더를 생성합니다.");
        fs.mkdirSync("uploads");
    }
    ```

#### 단일 파일 업로드

```javascript
app.post("/upload", upload.single("image"), (req, res) => {
    console.log(req.file, req.body);
    res.send("ok");
});
```

-   하나의 파일을 업로드하는 경우, 앞서 정의한 `upload`에서 `single` 미들웨어를 사용.
-   `single` 미들웨어를 라우터 미들웨어 앞에 넣어두면, multer 설정에 따라 파일 업로드 후, `req.file` 객체 생성. (인수는 `input` 태그의 `name` 혹은 폼 데이터의 키와 일치.)
-   업로드 성공 시 결과는 `req.file` 객체 내에 들어 있으며, `req.body`에는 파일이 아닌 데이터만 들어 있음.
-   _Cf._ `req.file` 객체

    ```javascript
    {
        fieldname: 'img',
        originalname: 'express.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'uploads/',
        filename: 'express1690472907098.png',
        path: 'uploads\\express1690472907098.png',
        size: 53535,
    }
    ```

#### 복수의 파일 업로드

-   [`array` 미들웨어](#array-미들웨어)
-   [`fields` 미들웨어](#fields-미들웨어)
-   [`none` 미들웨어](#none-미들웨어)

##### `array` 미들웨어

```html
<form id="form" action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="many" multiple />
    <input type="text" name="title" />
    <button type="submit">업로드</button>
</form>
```

-   하나의 `input`에서 여러 파일을 업로드하는 경우, `input` 태그에 `multiple` 어트리뷰트 지정.
-   [HTML attribute: multiple | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/multiple)

```javascript
app.post("/upload", upload.array("many"), (req, res) => {
    console.log(req.files, req.body);
    res.send("ok");
});
```

-   `single` 미들웨어 대신, `array` 미들웨어로 교체.
-   업로드 결과도 `req.file`이 아닌 `req.files` 배열에 들어 있음.

##### `fields` 미들웨어

```html
<form id="form" action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="image1" />
    <input type="file" name="image2" />
    <input type="text" name="title" />
    <button type="submit">업로드</button>
</form>
```

```javascript
app.post(
    "/upload",
    upload.fields([{ name: "image1" }, { name: "image2" }]),
    (req, res) => {
        console.log(req.files, req.body);
        res.send("ok");
    }
);
```

-   파일을 여러 개 업로드하지만, `input` 태그나 폼 데이터의 키가 다른 경우, `fields` 미들웨어를 사용.
-   `fields` 미들웨어의 인수로 `input` 태그의 `name`을 기술.
-   업로드 결과는 `req.files.image1`, `req.files.image2`에 각각 들어있게 됨.

##### `none` 미들웨어

```html
<form id="form" action="/upload" method="post" enctype="multipart/form-data">
    <input type="text" name="title" />
    <button type="submit">업로드</button>
</form>
```

```javascript
app.post("/upload", upload.none(), (req, res) => {
    console.log(req.body);
    res.send("ok");
});
```

-   파일을 업로드하지 않고도 멀티파트 형식으로 업로드하는 경우, `none` 미들웨어를 사용.
-   파일을 업로드하지 않았으므로, `req.body`만 존재.

#### multer 활용 예제

```javascript
// app.js
...
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
...
```

## 라우팅 분리하기

-   [라우팅 분리 개요](#라우팅-분리-개요)
-   [간단한 라우팅 분리](#간단한-라우팅-분리)
-   [`next` 함수를 응용한 라우터 점프](#next-함수를-응용한-라우터-점프)
-   [라우트 매개변수를 이용한 동적 라우팅](#라우트-매개변수를-이용한-동적-라우팅)
-   [라우터 활용 팁](#라우터-활용-팁)

### 라우팅 분리 개요

-   익스프레스를 사용하는 이유 중 하나로, 라우팅을 깔끔하게 관리할 수 있음.
-   `app.get`, `app.post` 같은 메서드가 라우터 부분으로, 라우터를 많이 연결하면 `app.js` 코드가 매우 길어지므로, 익스프레스에서는 라우터를 분리할 수 있는 방법을 제공.

### 간단한 라우팅 분리

```javascript
// routes/index.js
const express = require("express");
const router = express.Router();

// GET / 라우터
router.get("/", (req, res) => {
    res.send("hello, express!");
});

module.exports = router;


// routes/user.js
const express = require("express");
const router = express.Router();

// GET /user 라우터
router.get("/", (req, res) => {
    res.send("hello, user!");
});

module.exports = router;


// app.js
...
dotenv.config();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
...

app.use("/", indexRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
    res.status(404).send("404 Not Found");
});
...
```

### `next` 함수를 응용한 라우터 점프

```javascript
router.get(
    "/",
    (req, res, next) => {
        next("route");
    },
    (req, res, next) => {
        console.log("실행되지 않습니다.");
        next();
    },
    (req, res, next) => {
        console.log("실행되지 않습니다.");
        next();
    }
);

router.get("/", (req, res) => {
    console.log("실행됩니다.");
    res.send("hello, express!");
});
```

-   `next('route')`를 이용해 라우터에 연결된 나머지 미들웨어들을 건너뒤고 다음 라우터로 넘어갈 수 있음.
-   위의 코드에서, 첫 번째 라우터의 미들웨어에서 `next()` 대신 `next('route')`를 호출했는데, 이 경우 두 번째, 세 번째 미들웨어가 실행되지 않음. 대신 주소와 일치하는 다음 라우터로 이동.

### 라우트 매개변수를 이용한 동적 라우팅

```javascript
router.get("/user/:id", (req, res) => {
    console.log(req.params, req.query);
});
```

-   라우터 주소에는 정규표현식을 비롯한 특수 패턴 사용 가능.
-   위의 코드는 **라우트 매개 변수** 패턴을 이용.
    -   주소에 `:id`가 있는데, 문자 그대로 :id를 의미하는 것이 아니며, 이 부분에는 다른 값을 넣을 수 있음.
    -   '/user/id', '/user/123' 등의 요청도 이 라우터가 처리.
    -   이 파라미터는 `req.params` 객체 안에 들어있으며, `:id`면 `req.params.id`로, `:type`이면 `req.params.type`으로 조회 가능.
    -   _Cf._ 단, 해당 패턴을 사용 시, 일반 라우터보다 뒤에 위치해야 함. 다양한 라우터를 아우르는 와일드카드 역할을 하므로, 일반 라우터보다는 뒤에 위치해야 다른 라우터를 방해하지 않음. 그러므로, `/user/like` 같은 라우터는 `/user/:id` 같은 라우트 매개변수를 쓰는 라우터보다 위에 위치해야 함.

### 라우터 활용 팁

-   주소에 쿼리스트링을 쓸 때도 있는데, 쿼리스트링의 키-값 정보는 `req.query` 객체 내에 들어 있음.

    ```javascript
    // .../users/123?limit=5&skip=10

    // req.params
    { id: '123' }

    // req.query
    { limit: '5', skip: '10' }
    ```

-   `app.js`에서 에러 처리 미들웨어 위에 넣어둔 미들웨어는 일치하는 라우터가 없을 때 404 상태 에러 코드를 응답하는 역할을 하며, 미들웨어가 존재하지 않아도 익스프레스가 자체적으로 404 에러를 처리해주기는 하지만, 웬만하면 404 응답 미들웨어와 에러 처리 미들웨어를 연결해주는 것이 좋음.

    ```javascript
    // 이 미들웨어를 제거하고 localhost:3000/abc에 접속하면,
    // 404 상태 코드와 함께, Cannot GET / abc 메시지 응답.
    app.use((req, res, next) => {
        res.status(404).send("Not Fount");
    });
    ```

-   라우터에서 자주 쓰이는 활용법으로 `app.route`나, `router.route`가 존재. 다음과 같이 주소는 같지만 메서드가 다른 코드가 있을 때 이를 하나의 덩어리로 줄일 수 있음.

    ```javascript
    // Before
    router.get("/abc", (req, res) => {
        res.send("GET /abc");
    });

    router.post("/abc", (req, res) => {
        res.send("POST /abc");
    });

    // After
    router
        .route("/abc")
        .get((req, res) => {
            res.send("GET /abc");
        })
        .post((req, res) => {
            res.send("POST /abc");
        });
    ```

---

## `req`, `res` 객체 살펴보기

-   익스프레스의 `req`, `res` 객체는 http 모듈의 req, res 객체를 확장한 것입니다. 기존 http 모듈의 메서드도 사용할 수 있고, 익스프레스에서 확장된 메서드나 속성도 사용 가능.
    -   _Ex._, `res.writeHead`, `res.write`, `res.end` 메서드를 그대로 사용할 수 있고, `res.send`나 `res.sendFile` 같은 메서드도 사용 가능.
-   또한, `req`, `res` 객체의 메서드는 메서드 체이닝을 지원하는 경우가 많아 이를 활용하면 코드 량을 줄일 수 있음.
-   주로 사용하는 **`req`** 객체 속성과 메서드
    -   **`req.app`** `req` 객체를 통해 `app` 객체에 접근 가능. `req.app.get('port')` 같은 방식으로 사용 가능.
    -   **`req.body`** `body-parser` 미들웨어가 만드는 요청의 본문을 해석한 객체.
    -   **`req.cookies`** `cookie-parser` 미들웨어가 만드는 요청의 쿠키를 해석한 객체.
    -   **`req.ip`** 요청의 ip 주소.
    -   **`req.params`** 라우트 매개변수에 대한 정보가 담긴 객체.
    -   **`req.query`** 쿼리스트링에 대한 정보가 담긴 객체.
    -   **`req.signedCookies`** 서명된 쿠키들은 `req.cookies` 대신 여기에 담겨 있음.
    -   **`req.get(헤더 이름)`** 헤더의 값을 가져오고 싶을 때 사용하는 메서드.
-   주로 사용하는 **`res`** 객체 속성과 메서드
    -   **`res.app`** `req.app` 처럼 `res` 객체를 통해 `app` 객체에 접근 가능.
    -   **`res.cookies(키, 값, 옵션)`** 쿠키를 설정하는 메서드.
    -   **`res.clearCookie(키, 값, 옵션)`** 쿠키를 제거하는 메서드.
    -   **`res.end()`** 데이터 없이 응답 전송.
    -   **`res.json(JSON)`** JSON 형식의 응답 전송.
    -   **`res.redirect(주소)`** 리다이렉트할 주소와 함께 응답 전송.
    -   **`res.render(뷰, 데이터)`** 템플릿 엔진을 렌더링해서 응답할 때 사용하는 메서드.
    -   **`res.send(데이터)`** 데이터와 함께 응답 전송. 데이터는 문자열일 수 도 있고, HTML 일 수도 있으며, 버퍼일 수도 있고, 객체나 배열일 수도 있음.
    -   **`res.sendFile(경로)`** 경로에 위치한 파일을 응답.
    -   **`res.set(헤더, 값)`** 응답의 헤더를 설정.
    -   **`res.status(코드)`** 응답의 HTTP 상태 코드를 지정.

---

## Sequelize ORM

-   [Query Method](#query-method)

---

### Query Method

-   [INSERT 함수](#INSERT-함수)
-   [SELECT 함수](#SELECT-함수)
-   [UPDATE 함수](#UPDATE-함수)
-   [DELETE 함수](#DELETE-함수)

---

#### INSERT 함수

-   `create(values: Object, options: Object)` 해당 모델로 새로운 row를 생성 후, 생성된 row의 인스턴스 반환. 데이터는 인스턴스 내부의 `dataValues` 프로퍼티에 존재.
-   `findOrCreate(options: Object)` 해당 값으로 먼저 검색하여 존재하면 인스턴스를 반환, 존재하지 않는 경우 새로운 row 생성 후, 인스턴스 반환.
-   `findCreateFind(options: Object)` 해당 조건에 해당하는 데이터를 검색하고, 존재하지 않는 경우, 생성 후 재검색 및 해당 인스턴스를 반환.
-   `upsert(values: Object, options: Object)` 레코드의 ID가 존재하는 경우 업데이트하고 존재하지 않는 경우 삽입.

    ```typescript
    const newUser: User = await User.create({
        email: "id@example.com",
        password,
        username: "lee",
    });

    const newUser: User = await User.findOrCreate({
        email: "id@example.com",
        password,
        username: "lee",
    });
    ```

---

#### SELECT 함수

-   `findAll(options: Object)` 해당 조건에 해당하는 모든 데이터를 검색하고, 배열로 반환.
-   `findAndCountAll(options: Object)` 해당 조건에 해당하는 모든 데이터를 검색하고, 데이터의 개수를 반환.
-   `findByPk(id: number | string, options: Object)` Primary Key로 데이터를 검색하고, 해당 인스턴스를 반환.
-   `findOne(options: Object)` 해당 조건에 해당하는 데이터를 검색하고, 해당 인스턴스를 반환.
-   `findCreateFind(options: Object)` 해당 조건에 해당하는 데이터를 검색하고, 존재하지 않는 경우, 생성 후 재검색 및 해당 인스턴스를 반환.
-   `findOrCreate(options: Object)` 해당 값으로 먼저 검색하여 존재하면 인스턴스를 반환, 존재하지 않는 경우 새로운 row 생성 후, 인스턴스 반환.

    ```typescript
    const users: User[] = await User.findAll({
        // 검색 조건
        where: {
            email: "id@example.com",
        },

        attributes: ["id", "email"], // 해당 필드만 반환
        order: [["id", "DESC"]], // 검색 차순 옵션 설정,
        offset: unit * skip, // offset만큼 점프한 곳에서,
        limit: unit, // limit만큼 얻어옴.

        // LEFT JOIN을 사용해서 RIGHT 테이블의 데이터를 얻음.
        include: [
            {
                model: Post,
                attributes: ["id", "title"],
            },
        ],
    });
    ```

---

#### UPDATE 함수

-   `update(values: Object, options: Object)` 하나 혹은 여러 레코드의 값 갱신.
-   `upsert(values: Object, options: Object)` 레코드의 ID가 존재하는 경우 갱신하고 존재하지 않는 경우 삽입.

    ```typescript
    // [affectRowsCount, affectRows]
    const user: [number, User[]] = await User.create(
        {
            email: "id@example.com",
            username: "lee",
        },
        {
            where: {
                id: 1,
            },
        }
    );
    ```

---

#### DELETE 함수

-   `destroy(options: Option)` 하나 혹은 여러 레코드를 삭제.

    ```typescript
    const result: number = await Users.destroy({
        where: {
            id,
        },
    });
    ```

---

## `Passport.js`로 인증하기

### `Passport.js` 개요

-   세션 쿠키 및 JWT(Json Web Token)를 이용한 인증 프로세스를 **쉽게** 구현할 수 있게 만들어주는 라이브러리.
-   OAuth를 이용한 소셜 플랫폼(_Ex. facebook, google, kakao_) 인증도 간편하게 구현 가능.
-   [`Passport.js` 공식 문서](https://www.passportjs.org)
-   [Passport로 회원가입 및 로그인하기 | Zerocho](https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457)

### `Passport.js ` 인증 에제

```javascript
// /passport/index.js - passport의 설정 파일
const passport = require("passport");
const local = require("./localStrategy");
const { selectUserById } = require("../controllers/user");

module.exports = () => {
    // 직렬화 - strategy의 done(error, user, opts)의 user 매개변수를 넘겨받음.
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    // 역직렬화
    passport.deserializeUser(async (id, done) => {
        try {
            const { dataValues: user } = await selectUserById(+id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    local();
};
```

```javascript
// /passport/localStrategy.js - 사용할 전략 구현, 아래는 로컬 예제
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { selectUserByEmail } = require("../controllers/user");
const { compareHashed } = require("../libs/hash");

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email", // req.body.email
                passwordField: "password", // req.body.password
                session: true, // 세션 저장 여부
            },
            // done: (error, user?, options?)
            async (email, password, done) => {
                try {
                    const user = await selectUserByEmail(email);

                    // 유저 조회 검증
                    if (user) {
                        const isAccordPW = await compareHashed(
                            password,
                            user?.dataValues?.password
                        );
                        // 패스워드 일치 여부 검증
                        if (isAccordPW) {
                            done(null, user?.dataValues);
                        } else {
                            done(null, false, {
                                message: "Cannot accord passord.",
                            });
                        }
                    } else {
                        done(null, false, { message: "Cannot find user." });
                    }
                } catch (error) {
                    done(error);
                }
            }
        )
    );
};
```

```javascript
// app.js - 라우터에서 호출 전 passport 설정 적용
...
const passport = require("passport");
const passportConfig = require("./passport/index");

// for use env variables
dotenv.config();

const app = express();
passportConfig(); // configure passport for auth
const PORT = "port";
const PORT_NUMBER = process.env.PORT_NUMBER || 3000;

app.set(PORT, PORT_NUMBER);

...
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      signed: true,
      maxAge: 24 * 60 * 60, // a day
    },
    name: "express-session-cookie",
  }),
);

app.use(passport.initialize());
app.use(passport.session());

...
```

```javascript
// 라우터 적용
router.post("/login", isNotPrivate, async (req, res, next) => {
    passport.authenticate("local", async (isError, user, error) => {
        if (isError) {
            return next(error);
        }

        // 해당 이메일로 가입한 사용자가 있는지 검증
        if (!user) {
            const error = "해당 이메일로 가입된 사용자가 존재하지 않습니다.";
            return res.status(401).json({
                status: false,
                error,
            });
        }

        // 검증 로직 완료, 로그인 로직 수행 - sessioning
        return req.login(user, (loginErorr) => {
            if (loginErorr) {
                return next(loginErorr);
            }

            // 로그인 완료
            return res.status(200).json({
                status: true,
                data: {
                    id: user.id,
                    username: user.username,
                },
            });
        });
    })(req, res, next); // 미들웨어 내부에서 미들웨어를 호출하는 경우
});

router.get("/logout", isPrivate, (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }

        req.session.destroy();

        return res.status(200).json({
            status: true,
        });
    });
});
```

---

## 발견한 오류 목록

-   [프런트엔드 서버에서 쿠키 발급이 안되는 이슈](#프런트엔드-서버에서-쿠키-발급이-안되는-이슈)
-   [Error: req#logout requires a callback function](#error-reqlogout-requires-a-callback-function)

---

### 프런트엔드 서버에서 쿠키 발급이 안되는 이슈

-   도메인이 동일해야 쿠키가 발급됨.
-   프런트엔드와 백엔드를 나누어 개발할 경우, 발생할 수 있음.
-   프런트엔드에서 Proxy를 설정해주면 성공적으로 세션 쿠키가 발급됨
    -   Cf. [Next.js에서의 proxy 설정 | 호정s 개발 일기](https://hojung-testbench.tistory.com/entry/NextJS-NextJS%EC%97%90%EC%84%9C%EC%9D%98-proxy%EC%84%A4%EC%A0%95)

---

### Error: req#logout requires a callback function

-   `passport.js`의 버전이 올라가, 함수의 사용 방식이 비동기 방식으로 변경됨.
-   [[해결법] Error: req#logout requires a callback function | inflearn](https://www.inflearn.com/chats/798511/%ED%95%B4%EA%B2%B0%EB%B2%95-error-req-logout-requires-a-callback-function)

    ```javascript
    // 기존
    app.get("/logout", (req, res, next) => {
        req.logout();
        res.json({ status: true });
    });

    // 변경된 방식
    app.get("/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }

            res.json({ status: true });
        });
    });
    ```

---
