/**
 * @program: dolphin-admin
 * @description: 字典数据实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 字典数据查询参数 */
export type DictDataParams = Page & DictData;

/** 字典数据对象 */
export interface DictData extends CommonEntity {
    id: string;
    dictType: string;
    label: string;
    value: string;
    sort: number;
    [key: string]: any;
}

/** 字典数据响应对象 */
export type DictDataResult = R<DictData[]>;
