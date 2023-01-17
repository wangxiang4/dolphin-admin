/**
 * @program: dolphin-admin
 * @description: 生成给IconPicker组件展示的图标集
 * 指定图标集,要不然全部让vite-plugin-purge-icons打包到html,dom中,太大了
 * 提供两种访问模式
 * 在线: 使用到图标的时候进行在线请求,然后缓存对应的图标到浏览器(不加前缀,@iconify会远程获取)
 *      缺点: 在局域网或者无法访问到外网的环境中图标显示不出来
 * 离线: 该方式会在打包的时候将图标选择器的图标全部打包到js内,在使用的时候不会额外的请求在线图标
 *      缺点: 打包体积会偏大，具体的体积增加得看前面选择图标集的时候选择的图标数量的多少决定
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/6
 */

import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import chalk from 'chalk';
import pkg from '../../../package.json';

/** 生成图标集 */
(async function generateIcon() {

  // 查找@iconify的SVG图标集合json路径
  const dir = path.resolve(process.cwd(), 'node_modules/@iconify/json');

  const raw = await fs.readJSON(path.join(dir, 'collections.json'));

  // 转换SVG图标集合,加个ID,方便后面处理
  const collections = Object.entries(raw).map(([id, v]) => ({...(v as any), id }));

  const choices = collections.map((item) => ({ key: item.id, value: item.id, name: item.name }));

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'useType',
        choices: [
          { key: 'local', value: 'local', name: 'Local' },
          { key: 'onLine', value: 'onLine', name: 'OnLine' },
        ],
        message: '如何使用图标?',
      },
      {
        type: 'list',
        name: 'iconSet',
        choices: choices,
        message: '选择需要生成的图标集?',
      },
      {
        type: 'input',
        name: 'output',
        message: '选择需要生成的图标集?',
        default: 'src/components/Icon/data',
      },
    ])
    .then(async (answers) => {
      const { iconSet, output, useType } = answers;
      const outputDir = path.resolve(process.cwd(), output);
      fs.ensureDir(outputDir);
      // 找出选择的图标集
      const genCollections = collections.filter((item) => [iconSet].includes(item.id));
      const prefixSet: string[] = [];
      for (const info of genCollections) {
        const data = await fs.readJSON(path.join(dir, 'json', `${info.id}.json`));
        if (data) {
          const { prefix } = data;
          const isLocal = useType === 'local';
          const icons = Object.keys(data.icons).map(
            (item) => `${isLocal ? prefix + ':' : ''}${item}`
          );

          // 将选种的图标集生成到icons.data.ts文件中
          await fs.writeFileSync(
            path.join(output, `icons.data.ts`),
            `export default ${isLocal ? JSON.stringify(icons) : JSON.stringify({ prefix, icons })}`
          );
          prefixSet.push(prefix);
        }
      }
      // 清除vite预构建缓存
      fs.emptyDir(path.join(process.cwd(), 'node_modules/.vite'));
      console.log(`✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - Icon generated successfully:' + `[${prefixSet}]`);
    });
})();

