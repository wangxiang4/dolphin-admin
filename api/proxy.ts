import {Request} from "http-proxy-middleware/dist/types";

const fs = require('fs')
const dotenv = require('dotenv')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {

  // 在当前工作目录中根据 mode 加载env文件
  const envProductionConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env.production')))
  // 解析转换环境变量值
  let { VITE_PROXY } = envProductionConfig
  try {
    VITE_PROXY = JSON.parse(VITE_PROXY);
  } catch (error) {
    VITE_PROXY = [];
  }
  for (const [prefix, target] of VITE_PROXY) {
    // 创建代理对象并转发请求
    createProxyMiddleware(prefix, {
      target,
      changeOrigin: true,
      ws: true,
      pathRewrite: (path: string, req: Request) => path.replace(new RegExp(`^${prefix}`), ''),
      secure: true
    })(req, res)
  }

}
