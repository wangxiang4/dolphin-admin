/**
 * @program: dolphin-admin
 * @description: 发布构建成功后附加一些处理逻辑操作
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/6
 */

import { runBuildConfig } from './buildConf';
import chalk from 'chalk';
import pkg from '../../package.json';

export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2);

    // 生成配置文件
    if (!argvList.includes('disabled-config')) {
      runBuildConfig();
    }

    console.log(`✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - build successfully!');
  } catch (error) {
    console.log(chalk.red('vite build error:\n' + error));
    process.exit(1);
  }
};

(runBuild)();
