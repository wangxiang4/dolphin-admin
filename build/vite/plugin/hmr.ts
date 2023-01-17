/**
 * @program: dolphin-admin
 * @description: 解决HMR(模块热部署)循环依赖问题
 * todo: 目前解决方案直接清除已经导入的模块然后直接热部署,暂时解决Vite循环依赖问题,等以后有更好的解决方案修复,不知道这样写会带来什么问题
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import type { Plugin } from 'vite';

export function configHmrPlugin(): Plugin {
  return {
    name: 'singleHMR',
    handleHotUpdate({ modules, file }) {
      if (file.match(/xml$/)) return [];

      modules.forEach((m) => {
        if (!m.url.match(/\.(css|less)/)) {
          m.importedModules = new Set();
          m.importers = new Set();
        }
      });

      return modules;
    },
  };
}
