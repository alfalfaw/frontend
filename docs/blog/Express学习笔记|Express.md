# Express 笔记

## 构建基本 Server

```
const expresss = require("express");

// 初始化express
const app = expresss();

// 创建路由处理函数
app.get("/", function (req, res) {
  res.send("Hello World");
});

// 监听端口
app.listen(5000);
```

> 如果使用 import 语法，需要用 babel 进行编译

## 路由处理函数

```
app.get("/", function (req, res) {
  // 从数据库获取时数据
  // 加载页面
  // 返回json数据
  // 对请求(req)和响应(res)的完全访问权限
  // 重定向

  res.send("Hello World");
});
```

1. 处理请求
2. app.get()、app.post()、app.put()、app.delete()等方法
3. 访问参数(params):`:id`、URL 参数(query string):`?name="andy&&age="3"`、URL 的各个部分(url parts)等
4. 使用 express 提供的路由库(router)将路由分开在不同文件
5. 使用 Body Parser 解析 post 参数

## 中间件(middleware)

> 中间件是值可以访问请求体(request)和响应体(response)的函数。项目中使用的中间件主要来自 Express 内置、第三方包以及自定义

1. 执行任何代码
2. 对请求(request)和响应(response)做任何更改
3. 结束响应循环(response cycle)
4. 调用另一个栈中的另一个中间件(Call next middleware in the stack)

## 初始化项目

### 初始化包管理工具

```
npm init -y
```

### 安装依赖

```
// express
npm install express --save
// moment 日期处理类，便于打印日志时输出日期
npm install moment --save
// uuid
npm install uuid --save
// handkebars
npm install express-handlebars --save
```

### 构建 server

**index.js**

```
const expresss = require("express");

// 初始化express
const app = expresss();

// 端口
const PORT = process.env.PORT || 5000;

// 监听端口
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

### 创建路由

**index.js**

```
const expresss = require("express");

// 初始化express
const app = expresss();

const PORT = process.env.PORT || 5000;

// 路由处理函数
app.get("/", (req, res) => {
  // 返回Hello World
  res.send("Hello World");
});

// 监听端口
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

### 修改 package.json

**package.json**

```
"main": "index.js",
"scripts": {
  "start": "node index",
  "dev": "nodemon index"
},
```

> 针对不同开发环境选择不同项目启动方式，开发环境`npm run dev`，生产环境`npm run start`

## 静态文件

### 返回 HTML

> 使用`res.sendFile(filepath)`来返回 HTML 文件

```
// 创建路由处理函数
app.get("/", (req, res) => {
  // __dirname 表示当前文件所在目录，path.join() 用于路径拼接，下面的路径等同于  path-to-current-directory/public/index.html
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
```

### express.static("path")

> 如果只是返回静态页面，无需查询数据库等操作，甚至可以没有路由处理函数，只需要使用`express.static("path")`来指定静态资源路径。如果有多个静态资源目录，就使用多次`express.static()`

```
// 设置静态文件路径
app.use(expresss.static(path.join(__dirname, "public")));
```

> 访问`localhost:5000/about.html`将返回`public/about.html`文件

### css 文件

> 在 public 下新建 css 文件夹，该文件夹用于存放所有页面的样式

**public/css/main.css**

```
html {
  background: #000;
  color: white;
}
```

引入样式

**public/index.html**

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Express</title>
    <link rel="stylesheet" href="./css/mian.css" />
  </head>
  <body>
    <h1>My Website</h1>
  </body>
</html>
```

## json 数据

> express 通常作为后台使用`res.json()`向前端发送 json 数据。

**index.js**

```
const members = [
  {
    name: "abc",
    age: 18,
  },
  {
    name: "edg",
    age: 55,
  },
];
// 获取所有会员
app.get("/api/members", (res, req) => res.json(members));
```

## 日志中间件

> 新建`middleware`文件夹存放中间件，中间件其实是一个函数，它有三个参数，`req`请求体，`res`响应体，`next`用于路由放行。启用中间件使用`app.use(middleware)`，中间件启用后所有请求都会经过这个中间件

**middleware/logger.js**

```
// 日期处理
const moment = require("moment");
// 创建中间件
const logger = (req, res, next) => {
  console.log(
    `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }:${moment().format()}`
  );
  next();
};

module.exports = logger;
```

**index.js**

```
const logger = require("./middleware/logger");
// 初始化中间件
app.use(logger);
```

> 上面创建了一个日志中间件，每条请求到来时打印请求的 URL，使用`moment`格式化时间。该中间件有利于查找错误

## 获取路由参数

> `/api/members/:id`表示 URL 最后一个为参数名，通过`req.params.id`取值

**index.js**

```
// 获取指定会员
app.get("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const found = members.some((member) => member.id === id);
  if (found) res.json(members.filter((member) => member.id === id));
  else res.status(400).json({ msg: "No member found" });
});
```

1. 注意所有传递过来的参数都变为字符串类型，可以使用`parseInt()`将字符串变为整数。
2. 获取不到数据的情况应使用不同状态码

## 路由重构

> 新建一个路由文件夹`routes`，在该文件夹下新建`api`文件夹，该文件夹存放后台 api 接口。最后在`index.js`中导入。

**routes/api/member.js**

```
const express = require("express");
const router = express.Router();

const members = require("../../members");

// 获取所有会员
router.get("/", (req, res) => res.json(members));

// 获取指定会员
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const found = members.some((member) => member.id === parseInt(id));
  if (found) res.json(members.filter((member) => member.id === parseInt(id)));
  else res.status(400).json({ msg: "No member found" });
});

module.exports = router;
```

**index.js**

```
// 引入member路由文件
app.use("/api/members", require("./routes/api/member"));
```

## 解析 post 提交的数据和 URL

**index.js**

```
// 解析post提交数据
app.use(expresss.json());

// 解析URL编码的数据
app.use(expresss.urlencoded({ extended: false }));
```

**routes/api/member.js**

```
// 添加会员
router.post("/", (req, res) => {
  const { name, email } = req.body;
  const newMember = {
    id: uuid.v4(),
    name,
    email,
    status: "active",
  };
  if (!newMember.name || !newMember.email) {
    return res.status(400).json({ msg: "请输入用户名和密码" });
  }
  members.push(newMember);
  res.status(201).json(members);
});

// 更新会员信息
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const found = members.some((member) => member.id === parseInt(id));
  if (found) {
    updMember = req.body;
    members.forEach((member) => {
      if (member.id === parseInt(id)) {
        member.name = updMember.name ? updMember.name : member.name;
        member.email = updMember.email ? updMember.email : member.email;
        res.json({ msg: "updated", member });
        return;
      }
    });
  } else res.status(400).json({ msg: "No member found" });
});

// 删除会员
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const found = members.some((member) => member.id === parseInt(id));
  if (found)
    res.json({
      msg: "member deleted",
      members: members.filter((member) => member.id !== parseInt(id)),
    });
  else res.status(400).json({ msg: "No member found" });
});
```

## 模板引擎

> 新建`views`文件夹，存放模板文件

**index.js**

```
const exphbs = require('express-handlebars')
// handlebars 中间件
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// 主页路由 该文件在 views/index.handlebars
app.get("/", (req, res) => res.render("index"));
```

> 如果需要向模板传递参数，使用`res.render("index", { name:'andy', age:12 })`

**views/layouts/main.handlebars**

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member App</title>
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

</head>

<body>
    <div class="container">
        {{{body}}}
    </div>
    <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
</body>

</html>
```

> 该页面是布局文件

**views/index.handlebars**

> 如果使用模板渲染引擎，可以注释掉**app.use(expresss.static(path.join(\_\_dirname, "public")));**。

```
<h1>{{title}}</h1>

<h4>Members</h4>
<form action="/api/members" method="POST" class="mb-4">
    <div class="form-group">
        <label for="name">Name</label>
        <input type="text" name="name" class="form-control">
    </div>
    <div class="form-group">
        <label for="email">Email</label>
        <input type="text" name="email" class="form-control">
    </div>
    <input type="submit" value="提交" class="btn btn-primary btn-block">
</form>
<ul class="list-group">
    {{#each members}}
    <li class="list-group-item">{{this.name}}:{{this.email}}</li>
    {{/each}}
</ul>
```

添加会员后，返回原来的模板文件，添加的用户信息将展示在页面上

```
// res.status(201).json(members);
res.redirect("/");
```

## 登录验证

> 参考http://www.passportjs.org/
