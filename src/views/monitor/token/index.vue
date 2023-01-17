<template>
  <div>
    <BasicTable @register="registerTable">
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
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listToken, delToken } from '/@/api/platform/monitor/controller/token';
  import { columns } from './token.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createConfirm, createMessage } = useMessage();
  const [registerTable, { reload }] = useTable({
    title: '令牌列表',
    api: listToken,
    columns,
    showTableSetting: true,
    bordered: true,
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
    }
  });

  /** 删除按钮操作,行内删除 */
  async function handleDel(record?: Recordable) {
    const access_token = record?.access_token;
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: `是否强制${access_token}下线?`,
      onOk: async () => {
        await delToken(access_token);
        createMessage.success('下线成功!');
        handleRefreshTable();
      }
    });
  }

  /** 处理表格刷新 */
  function handleRefreshTable() {
    reload();
  }
</script>
