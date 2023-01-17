/**
 * @program: dolphin-admin
 * @description: 环境变量工具类
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import type { GlobEnvConfig } from '/#/config';
import { warn } from '/@/utils/log';
import pkg from '../../package.json';
import { getConfigFileName } from '../../build/getConfigFileName';

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// 根据版本生成缓存键
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = (import.meta.env.DEV
    ? // 获取全局配置（打包时会独立提取配置）
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_CLIENT_ID,
    VITE_GLOB_CLIENT_SECRET,
    VITE_GLOB_GATEWAY_ASE_ENCODE_SECRET
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      'VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.'
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_CLIENT_ID,
    VITE_GLOB_CLIENT_SECRET,
    VITE_GLOB_GATEWAY_ASE_ENCODE_SECRET
  };
}

/**
 * 获取环境变量
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * 是不是开发模式
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * 是不是生产模式
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
