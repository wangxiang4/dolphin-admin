/**
 * @program: dolphin-admin
 * @description: 配置路由导航守卫
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { Router, RouteLocationNormalized } from 'vue-router';
import { useAppStoreWithOut } from '/@/store/modules/app';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import { Modal, notification } from 'ant-design-vue';
import { warn } from '/@/utils/log';
import { unref } from 'vue';
import { setRouteChange } from '/@/logics/mitt/routeChange';
import { createPermissionGuard } from './permissionGuard';
import { createStateGuard } from './stateGuard';
import nProgress from 'nprogress';
import projectSetting from '/@/settings/projectSetting';

/** 不要改变创建的顺序 */
export function setupRouterGuard(router: Router) {
  createPageGuard(router);
  createPageLoadingGuard(router);
  createHttpGuard(router);
  createScrollGuard(router);
  createMessageGuard(router);
  createProgressGuard(router);
  createPermissionGuard(router);
  createStateGuard(router);
}

/** 处理页面缓存 */
function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>();
  router.beforeEach(async (to) => {
    // 页面已经加载完毕,再次打开会更快,不需要再做加载等处理
    to.meta.loaded = !!loadedPageMap.get(to.path);
    // 通知路由更改
    setRouteChange(to);
    return true;
  });
  router.afterEach((to) => {
    loadedPageMap.set(to.path, true);
  });
}

/** 处理页面正在加载中 */
function createPageLoadingGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const appStore = useAppStoreWithOut();
  const { getOpenPageLoading } = useTransitionSetting();
  router.beforeEach(async (to) => {
    if (!userStore.getAccessToken) return true;
    if (to.meta.loaded) return true;
    if (unref(getOpenPageLoading)) {
      await appStore.setPageLoadingAction(true);
      return true;
    }
    return true;
  });
  router.afterEach(async () => {
    if (unref(getOpenPageLoading)) {
      // 定时器模拟加载时间，防止闪烁过快 TODO 寻找更好的方法
      setTimeout(() => {
        appStore.setPageLoading(false);
      }, 220);
    }
    return true;
  });
}

/** 处理路由切换时关闭当前页面正在发生请求的axios */
function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = projectSetting;
  let axiosCanceler: Nullable<AxiosCanceler>;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  router.beforeEach(async () => {
    // 切换路由会删除之前的请求
    axiosCanceler?.removeAllPending();
    return true;
  });
}

/** 处理路由切换时自动滚动到顶部 */
function createScrollGuard(router: Router) {
  const isHash = (href: string) => /^#/.test(href);
  const body = document.body;
  router.afterEach(async (to) => {
    // 滚动顶部
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);
    return true;
  });
}

/** 处理路由切换时关闭当前页面正在提示的消息实例 */
export function createMessageGuard(router: Router) {
  const { closeMessageOnSwitch } = projectSetting;
  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll();
        notification.destroy();
      }
    } catch (error) {
      warn('消息关闭错误:' + error);
    }
    return true;
  });
}

/** 处理发送请求时显示请求进度条 */
export function createProgressGuard(router: Router) {
  const { getOpenNProgress } = useTransitionSetting();
  router.beforeEach(async (to) => {
    if (to.meta.loaded) return true;
    unref(getOpenNProgress) && nProgress.start();
    return true;
  });
  router.afterEach(async () => {
    unref(getOpenNProgress) && nProgress.done();
    return true;
  });
}
