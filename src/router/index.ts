/**
 * @program: dolphin-admin
 * @description: 基础路由配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { routesConfig } from './routes';

/** 固定路由,设置基础路由不需要被重置掉 */
const AFFIX_NAME_LIST: string[] = [];
const getRouteNames = (array: any[]) => array.forEach((item) => {
  AFFIX_NAME_LIST.push(item.name);
  getRouteNames(item.children || []);
});getRouteNames(routesConfig);

/** 应用配置的静态路由 */
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH as string),
  routes: routesConfig as unknown as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/** 重置所有路由,除基础路由外 */
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !AFFIX_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

/** 配置路由器 */
export function setupRouter(app: App<Element>) {
  app.use(router);
}
