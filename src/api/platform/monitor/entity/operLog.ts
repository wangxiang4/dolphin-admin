/**
 * @program: dolphin-admin
 * @description: 操作日志实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 操作日志查询参数 */
export type OperLogParams = Page & OperLog;

/** 操作日志对象 */
export interface OperLog extends CommonEntity {
    id: string;
    title: string;
    type: string;
    method: string;
    userAgent: string;
    operName: string;
    clientId: string;
    operUrl: string;
    operIp: string;
    operAddr: string;
    operParam: string;
    status: string;
    errorMsg: string;
    executeTime: string;
    operTime: string;
    serviceId: string;
    [key: string]: any;
}

/** 操作日志响应对象 */
export type OperLogResult = R<OperLog[]>;
