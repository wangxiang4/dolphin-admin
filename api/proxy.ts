const { loadEnv } = require('vite')
const { wrapperEnv } = require ('../build/utils')
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  const root = process.cwd();

  // 在当前工作目录中根据 mode 加载env文件
  const env = loadEnv('build', root);

  // 解析转换环境变量值
  const viteEnv = wrapperEnv(env);
  const { VITE_PROXY } = viteEnv;

  console.log(VITE_PROXY)
  console.log(process.env)
  for (const [prefix, target] of process.env.VITE_PROXY || []) {
    console.log(1111)
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
