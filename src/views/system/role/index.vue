<template>
  <div>
    <BasicTable @register="registerTable"
                @selection-change="handleSelectionChange"
    >
      <template #toolbar>
        <a-button v-auth="['role_add']"
                  type="primary"
                  @click="handleAdd()"
        >新增角色</a-button>
        <a-button v-auth="['role_edit']"
                  type="primary"
                  :disabled="state.single"
                  @click="handleEdit()"
        >修改角色</a-button>
        <a-button v-auth="['role_del']"
                  type="primary"
                  :disabled="state.multiple"
                  @click="handleDel()"
        >删除角色</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '编辑',
            icon: 'fa6-regular:pen-to-square',
            auth: ['role_edit'],
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            auth: ['role_del'],
            color: 'error',
            onClick: handleDel.bind(null, record)
          }]"
        />
      </template>
    </BasicTable>
    <!--弹出窗体区域-->
    <RoleDrawer @register="registerDrawer" @success="handleRefreshTable"/>
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
  import { listRole, delRole } from '/@/api/platform/system/controller/role';
  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';
  import { columns, searchFormSchema } from './role.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, toRaw } from 'vue';

  /** 类型规范统一声明定义区域 */
  interface TableState {
    ids: string[];
    single: boolean;
    multiple: boolean;
  }

  /** 通用变量统一声明区域 */
  const state = reactive<TableState>({
    // 选中数组
    ids: [],
    // 非单个禁用
    single: true,
    // 非多个禁用
    multiple: true
  });
  const { createConfirm, createMessage } = useMessage();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
    title: '角色列表',
    api: listRole,
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
    showIndexColumn: false,
    clickToRowSelect: false,
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
    state.ids = rowSelection;
    state.single = rowSelection.length != 1;
    state.multiple = !rowSelection.length;
  }

  /** 新增按钮操作,行内新增与工具栏局域新增通用 */
  function handleAdd() {
    openDrawer(true,{ _tag: 'add' });
  }

  /** 编辑按钮操作,行内编辑 */
  function handleEdit(record?: Recordable) {
    record = record || { id: toRaw(state.ids) };
    openDrawer(true, { _tag: 'edit', record });
  }

  /** 删除按钮操作,行内删除 */
  async function handleDel(record?: Recordable) {
    const ids = record?.id || toRaw(state.ids);
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: `是否确认删除角色编号为${ids}角色吗?`,
      onOk: async () => {
        await delRole(ids);
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
