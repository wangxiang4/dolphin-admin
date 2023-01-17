/**
 * @program: dolphin-admin
 * @description: vite-plugin-compression配置
 * 用于打包输出gzip
 * 文档: https://github.com/anncwb/vite-plugin-compression
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/6
 */

import type { Plugin } from 'vite';
import compressPlugin from 'vite-plugin-compression';

export function configCompressPlugin(compress: 'gzip' | 'brotli' | 'none', deleteOriginFile = false): Plugin | Plugin[] {
  const compressList = compress.split(',');

  const plugins: Plugin[] = [];

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
      })
    );
  }
  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      })
    );
  }
  return plugins;
}
