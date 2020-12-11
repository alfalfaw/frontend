# Koa 笔记

## RESTful API

### 请求规范

- URI 使用名词，尽量使用复数，如`/users`

- URI 使用嵌套表示关联关系 如`/users/12/repos/5`
- 使用正确的 HTTP 方法，如 GET、POST、PUT、DELETE

### 响应规范

- 查询
- 状态码
- 分页
- 字段过滤
- 错误处理

### 安全

- HTTPS
- 鉴权
- 限流

### CURD

- GET 返回 200

- POST 返回新建对象，PATCH 更新部分属性，返回修改对象

- PUT 返回修改对象

- DELETE 返回 204

### 断点调试

先打上断点，然后按 fn + f5 运行项目

[![w8g441.png](https://upload-images.jianshu.io/upload_images/20823417-a614808da8c2eb77.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](https://imgchr.com/i/w8g441)

对于常用的变量可以`add to watch`方便以后查找

## Koa 请求参数

Koa 获取参数有两种方式，一种是从上下文对象中直接获取，另一种是从上下文的 request 对象中获取。请求参数主要包含以下内容

- Query String，如 q=100

从上下文中获取 query 参数

获取请求对象 `ctx.query`返回`{q: 100}`

获取请求字符串 `ctx.querystring`返回`q=100`

从上下文的`request`对象中获取参数

获取请求对象 `ctx.request.query`返回`{q: 100}`

获取请求字符串 `ctx.request.querystring`返回`{q: 100}`

- Router Params，如/user/:id

获取路由中的参数`ctx.request.params.id`

- Body

获取请求体可以借助第三方中间件来，如`koa-body`或者`koa-bodyparser`，使用过程可以参考[这篇文章](http://www.ptbird.cn/koa-body.html)

- Header, 如 Accept、Cookie

获取请求头可以通过`ctx.request.headers`

## Koa 发送响应

### status

设置响应状态码使用`ctx.response.status = 200`，如果状态码没有被设置，那么 koa 会自动设置为`200`或`204`

各种场景对应的状态码如下

```
100 "continue"
101 "switching protocols"
102 "processing"
200 "ok"
201 "created"
202 "accepted"
203 "non-authoritative information"
204 "no content"
205 "reset content"
206 "partial content"
207 "multi-status"
208 "already reported"
226 "im used"
300 "multiple choices"
301 "moved permanently"
302 "found"
303 "see other"
304 "not modified"
305 "use proxy"
307 "temporary redirect"
308 "permanent redirect"
400 "bad request"
401 "unauthorized"
402 "payment required"
403 "forbidden"
404 "not found"
405 "method not allowed"
406 "not acceptable"
407 "proxy authentication required"
408 "request timeout"
409 "conflict"
410 "gone"
411 "length required"
412 "precondition failed"
413 "payload too large"
414 "uri too long"
415 "unsupported media type"
416 "range not satisfiable"
417 "expectation failed"
418 "I'm a teapot"
422 "unprocessable entity"
423 "locked"
424 "failed dependency"
426 "upgrade required"
428 "precondition required"
429 "too many requests"
431 "request header fields too large"
500 "internal server error"
501 "not implemented"
502 "bad gateway"
503 "service unavailable"
504 "gateway timeout"
505 "http version not supported"
506 "variant also negotiates"
507 "insufficient storage"
508 "loop detected"
510 "not extended"
511 "network authentication required"
```

### message

响应状态消息一般和状态码有关，设置方式是`ctx.response.message = 'something was wrong.'`

### body

`ctx.response.body = {}`，其中响应体可以是以下类型

- String 类型
- Buffer 流
- Stream 管道
- Object || Array JSON
- null 无内容

| Body 类型         | Content-Type             |
| ----------------- | ------------------------ |
| String            | text/html 或 text/plain  |
| Buffer            | application/octet-stream |
| Stream            | application/octet-stream |
| Object \|\| Array | application/json         |

### header

用`set`设置响应头，也可以使用`.`语法

```
ctx.set({
  'Etag': '1234',
  'Last-Modified': date
});
```

设置响应的`Content-Type`

```
ctx.type = 'text/plain; charset=utf-8';
ctx.type = 'image/png';
ctx.type = '.png';
ctx.type = 'png';
```

## 编写控制器最佳实践

处理请求、处理业务、返回响应

- 每个资源的控制器放在不同的文件里

- 尽量使用类+类方法的形式编写控制器

- 严谨的错误处理

## 目录结构

- 按照功能模块进行区分
- 路由压缩 koa-combine-routers
- 静态资源 koa-static

```
.
|____LICENSE
|____README.md
|____.gitignore
|____package-lock.json
|____package.json
|____src
| |____middlewares
| | |____check.js
| |____models
| | |____Question.js
| | |____User.js
| | |____Answer.js
| | |____Comment.js
| | |____Topic.js
| |____config.js
| |____public
| | |____index.html
| | |____uploads
| | | |____.gitkeep
| |____controllers
| | |____questions.js
| | |____users.js
| | |____comments.js
| | |____common.js
| | |____topics.js
| | |____answers.js
| |____routes
| | |____questions.js
| | |____users.js
| | |____index.js
| | |____comments.js
| | |____common.js
| | |____topics.js
| | |____answers.js
| |____app.js
```

## Koa 高级

### 中间件

```
const Koa = require('koa')
const app = new Koa()
const KoaRouter = require('koa-router')
const router = new KoaRouter()

const middleware1 = async function (ctx, next) {
  await next()
  console.log('this is middleware1')
}
const middleware2 = async function (ctx, next) {
  console.log('this is middleware2')
  await next()
}
const middleware3 = async function (ctx, next) {
  console.log('this is middleware3')
  await next()
}
router.get('/', middleware1, middleware2, middleware3, (ctx) => {
  ctx.body = 'ok'
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(5000)
```

按`middleware`出现次序依次执行，遇到`next()`直接执行下一个中间件，执行完成后返回到之前代码继续执行

### 异常处理

常见错误类型

- 运行时错误，500
- 逻辑错误，找不到`404`、先决条件失败`412`，如缺少参数，无法处理实体`422`，如参数格式不对

为什么要有错误信息

- 防止程序挂掉

- 告诉用户错误信息

- 便于开发调试

#### koa 自带错误处理

koa 会自动处理类似 404，500 等错误，并返回错误信息

#### 自定义中间件处理错误

```
// 支持捕获主动抛出错误和运行时错误，不能捕获 404
app.use(async (ctx, next) => {
  try {
    // 如果 next 的代码出错，会被 catch 捕获
    await next();
  } catch (error) {
    ctx.status = error.status || error.statusCode || 500;
    ctx.body = {
      message: error.message,
    };
  }
});
```

#### koa-json-error 处理错误

安装

```
npm i koa-json-error
```

区分生产环境和开发环境

```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "serve": "nodemon src/app",
  "start": "NODE_ENV=production node src/app"
},
```

windows 环境可能需要安装`cross-env`来配置环境变量

配置`koa-json-error`，让其在生产环境下不打印堆栈信息

```
const error = require("koa-json-error");
// 在生产环境不返回错误堆栈信息
app.use(
  error({
    postFormat: (error, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
  })
);
```

### 参数校验

koa-parameter 校验参数

安装

```
npm i koa-parameter
```

使用

**app.js**

```
app.use(parameter(app));
```

**controllers/users.js**

```
async create(ctx) {
  ctx.verifyParams({
    name: { type: "string", required: true },
    password: { type: "string", required: true },
  });
  const { name } = ctx.request.body;
  const repeatedUser = await User.findOne({ name });
  if (repeatedUser) {
    ctx.throw(409, "用户名已经占用");
  }
  const user = await new User(ctx.request.body).save();

  ctx.body = user;
}
```

### 解析请求体

安装

```
npm i koa-body
```

使用

**app.js**

```
const KoaBody = require("koa-body");
// 解析 body
app.use(
  KoaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "public/uploads"),
      keepExtensions: true,
    },
  })
);
```

### 跨域

```
npm i @koa/cors
```

**app.js**

```
const KoaCors = require('@koa/cors')
app.use(KoaCors())
```

### 格式化响应

```
npm i koa-json
```

**app.js**

```
const KoaJson = require('koa-json')
// 默认关闭 pretty , 只有当 query 参数中含有 pretty 时才会返回格式化参数
app.use(KoaJson({ pretty: false, param: 'pretty' }))
```

### 合并路由

```
npm i koa-combine-routers
```

**app.js**

```
const Koa = require('koa')
const router = require('./routes')
const app = new Koa()
app.use(router())
```

**routes/index.js**

```
const Router = require('koa-router')
const combineRouters = require('koa-combine-routers')

const dogRouter = new Router()
const catRouter = new Router()

dogRouter.get('/dogs', async ctx => {
  ctx.body = 'ok'
})

catRouter.get('/cats', async ctx => {
  ctx.body = 'ok'
})

const router = combineRouters(
  dogRouter,
  catRouter
)

module.exports = router
```

### 安全

```
npm i koa-helmet
```

**app.js**

```
const Koa = require('koa')
const KoaHelmet = require('koa-helmet')
const app = new Koa()
app.use(KoaHelmet())
```

### 静态文件

```
npm i koa-static
```

**app.js**

```
const Koa = require('koa')
const path = require('path')
const KoaStatic = require('koa-static')
const app = new Koa()
app.use(KoaStatic(path.join(__dirname, '../public')))
```

### es6&webpack

```
npm i -D webpack webpack-cli
npm i -D clean-webpack-plugin webpack-node-externals @babel/core @babel/node @babel/preset-env babel-loader cross-env
```

- clean-webpack-plugin 清理 dist 文件夹
- webpack-node-externals 排除 node_modules
- babel 支持 es6 语法

**webpack.config.js**

```
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const webpackconfig = {
  target: 'node',
  mode: 'development',
  entry: {
    server: path.join(__dirname, 'src/app.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist')
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: [path.join(__dirname, 'node_modules')]
      }
    ]
  },
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin()],
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  }
}

module.exports = webpackconfig
```

**.babelrc**

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```

**package.json**

```
"scripts": {
  "serve": "nodemon --exec babel-node src/app.js"
},
```

调试 webpack 配置

- Chrome 调试

运行

```
node --inspect-brk ./node_modules/.bin/webpack --inline --progress
```

浏览器访问`chrome://inspect/#devices`，点击`inspect`进入调试页面

为了调试方便，可以在`package.json`文件中加入如下命令

```
"scripts": {
  "webpack:debug": "node --inspect-brk ./node_modules/.bin/webpack --inline --progress"
},
```

之后调试`webpack`只需要运行`npm run webpack:debug`

- VSCode 调试

在`configurations`中输入`nodemon`，选择`nodemon setup`快速生成配置样板

**.vscode/launch.json**

```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "name": "nodemon",
      "program": "${workspaceFolder}/src/app.js",
      "request": "launch",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "skipFiles": ["<node_internals>/**"],
      "type": "pwa-node",
      "runtimeArgs": ["--exec", "babel-node"]
    }
  ]
}
```

`program`指定入口文件，指定`runtimeArgs`是因为使用了 es6 语法

### 数据库

#### 连接数据库

**app.js**

```
const mongoose = require("mongoose");
const { connectionStr } = require("./config");

mongoose.connect(
  connectionStr,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("connect")
);
mongoose.connection.on("error", console.error);
```

#### 定义 Schema

**models/User.js**

```
const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    // select 为 false 时查询时默认隐藏
    password: {
      type: String,
      required: true,
      select: false,
      set(val) {
        return require("bcrypt").hashSync(val, 10);
      },
    },
    avatar_url: { type: String },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
      required: true,
    },
    headline: { type: String },
    locations: {
      type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
      select: false,
    },
    business: { type: Schema.Types.ObjectId, ref: "Topic", select: false },
    employments: {
      type: [
        {
          company: { type: Schema.Types.ObjectId, ref: "Topic" },
          job: { type: Schema.Types.ObjectId, ref: "Topic" },
        },
      ],
      select: false,
    },
    educations: {
      type: [
        {
          school: { type: Schema.Types.ObjectId, ref: "Topic" },
          major: { type: Schema.Types.ObjectId, ref: "Topic" },
          diploma: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
          },
          entrance_year: { type: Number },
          graduation_year: { type: Number },
        },
      ],
      select: false,
    },
    following: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      select: false,
    },
    // 关注话题
    followingTopics: {
      type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
      select: false,
    },
    // 关注问题
    followingQuestions: {
      type: [{ type: Schema.Types.ObjectId, ref: "Question" }],
      select: false,
    },

    likingAnswers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Answer",
        },
      ],
      select: false,
    },
    dislikingAnswers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Answer",
        },
      ],
      select: false,
    },
    collectingAnswers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Answer",
        },
      ],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
```

#### 字段过滤

让一些字段默认不显示，方法是修改 schema，在默认不显示的字段上添加`select:false`。在查询时如果需要这个字段，需要加上`select("+fieldName")`

## 权限认证

### 自定义中间件完成权限认证

**controllers/users.js**

```
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { secret } = require("../config");
const bcrypt = require("bcrypt");
class UsersCtl {

  // 登录
  async login(ctx) {
    const { name, password } = ctx.request.body;
    const user = await User.findOne({ name }).select("+password");
    if (!user) {
      ctx.throw(422, "用户不存在");
    }
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      ctx.throw(422, "用户密码错误");
    }

    const token = jwt.sign({ _id: user._id, name }, secret, {
      expiresIn: "1d",
    });
    ctx.body = { token };
  }

  // 检查权限，只允许修改本人信息
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }
}
module.exports = new UsersCtl();
```

**routes/users.js**

```
const Router = require("koa-router");
const router = new Router({ prefix: "/users" });
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const {
  find,
  findById,
  create,
  update,
  del,
  login,
  checkOwner,
} = require("../controllers/users");

const auth = async (ctx, next) => {
  const { authorization = "" } = ctx.request.header;
  const token = authorization.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, secret);
    ctx.state.user = user;
  } catch (error) {
    ctx.throw(401, error.message);
  }
  await next();
};

router.get("/", find);
router.get("/:id", findById);
router.post("/", create);
router.patch("/:id", auth, checkOwner, update);
router.delete("/:id", auth, checkOwner, del);
router.post("/login", login);

module.exports = router;
```

### 基于 koa-jwt 实现权限认证

安装

```
npm i koa-jwt
```

使用

```
const Router = require("koa-router");
const router = new Router({ prefix: "/users" });
// const jwt = require("jsonwebtoken");
const jwt = require("koa-jwt");
const { secret } = require("../config");
const {
  find,
  findById,
  create,
  update,
  del,
  login,
  checkOwner,
} = require("../controllers/users");

const auth = jwt({ secret });

// 获取用户列表
router.get("/", find);
// 获取用户详情
router.get("/:id", findById);
// 创建用户
router.post("/", create);
// 更新用户 patch 可以更新部分
router.patch("/", auth, update);
// 删除用户
router.delete("/", auth, del);
// 登录
router.post("/login", login);

module.exports = router;
```

## 上传图片

### 主要功能

基础功能：图片上传、生成图片链接

附加功能：限制上传图片的大小与类型、生成高中低三种分辨率的图片链接、生成 CDN

### 代码实现

安装

```
npm i koa-body
npm i koa-static
```

**app.js**

```
const KoaBody = require("koa-body");
const serve = require("koa-static");

// 静态资源目录
app.use(serve(path.join(__dirname, "public")));
// 解析 body
app.use(
  KoaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "public/uploads"),
      keepExtensions: true,
    },
  })
);
```

**controllers/common.js**

```
// Content-Type 为 multipart/form-data 才会被解析
upload(ctx) {
  const file = ctx.request.files.file;
  const basename = path.basename(file.path);
  ctx.body = {
    url: `${ctx.origin}/uploads/${basename}`,
  };
}
```

**public/index.html**

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <form action="/upload" enctype="multipart/form-data" method="POST">
      <!-- 必须指定 name 否则后端获取不到文件 -->
      <input type="file" name="file" accept="image/*" />
      <button type="submit">上传</button>
    </form>
  </body>
</html>
```

`accept`可以指定允许上传的图片类型，比如`image/gif, image/jpeg`，多种类型用逗号隔开

## 分页和模糊搜索

**controllers/questions.js**

```
async find(ctx) {
  const { per_page = 10 } = ctx.query;
  const page = Math.max(ctx.query.page * 1, 1) - 1;
  const perPage = Math.max(per_page * 1, 1);
  const q = new RegExp(ctx.query.q);
  ctx.body = await Question.find({ $or: [{ title: q }, { description: q }] })
    .limit(perPage)
    .skip(perPage * page);
}
```

分页搜索的关键是`skip`和`limit`这两个查询参数，模糊搜索则使用了正则表达式

## 功能列表

### 用户

- 用户列表
- 用户详情
- 创建用户
- 更新用户
- 删除用户
- 登录
- 获取已关注用户列表
- 获取用户粉丝列表
- 关注用户
- 取消关注
- 用户关注话题列表
- 用户关注话题
- 用户取消关注话题
- 用户关注问题列表
- 用户问题列表(用户-问题的一对多关系)
- 用户关注问题
- 用户取消关注问题
- 用户赞同答案列表
- 用户赞同答案
- 用户取消赞同
- 用户不赞同答案列表
- 用户不赞同答案
- 用户取消不赞同
- 用户收藏答案列表
- 用户收藏答案
- 用户取消收藏

### 话题

- 获取话题列表
- 话题详情
- 创建话题
- 修改话题
- 删除话题
- 获取话题粉丝列表
- 获取话题的问题列表

### 问题

- 问题列表

- 创建问题
- 修改问题
- 删除问题
- 问题详情
- 问题的话题列表(问题-话题多对多关系)
- 问题的关注列表(问题-用户多对多关系)

### 回答

- 回答列表
- 创建回答(问题-答案/用户-答案一对多)
- 回答详情
- 修改回答
- 删除回答

### 评论

- 获取评论列表
- 发表评论(答案-评论/问题-评论/用户-评论一对多、多级评论)
- 获取评论详情
- 修改评论
- 删除评论

## API 文档

### 登录

#### 接口：

```
POST /users/login
```

#### 参数：

| 参数名   | 参数类型 | 参数位置 | 描述         |
| -------- | -------- | -------- | ------------ |
| name     | string   | body     | 用户名，必填 |
| password | string   | body     | 密码，必填   |

#### 响应：

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjcxZDNkNDk4ZDRkYzBkZTEzMjAwZjUiLCJuYW1lIjoiYWxmYWxmYXciLCJpYXQiOjE2MDE0NjExNTMsImV4cCI6MTYwMTU0NzU1M30.HairtegFaKmtiFOyIZ7iWche11L8dlZ614bjynRhOWs"
}
```

### 获取用户列表

#### 接口：

```
GET /users
```

#### 参数：

| 参数名   | 参数类型 | 参数位置 | 描述               |
| -------- | -------- | -------- | ------------------ |
| per_page | number   | query    | 可选，每页大小     |
| page     | number   | query    | 可选，当前所在页码 |

#### 响应：

```
[
  {
    "gender": "male",
    "_id": "5f71d3d498d4dc0de13200f5",
    "name": "alfalfaw",
    "avatar_url": "test_url",
    "__v": 3
  }
]
```

### 获取用户详情

#### 接口：

```
GET /users/:id
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述                                                                                                                                                           |
| ------ | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id     | string   | path     | 必选，用户 id                                                                                                                                                  |
| fields | string   | query    | 可选，需要增加到返回结果中的字段。可选项`locations business employments educations following followingTopics likingAnswers dislikingAnswers collectingAnswers` |

#### 响应：

```
{
  "gender": "male",
  "locations": [],
  "following": [],
  "followingTopics": [
    {
      "_id": "5f71ddf84557410e40278a2e",
      "name": "水木年华",
      "avatar_url": "test_url",
      "__v": 0
    }
  ],
  "likingAnswers": [
    {
      "voteCount": 0,
      "_id": "5f771b1b1755574dbb6f5b0b",
      "content": "这是答案",
      "answerer": "5f71d3d498d4dc0de13200f5",
      "questionId": "5f734af88519d353e0dcea03",
      "createdAt": "2020-10-02T12:20:43.530Z",
      "updatedAt": "2020-10-02T12:30:28.505Z",
      "__v": 0
    }
  ],
  "dislikingAnswers": [],
  "collectingAnswers": [],
  "_id": "5f71d3d498d4dc0de13200f5",
  "name": "alfalfaw",
  "avatar_url": "test_url",
  "__v": 10,
  "updatedAt": "2020-10-02T13:00:53.472Z",
  "createdAt": "2020-10-02T10:52:46.202Z"
}
```

### 创建用户

#### 接口：

```
POST /users
```

#### 参数：

| 参数名   | 参数类型 | 参数位置 | 描述               |
| -------- | -------- | -------- | ------------------ |
| name     | string   | body     | 必须且唯一，用户名 |
| password | string   | body     | 必须，用户密码     |

#### 响应：

```
{
  "gender": "male",
  "locations": [],
  "following": [],
  "followingTopics": [],
  "likingAnswers": [],
  "dislikingAnswers": [],
  "collectingAnswers": [],
  "_id": "5f76d22e58edc146378be327",
  "name": "alfalfaw2",
  "password": "$2b$10$jNfWo9MYKKJs9N4xUzv9WeumlSProJxQ7L5TBMDPBrQ9VjJXm1ZD.",
  "employments": [],
  "educations": [],
  "createdAt": "2020-10-02T07:09:35.017Z",
  "updatedAt": "2020-10-02T07:09:35.017Z",
  "__v": 0
}
```

### 修改用户资料

#### 接口：

```
PATCH /users
```

#### 参数：

| 参数名            | 参数类型 | 参数位置 | 描述                           |
| ----------------- | -------- | -------- | ------------------------------ |
| Authorization     | string   | header   | 必须，token 参数               |
| name              | string   | body     | 可选，用户名                   |
| password          | string   | body     | 可选，密码                     |
| avatar_url        | string   | body     | 可选，头像                     |
| gender            | enum     | body     | 可选，性别。'male'或者'female' |
| headline          | string   | body     | 可选，简介                     |
| locations         | array    | body     | 可选，地点                     |
| business          | object   | body     | 可选，行业                     |
| employments       | array    | body     | 可选，职业经历                 |
| educations        | array    | body     | 可选，教育经历                 |
| following         | array    | body     | 可选，关注的人                 |
| followingTopics   | array    | body     | 可选，关注的话题               |
| likingAnswers     | array    | body     | 可选，喜欢的答案               |
| dislikingAnswers  | array    | body     | 可选，不喜欢的答案             |
| collectingAnswers | array    | body     | 可选，收藏的答案               |

#### 响应：

```
{
  "gender": "male",
  "_id": "5f71d3d498d4dc0de13200f5",
  "name": "alfalfaw",
  "avatar_url": "test_url",
  "__v": 10,
  "updatedAt": "2020-10-02T13:05:26.961Z",
  "createdAt": "2020-10-02T10:52:46.202Z"
}
```

### 删除用户

#### 接口：

```
DELETE /users
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必须，token 参数 |

#### 响应：

```
status 204
```

### 获取已关注用户列表

#### 接口：

```
GET /users/:id/following
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，用户 id |

#### 响应：

```
[
  {
    "gender": "male",
    "_id": "5f7705281d073d487d312571",
    "name": "tom",
    "createdAt": "2020-10-02T10:47:04.147Z",
    "updatedAt": "2020-10-02T10:47:04.147Z",
    "__v": 0
  }
]
```

### 关注用户

#### 接口：

```
PUT /users/following/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述                |
| ------------- | -------- | -------- | ------------------- |
| Authorization | string   | header   | 必须，token 参数    |
| id            | string   | path     | 必须，被关注人的 id |

#### 响应：

```
status 204
```

### 获取用户粉丝列表

#### 接口：

```
GET /users/:id/followers
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，用户 id |

#### 响应：

```
[
  {
    "gender": "male",
    "_id": "5f71d3d498d4dc0de13200f5",
    "name": "alfalfaw",
    "avatar_url": "test_url",
    "__v": 4,
    "updatedAt": "2020-10-02T10:52:46.202Z",
    "createdAt": "2020-10-02T10:52:46.202Z"
  }
]
```

### 取消关注用户

#### 接口：

```
DELETE /users/following/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述                    |
| ------------- | -------- | -------- | ----------------------- |
| Authorization | string   | header   | 必选，token 参数        |
| id            | string   | path     | 必选，取消关注的用户 id |

#### 响应：

```
status 204
```

### 获取用户关注话题列表

#### 接口：

```
GET /users/:id/followingTopics
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，用户 id |

#### 响应：

```
[
  {
    "_id": "5f71ddf84557410e40278a2e",
    "name": "水木年华",
    "avatar_url": "test_url",
    "__v": 0
  }
]
```

### 用户关注话题

#### 接口：

```
PUT /users/followingTopic/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，话题 id    |

#### 响应：

```
status 204
```

### 用户取消关注话题

#### 接口：

```
DELETE /users/followingTopic/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，话题 id    |

#### 响应：

```
status 204
```

### 获取用户问题列表

#### 接口：

```
GET /users/:id/questions
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，用户 id |

#### 响应：

```
[
  {
    "_id": "5f734af88519d353e0dcea03",
    "title": "如何看待鸿蒙应用开发框架采用JavaScript作为开发语言？",
    "description": "",
    "questioner": "5f71d3d498d4dc0de13200f5",
    "__v": 0
  }
]
```

### 用户喜欢的答案列表

#### 接口：

```
GET /users/:id/likingAnswers
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，答案 id |

#### 响应：

```
[
  {
    "voteCount": 1,
    "_id": "5f771b1b1755574dbb6f5b0b",
    "content": "这是回答",
    "answerer": "5f71d3d498d4dc0de13200f5",
    "questionId": "5f734af88519d353e0dcea03",
    "createdAt": "2020-10-02T12:20:43.530Z",
    "updatedAt": "2020-10-02T12:21:19.528Z",
    "__v": 0
  }
]
```

### 用户喜欢答案

#### 接口：

```
PUT /users/likingAnswers/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，答案 id    |

#### 响应：

```
status 204
```

### 用户取消喜欢答案

#### 接口：

```
DELETE /users/likingAnswers/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，答案 id    |

#### 响应：

```
status 204
```

### 用户不喜欢的答案列表

#### 接口：

```
GET /users/:id/dislikingAnswers
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，用户 id |

#### 响应：

```
[
  {
    "voteCount": 0,
    "_id": "5f771b1b1755574dbb6f5b0b",
    "content": "这是回答",
    "answerer": "5f71d3d498d4dc0de13200f5",
    "questionId": "5f734af88519d353e0dcea03",
    "createdAt": "2020-10-02T12:20:43.530Z",
    "updatedAt": "2020-10-02T12:30:28.505Z",
    "__v": 0
  }
]
```

### 用户不喜欢答案

#### 接口：

```
PUT /users/dislikingAnswers/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，答案 id    |

#### 响应：

```
status 204
```

### 用户取消不喜欢回答

#### 接口：

```
DELETE /users/dislikingAnswers/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，回答 id    |

#### 响应：

```
status 204
```

### 用户收藏答案列表

#### 接口：

```
GET /users/:id/collectingAnswers
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，用户 id |

#### 响应：

```
[
  {
    "voteCount": 0,
    "_id": "5f771b1b1755574dbb6f5b0b",
    "content": "这是回答",
    "answerer": "5f71d3d498d4dc0de13200f5",
    "questionId": "5f734af88519d353e0dcea03",
    "createdAt": "2020-10-02T12:20:43.530Z",
    "updatedAt": "2020-10-02T12:30:28.505Z",
    "__v": 0
  }
]
```

### 用户收藏答案

#### 接口：

```
PUT /users/collectingAnswers/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，答案 id    |

#### 响应：

```
status 204
```

### 用户取消收藏答案

#### 接口：

```
DELETE /users/collectingAnswers/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，答案 id    |

#### 响应：

```
status 204
```

### 创建回答

#### 接口：

```
POST /questions/:questionId/answers
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| questionId    | string   | path     | 必选，问题 id    |

#### 响应：

```
{
  "topics": [],
  "voteCount": 0,
  "_id": "5f77177b90d3df4c46def772",
  "content": "这是回答",
  "answerer": "5f71d3d498d4dc0de13200f5",
  "questionId": "5f734af88519d353e0dcea03",
  "createdAt": "2020-10-02T12:05:15.146Z",
  "updatedAt": "2020-10-02T12:05:15.146Z",
  "__v": 0
}
```

### 获取回答列表

#### 接口：

```
GET /questions/:questionId/answers
```

#### 参数：

| 参数名     | 参数类型 | 参数位置 | 描述          |
| ---------- | -------- | -------- | ------------- |
| questionId | string   | path     | 必选，问题 id |

#### 响应：

```
[
  {
    "voteCount": 0,
    "_id": "5f77177b90d3df4c46def772",
    "content": "这是回答",
    "answerer": "5f71d3d498d4dc0de13200f5",
    "questionId": "5f734af88519d353e0dcea03",
    "createdAt": "2020-10-02T12:05:15.146Z",
    "updatedAt": "2020-10-02T12:05:15.146Z",
    "__v": 0
  }
]
```

### 获取回答详情

#### 接口：

```
GET /questions/:questionId/answers/:id
```

#### 参数：

| 参数名     | 参数类型 | 参数位置 | 描述          |
| ---------- | -------- | -------- | ------------- |
| questionId | string   | path     | 必选，问题 id |
| id         | string   | path     | 必选，答案 id |

#### 响应：

```
{
  "voteCount": 0,
  "_id": "5f77177b90d3df4c46def772",
  "content": "这是答案",
  "answerer": {
    "gender": "male",
    "_id": "5f71d3d498d4dc0de13200f5",
    "name": "alfalfaw",
    "avatar_url": "test_url",
    "__v": 10,
    "updatedAt": "2020-10-02T13:05:26.961Z",
    "createdAt": "2020-10-02T10:52:46.202Z"
  },
  "questionId": "5f734af88519d353e0dcea03",
  "createdAt": "2020-10-02T12:05:15.146Z",
  "updatedAt": "2020-10-02T12:05:15.146Z",
  "__v": 0
}
```

### 修改回答

#### 接口：

```
PATCH /questions/:questionId/answers/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| questionId    | string   | path     | 必选，问题 id    |
| id            | string   | path     | 必选，答案 id    |

#### 响应：

```
{
  "n": 1,
  "nModified": 1,
  "ok": 1
}
```

### 删除回答

#### 接口：

```
DELETE /questions/:questionId/answers/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| questionId    | string   | path     | 必选，问题 id    |
| id            | string   | path     | 必选，答案 id    |

#### 响应：

```
status 204
```

### 获取问题列表

#### 接口：

```
GET /questions
```

#### 参数：

| 参数名   | 参数类型 | 参数位置 | 描述               |
| -------- | -------- | -------- | ------------------ |
| per_page | number   | query    | 可选，每页大小     |
| page     | number   | query    | 可选，当前所在页码 |

#### 响应：

```
[
  {
    "_id": "5f734af88519d353e0dcea03",
    "title": "这是一个问题",
    "description": "这是问题的描述",
    "questioner": "5f71d3d498d4dc0de13200f5",
    "__v": 0
  }
]
```

### 获取问题详情

#### 接口：

```
GET /questions/:id
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，问题 id |

#### 响应：

```
{
  "topics": [],
  "_id": "5f734af88519d353e0dcea03",
  "title": "这是一个问题",
  "description": "这是问题的描述",
  "questioner": {
    "gender": "male",
    "_id": "5f71d3d498d4dc0de13200f5",
    "name": "alfalfaw",
    "avatar_url": "test_url",
    "__v": 10,
    "updatedAt": "2020-10-02T13:05:26.961Z",
    "createdAt": "2020-10-02T10:52:46.202Z"
  },
  "__v": 0
}
```

### 创建问题

#### 接口：

```
POST /questions
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| title         | string   | body     | 必选，标题       |
| description   | string   | body     | 可选，问题描述   |

#### 响应：

```
{
  "topics": [],
  "_id": "5f7730043312fc52b064db4c",
  "title": "问题1",
  "description": "描述1",
  "questioner": "5f71d3d498d4dc0de13200f5",
  "createdAt": "2020-10-02T13:49:56.776Z",
  "updatedAt": "2020-10-02T13:49:56.776Z",
  "__v": 0
}
```

### 修改问题

#### 接口：

```
PATCH /questions/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，问题 id    |

#### 响应：

```
{ "n": 1, "nModified": 1, "ok": 1 }
```

### 删除问题

#### 接口：

```
DELETE /questions/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，问题 id    |

#### 响应：

```
status 204
```

### 获取问题的关注列表

#### 接口：

```
GET /questions/:id/followers
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述    |
| ------ | -------- | -------- | ------- |
| id     | string   | path     | 问题 id |

#### 响应：

```
[
  {
    "gender": "male",
    "_id": "5f71d3d498d4dc0de13200f5",
    "name": "alfalfaw",
    "avatar_url": "test_url",
    "__v": 11,
    "updatedAt": "2020-10-02T14:33:05.207Z",
    "createdAt": "2020-10-02T10:52:46.202Z"
  }
]
```

### 获取用户问题列表

#### 接口：

```
GET /users/:id/questions
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述    |
| ------ | -------- | -------- | ------- |
| id     | string   | path     | 用户 id |

#### 响应：

```
[
  {
    "_id": "5f734af88519d353e0dcea03",
    "title": "问题122s",
    "description": "描述1",
    "questioner": "5f71d3d498d4dc0de13200f5",
    "__v": 0,
    "updatedAt": "2020-10-02T14:06:18.276Z"
  },
  {
    "_id": "5f7730043312fc52b064db4c",
    "title": "问题1",
    "description": "描述1",
    "questioner": "5f71d3d498d4dc0de13200f5",
    "createdAt": "2020-10-02T13:49:56.776Z",
    "updatedAt": "2020-10-02T13:49:56.776Z",
    "__v": 0
  }
]
```

### 获取用户关注问题列表

#### 接口：

```
GET /users/:id/followingQuestions
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，用户 id |

#### 响应：

```
[
  {
    "_id": "5f734af88519d353e0dcea03",
    "title": "问题122s",
    "description": "描述1",
    "questioner": "5f71d3d498d4dc0de13200f5",
    "__v": 0,
    "updatedAt": "2020-10-02T14:06:18.276Z"
  }
]
```

### 用户关注问题

#### 接口：

```
PUT /users/followingQuestion/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，问题 id    |

#### 响应：

```
status 204
```

### 用户取消关注问题

#### 接口：

```
DELETE /users/followingQuestion/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 必选，问题 id    |

#### 响应：

```
status 204
```

### 获取问题的话题列表

#### 接口：

```
GET /questions/:id/topics
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，问题 id |

#### 响应：

```
[
  {
    "_id": "5f71ddf84557410e40278a2e",
    "name": "水木年华",
    "avatar_url": "test_url",
    "__v": 0
  }
]
```

### 获取话题列表

#### 接口：

```
GET /topics
```

#### 参数：

| 参数名   | 参数类型 | 参数位置 | 描述               |
| -------- | -------- | -------- | ------------------ |
| per_page | number   | query    | 可选，每页大小     |
| page     | number   | query    | 可选，当前所在页码 |

#### 响应：

```
[
  {
    "_id": "5f71ddf84557410e40278a2e",
    "name": "水木年华",
    "avatar_url": "test_url",
    "__v": 0
  }
]
```

### 获取话题详情

#### 接口：

```
GET /topics/:id
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述          |
| ------ | -------- | -------- | ------------- |
| id     | string   | path     | 必选，话题 id |

#### 响应：

```
{
  "_id": "5f71ddf84557410e40278a2e",
  "name": "水木年华",
  "avatar_url": "test_url",
  "__v": 0
}
```

### 创建话题

#### 接口：

```
POST /topics
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| name          | string   | body     | 必选，标题       |
| avatar_url    | string   | body     | 可选，话题封面   |
| introduction  | string   | body     | 可选，话题描述   |

#### 响应：

```
{
  "_id": "5f77402928281f57f19bb665",
  "name": "水木年华11",
  "avatar_url": "test_url",
  "introduction": "测试话题",
  "createdAt": "2020-10-02T14:58:49.727Z",
  "updatedAt": "2020-10-02T14:58:49.727Z",
  "__v": 0
}
```

### 删除话题

#### 接口：

```
DELETE /topics/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| id            | string   | path     | 话题 id          |

#### 响应：

```
status 204
```

### 获取话题粉丝列表

#### 接口：

```
GET /topics/:id/followers
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述    |
| ------ | -------- | -------- | ------- |
| id     | string   | path     | 话题 id |

#### 响应：

```
[
  {
    "gender": "male",
    "_id": "5f71d3d498d4dc0de13200f5",
    "name": "alfalfaw",
    "avatar_url": "test_url",
    "__v": 11,
    "updatedAt": "2020-10-02T14:33:05.207Z",
    "createdAt": "2020-10-02T10:52:46.202Z"
  }
]
```

### 获取话题的问题列表

#### 接口：

```
GET /topics/:id/questions
```

#### 参数：

| 参数名 | 参数类型 | 参数位置 | 描述    |
| ------ | -------- | -------- | ------- |
| id     | string   | path     | 话题 id |

#### 响应：

```
[
  {
    "_id": "5f734af88519d353e0dcea03",
    "title": "问题122s",
    "description": "描述1",
    "questioner": "5f71d3d498d4dc0de13200f5",
    "__v": 0,
    "updatedAt": "2020-10-02T15:13:42.624Z"
  }
]
```

### 获取评论列表

#### 接口：

```
GET /questions/:questionId/answers/:answerId/comments
```

#### 参数：

| 参数名     | 参数类型 | 参数位置 | 描述          |
| ---------- | -------- | -------- | ------------- |
| questionId | string   | path     | 必选，问题 id |
| answerId   | string   | path     | 必选，回答 id |

#### 响应：

```
[
  {
    "_id": "5f7749065aabfe5ac4d5c4d0",
    "content": "评论1",
    "commentator": {
      "gender": "male",
      "_id": "5f71d3d498d4dc0de13200f5",
      "name": "alfalfaw",
      "avatar_url": "test_url",
      "__v": 11,
      "updatedAt": "2020-10-02T14:33:05.207Z",
      "createdAt": "2020-10-02T10:52:46.202Z"
    },
    "answerId": "5f771b1b1755574dbb6f5b0b",
    "questionId": "5f734af88519d353e0dcea03",
    "createdAt": "2020-10-02T15:36:38.362Z",
    "updatedAt": "2020-10-02T15:36:38.362Z",
    "__v": 0
  }
]
```

### 发表评论

#### 接口：

```
POST /questions/:questionId/answers/:answerId/comments
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| questionId    | string   | path     | 必选，问题 id    |
| answerId      | string   | path     | 必选，回答 id    |
| content       | string   | body     | 必选，评论内容   |
| parentId      | string   | body     | 可选，父评论 id  |
| replyTo       | string   | body     | 可选，被评论的人 |

#### 响应：

```
{
  "_id": "5f7749065aabfe5ac4d5c4d0",
  "content": "评论1",
  "commentator": "5f71d3d498d4dc0de13200f5",
  "answerId": "5f771b1b1755574dbb6f5b0b",
  "questionId": "5f734af88519d353e0dcea03",
  "createdAt": "2020-10-02T15:36:38.362Z",
  "updatedAt": "2020-10-02T15:36:38.362Z",
  "__v": 0
}
```

### 获取评论详情

#### 接口：

```
GET /questions/:questionId/answers/:answerId/comments/:id
```

#### 参数：

| 参数名     | 参数类型 | 参数位置 | 描述          |
| ---------- | -------- | -------- | ------------- |
| questionId | string   | path     | 必选，问题 id |
| answerId   | string   | path     | 必选，回答 id |
| id         | string   | path     | 必选，评论 id |

#### 响应：

```
{
  "_id": "5f7749065aabfe5ac4d5c4d0",
  "content": "评论1",
  "commentator": {
    "gender": "male",
    "_id": "5f71d3d498d4dc0de13200f5",
    "name": "alfalfaw",
    "avatar_url": "test_url",
    "__v": 11,
    "updatedAt": "2020-10-02T14:33:05.207Z",
    "createdAt": "2020-10-02T10:52:46.202Z"
  },
  "answerId": "5f771b1b1755574dbb6f5b0b",
  "questionId": "5f734af88519d353e0dcea03",
  "createdAt": "2020-10-02T15:36:38.362Z",
  "updatedAt": "2020-10-02T15:36:38.362Z",
  "__v": 0
}
```

### 修改评论

#### 接口：

```
PATCH /questions/:questionId/answers/:answerId/comments/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| questionId    | string   | path     | 必选，问题 id    |
| answerId      | string   | path     | 必选，回答 id    |
| id            | string   | path     | 必选，评论 id    |
| content       | string   | body     | 必选，评论内容   |

#### 响应：

```
status 204
```

### 删除评论

#### 接口：

```
DELETE /questions/:questionId/answers/:answerId/comments/:id
```

#### 参数：

| 参数名        | 参数类型 | 参数位置 | 描述             |
| ------------- | -------- | -------- | ---------------- |
| Authorization | string   | header   | 必选，token 参数 |
| questionId    | string   | path     | 必选，问题 id    |
| answerId      | string   | path     | 必选，回答 id    |
| id            | string   | path     | 必选，评论 id    |

#### 响应：

```
status 204
```
