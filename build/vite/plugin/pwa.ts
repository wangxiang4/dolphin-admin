/**
 * @program: dolphin-admin
 * @description: vite-plugin-pwa配置
 * 提供零配置就可以实现(pwa)渐进式web应用程序
 * 什么是渐进式(是一种普通网页或网站架构起来的网络应用程序，但它可以以传统应用程序或原生移动应用程序形式展示给用户，就是给用户接近原生app的形式进行访问)
 * 了解更多信息: https://zh.m.wikipedia.org/zh-sg/%E6%B8%90%E8%BF%9B%E5%BC%8F%E7%BD%91%E7%BB%9C%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F
 * 目前主要用来开启service-worker让他来做缓存的: https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers
 * 文档: https://github.com/antfu/vite-plugin-pwa
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/6
 */

import { VitePWA } from 'vite-plugin-pwa';

export function configPwaConfig(env: ViteEnv) {
  const { VITE_USE_PWA, VITE_GLOB_APP_TITLE, VITE_GLOB_APP_SHORT_NAME } = env;
  if (VITE_USE_PWA) {
    const pwaPlugin = VitePWA({
      // pwa应用相关配置,参考配置选项: https://developer.mozilla.org/en-US/docs/Web/Manifest/short_name
      manifest: {
        name: VITE_GLOB_APP_TITLE,
        short_name: VITE_GLOB_APP_SHORT_NAME,
        // 用于浏览器各种上下文中用作Web应用程序的标志性表示的图像,比如安卓上新建快捷方式
        // 更多信息请参考: https://w3c.github.io/manifest/#icons-member
        icons: [
          {
            src: './resource/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './resource/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    });
    return pwaPlugin;
  }
  return [];
}
