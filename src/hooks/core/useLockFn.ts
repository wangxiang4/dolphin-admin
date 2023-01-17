/**
 * @program: dolphin-admin
 * @description: 检测是否锁屏工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { ref, unref } from 'vue';

export function useLockFn<P extends any[] = any[], V extends any = any>(
  fn: (...args: P) => Promise<V>
) {
  const lockRef = ref(false);
  return async function (...args: P) {
    if (unref(lockRef)) return;
    lockRef.value = true;
    try {
      const ret = await fn(...args);
      lockRef.value = false;
      return ret;
    } catch (e) {
      lockRef.value = false;
      throw e;
    }
  };
}
