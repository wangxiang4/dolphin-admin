/**
 * @program: dolphin-admin
 * @description: 控制台日志输出工具类
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

const projectName = import.meta.env.VITE_GLOB_APP_TITLE;

export function warn(message: string) {
  console.warn(`[${projectName} warn]:${message}`);
}

export function error(message: string) {
  throw new Error(`[${projectName} error]:${message}`);
}
