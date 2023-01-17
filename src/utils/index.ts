/**
 * @program: dolphin-admin
 * @description: 通用工具类
 * 注意: 如果同一类的工具类很多,建议创建文件存放到这个文件中,方便工具分类,与后期维护
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/8
 */

import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Plugin } from 'vue';
import { unref } from 'vue';
import { isObject } from '/@/utils/is';
import { isEmpty } from 'lodash-es';

export const noop = () => {};

/**
 * 设置ui挂载节点
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * 将对象作为参数添加到 URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean }
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// 动态使用钩子道具
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};


/** 查询指定集合名称 */
export const findListNameById = (id: string, list: any[], options: Partial<{ idField: string, nameField: string, childrenField: string }> = {}) => {
  // 设置默认配置
  options = Object.assign({ idField: 'id', nameField: 'name', childrenField: 'children' }, options);
  console.log(id, list, options);
  for (let i = 0; i < list.length; i++) {
    if (list[i][options.idField!] === id) {
      return list[i][options.nameField!];
    }
    if (!isEmpty(list[i][options.childrenField!])) {
      return findListNameById(id, list[i][options.childrenField!],options);
    }
  }
  return '';
};
