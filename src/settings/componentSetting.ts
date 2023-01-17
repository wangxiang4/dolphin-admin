/**
 * @program: dolphin-admin
 * @description: 用于配置部分组件的通用配置，无需修改组件
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/7
 */
import type { SorterResult } from '../components/Table';
import { buildUUID } from '/@/utils/uuid';
import { useGlobSetting } from '/@/hooks/setting';
const { apiUrl } = useGlobSetting();

export default {
  // 基本表设置
  table: {
    // 表单接口请求通用配置
    fetchSetting: {
      // 传给后台的当前页面的字段名
      pageField: 'current',
      // 后台显示的每页的数字字段名称
      sizeField: 'size',
      // 接口返回的表单数据的字段名
      listField: 'data',
      // 接口字段名返回的表总数
      totalField: 'total',
    },
    // 可选择的页数
    pageSizeOptions: ['10', '20', '50', '100'],
    // 一页默认显示数量
    defaultPageSize: 10,
    // 自定义通用排序功能
    defaultSortFn: (sortInfo: SorterResult) => {
      const { field, order } = sortInfo;
      return {
        // 传递给后端的排序字段
        field,
        // 传递给后台的排序方法 asc/desc
        order,
      };
    },
    // 自定义通用过滤功能
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
      return data;
    },
  },
  // 滚动条设置
  scrollbar: {
    // 是否使用原生滚动条
    // 打开后menu、modal、drawer都会将弹出的滚动条改为native
    native: false,
  },
  // 地图设计器设置
  mapDesigner: {
    // 默认中心点
    mapCenter: '112.919043, 28.288623',
    // 默认缩放
    defaultZoom: 17,
    // sse后端地址
    sseUrl: `${apiUrl}/common_proxy/common/mapLogisticSse/subscribe?clientId=${buildUUID()}`
  }
};
