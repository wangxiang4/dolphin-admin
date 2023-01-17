/**
 * @program: dolphin-admin
 * @description: 部门实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 部门查询参数 */
export type DeptParams = Page & Dept;

/** 部门对象 */
export interface Dept extends CommonEntity {
  deptId: string;
  code: string;
  name: string;
  parentId: string;
  sort: number;
  contacts: string;
  phone: string;
  address: string;
  email: string;
  status: string;
  [key: string]: any;
}

/** 部门响应对象 */
export type DeptResult = R<Dept[]>;
