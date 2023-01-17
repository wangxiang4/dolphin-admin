/**
 * @program: dolphin-admin
 * @description: 基础相关实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

/** 扩展安全框架用户信息 */
export interface DolphinUser {
  id: string;
  username: string;
  password: string;
  deptId: string;
  phone: string;
  enabled: boolean;
  tenantId: string;
  authorities: Recordable[];
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  [key: string]: any;
}

/** 基础模型 */
export interface BaseEntity {
  tenantId: string;
  currentUser: DolphinUser;
  sqlFilter: string;
}

/** 结果集模型 */
export interface ResultVo<T = any> {
  result: T;
  extend: T;
}
