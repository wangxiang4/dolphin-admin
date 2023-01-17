/**
 * @program: dolphin-admin
 * @description: 存储授权信息缓存工具类
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import { ACCESS_TOKEN_KEY } from '/@/enums/cacheEnum';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getAccessToken() {
  return getAuthCache(ACCESS_TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value: any) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

/**
 * 清空授权缓存(清除当前项目所有缓存信息)
 * 注意:这个请谨慎使用,会清空所有storage数据,不止会清除授权缓存,包括项目配置缓存,国际化缓存等等当前系统中所有缓存信息
 */
export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}
