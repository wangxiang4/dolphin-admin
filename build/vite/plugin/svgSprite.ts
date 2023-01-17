/**
 * @program: dolphin-admin
 * @description: vite-plugin-svg-icons配置
 * 用于快速创建SVG精灵的Vite插件
 * SVG精灵(它是由几个小图形文件（SVG 图标、设计元素）合并而成的图标系统)
 * 文档: https://github.com/anncwb/vite-plugin-svg-icons
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import SvgIconsPlugin from 'vite-plugin-svg-icons';
import path from 'path';

export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = SvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
    // default
    symbolId: 'icon-[dir]-[name]',
  });
  return svgIconsPlugin;
}
