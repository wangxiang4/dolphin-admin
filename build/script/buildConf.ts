/**
 * @program: dolphin-admin
 * @description: 用于打包时生成额外的配置文件,该文件可以配置一些全局变量,这样就可以直接在外部更改,无需重新打包
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/6
 */

import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR } from '../constant';
import fs, { writeFileSync } from 'fs-extra';
import chalk from 'chalk';
import { getRootPath, getEnvConfig } from '../utils';
import { getConfigFileName } from '../getConfigFileName';
import pkg from '../../package.json';

/** 创建外部配置文件 */
function createConfig({
                        configName,
                        config,
                        configFileName = GLOB_CONFIG_FILE_NAME
                      }: { configName: string; config: any; configFileName?: string } = { configName: '', config: {} }) {
  try {
    const windowConf = `window.${configName}`;
    // 确保变量不会被修改
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '');
    fs.mkdirp(getRootPath(OUTPUT_DIR));
    // 将配置信息追加到_app.config.js文件中
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr);

    console.log(chalk.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`);
    console.log(chalk.gray(OUTPUT_DIR + '/' + chalk.green(configFileName)) + '\n');
  } catch (error) {
    console.log(chalk.red('configuration file configuration file failed to package:\n' + error));
  }
}

/** 运行构建外部配置文件 */
export function runBuildConfig() {
  const config = getEnvConfig();
  const configFileName = getConfigFileName(config);
  createConfig({ config, configName: configFileName });
}
