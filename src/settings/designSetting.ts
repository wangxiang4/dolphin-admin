/**
 * @program: dolphin-admin
 * @description: ant-design颜色配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/7
 */

import { ThemeEnum } from '../enums/appEnum';
export const prefixCls = 'dolphin';
export const darkMode = ThemeEnum.LIGHT;

/** 应用主题预设颜色 */
export const APP_PRESET_COLOR_LIST: string[] = [
  '#03ac54',
  '#0960bd',
  '#0084f4',
  '#ee4f12',
  '#0096c7',
];

/** 导航栏预设颜色 */
export const HEADER_PRESET_BG_COLOR_LIST: string[] = [
  '#ffffff',
  '#001624',
  '#151515',
  '#009688',
  '#5172DC',
  '#018ffb',
];

/** 侧边预设颜色 */
export const SIDE_BAR_BG_COLOR_LIST: string[] = [
  '#001624',
  '#001529',
  '#212121',
  '#273352',
  '#ffffff',
];
