/**
 * @program: dolphin-admin
 * @description: vite-plugin-imagemin配置
 * 提供压缩图片资源的功能
 * 文档: https://github.com/anncwb/vite-plugin-imagemin
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/6
 */

import viteImagemin from 'vite-plugin-imagemin';

export function configImageminPlugin() {
  const plugin = viteImagemin({
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 20,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  });
  return plugin;
}
