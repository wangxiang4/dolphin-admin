/**
 * @program: dolphin-admin
 * @description: 路由帮助工具类
 * 主要处理路由的组装,以及将菜单转换成路由的处理
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';
import { getParentLayout, LAYOUT, PARENT_LAYOUT_NAME } from '/@/router/constant';
import { warn } from '/@/utils/log';
import { cloneDeep, omit } from 'lodash-es';
import { createRouter, createWebHashHistory } from 'vue-router';

const IFRAME = () => import('/@/views/core/iframe/FrameBlank.vue');

/** 布局组件Map */
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();
LayoutMap.set('Layout', LAYOUT);
LayoutMap.set('Iframe', IFRAME);

/** 性能优化,避免多次加载views下的组件 */
let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

/** 查找导入的views目录下的组件 */
function findImportComponent(dynamicViewsModules: Record<string, () => Promise<Recordable>>, component: string) {
  const keys = Object.keys(dynamicViewsModules);
  // 检测同一个目录下是否存在多个名字相同的组件
  const matchKeys = keys.filter((key) => {
    let k = key.replace('../../views/', '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    warn('请不要创建".vue"和".TSX"具有相同文件的文件名称在同一层次结构目录中在视图文件夹下,这将导致动态引入失败!');
    return;
  }
}

/** 将菜单对象变成路由对象 */
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  routeList.forEach((item) => {
    const { component, children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component as string);
      if (layoutFound) {
        item.component = layoutFound;
      } else if (component == PARENT_LAYOUT_NAME) {
        item.component = getParentLayout();
      }else {
        item.component = findImportComponent(dynamicViewsModules, component as string);
      }
    }
    children && transformObjToRoute(children);
  });
}


/**
 * 将多级路由转换为 2 级路由,由于我只有LAYOUT布局组件中加入了RouterView可以显示组件
 * 多级路由父级采用的是一个(getParentLayout)临时空组件是没有RouterView的,所以组件是显示不出的
 * 要处理成2级嵌套路由,一级组件是LAYOUT,二级组件是模块组件
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    // 判断级别是否 多级 路由
    if (!isMultipleRoute(routeModule)) {
      // 声明终止当前循环,即跳过此次循环,进行下一轮
      continue;
    }
    // 路由等级提升
    promoteRouteLevel(routeModule);
  }
  return modules;
}


/** 将所有多级路由全部提升为2级路由 */
function promoteRouteLevel(routeModule: AppRouteModule) {
  // 使用vue-router拼接菜单
  // createRouter 创建一个可以被 Vue 应用程序使用的路由实例
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });
  // 获取所有 路由记录的完整列表。
  const routes = router.getRoutes();
  // 将所有子路由添加到二级路由
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;
  // omit lodash的函数 对传入的item对象的children进行删除
  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

/** 将所有子路由添加到二级路由 */
function addToChildren(routes: RouteRecordNormalized[], children: AppRouteRecordRaw[], routeModule: AppRouteModule ) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

/** 判断级别是否超过2级,超过两级就是多级路由 */
function isMultipleRoute(routeModule: AppRouteModule) {
  // Reflect.has 与 in 操作符 相同,用于检查一个对象(包括它原型链上)是否拥有某个属性
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }
  const children = routeModule.children;
  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}
