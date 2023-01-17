/**
 * @program: dolphin-admin
 * @description: 浏览器窗口大小监听工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { tryOnMounted, tryOnUnmounted } from '@vueuse/core';
import { useDebounceFn } from '@vueuse/core';

interface WindowSizeOptions {
  once?: boolean;
  immediate?: boolean;
  listenerOptions?: AddEventListenerOptions | boolean;
}

export function useWindowSizeFn(fn: Fn, wait = 150, options?: WindowSizeOptions) {
  let handler = () => {
    fn();
  };
  const handleSize = useDebounceFn(handler, wait);
  handler = handleSize;

  const start = () => {
    if (options && options.immediate) {
      handler();
    }
    window.addEventListener('resize', handler);
  };

  const stop = () => {
    window.removeEventListener('resize', handler);
  };

  tryOnMounted(() => {
    start();
  });

  tryOnUnmounted(() => {
    stop();
  });
  return [start, stop];
}
