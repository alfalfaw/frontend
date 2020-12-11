# Mac 配置

## 终端

> zsh + oh-my-zsh + vim + nano

## 键盘设置

大写: shift+需要大写的字母

`ctrl` 键和`caps lock`互换( 方便移动光标)
![](https://upload-images.jianshu.io/upload_images/20823417-f94614a2f186b0f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

退格: `caps lock + b`
前进: `caps lock + f`
上移: `caps lock + p`
下移: `caps lock + n`

## VSCode 插件

`A Touch of Lilac Theme`或者`Material Theme`主题
`Auto Rename Tag` 标签自动重命名
`Easy Less` 编译 Less
`Live Sass Compiler` 编译 Sass
`EditorConfig for VS Code` 读取配置文件
`Live Server` 本地开启 HTTP Server，代码更改后自动刷新
`Go` 开发 go 必备
`HTML CSS Support` 代码提示
`IntelliSense for CSS class names in HTML` 智能类名提示
`Prettier` 代码格式化
`Bracket Pair Colorizer 2` 将配对的括号显示相同颜色
`px to rem` 将 px 单位转 rem
`Python` 执行 python 文件
`SFTP` 远程连接服务器
`Vettur` Vue 开发必备
`Remote - SSH` 远程连接服务器开发
`Remote Github` 访问 Github 仓库

`Quokka.js` 直接在编辑界面展示运行结果 (command + shift + p ，输入 Quakka 查看使用方法)(一般)

`Code Runner` 代码运行

`Todo Tree` 高亮 TODO

`JavaScript (ES6) code snippets` ES6 代码提示

`Import Cost` 显示导入模块大小

`REST Client` 通过编辑器发送请求(一般)

`Indenticator` 缩进指示器(一般)

`Chinese VSCode` 汉化插件

## Chrome 插件

`Color Picker` 获取颜色(非必须，直接点击 css 样式中的色块会出现取色器)
`CSS Peeper` 提取元素样式
`Enable Copy` 开启复制
`Enhanced GitHub` 展示 github 下载链接(只能下载文件，没什么用)
`Infinity 新标签页 (Pro)` 主题美化
`JSON Formatter` 格式化 JSON 数据
`Talend API Tester - Free Edition` 发送请求，类似 Postman
`Video Speed Controller` 视频播放加速
`Vue.js devtools Vue` 开发者工具
`XPath Helper` 输入 xpth，展示提取结果
`安全外壳 (SSH)` 模拟终端

## VSCode 快捷键

打开侧边栏 `command + b`
删除上一个单词 `option + delete`
删除一行 `command + u`
删除当前行`command + shift + k`
选中一个单词`command + d`
删除光标后面的字符`fn + delete`
快速切换文件 `command + p` ，输入文件名并回车

## vscode 关闭渲染空格

默认情况下在选中区域会渲染空格，也就是呈现一个个圆点，如果不需要可以关闭。

```
"editor.renderWhitespace": "none",
```

## vscode 不显示缩进线

```
"editor.renderIndentGuides": false,
```

## 关闭开机启动项

系统偏好设置->用户与群组->登录项->删除开机启动项

## 触控板

鼠标右键 双指点击触控板
系统偏好设置->辅助功能->指针控制->触控板选项->启用拖移->三指拖移

## 卸载重装 chrome

删除 chrome 程序
删除配置文件(可选) `~/Library/Application Support/Google/Chrome`

## 卸载重装 VSCode

有时因为插件冲突或者自动升级之后，VS Code 会出现一些问题，这个时候需要重装 VS Code

```
rm -rf $HOME/Library/Application\ Support/Code
 if you're using insider*
sudo rm -rf $HOME/Library/Application\ Support/Code\ -\ Insiders/
rm -rf $HOME/.vscode
 if you're using insider*
sudo rm -rf $HOME/.vscode-insiders/
```

最后删除 VS Code 应用

## Chrome 调试技巧

按`ESC`同时显示源码和控制台
`$$`对元素选取
