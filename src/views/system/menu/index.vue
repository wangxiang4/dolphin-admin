<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="['menu_add']"
                  type="primary"
                  @click="handleAdd()"
        >新增菜单</a-button>
        <a-button type="default"
                  @click="expandAll"
        >展开全部</a-button>
        <a-button type="default"
                  @click="collapseAll"
        >折叠全部</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '编辑',
            icon: 'fa6-regular:pen-to-square',
            auth: ['menu_edit'],
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '新增',
            icon: 'ant-design:plus-circle-outlined',
            auth: ['menu_add'],
            onClick: handleAdd.bind(null, record)
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            auth: ['menu_del'],
            color: 'error',
            popConfirm: {
              title: '是否确认删除',
              confirm: handleDel.bind(null, record)
            }
          }]"
        />
      </template>
    </BasicTable>
    <MenuModal @register="registerModal" @success="handleRefreshTable"/>
  </div>
</template>
<script lang="ts" setup>
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用vben-动态表格表单封装组件编写,采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listMenu, delMenu } from '/@/api/platform/system/controller/menu';
  import { useModal } from '/@/components/Modal';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { columns, searchFormSchema } from './menu.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import MenuModal from './MenuModal.vue';

  /** 通用变量统一声明区域 */
  const { createMessage } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, expandAll, collapseAll }] = useTable({
    title: '菜单列表',
    api: listMenu,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      fieldMapToTime: [['dateRange', ['beginTime', 'endTime'], 'YYYY-MM-DD']]
    },
    isTreeTable: true,
    pagination: false,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 250,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: false
    },
    afterFetch: (result) => listToTree(result)
  });

  /** 新增按钮操作,行内新增与工具栏局域新增通用 */
  function handleAdd(record?: Recordable) {
    openModal(true,{ _tag: 'add', record });
  }

  /** 编辑按钮操作,行内编辑 */
  function handleEdit(record: Recordable) {
    openModal(true, { _tag: 'edit', record });
  }

  /** 删除按钮操作,行内删除 */
  async function handleDel(record: Recordable) {
    await delMenu(record.id);
    createMessage.success('删除成功!');
    handleRefreshTable();
  }

  /** 处理表格刷新 */
  function handleRefreshTable() {
    reload();
  }

</script>
