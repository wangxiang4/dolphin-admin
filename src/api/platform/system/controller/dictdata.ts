/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { DictDataParams, DictData, DictDataResult } from '/@/api/platform/system/entity/dictData';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/dictData/list',
  add = '/system_proxy/system/dictData/save',
  get = '/system_proxy/system/dictData',
  edit = '/system_proxy/system/dictData/update',
  del = '/system_proxy/system/dictData/remove',
  getByDictType = '/system_proxy/system/dictData/dictType'
}

/** 查询字典数据列表 */
export const listDictData = (params?: Partial<DictDataParams>) => defHttp.get<DictDataResult>({ url: Api.list, params }, { isReturnResultResponse: true });

/** 新增字典数据 */
export const addDictData = (params: Partial<DictData>) => defHttp.post({ url: Api.add, data: params });

/** 修改字典数据 */
export const editDictData = (params: Partial<DictData>) => defHttp.put({ url: Api.edit, data: params });

/** 查询字典数据详细 */
export const getDictData = (id: string) => defHttp.get<DictData>({ url: `${Api.get}/${id}` });

/** 删除字典数据 */
export const delDictData = (ids: string) => defHttp.delete({ url: `${Api.del}/${ids}` });

/** 根据字典类型查询字典数据 */
export const getDataByDictType = (dictType: string) => defHttp.get<DictData[]>({ url: `${Api.getByDictType}/${dictType}` });
