<template>
  <div>
    <BasicTable @register="registerTable"
                @selection-change="handleSelectionChange"
    >
      <template #toolbar>
        <a-button v-auth="['role_del']"
                  type="primary"
                  :disabled="state.multiple"
                  @click="handleDel()"
        >删除日志</a-button>
        <a-button v-auth="['operLog_del']"
                  type="primary"
                  @click="handleCleanOperLog()"
        >清空日志</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: ['client_del'],
            onClick: handleDel.bind(null, record)
          }]"
        />
      </template>
    </BasicTable>
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
  import { listOperLog, delOperLog, cleanOperLog } from '/@/api/platform/monitor/controller/operLog';
  import { columns, searchFormSchema } from './operLog.data';
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
  const [registerTable, { reload, clearSelectedRowKeys, getSelectRowKeys }] = useTable({
    title: '操作日志列表',
    api: listOperLog,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      fieldMapToTime: [['dateRange', ['beginTime', 'endTime'], 'YYYY-MM-DD']]
    },
    rowSelection: { type: 'checkbox' },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: false,
    tableSetting: {
      fullScreen: true
    },
    actionColumn: {
      width: 120,
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

  /** 删除按钮操作,行内删除 */
  async function handleDel(record?: Recordable) {
    const ids = record?.id || getSelectRowKeys();
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: `是否确认删除操作日志编号为${ids}操作日志吗?`,
      onOk: async () => {
        await delOperLog(ids);
        createMessage.success('删除成功!');
        handleRefreshTable();
      }
    });
  }

  /** 清空日志按钮操作 */
  async function handleCleanOperLog() {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否确认清空全部操作日志?',
      onOk: async () => {
        await cleanOperLog();
        createMessage.success('清除成功!');
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
