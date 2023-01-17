/**
 * @program: dolphin-admin
 * @description: 角色实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 角色查询参数 */
export type RoleParams = Page & Role;

/** 角色对象 */
export interface Role extends CommonEntity {
  id: string;
  name: string;
  code: string;
  sort: string;
  status: string;
  [key: string]: any;
}

/** 角色响应对象 */
export type RoleResult = R<Role[]>;
