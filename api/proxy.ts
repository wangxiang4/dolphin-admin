/**
 * @program: dolphin-admin
 * @description: vercel部署Api转发代理 serverless functions 配置
 * vercel官网文档: https://vercel.com/docs/concepts/functions/serverless-functions
 * @author: wangxiang4
 * @create: 2023/1/21
 */

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
    VITE_PROXY = JSON.parse(VITE_PROXY)
  } catch (error) {
    VITE_PROXY = []
  }

  let target = VITE_PROXY[0]?.[1]
  let pathRewrite = {}
  for (const [prefix, target] of VITE_PROXY) {
    pathRewrite[`^${prefix}`] = target.replaceAll(/^(https?:\/\/)[^/]+/g, '')
  }

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    pathRewrite: pathRewrite,
    secure: true
  })(req, res)

}
