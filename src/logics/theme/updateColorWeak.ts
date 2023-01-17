/**
 * @program: dolphin-admin
 * @description: 更改项目颜色弱模式的状态
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import { toggleClass } from './util';

export function updateColorWeak(colorWeak: boolean) {
  toggleClass(colorWeak, 'color-weak', document.documentElement);
}
