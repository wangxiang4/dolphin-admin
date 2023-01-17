/**
 * @program: dolphin-admin
 * @description: 组件挂载或激活工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { nextTick, onMounted, onActivated } from 'vue';

export function onMountedOrActivated(hook: Fn) {
  let mounted: boolean;

  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}
