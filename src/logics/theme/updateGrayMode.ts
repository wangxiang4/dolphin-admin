/**
 * @program: dolphin-admin
 * @description: 更改项目灰色模式状态
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import { toggleClass } from './util';

export function updateGrayMode(gray: boolean) {
  toggleClass(gray, 'gray-mode', document.documentElement);
}
