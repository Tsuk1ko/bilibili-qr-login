## 哔哩哔哩 cookie 获取工具

扫码登录获取B站 cookie，可与各种场景联动

## iframe / window 模式

该工具可以通过 `<iframe>` 或 `window.open()` 联动使用

1. 编译时设置环境变量 `TRUST_ORIGIN`，值为你允许通过 `<iframe>` 或 `window.open()` 调用的源，多个之间用英文逗号 `,` 分隔，例如 `https://example.com,https://abc.example.com`
   - 不设置时则无法正常使用 iframe / window 模式
   - 可设置为 `*`，允许所有页面调用，但不推荐，除非你知道这意味着什么
   - 在本地开发时若未提供则默认为 `*`
2. 带上查询参数 `mode=iframe` 或 `mode=window` 进行使用（访问），然后监听 `message` 事件获取登陆成功后的 cookie
   - 请参考 [demo](https://github.com/Tsuk1ko/bilibili-qr-login/blob/main/dev/src/App.vue)
   - 本地开发访问 http://localhost:5173/dev/ 可体验效果

## 开发

要求 Node.js >= 18

```bash
# 安装依赖
yarn

# 开发
yarn dev

# 编译
yarn build

# 预览成品（需要先编译）
yarn preview # http://localhost:3000
```
