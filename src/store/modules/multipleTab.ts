/**
 * @program: dolphin-admin
 * @description: 头部多标签tab信息存储中心
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';
import { toRaw, unref } from 'vue';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import { Persistent } from '/@/utils/cache/persistent';
import { PageEnum } from '/@/enums/pageEnum';
import { PAGE_NOT_FOUND_NAME, REDIRECT_NAME } from '/@/router/constant';
import { getRawRoute } from '/@/utils';
import { MULTIPLE_TABS_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import { useUserStore } from '/@/store/modules/user';

export interface MultipleTabState {
  cacheTabList: Set<string>;
  tabList: RouteLocationNormalized[];
  lastDragEndIndex: number;
}

function handleGotoPage(router: Router) {
  const go = useGo(router);
  go(unref(router.currentRoute).path, true);
}

const cacheTab = projectSetting.multiTabsSetting.cache;

export const useMultipleTabStore = defineStore({
  id: 'app-multiple-tab',
  state: (): MultipleTabState => ({
    // 需要缓存的选项卡
    cacheTabList: new Set(),
    // 多标签列表
    tabList: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
    // 最后移动的标签的索引
    lastDragEndIndex: 0,
  }),
  getters: {
    getTabList(): RouteLocationNormalized[] {
      return this.tabList;
    },
    getCachedTabList(): string[] {
      return Array.from(this.cacheTabList);
    },
    getLastDragEndIndex(): number {
      return this.lastDragEndIndex;
    },
  },
  actions: {
    /** 更新缓存标签缓存目前打开的标签 */
    async updateCacheTab() {
      const cacheMap: Set<string> = new Set();
      for (const tab of this.tabList) {
        const item = getRawRoute(tab);
        // 忽略缓存
        const needCache = item.meta?.keepAlive;
        if (!needCache) continue;
        const name = item.name as string;
        cacheMap.add(name);
      }
      this.cacheTabList = cacheMap;
    },
    /** 刷新标签 */
    async refreshPage(router: Router) {
      const { currentRoute } = router;
      const route = unref(currentRoute);
      const name = route.name;
      const findTab = this.getCachedTabList.find((item) => item === name);
      if (findTab) this.cacheTabList.delete(findTab);
      const redo = useRedo(router);
      await redo();
    },
    /** 清除所有缓存标签 */
    clearCacheTabs(): void {
      this.cacheTabList = new Set();
    },
    /** 刷新标签数据存储数据 */
    resetState(): void {
      this.tabList = [];
      this.clearCacheTabs();
    },
    /** 处理跳转页面 */
    goToPage(router: Router) {
      const go = useGo(router);
      const len = this.tabList.length;
      const { path } = unref(router.currentRoute);
      let toPath: PageEnum | string = PageEnum.BASE_HOME;
      if (len > 0) {
        const page = this.tabList[len - 1];
        const p = page.fullPath || page.path;
        if (p) toPath = p;
      }
      // 如果path不等于toPath,就跳转到当前页面并报错
      path !== toPath && go(toPath as PageEnum, true);
    },
    /** 添加标签页 */
    async addTab(route: RouteLocationNormalized) {
      const { path, name, fullPath, params, query } = getRawRoute(route);
      // 404页面不需要添加标签
      if (
        path === PageEnum.ERROR_PAGE ||
        path === PageEnum.BASE_LOGIN ||
        !name ||
        [REDIRECT_NAME, PAGE_NOT_FOUND_NAME].includes(name as string)
      ) return;
      let updateIndex = -1;
      // 现有页面,不要重复添加标签
      const tabHasExits = this.tabList.some((tab, index) => {
        updateIndex = index;
        return (tab.fullPath || tab.path) === (fullPath || path);
      });
      // 如果选项卡已经存在，则执行更新操作
      if (tabHasExits) {
        const curTab = toRaw(this.tabList)[updateIndex];
        if (!curTab) return;
        curTab.params = params || curTab.params;
        curTab.query = query || curTab.query;
        curTab.fullPath = fullPath || curTab.fullPath;
        this.tabList.splice(updateIndex, 1, curTab);
      // 添加选项卡
      } else this.tabList.push(route);
      await this.updateCacheTab();
      cacheTab && Persistent.setLocal(MULTIPLE_TABS_KEY, this.tabList);
    },
    /** 关闭标签页 */
    async closeTab(tab: RouteLocationNormalized, router: Router) {
      const getToTarget = (tabItem: RouteLocationNormalized) => {
        const { params, path, query } = tabItem;
        return {
          params: params || {},
          path,
          query: query || {},
        };
      };
      const close = (route: RouteLocationNormalized) => {
        const { fullPath, meta: { affix } = {} } = route;
        if (affix) return;
        const index = this.tabList.findIndex((item) => item.fullPath === fullPath);
        index !== -1 && this.tabList.splice(index, 1);
      };
      const { currentRoute, replace } = router;
      const { path } = unref(currentRoute);
      // 关闭不是激活选项卡
      if (path !== tab.path) return close(tab);
      // 关闭被激活选项卡
      let toTarget: RouteLocationRaw = {};
      const index = this.tabList.findIndex((item) => item.path === path);
      // 如果当前是最左边的选项卡
      if (index === 0) {
        // 只有一个标签，然后跳转到首页，否则跳转到右侧标签
        if (this.tabList.length === 1) {
          const userStore = useUserStore();
          toTarget = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
        } else {
          // 跳转到右侧标签
          const page = this.tabList[index + 1];
          toTarget = getToTarget(page);
        }
      } else {
        // 关闭当前选项卡
        const page = this.tabList[index - 1];
        toTarget = getToTarget(page);
      }
      close(currentRoute.value);
      await replace(toTarget);
    },
    /** 标签新增与删除回调处理,用于关闭标签页 */
    async closeTabByKey(key: string, router: Router) {
      const index = this.tabList.findIndex((item) => (item.fullPath || item.path) === key);
      index !== -1 && await this.closeTab(this.tabList[index], router);
    },
    /** 对选项卡进行排序 */
    async sortTabs(oldIndex: number, newIndex: number) {
      const currentTab = this.tabList[oldIndex];
      this.tabList.splice(oldIndex, 1);
      this.tabList.splice(newIndex, 0, currentTab);
      this.lastDragEndIndex = this.lastDragEndIndex + 1;
    },
    /** 关闭右侧的标签并跳转 */
    async closeLeftTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex((item) => item.path === route.path);
      if (index > 0) {
        const leftTabs = this.tabList.slice(0, index);
        const pathList: string[] = [];
        for (const item of leftTabs) {
          const affix = item?.meta?.affix ?? false;
          if (!affix) pathList.push(item.fullPath);
        }
        await this.bulkCloseTabs(pathList);
      }
      await this.updateCacheTab();
      handleGotoPage(router);
    },
    /** 关闭左侧标签并跳转 */
    async closeRightTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex((item) => item.fullPath === route.fullPath);
      if (index >= 0 && index < this.tabList.length - 1) {
        const rightTabs = this.tabList.slice(index + 1, this.tabList.length);
        const pathList: string[] = [];
        for (const item of rightTabs) {
          const affix = item?.meta?.affix ?? false;
          if (!affix) pathList.push(item.fullPath);
        }
        await this.bulkCloseTabs(pathList);
      }
      await this.updateCacheTab();
      handleGotoPage(router);
    },
    /** 关闭全部标签并跳转 */
    async closeAllTab(router: Router) {
      this.tabList = this.tabList.filter((item) => item?.meta?.affix ?? false);
      this.clearCacheTabs();
      this.goToPage(router);
    },
    /** 关闭其他标签 */
    async closeOtherTabs(route: RouteLocationNormalized, router: Router) {
      const closePathList = this.tabList.map((item) => item.fullPath);
      const pathList: string[] = [];
      for (const path of closePathList) {
        if (path !== route.fullPath) {
          const closeItem = this.tabList.find((item) => item.path === path);
          if (!closeItem) continue;
          const affix = closeItem?.meta?.affix ?? false;
          if (!affix) pathList.push(closeItem.fullPath);
        }
      }
      await this.bulkCloseTabs(pathList);
      await this.updateCacheTab();
      handleGotoPage(router);
    },
    /** 批量关闭标签页 */
    async bulkCloseTabs(pathList: string[]) {
      this.tabList = this.tabList.filter((item) => !pathList.includes(item.fullPath));
    },
    /** 设置标签的标题 */
    async setTabTitle(title: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find((item) => item === route);
      if (findTab) {
        findTab.meta.title = title;
        await this.updateCacheTab();
      }
    },
    /** 替换选项卡的路径 */
    async updateTabPath(fullPath: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find((item) => item === route);
      if (findTab) {
        findTab.fullPath = fullPath;
        findTab.path = fullPath;
        await this.updateCacheTab();
      }
    }
  }
});

// 需要在设置之外使用
export function useMultipleTabWithOutStore() {
  return useMultipleTabStore(store);
}
