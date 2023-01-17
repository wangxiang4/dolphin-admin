/**
 * @program: dolphin-admin
 * @description: 监听元素大小变化触发对应事件工具类
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import ResizeObserver from 'resize-observer-polyfill';

const isServer = typeof window === 'undefined';

/** 当元素大小发生变化自定义处理 */
function resizeHandler(entries: any[]) {
  for (const entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach((fn: () => any) => {
        fn();
      });
    }
  }
}

/** 添加元素到元素大小监控中 */
export function addResizeListener(element: any, fn: () => any) {
  if (isServer) return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
}

/** 移除元素到元素大小监控中 */
export function removeResizeListener(element: any, fn: () => any) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
}

/** 设置触发窗口调整大小重新调整页面,resize函数是外部定义的 */
export function triggerWindowResize() {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, true);
  (event as any).eventType = 'message';
  window.dispatchEvent(event);
}
