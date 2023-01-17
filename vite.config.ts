/**
 * @program: dolphin-admin
 * @description: vite配置
 * vite采用按需打包的方式,极大的提高了打包的效率,对比其他打包工具这个是他最大的优势
 * vite官网文档: https://cn.vitejs.dev/guide/why.html
 * vue3官方文档: https://staging-cn.vuejs.org
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/4
 */

import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import { generateModifyVars } from './build/generate/generateModifyVars';
import { createProxy } from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';
import pkg from './package.json';
import moment from 'moment';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

/** 项目信息 */
const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: moment().format('YYYY-MM-DD HH:mm:ss'),
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  // 在当前工作目录中根据 mode 加载env文件
  const env = loadEnv(mode, root);

  // 解析转换环境变量值
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  // 利用command(serve:开发环境, build:发布环境)判断当前vite运行环境
  const isBuild = command === 'build';

  return {
    root,
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      // 监听所有本地 IP
      host: true,
      // 指定开发服务器端口
      port: VITE_PORT,
      // 从.env环境配置中加载代理配置
      proxy: createProxy(VITE_PROXY),
    },
    build: {
      minify: 'terser',
      // 设置最终构建的浏览器兼容目标
      target: 'es2015',
      // 指定输出路径
      outDir: OUTPUT_DIR,
      // 设置代码简洁压缩选项
      terserOptions: {
        // 参考文档: https://terser.org/docs/api-reference
        compress: {
          keep_infinity: true,
          // 用于在生产环境中删除控制台
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      // 关闭 brotliSize 显示可以稍微减少打包时间
      brotliSize: false,
      // 设置块大小警告限制提示
      chunkSizeWarningLimit: 2000,
    },
    define: {
      // 在生产中启用/禁用@intlify/devtools支持,默认值false
      __INTLIFY_PROD_DEVTOOLS__: false,
      // 定义应用程序信息,方便项目提取信息
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        // 参考文档: https://lesscss.org/usage/#command-line-usage-options
        less: {
          charset: false,
          // 设置需要修改less的变量
          modifyVars: generateModifyVars(),
          // 在less文件中启用内联JavaScript,目前已经被弃用
          javascriptEnabled: true,
        }
      },
      postcss: {
        plugins: [
          {
            // 消除含义中文vxe-table样式@charset:UTF-8警告
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ],
      },
    },
    // 项目使用的vite插件太多,单独提取管理,便于维护
    plugins: createVitePlugins(viteEnv, isBuild),
    // 默认预构建是根据index.html来检测需要哪些预构建的依赖项
    // 配置预构建原因请参考: https://cn.vitejs.dev/guide/dep-pre-bundling.html#the-why
    optimizeDeps: {
      // 首次启动vite预加载强制包含依赖
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        // @iconify/iconify依赖是由@purge-iconsgenerated动态和虚拟加载的,因此需要显式指定
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
        'moment/dist/locale/zh-cn',
        'moment/dist/locale/eu',
      ]
    }
  };
};
