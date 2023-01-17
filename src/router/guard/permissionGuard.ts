/**
 * @program: dolphin-admin
 * @description: 权限导航守卫
 * 校验当前用户是否有权限能够进入系统
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { Router, RouteRecordRaw } from 'vue-router';
import { usePermissionStoreWithOut } from '/@/store/modules/permission';
import { PageEnum } from '/@/enums/pageEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { PAGE_NOT_FOUND_NAME } from '/@/router/constant';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const ROOT_HOME = PageEnum.ROOT_HOME;
/** 设置路由白名单 */
const whitePathList: PageEnum[] = [ LOGIN_PATH ];

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    // 放过白名单路由
    if (whitePathList.includes(to.path as PageEnum))
      return next();
    // 校验token权限信息
    const token = userStore.getAccessToken;
    if (!token) {
      // 是否忽略权限验证,需要将路由ignoreAuth设置true
      if (to.meta.ignoreAuth) return next();
      // 重定向登录页面
      const redirectLogin: { path: string; replace: boolean; query?: Recordable<string>; } = { path: LOGIN_PATH, replace: true };
      // 补充拦截路由信息
      if (to.path) {
        redirectLogin.query = {
          ...redirectLogin.query,
          redirect: to.path,
        };
      }
      return next(redirectLogin);
    }
    // 检测是否构建完路由与菜单
    if (permissionStore.getIsDynamicAddedRoute) {
      // 用户个性化设置根路由调整地址(首页地址)
      if (from.path === ROOT_HOME && to.path === PageEnum.BASE_HOME && userStore.getUserInfo.homePath !== PageEnum.BASE_HOME) {
        return next(userStore.getUserInfo.homePath!);
      } else return next();
    }
    // 构建路由与菜单
    const routes = await permissionStore.buildRoutesAction();
    routes.forEach((route) => router.addRoute(route as unknown as RouteRecordRaw));
    permissionStore.setDynamicAddedRoute(true);
    // 动态添加路由后,此处应当重定向到fullPath,否则会加载404页面内容,添加query以免丢失
    if (to.name === PAGE_NOT_FOUND_NAME) {
      next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
      next(nextData);
    }
  });
}
