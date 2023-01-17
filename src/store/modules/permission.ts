/**
 * @program: dolphin-admin
 * @description: 权限信息存储中心
 * 路由就是菜单
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { filter } from '/@/utils/helper/treeHelper';
import { listMenuRoute } from '/@/api/platform/core/controller/menu';
import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';

interface PermissionState {
  // 路由是否动态添加
  isDynamicAddedRoute: boolean;
  // 触发菜单更新
  lastBuildMenuTime: number;
  // 菜单列表
  menuList: Menu[];
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // 菜单列表
    menuList: []
  }),
  getters: {
    getMenuList(): Menu[] {
      return this.menuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setMenuList(list: Menu[]) {
      this.menuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },
    setLastBuildMenuTime(time?: number) {
      this.lastBuildMenuTime = time || new Date().getTime();
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.setDynamicAddedRoute(false);
      this.setMenuList([]);
      this.setLastBuildMenuTime(0);
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();
      const userStore = useUserStore();
      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /** 根据设置的首页path，修正routes中的affix标记（固定首页） */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 固定首页已处理完毕跳出循环
          return;
        }
      };

      /** 提示菜单正在加载中 */
      const { createMessage } = useMessage();
      createMessage.loading({
        content: t('sys.app.menuLoading'),
        duration: 1,
      });

      /** 构建菜单与路由 */
      let routeList: AppRouteRecordRaw[] = [];
      try {
        routeList = await listMenuRoute();
        transformObjToRoute(routeList);
        const menuList = transformRouteToMenu(routeList);
        this.setMenuList(menuList);
        // 过滤忽略路由配置项,只构建菜单不构建路由
        routeList = filter(flatMultiLevelRoutes(routeList), routeRemoveIgnoreFilter);
        patchHomeAffix(routeList);
      } catch (error) { console.error(error); }
      return routeList;
    }
  }
});

// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
