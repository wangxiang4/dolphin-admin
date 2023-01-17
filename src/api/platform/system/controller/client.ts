/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { Client, ClientParams, ClientResult } from '/@/api/platform/system/entity/client';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/client/list',
  add = '/system_proxy/system/client/save',
  get = '/system_proxy/system/client',
  edit = '/system_proxy/system/client/update',
  del = '/system_proxy/system/client/remove',
  cache = '/system_proxy/system/client/cache'
}

/** 查询客户端列表 */
export const listClient = (params?: Partial<ClientParams>) => defHttp.get<ClientResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 新增客户端 */
export const addClient = (params: Partial<ClientParams>) => defHttp.post({ url: Api.add, data: params });

/** 修改客户端 */
export const editClient = (params: Partial<ClientParams>) => defHttp.put({ url: Api.edit, data: params });

/** 查询客户端详细 */
export const getClient = (id: string) => defHttp.get<Client>({ url: `${Api.get}/${id}` });

/** 删除客户端 */
export const delClient = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });

/** 清理客户端缓存 */
export const cleanCache = () => defHttp.delete({ url: Api.cache });
