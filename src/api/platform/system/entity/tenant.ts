/**
 * @program: dolphin-admin
 * @description: 多租户实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 多租户查询参数 */
export type TenantParams = Page & Tenant;

/** 多租户对象 */
export interface Tenant extends CommonEntity {
  id: string;
  name: string;
  code: string;
  tenantStartTime: string;
  tenantEndTime: string;
  status: string;
  [key: string]: any;
}

/** 多租户响应对象 */
export type TenantResult = R<Tenant[]>;
