/**
 * @program: dolphin-admin
 * @description: 字典实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 字典查询参数 */
export type DictParams = Page & Dict;

/** 字典对象 */
export interface Dict extends CommonEntity {
    id: string;
    name: string;
    type: string;
    isSys: string;
    status: string;
    [key: string]: any;
}

/** 字典响应对象 */
export type DictResult = R<Dict[]>;
