/**
 * @program: dolphin-admin
 * @description: 数据相关实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

/** 分页模型 */
export interface Page {
  size: number;
  current: number;
  total: number;
  [key: string]: any;
}

/** 通用模型 */
export interface CommonEntity {
  createById: string;
  createByName: string;
  createTime: string;
  updateById: string;
  updateByName: string;
  updateTime: string;
  remarks: string;
}

/** 树结构模型 */
export interface TreeEntity<T = any> {
  id:string;
  parentId: string;
  name: string;
  sort: number;
  children: T[]
}
