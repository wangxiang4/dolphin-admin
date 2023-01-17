/**
 * @program: dolphin-admin
 * @description: 区域实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import type { R } from '/#/axios';
import type { TreeEntity, Page } from '/@/api/common/data/entity';

export type RegionParams = Region & Page;

export interface Region extends TreeEntity {
    code: string;
    level: number;
    [key: string]: any
}

export type RegionResult = R<Region[]>;
