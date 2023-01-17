/**
 * @program: dolphin-admin
 * @description: 样式设计工具
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/10
 */

import { useAppProviderContext } from '/@/components/Application';

export function useDesign(scope: string) {
  const values = useAppProviderContext();
  return {
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
  };
}
