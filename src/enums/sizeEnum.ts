/**
 * @program: dolphin-admin
 * @description: 尺寸大小枚举
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/9
 */

export enum SizeEnum {
  DEFAULT = 'default',
  SMALL = 'small',
  LARGE = 'large',
}

export enum SizeNumberEnum {
  DEFAULT = 48,
  SMALL = 16,
  LARGE = 64,
}

export const sizeMap: Map<SizeEnum, SizeNumberEnum> = (() => {
  const map = new Map<SizeEnum, SizeNumberEnum>();
  map.set(SizeEnum.DEFAULT, SizeNumberEnum.DEFAULT);
  map.set(SizeEnum.SMALL, SizeNumberEnum.SMALL);
  map.set(SizeEnum.LARGE, SizeNumberEnum.LARGE);
  return map;
})();
