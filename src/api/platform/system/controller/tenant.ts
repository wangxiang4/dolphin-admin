/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { Tenant, TenantParams, TenantResult } from '/@/api/platform/system/entity/tenant';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/tenant/list',
  add = '/system_proxy/system/tenant/save',
  get = '/system_proxy/system/tenant',
  edit = '/system_proxy/system/tenant/update',
  del = '/system_proxy/system/tenant/remove',
  currentUserTenantList = '/system_proxy/system/tenant/currentUserTenantList'
}

/** 查询多租户列表 */
export const listTenant = (params?: Partial<TenantParams>) => defHttp.get<TenantResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 新增多租户 */
export const addTenant = (params: Partial<Tenant>) => defHttp.post({ url: Api.add, data: params });

/** 修改多租户 */
export const editTenant = (params: Partial<Tenant>) => defHttp.put({ url: Api.edit, data: params });

/** 查询多租户详细 */
export const getTenant = (id: string) => defHttp.get<Tenant>({ url: `${Api.get}/${id}` });

/** 删除多租户 */
export const delTenant = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });

/** 查询当前用户多租户列表 */
export const currentUserTenantList = () => defHttp.get<Tenant[]>({ url: Api.currentUserTenantList });
