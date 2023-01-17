/**
 * @program: dolphin-admin
 * @description: 主题样式处理工具类
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

const docEle = document.documentElement;
export function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, '');
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

export function setCssVar(prop: string, val: any, dom = docEle) {
  dom.style.setProperty(prop, val);
}
