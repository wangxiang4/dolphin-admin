/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import type { DeptParams, Dept } from '/@/api/platform/system/entity/dept';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/system_proxy/system/dept/list',
  add = '/system_proxy/system/dept/save',
  get = '/system_proxy/system/dept',
  edit = '/system_proxy/system/dept/update',
  del = '/system_proxy/system/dept/remove',
}

/** 查询部门列表 */
export const listDept = (params?: Partial<DeptParams>) => defHttp.get({ url: Api.list, params });

/** 新增部门 */
export const addDept = (params: Partial<Dept>) => defHttp.post({ url: Api.add, data: params });

/** 修改部门 */
export const editDept = (params: Partial<Dept>) => defHttp.put({ url: Api.edit, data: params });

/** 查询部门详细 */
export const getDept = (id: string) => defHttp.get<Dept>({ url: `${Api.get}/${id}` });

/** 删除部门 */
export const delDept = (id: string) => defHttp.delete({ url: `${Api.del}/${id}` });
