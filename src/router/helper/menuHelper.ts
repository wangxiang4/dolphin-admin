/**
 * @program: dolphin-admin
 * @description: 菜单帮助工具类
 * 主要处理菜单的组装,以及将路由转为菜单的处理
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import { AppRouteModule } from '/@/router/types';
import type { Menu, AppRouteRecordRaw } from '/@/router/types';
import { findPath, treeMap } from '/@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';
import { isUrl } from '/@/utils/is';
import {usePermissionStore} from '/@/store/modules/permission';

/** 获取当前菜单的所有父菜单路径 */
export function getAllParentPath<T = Recordable>(treeData: T[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
}

/** 构建嵌套路由,具体详情参考:https://next.router.vuejs.org/guide/essentials/nested-routes.html */
function joinNestedRoute(menus: Menu[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // 请注意,以/开头的嵌套路径将被视为根路径与外嵌网页url不允许加入嵌套路由
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) menu.path = `${parentPath}/${menu.path}`;
    // 递归处理子路由的拼接
    if (menu?.children?.length) joinNestedRoute(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path);
  }
}

/** 将路由对象变成菜单对象  */
export function transformRouteToMenu(routeModList: AppRouteModule[]) {
  const routeList: AppRouteRecordRaw[] = cloneDeep(routeModList);
  // 提取树指定的树形结构
  const list = treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, hideMenu = false } = {} } = node;
      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    }
  });
  joinNestedRoute(list);
  return list;
}

/** 异步获取后台菜单数据 */
export const getMenus = async (): Promise<Menu[]> => {
  const permissionStore = usePermissionStore();
  return permissionStore.getMenuList.filter((item) => !item.hideMenu);
};

/** 获取当前菜单父级菜单路径  */
export async function getCurrentParentPath(currentPath: string) {
  const menus = await getMenus();
  const allParentPath = getAllParentPath(menus, currentPath);
  return allParentPath?.[0];
}

/** 获取一级菜单,删除子项 */
export async function getShallowMenus(): Promise<Menu[]> {
  const menus = await getMenus();
  const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
  return shallowMenuList;
}

/** 获取一级菜单的子集菜单 */
export async function getChildrenMenus(parentPath: string) {
  const menus = await getMenus();
  const parent = menus.find((item) => item.path === parentPath);
  if (!parent || !parent.children || !!parent?.meta?.hideChildrenInMenu) {
    return [] as Menu[];
  }
  return parent.children;
}
