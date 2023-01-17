/**
 * @program: dolphin-admin
 * @description: 通用定义
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

declare type RefType<T> = T | null;

declare type LabelValueOptions = {
  label: string;
  value: any;
  [key: string]: string | number | boolean;
}[];

declare type EmitType = (event: string, ...args: any[]) => void;

declare type TargetContext = '_self' | '_blank';

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

/** 弹窗传递数据通用类型定义 */
declare type  WindowInnerData = {
  // 操作标签
  _tag: string;
  // 表格记录行数
  record?: Recordable;
  [key: string]: any;
};

