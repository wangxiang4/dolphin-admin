/**
 * @program: dolphin-admin
 * @description: vite-plugin-html配置
 * 在index.html提供压缩和基于ejs模板功能
 * 文档: https://github.com/anncwb/vite-plugin-html
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import type { Plugin } from 'vite';
import html from 'vite-plugin-html';
import pkg from '../../../package.json';
import { GLOB_CONFIG_FILE_NAME } from '../../constant';

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;

  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;
  const getAppConfigSrc = () => {
    return `${path || '/'}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
  };

  const htmlPlugin: Plugin[] = html({
    minify: isBuild,
    inject: {
      // 将数据注入ejs模板
      injectData: {
        title: VITE_GLOB_APP_TITLE,
      },
      // 嵌入生成的app.config.js文件
      tags: isBuild
        ? [
            {
              tag: 'script',
              attrs: {
                src: getAppConfigSrc(),
              },
            },
          ]
        : []
    }
  });
  return htmlPlugin;
}
