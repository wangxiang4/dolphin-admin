<template>
  <div>
    <BasicTable @register="registerTable"
                @expand="onExpandClick"
    >
      <template #toolbar>
        <a-button type="primary"
                  @click="handleAdd()"
        >新增区域</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '编辑',
            icon: 'fa6-regular:pen-to-square',
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '新增',
            icon: 'ant-design:plus-circle-outlined',
            onClick: handleAdd.bind(null, record)
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            color: 'error',
            popConfirm: {
              title: '是否确认删除',
              confirm: handleDel.bind(null, record)
            }
          }]"
        />
      </template>
    </BasicTable>
    <RegionModal @register="registerModal" @success="handleRefreshTable"/>
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
  import { useModal } from '/@/components/Modal';
  import RegionModal from './RegionModal.vue';
  import { columns, searchFormSchema } from './region.data';
  import { delRegion, lazyListRegion } from '/@/api/platform/system/controller/region';
  import { useMessage } from '/@/hooks/web/useMessage';

  /** 通用变量统一声明区域 */
  const { createMessage } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, setLoading, collapseAll }] = useTable({
    title: '区域列表',
    api: lazyListRegion,
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
    searchInfo: { parentId: '0' },
    handleSearchInfoFn: () => collapseAll()
  });

  /** 处理点击展示子集数据 */
  function onExpandClick(expanded, info) {
    if (expanded) {
      setLoading(true);
      lazyListRegion({ parentId: info.id }).then(res => {
        info.children = res;
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }

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
    await delRegion(record.id);
    createMessage.success('删除成功!');
    handleRefreshTable();
  }

  /** 处理表格刷新 */
  function handleRefreshTable() {
    reload();
    collapseAll();
  }

</script>
