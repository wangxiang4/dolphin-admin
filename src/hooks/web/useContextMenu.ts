/**
 * @program: dolphin-admin
 * @description: 元素上下文菜单工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { onUnmounted, getCurrentInstance } from 'vue';
import { createContextMenu, destroyContextMenu } from '/@/components/ContextMenu';
import type { ContextMenuItem } from '/@/components/ContextMenu';

export type { ContextMenuItem };

export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu();
    });
  }
  return [createContextMenu, destroyContextMenu];
}
