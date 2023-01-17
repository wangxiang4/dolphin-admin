/**
 * @program: dolphin-admin
 * @description: 配置参数模块动态渲染配置
 * @author: entfrm开发团队-王翔
 * @create: 2022/4/21
 */
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { ColumnProps } from 'ant-design-vue/lib/table/interface';

/** 表格列配置 */
export const columns: ColumnProps[] = [
  {
    title: '参数名称',
    align: 'center',
    dataIndex: 'name',
    width: 200
  },
  {
    title: '参数键名',
    align: 'center',
    dataIndex: 'key'
  },
  {
    title: '参数键值',
    align: 'center',
    dataIndex: 'value'
  },
  {
    title: '系统内置',
    align: 'center',
    dataIndex: 'isSys',
    width: 130,
    customRender: ({record}) => {
      return record.isSys  == '0' ? h(Tag, { color: 'success' }, '是') : h(Tag, { color: 'red' }, '否');
    }
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remarks',
    customRender: ({record}) => {
      return record.remarks || h(Tag, {color: 'red'},'暂无数据');
    }
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime'
  },
  {
    width: 220,
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    slots: { customRender: 'action' },
    fixed: false
  }
];
