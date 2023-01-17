/**
 * @program: dolphin-admin
 * @description: 导出指令注册
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import type { App } from 'vue';
import { setupPermissionDirective } from './permission';
import { setupLoadingDirective } from './loading';

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app);
  setupLoadingDirective(app);
}
