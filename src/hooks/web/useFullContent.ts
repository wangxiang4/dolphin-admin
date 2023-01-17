/**
 * @program: dolphin-admin
 * @description: 获取是否全屏显示内容参数工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { computed, unref } from 'vue';
import { useAppStore } from '/@/store/modules/app';
import { useRouter } from 'vue-router';

/**
 * 全屏显示内容
 */
export const useFullContent = () => {
  const appStore = useAppStore();
  const router = useRouter();
  const { currentRoute } = router;

  // 是否全屏显示内容而不显示菜单
  const getFullContent = computed(() => {
    // 查询参数，地址栏有满参数时全屏显示
    const route = unref(currentRoute);
    const query = route.query;
    if (query && Reflect.has(query, '__full__')) {
      return true;
    }
    // 返回配置文件中的配置
    return appStore.getProjectConfig.fullContent;
  });

  return { getFullContent };
};
