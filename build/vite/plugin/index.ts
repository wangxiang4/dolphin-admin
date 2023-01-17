/**
 * @program: dolphin-admin
 * @description: vite插件统一管理
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import purgeIcons from 'vite-plugin-purge-icons';
import windiCSS from 'vite-plugin-windicss';
import { configHtmlPlugin } from './html';
import { configPwaConfig } from './pwa';
import { configCompressPlugin } from './compress';
import { configStyleImportPlugin } from './styleImport';
import { configVisualizerConfig } from './visualizer';
import { configThemePlugin } from './theme';
import { configImageminPlugin } from './imagemin';
import { configSvgIconsPlugin } from './svgSprite';
import { configHmrPlugin } from './hmr';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_IMAGEMIN,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
  } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [
    // 必须,提供对Vue3单文件组件构建
    vue(),
    // 必须,提供对Vue3 Jsx构建
    vueJsx()
  ];

  // vite-plugin-windicss,提供对windicss构建
  vitePlugins.push(windiCSS());

  // @vitejs/plugin-legacy,提供对打包后的文件传统浏览器兼容性的支持
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-purge-icons,提供对Iconify图标框架中的icon以dom节点的方式生成到html中
  vitePlugins.push(purgeIcons());

  // todo: 解决HMR(模块热部署)循环依赖问题
  !isBuild && vitePlugins.push(configHmrPlugin());

  // vite-plugin-html,提供压缩和基于ejs模板功能
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-svg-icons,提供对SVG精灵图标系统构建
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  // rollup-plugin-visualizer,提供分析依赖查看哪些模块占用了空间
  vitePlugins.push(configVisualizerConfig());

  // vite-plugin-theme,提供动态切换ant-design主题功能(默认模式,暗黑模式)
  vitePlugins.push(configThemePlugin(isBuild));

  // vite-plugin-style-import,提供对vite的按需引入组件库样式功能
  vitePlugins.push(configStyleImportPlugin());

  // 以下插件仅适用于生产环境
  if (isBuild) {
    // vite-plugin-imagemin,提供压缩图片资源的功能
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // vite-plugin-compression,提供打包输出gzip
    vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE));

    // vite-plugin-pwa,提供零配置就可以实现(pwa)渐进式web应用程序
    vitePlugins.push(configPwaConfig(viteEnv));
  }

  return vitePlugins;
}
