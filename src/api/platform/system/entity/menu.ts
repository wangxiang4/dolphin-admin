/**
 * @program: dolphin-admin
 * @description: 菜单实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { CommonEntity, Page } from '/@/api/common/data/entity';

/** 菜单查询参数 */
export type MenuParams = Page & Menu;

/** 菜单对象 */
export interface Menu extends CommonEntity {
  id: string;
  name: string;
  parentId: string;
  type: string;
  path: string;
  component: string;
  permission: string;
  icon: string;
  keepAlive: string;
  hideMenu: string;
  sort: string;
  [key: string]: any;
}

/** 菜单响应对象 */
export type MenuResult = R<Menu[]>;
