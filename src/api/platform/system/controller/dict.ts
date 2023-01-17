/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { DictParams, Dict, DictResult } from '/@/api/platform/system/entity/dict';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/dict/list',
  add = '/system_proxy/system/dict/save',
  get = '/system_proxy/system/dict',
  edit = '/system_proxy/system/dict/update',
  del = '/system_proxy/system/dict/remove',
  changeStatus='/system_proxy/system/dict/changeStatus'
}

/** 查询配置列表 */
export const listDict = (params?: Partial<DictParams>) => defHttp.get<DictResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 新增配置 */
export const addDict = (params: Partial<Dict>) => defHttp.post({ url: Api.add, data: params });

/** 修改配置 */
export const editDict = (params: Partial<Dict>) => defHttp.put({ url: Api.edit, data: params });

/** 查询配置详细 */
export const getDict = (id: string) => defHttp.get<Dict>({ url: `${Api.get}/${id}` });

/** 删除配置 */
export const delDict = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });

/** 修改字典状态 */
export const changeStatus = (id: string, status: string) => defHttp.put({ url: Api.changeStatus, data: { id: id, status: status } });
