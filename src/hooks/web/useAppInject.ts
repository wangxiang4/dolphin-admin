/**
 * @program: dolphin-admin
 * @description: 获取应用上下文数据工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { useAppProviderContext } from '/@/components/Application';
import { computed, unref } from 'vue';

export function useAppInject() {
  const values = useAppProviderContext();

  return {
    getIsMobile: computed(() => unref(values.isMobile)),
  };
}
