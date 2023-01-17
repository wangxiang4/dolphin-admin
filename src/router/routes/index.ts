/**
 * @program: dolphin-admin
 * @description: 导出路由配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { AppRouteModule } from '/@/router/types';
import { basicRoute } from './basic';
const modules = import.meta.globEager('./modules/**/*.ts');
const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default;
  if (mod) {
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
  }
});

export const routesConfig = [
  ...basicRoute,
  ...routeModuleList
];
