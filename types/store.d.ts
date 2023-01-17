/**
 * @program: dolphin-admin
 * @description: pinia数据存储定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

/** 锁屏信息 */
export interface LockInfo {
  // 要求输入密码
  pwd?: string | undefined;
  // 是否被锁定？
  isLock?: boolean;
}

/** 当窗口收缩时,记住一些状态,在窗口恢复时恢复这些状态 */
export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
