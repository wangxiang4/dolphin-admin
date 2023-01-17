/**
 * @program: dolphin-admin
 * @description: 创建pinia数据存储实例
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/7
 */

import type { App } from 'vue';
import { createPinia } from 'pinia';

const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
