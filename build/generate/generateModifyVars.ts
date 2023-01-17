/**
 * @program: dolphin-admin
 * @description: 生成less修改的变量
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import { generateAntColors, primaryColor } from '../config/themeConfig';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
import { resolve } from 'path';

/** 生成less需要修改的变量 */
export function generateModifyVars(dark = false) {
  // 根据算法生成Ant颜色详情: https://ant.design/docs/spec/colors-cn
  const palettes = generateAntColors(primaryColor);
  const primary = palettes[5];

  // 设置主题自然变化渐变颜色有十种
  const primaryColorObj: Record<string, string> = {};
  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  // 获取ant-design主题变量
  const modifyVars = getThemeVariables({ dark });
  return {
    ...modifyVars,
    // 定制Ant主题,使用@import (reference)覆盖内部配置
    hack: `${modifyVars.hack} @import (reference) "${resolve('src/assets/styles/config.less')}";`,
    'primary-color': primary,
    ...primaryColorObj,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187',
    'error-color': '#ED6F6F',
    'warning-color': '#EFBD47',
    'border-color-base': '#EEEEEE',
    'font-size-base': '14px',
    'border-radius-base': '2px',
    'link-color': primary,
    'app-content-background': '#fafafa'
  };
}
