/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { Role, RoleParams, RoleResult } from '/@/api/platform/system/entity/role';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/role/list',
  add = '/system_proxy/system/role/save',
  get = '/system_proxy/system/role',
  edit = '/system_proxy/system/role/update',
  del = '/system_proxy/system/role/remove',
  changeStatus = '/system_proxy/system/role/changeStatus'
}

/** 查询角色列表 */
export const listRole = (params?: Partial<RoleParams>) => defHttp.get<RoleResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 新增角色 */
export const addRole = (params: Partial<Role>) => defHttp.post({ url: Api.add, data: params });

/** 修改角色 */
export const editRole = (params: Partial<Role>) => defHttp.put({ url: Api.edit, data: params });

/** 查询角色详细 */
export const getRole = (id: string) => defHttp.get<Role>({ url: `${Api.get}/${id}` });

/** 删除角色 */
export const delRole = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });

/** 修改角色状态 */
export const changeStatus = (id: string, status: string) => defHttp.put({ url: Api.changeStatus, data: { id: id, status: status } });
