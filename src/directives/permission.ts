/**
 * @program: dolphin-admin
 * @description: 权限指令
 * 用于组件权限的细粒度控制
 * @Example v-auth="xxx"
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import type { App, Directive, DirectiveBinding } from 'vue';
import { usePermission } from '/@/hooks/web/usePermission';

function isAuth(el: Element, binding: any) {
  const { hasPermission } = usePermission();
  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const authDirective: Directive = { mounted };

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
