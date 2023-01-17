/**
 * @program: dolphin-admin
 * @description: 令牌实体类
 * 类型定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */
import type { R } from '/#/axios';
import type { Page } from '/@/api/common/data/entity';
import type { TokenEnhancer } from '/@/api/platform/core/entity/user';

/** 令牌查询参数 */
export type TokenParams = Page & TokenEnhancer;

/** 令牌响应对象 */
export type TokenResult = R<TokenEnhancer[]>;
