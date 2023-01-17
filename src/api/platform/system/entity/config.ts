/**
 * @program: dolphin-admin
 * @description: 配置实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 配置查询参数 */
export type ConfigParams = Page & Config;

/** 配置对象 */
export interface Config extends CommonEntity {
    id: string;
    name: string;
    key: string;
    value: string;
    isSys: string;
    [key: string]: any;
}

/** 配置响应对象 */
export type ConfigResult = R<Config[]>;
