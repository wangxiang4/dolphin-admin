/**
 * @program: dolphin-admin
 * @description: 全局注册组件
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/26
 */

import type { App } from 'vue';
import { Button } from './Button';
import {
  Button as AntButton,
  Input,
  Layout
} from 'ant-design-vue';

const compList = [AntButton.Group];

export function registerGlobComp(app: App) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });

  app.use(Input).use(Button).use(Layout);
}
