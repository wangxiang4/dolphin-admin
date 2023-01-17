/**
 * @program: dolphin-admin
 * @description: 主题颜色动态生成配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import { generate } from '@ant-design/colors';

export const primaryColor = '#0960bd';
type Fn = (...arg: any) => any;
type GenerateTheme = 'default' | 'dark';

export interface GenerateColorsParams {
  mixLighten: Fn;
  mixDarken: Fn;
  tinycolor: any;
  color?: string;
}

/** 根据ant-design色板生成算法生成渐变颜色: https://ant.design/docs/spec/colors-cn */
export function generateAntColors(color: string, theme: GenerateTheme = 'default') {
  return generate(color, { theme });
}

/** 获取ant-design主题颜色(包含: 默认主题,暗黑主题) */
export function getThemeColors(color?: string) {
  const tc = color || primaryColor;
  const lightColors = generateAntColors(tc);
  const primary = lightColors[5];
  const modeColors = generateAntColors(primary, 'dark');
  return [...lightColors, ...modeColors];
}

/** 生成主题(明亮,暗黑)渐变颜色 */
export function generateColors({ color = primaryColor, mixLighten, mixDarken, tinycolor }: GenerateColorsParams) {
  const arr = new Array(19).fill(0);

  // 生成渐变亮十六进制颜色,只有6个可用
  const lightens = arr.map((_t, i) => {
    return mixLighten(color, i / 5);
  });

  // 生成渐变暗十六进制颜色,只有6个可用
  const darkens = arr.map((_t, i) => {
    return mixDarken(color, i / 5);
  });

  // 生成RGBA颜色
  const alphaColors = arr.map((_t, i) => {
    return tinycolor(color)
      .setAlpha(i / 20)
      .toRgbString();
  });

  // 生成去除小数点短型RGBA颜色
  const shortAlphaColors = alphaColors.map((item) => item.replace(/\s/g, '').replace(/0\./g, '.'));

  // 使用tinycolor颜色工具生成渐变亮十六进制颜色
  const tinycolorLightens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .lighten(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#ffffff');

  // 使用tinycolor颜色工具生成渐变暗十六进制颜色
  const tinycolorDarkens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .darken(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#000000');

  return [
    ...lightens,
    ...darkens,
    ...alphaColors,
    ...shortAlphaColors,
    ...tinycolorDarkens,
    ...tinycolorLightens,
  ].filter((item) => !item.includes('-'));
}
