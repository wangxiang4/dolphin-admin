/**
 * @program: dolphin-admin
 * @description: 用于监视路由更改以及更改菜单和选项卡的状态。不需要监听路由，因为路由状态变化受页面渲染时间影响，会比较慢
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import mitt from '/@/utils/mitt';
import type { RouteLocationNormalized } from 'vue-router';
import { getRawRoute } from '/@/utils';

const emitter = mitt();
const key = Symbol();
let lastChangeTab: RouteLocationNormalized;

export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  const r = getRawRoute(lastChangeRoute);
  emitter.emit(key, r);
  lastChangeTab = r;
}

export function listenerRouteChange(callback: (route: RouteLocationNormalized) => void, immediate = true) {
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
}

export function removeTabChangeListener() {
  emitter.clear();
}
