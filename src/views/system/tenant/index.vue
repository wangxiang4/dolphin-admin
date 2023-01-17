<template>
  <div>
    <BasicTable @register="registerTable"
                @selection-change="handleSelectionChange"
    >
      <template #toolbar>
        <a-button v-auth="['tenant_add']"
                  type="primary"
                  @click="handleAdd()"
        >新增多租户</a-button>
        <a-button v-auth="['tenant_edit']"
                  type="primary"
                  :disabled="state.single"
                  @click="handleEdit()"
        >修改多租户</a-button>
        <a-button v-auth="['tenant_del']"
                  type="primary"
                  :disabled="state.multiple"
                  @click="handleDel()"
        >删除多租户</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '编辑',
            icon: 'fa6-regular:pen-to-square',
            auth: ['tenant_edit'],
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: ['tenant_del'],
            onClick: handleDel.bind(null, record)
          }]"
        />
      </template>
    </BasicTable>
    <!--弹出窗体区域-->
    <TenantModal @register="registerModal" @success="handleRefreshTable"/>
  </div>
</template>

<script lang="ts" setup>
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用vben-动态表格表单封装组件编写,采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { reactive, toRaw } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listTenant, delTenant } from '/@/api/platform/system/controller/tenant';
  import { useModal } from '/@/components/Modal';
  import TenantModal from './TenantModal.vue';
  import { columns, searchFormSchema } from './tenant.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  /** 类型规范统一声明定义区域 */
  interface TableState {
    single: boolean;
    multiple: boolean;
  }

  /** 通用变量统一声明区域 */
  const state = reactive<TableState>({
    // 非单个禁用
    single: true,
    // 非多个禁用
    multiple: true
  });
  const { createConfirm, createMessage } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, clearSelectedRowKeys, getSelectRowKeys }] = useTable({
    title: '多租户列表',
    api: listTenant,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true
    },
    rowSelection: { type: 'checkbox' },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: false,
    actionColumn: {
      width: 220,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: false
    },
    handleSearchInfoFn: () => clearSelectedRowKeys()
  });

  /** 处理多选框选中数据 */
  function handleSelectionChange(selection?: Recordable) {
    const rowSelection = toRaw(selection?.keys) || [];
    state.single = rowSelection.length != 1;
    state.multiple = !rowSelection.length;
  }

  /** 新增按钮操作,行内新增与工具栏局域新增通用 */
  function handleAdd() {
    openModal(true,{ _tag: 'add' });
  }

  /** 编辑按钮操作,行内编辑 */
  function handleEdit(record?: Recordable) {
    record = record || { id: getSelectRowKeys() };
    openModal(true, { _tag: 'edit', record });
  }

  /** 删除按钮操作,行内删除 */
  async function handleDel(record?: Recordable) {
    const ids = record?.id || getSelectRowKeys();
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: `是否确认删除多租户编号为${ids}多租户吗?`,
      onOk: async () => {
        await delTenant(ids);
        createMessage.success('删除成功!');
        handleRefreshTable();
      }
    });
  }

  /** 处理表格刷新 */
  function handleRefreshTable() {
    clearSelectedRowKeys();
    reload();
  }

</script>
