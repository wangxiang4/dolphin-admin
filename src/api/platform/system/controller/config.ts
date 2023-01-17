/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { ConfigParams, Config, ConfigResult } from '/@/api/platform/system/entity/config';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/config/list',
  add = '/system_proxy/system/config/save',
  get = '/system_proxy/system/config',
  edit = '/system_proxy/system/config/update',
  del = '/system_proxy/system/config/remove',
  getByKey = '/system_proxy/system/config/getByKey'
}

/** 查询配置列表 */
export const listConfig = (params?: Partial<ConfigParams>) => defHttp.get<ConfigResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 新增配置 */
export const addConfig = (params: Partial<Config>) => defHttp.post({ url: Api.add, data: params });

/** 修改配置 */
export const editConfig = (params: Partial<Config>) => defHttp.put({ url: Api.edit, data: params });

/** 查询配置详细 */
export const getConfig = (id: string) => defHttp.get<Config>({ url: `${Api.get}/${id}` });

/** 删除配置 */
export const delConfig = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });

/** 根据 key 查询配置详细 */
export const getConfigByKey = (id: string) => defHttp.get<Config>({ url: `${Api.getByKey}/${id}` });
