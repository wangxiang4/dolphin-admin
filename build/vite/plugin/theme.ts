/**
 * @program: dolphin-admin
 * @description: vite-plugin-theme配置
 * 提供动态切换ant-design主题功能(默认模式,暗黑模式)
 * 文档: https://github.com/anncwb/vite-plugin-theme
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import type { Plugin } from 'vite';
import path from 'path';
import {
  viteThemePlugin,
  antdDarkThemePlugin,
  mixLighten,
  mixDarken,
  tinycolor
} from 'vite-plugin-theme';
import { getThemeColors, generateColors } from '../../config/themeConfig';
import { generateModifyVars } from '../../generate/generateModifyVars';

export function configThemePlugin(isBuild: boolean): Plugin[] {
  // 生成主题渐变颜色,进行匹配提取css
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor
  });
  const plugin = [
    // 配置vite主题插件,在vite编译时处理
    viteThemePlugin({
      // 自定义选择器转换
      resolveSelector: (s) => {
        s = s.trim();
        switch (s) {
          case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
            return '.ant-steps-item-icon > .ant-steps-icon';
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)':
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover':
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active':
            return s;
          case '.ant-steps-item-icon > .ant-steps-icon':
            return s;
          case '.ant-select-item-option-selected:not(.ant-select-item-option-disabled)':
            return s;
        }
        // 对于没有data-theme前缀的css选择器,加个[data-theme]标识前缀,目前没什么用,后期可能会用到获取这部分数据
        return s.startsWith('[data-theme') ? s : `[data-theme] ${s}`;
      },
      // 如果css包含数组中的颜色值,则会提取css
      colorVariables: [...getThemeColors(), ...colors]
    }),
    // 配置ant-design暗黑主题插件
    antdDarkThemePlugin({
      // 设置服务器启动预加载antd.less文件
      preloadFiles: [
        path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.less'),
        // path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.dark.less'),
        path.resolve(process.cwd(), 'src/assets/styles/index.less'),
        path.resolve(process.cwd(), 'node_modules/vxe-table/lib/style.css'),
      ],
      // 过滤less(禁止在生产环境客户端控制台调用transform注入的函数处理css)
      filter: (id) => (isBuild ? !id.endsWith('antd.less') : true),
      // 制定暗黑主题风格颜色
      darkModifyVars: {
        // ant-design默认颜色
        ...generateModifyVars(true),
        // 替换ant-design默认颜色,制定暗黑系列
        'text-color': '#c9d1d9',
        'primary-1': 'rgb(255 255 255 / 8%)',
        'text-color-base': '#c9d1d9',
        'component-background': '#151515',
        'heading-color': 'rgb(255 255 255 / 65%)',
        // black: '#0e1117',
        // #8b949e
        'text-color-secondary': '#8b949e',
        'border-color-base': '#303030',
        // 'border-color-split': '#30363d',
        'item-active-bg': '#111b26',
        'app-content-background': '#1e1e1e',
        'tree-node-selected-bg': '#11263c',
        'alert-success-border-color': '#274916',
        'alert-success-bg-color': '#162312',
        'alert-success-icon-color': '#49aa19',
        'alert-info-border-color': '#153450',
        'alert-info-bg-color': '#111b26',
        'alert-info-icon-color': '#177ddc',
        'alert-warning-border-color': '#594214',
        'alert-warning-bg-color': '#2b2111',
        'alert-warning-icon-color': '#d89614',
        'alert-error-border-color': '#58181c',
        'alert-error-bg-color': '#2a1215',
        'alert-error-icon-color': '#a61d24'
      }
    })
  ];

  return plugin as unknown as Plugin[];
}
