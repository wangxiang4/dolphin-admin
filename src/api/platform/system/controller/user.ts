/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { UserParams, UserResult } from '/@/api/platform/system/entity/user';
import type { User } from '/@/api/platform/core/entity/user';
import type { ResultVo } from '/@/api/common/base/entity';
import { defHttp } from '/@/utils/http/axios';
import { DolphinUser } from '/@/api/common/base/entity';

enum Api {
  list = '/system_proxy/system/user/list',
  add = '/system_proxy/system/user/save',
  get = '/system_proxy/system/user',
  edit = '/system_proxy/system/user/update',
  del = '/system_proxy/system/user/remove',
  updatePwd = '/system_proxy/system/user/updatePwd',
  resetPwd='/system_proxy/system/user/resetPwd',
  changeStatus='/system_proxy/system/user/changeStatus',
  changeTenant='/system_proxy/system/user/changeTenant',
  resetTenant='/system_proxy/system/user/resetTenant',
  synchronousAuthenticationUser = '/system_proxy/system/user/synchronousAuthenticationUser',
}

/** 查询用户列表 */
export const listUser = (params?: Partial<UserParams>) => defHttp.get<UserResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 新增用户 */
export const addUser = (params: Partial<User>) => defHttp.post({ url: Api.add, data: params });

/** 修改用户 */
export const editUser = (params: Partial<User>) => defHttp.put({ url: Api.edit, data: params });

/** 查询用户详细 */
export const getUser = (id: string) => defHttp.get<ResultVo>({ url: `${Api.get}/${id}` });

/** 删除用户 */
export const delUser = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });

/** 更新密码 */
export const updatePwd = (params: Partial<User>) => defHttp.put({ url: Api.updatePwd, params });

/** 重置密码 */
export const resetPwd = (params: Partial<User>) => defHttp.put({ url: Api.resetPwd, data: params });

/** 修改用户状态 */
export const changeStatus = (id: string, status: string) => defHttp.put({ url: Api.changeStatus, data: { id: id, status: status } });

/** 修改用户多租户 */
export const changeTenant = (tenantIds: string[]) => defHttp.get({ url: `${Api.changeTenant}/${tenantIds}` });

/** 还原用户多租户 */
export const resetTenant = () => defHttp.get({ url: Api.resetTenant });

/** 同步身份验证用户 */
export const synchronousAuthenticationUser = () => defHttp.get<DolphinUser>({ url: Api.synchronousAuthenticationUser });
