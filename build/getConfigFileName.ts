/**
 * @program: dolphin-admin
 * @description: 获取外部配置文件变量名
 * 主要用于控制台输出额外的发布信息
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/6
 */

export const getConfigFileName = (env: Record<string, any>) => {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '');
};
