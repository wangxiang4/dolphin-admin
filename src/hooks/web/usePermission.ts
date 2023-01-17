/**
 * @program: dolphin-admin
 * @description: 权限校验工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import type { RouteRecordRaw } from 'vue-router';
import { usePermissionStoreWithOut } from '/@/store/modules/permission';
import { useTabs } from './useTabs';
import { router, resetRouter } from '/@/router';
import { intersection } from 'lodash-es';
import { isArray } from '/@/utils/is';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { useUserStoreWithOut } from '/@/store/modules/user';

// 用户权限相关操作
export function usePermission() {
  const permissionStore = usePermissionStoreWithOut();
  const userStore = useUserStoreWithOut();
  const { closeAll } = useTabs(router);

  /**
   * 重置和重新获得权限资源信息
   * @param id
   */
  async function resume() {
    const tabStore = useMultipleTabStore();
    tabStore.clearCacheTabs();
    resetRouter();
    const routes = await permissionStore.buildRoutesAction();
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    permissionStore.setLastBuildMenuTime();
    closeAll();
  }

  /**
   * 判断是否有权限
   */
  function hasPermission(value?: string | string[], def = true): boolean {
    // 默认可见
    if (!value) {
      return def;
    }
    const allCodeList = userStore.getPermissions as string[];
    if (!isArray(value)) {
      return allCodeList.includes(value);
    }
    return (intersection(value, allCodeList) as string[]).length > 0;
    return true;
  }

  /**
   * 刷新菜单数据
   */
  async function refreshMenu() {
    resume();
  }

  return { hasPermission, refreshMenu };
}
