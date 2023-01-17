/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { MenuParams, Menu } from '/@/api/platform/system/entity/menu';
import type { ResultVo } from '/@/api/common/base/entity';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/menu/list',
  add = '/system_proxy/system/menu/save',
  get = '/system_proxy/system/menu',
  edit = '/system_proxy/system/menu/update',
  del = '/system_proxy/system/menu/remove',
  roleMenuIds = '/system_proxy/system/menu/roleMenuTree'
}

/** 查询菜单列表 */
export const listMenu = (params?: Partial<MenuParams>) => defHttp.get({ url: Api.list, params });

/** 新增菜单 */
export const addMenu = (params: Partial<Menu>) => defHttp.post({ url: Api.add, data: params });

/** 修改菜单 */
export const editMenu = (params: Partial<Menu>) => defHttp.put({ url: Api.edit, data: params });

/** 查询菜单详细 */
export const getMenu = (id: string) => defHttp.get<Menu>({ url: `${Api.get}/${id}` });

/** 删除菜单 */
export const delMenu = (id: string) => defHttp.delete({ url: `${Api.del}/${id}` });

/** 通过角色编号查询菜单编号 */
export const getRoleMenuIds = (roleId : string) => defHttp.get<ResultVo>({ url: `${Api.roleMenuIds}/${roleId}`});
