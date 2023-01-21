const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {

  for (const [prefix, target] of process.env.VITE_PROXY || []) {
    // 创建代理对象并转发请求
    createProxyMiddleware(prefix, {
      target,
      changeOrigin: true,
      ws: true,
      pathRewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      secure: true
    })(req, res)
  }

}
