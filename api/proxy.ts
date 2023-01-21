const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''
  if (req.url.startsWith('/prod-api') || req.url.startsWith('/prod-upload')) {
    target = 'http://123.60.163.167:9999'
  }

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/prod-api/': '/',
      '^/prod-upload/': '/',
    }
  })(req, res)
}
