/**
 * @program: dolphin-admin
 * @description: vite-plugin-style-import配置
 * 提供对vite的按需引入组件库样式功能
 * 文档: https://github.com/anncwb/vite-plugin-style-import
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import styleImport from 'vite-plugin-style-import';

export function configStyleImportPlugin() {
  const styleImportPlugin = styleImport({
    libs: [
      {
        // 需要导入库名
        libraryName: 'ant-design-vue',
        // 如果样式文件不是.css后缀,需要开启这个选项
        esModule: true,
        // 自定义样式文件转换
        resolveStyle: (name) => {
          return `ant-design-vue/es/${name}/style/index`;
        }
      },
      { // 按需加载vxe-table组件
        libraryName: 'vxe-table',
        esModule: true,
        resolveComponent: (name) => `vxe-table/es/${name}`,
        resolveStyle: (name) => `vxe-table/es/${name}/style.css`
      }
    ]
  });
  return styleImportPlugin;
}
