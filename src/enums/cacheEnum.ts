/**
 * @program: dolphin-admin
 * @description: 缓存枚举键
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

/** 访问令牌密钥 */
export const ACCESS_TOKEN_KEY = 'ACCESS__TOKEN__';

/** 刷新令牌密钥 */
export const REFRESH_TOKEN_KEY = 'REFRESH__TOKEN__';

/** 按钮权限键 */
export const PERMISSIONS_KEY = 'PERMISSIONS__';

/** 角色id键 */
export const ROLE_IDS_KEY = 'ROLE__IDS__';

/** 国际化键 */
export const LOCALE_KEY = 'LOCALE__';

/** 用户信息键 */
export const USER_INFO_KEY = 'USER__INFO__';

/** 项目配置键 */
export const PROJ_CFG_KEY = 'PROJ__CFG__KEY__';

/** 锁定信息 */
export const LOCK_INFO_KEY = 'LOCK__INFO__KEY__';

/** 多标签键 */
export const MULTIPLE_TABS_KEY = 'MULTIPLE_TABS__KEY__';

/** 应用主题键 */
export const APP_DARK_MODE_KEY = '__APP__DARK__MODE__';

/** 基本全局本地缓存密钥 */
export const APP_LOCAL_CACHE_KEY = 'COMMON__LOCAL__KEY__';

/** 基本全局会话缓存密钥 */
export const APP_SESSION_CACHE_KEY = 'COMMON__SESSION__KEY__';

export enum CacheTypeEnum {
  SESSION,
  LOCAL,
}
