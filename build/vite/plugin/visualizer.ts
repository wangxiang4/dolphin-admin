/**
 * @program: dolphin-admin
 * @description: rollup-plugin-visualizer配置
 * 提供分析依赖查看哪些模块占用了空间
 * 文档: https://github.com/btd/rollup-plugin-visualizer
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/5
 */

import visualizer from 'rollup-plugin-visualizer';
import { isReportMode } from '../../utils';

export function configVisualizerConfig() {
  if (isReportMode()) {
    return visualizer({
      // 生成图表的文件的名称
      filename: './node_modules/.cache/visualizer/stats.html',
      // 生成完毕自动打开生成的文件
      open: true,
      // 从源代码中收集gzip大小并将其显示在图表中
      gzipSize: true,
      // 从源代码中收集brotli大小并将其显示在图表中
      brotliSize: true,
    }) as Plugin;
  }
  return [];
}
