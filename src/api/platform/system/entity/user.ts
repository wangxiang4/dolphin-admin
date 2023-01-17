/**
 * @program: dolphin-admin
 * @description: 用户实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { Page } from '/@/api/common/data/entity';
import type { User } from '/@/api/platform/core/entity/user';

/** 用户查询参数 */
export type UserParams = Page & User;

/** 用户响应对象 */
export type UserResult = R<User[]>;
