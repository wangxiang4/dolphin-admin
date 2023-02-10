<template>
  <div>
    <BasicTable @register="registerTable"
                @selection-change="handleSelectionChange"
    >
      <template #toolbar>
        <BasicUpload v-model:value="state.fileList"
                     v-auth="['file_upload']"
                     :maxSize="20"
                     :maxNumber="10"
                     :showPreviewNumber="false"
                     :emptyHidePreview="true"
                     :api="commonUpload"
                     :uploadParams="{
                       ossFile: {
                         duration: 150
                       }
                     }"
                     :accept="['image/*']"
                     multiple
                     @success="handleUploadSuccess"
        />
        <a-button v-auth="['file_del']"
                  type="primary"
                  :disabled="state.multiple"
                  @click="handleDel()"
        >删除</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '文件下载',
            icon: 'fa6-regular:circle-down',
            auth: ['file_download'],
            onClick: handleFileDownLoad.bind(null, record)
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: ['file_del'],
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
  import { listFile, delFile, getFile } from '/@/api/platform/system/controller/file';
  import { columns, searchFormSchema } from './file.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { commonUpload } from '/@/api/platform/core/controller/upload';
  import { BasicUpload } from '/@/components/Upload';

  /** 类型规范统一声明定义区域 */
  interface TableState {
    single: boolean;
    multiple: boolean;
    fileList: Recordable[];
  }

  /** 通用变量统一声明区域 */
  const state = reactive<TableState>({
    // 非单个禁用
    single: true,
    // 非多个禁用
    multiple: true,
    // 文件列表
    fileList: []
  });
  const { createConfirm, createMessage } = useMessage();
  const [registerTable, { reload, clearSelectedRowKeys, getSelectRowKeys }] = useTable({
    title: '文件列表',
    api: listFile,
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

  /** 处理上传成功回调 */
  function handleUploadSuccess(closeUploadModal: Fn) {
    state.fileList = [];
    closeUploadModal();
    handleRefreshTable();
  }

  /** 处理行内文件下载 */
  function handleFileDownLoad(record?: Recordable) {
    getFile(record?.bucketName, record?.fileName).then(() => createMessage.success(`${record?.fileName}文件下载成功!`));
  }

  /** 删除按钮操作,行内删除 */
  async function handleDel(record?: Recordable) {
    const ids = record?.id || getSelectRowKeys();
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: `是否确认删除文件编号为${ids}文件吗?`,
      onOk: async () => {
        await delFile(ids);
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
