# Learn Express.js && Node.js

## 목차

-   [익스프레스 프로젝트 시작](#익스프레스-프로젝트-시작)

---

## 익스프레스 프로젝트 시작

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
