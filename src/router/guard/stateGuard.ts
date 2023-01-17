/**
 * @program: dolphin-admin
 * @description: 清除数据储存处导航守卫
 * 只要进入登录页面的路由,就会清除认证信息
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { Router } from 'vue-router';
import { useAppStore } from '/@/store/modules/app';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { useUserStore } from '/@/store/modules/user';
import { usePermissionStore } from '/@/store/modules/permission';
import { PageEnum } from '/@/enums/pageEnum';
import { removeTabChangeListener } from '/@/logics/mitt/routeChange';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // 只需进入登录页面，清除认证信息即可
    if (to.path === PageEnum.BASE_LOGIN) {
      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();
      const appStore = useAppStore();
      const permissionStore = usePermissionStore();
      appStore.resetAllState().then(()=>{
        permissionStore.resetState();
        tabStore.resetState();
        userStore.resetState();
        removeTabChangeListener();
      });
    }
  });
}
