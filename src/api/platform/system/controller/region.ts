/**
 * 提供api模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
 * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
 * author entfrm开发团队-王翔
 */
import { RegionParams, Region, RegionResult } from '/@/api/platform/system/entity/region';
import { ResultVo } from '/@/api/common/base/entity';
import { defHttp } from '/@/utils/http/axios';

enum Api {
    list = '/system_proxy/system/region/list',
    lazyList= '/system_proxy/system/region/lazyList',
    get = '/system_proxy/system/region',
    add = '/system_proxy/system/region/save',
    edit = '/system_proxy/system/region/update',
    del = '/system_proxy/system/region/remove'
}

export const listRegion = (params?: Partial<RegionParams>) => {
    let url = Api.lazyList;
    if (params?.name || params?.code || params?.beginTime || params?.endTime) url = Api.list;
    return defHttp.get({ url: url, params });
};

export const listRegionCascade = (params?: Partial<RegionParams>) => defHttp.get({ url: Api.lazyList, params }).then(res => {
    return res.map(item => {
      const { children, ...result } = item;
      return { ...result, isLeaf: !!!children };
    });
});

export const addRegion = (params:Partial<Region>) => defHttp.post({ url: Api.add,data:params });

export const editRegion = (params:Partial<Region>) => defHttp.put({ url: Api.edit,data:params });

export const getRegion = (id: string) => defHttp.get<ResultVo<Region>>({ url: `${Api.get}/${id}` });

export const delRegion = (id: string) => defHttp.delete({ url: `${Api.del}/${id}` });

