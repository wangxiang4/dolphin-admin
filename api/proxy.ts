import { getConfigFileName } from '../build/getConfigFileName'
import { GlobEnvConfig } from '../types/config'
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {

  const ENV_NAME = getConfigFileName(import.meta.env);
  const ENV = (import.meta.env.DEV
    ? (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;
  const { VITE_PROXY } = ENV;

  for (const [prefix, target] of VITE_PROXY) {
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
