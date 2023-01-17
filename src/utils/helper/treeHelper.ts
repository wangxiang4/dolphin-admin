/**
 * @program: dolphin-admin
 * @description: 树形数据处理帮助工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/7
 */

interface TreeHelperConfig {
  id: string;
  children: string;
  parentId: string;
}
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  parentId: 'parentId',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

/** 集合转换树形 */
export function listToTree<T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, children, parentId } = conf;
  for (const node of list) nodeMap.set(node[id], node);
  for (const node of list) {
    const parent = nodeMap.get(node[parentId]);
    (parent ? parent[children] || (parent[children] = []) : result).push(node);
  }
  return result;
}

/** 树形转换集合 */
export function treeToList<T = any>(tree: any[], config: Partial<TreeHelperConfig> = {}): T {
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

/** 查找树形匹配的节点信息,只包含当前节点数据 */
export function findNode<T = any>(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}): T | null {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  for (const node of list) {
    if (func(node)) return node;
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

/** 查找树形匹配 in 的节点信息,以集合的形式返回 */
export function findNodeIn<T = any>(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}): T[] {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  const result: T[] = [];
  for (const node of list) {
    func(node) && result.push(node);
    node[children!] && list.push(...node[children!]);
  }
  return result;
}

/** 查找树形集合父级元素,可以使用func函数进行控制 */
export function findPath<T = any>(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}): T | T[] | null {
  config = getConfig(config);
  const path: T[] = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

/** 查找树形集合所有父级元素,不能使用func函数进行控制,只能利用func函数处理数据 */
export function findPathAll(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) {
  config = getConfig(config);
  const path: any[] = [];
  const list = [...tree];
  const result: any[] = [];
  const visitedSet = new Set(),
    { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
}

/** 树形集合过滤,过滤后数据为父级元素加子级元素的形式 */
export function filter<T = any>(tree: T[], func: (n: T) => boolean, config: Partial<TreeHelperConfig> = {}): T[] {
  config = getConfig(config);
  const children = config.children as string;
  function listFilter(list: T[]) {
    return list.map((node: any) => ({ ...node })).filter((node) => {
      node[children] = node[children] && listFilter(node[children]);
      return func(node) || (node[children] && node[children].length);
    });
  }
  return listFilter(tree);
}

/** 树形集合循环 */
export function forEach<T = any>(tree: T[], func: (n: T) => any, config: Partial<TreeHelperConfig> = {}): void {
  config = getConfig(config);
  const list: any[] = [...tree];
  const { children } = config;
  for (let i = 0; i < list.length; i++) {
    // func返回true就终止遍历,避免大量节点场景下无意义循环,引起浏览器卡顿
    if (func(list[i])) return;
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children]);
  }
}

/** 提取树指定结构 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map((item) => treeMapEach(item, opt));
}

/** 进行循环转换指定树结构 */
export function treeMapEach(data: any, { children = 'children', conversion }: { children?: string; conversion: Fn }) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
      treeMapEach(i, {
        children,
        conversion,
      }))
    };
  } else {
    return {
      ...conversionData
    };
  }
}
