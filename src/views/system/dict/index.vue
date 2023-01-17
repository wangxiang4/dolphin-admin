<template>
  <PageWrapper dense
               fixedHeight
               contentFullHeight
               contentClass="flex"
  >
    <BasicTable class="w-2/4 xl:w-2/4"
                @register="registerTable"
                @selection-change="handleSelectionChange"
                @row-click="handleClickSubTable"
    >
      <template #toolbar>
        <a-button v-auth="['dict_add']"
                  type="primary"
                  @click="handleAdd()"
        >新增字典</a-button>
        <a-button v-auth="['dict_edit']"
                  type="primary"
                  :disabled="state.single"
                  @click="handleEdit()"
        >修改字典</a-button>
        <a-button v-auth="['dict_del']"
                  type="primary"
                  :disabled="state.multiple"
                  @click="handleDel()"
        >删除字典</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '编辑',
            icon: 'fa6-regular:pen-to-square',
            auth: ['dict_edit'],
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            auth: ['dict_del'],
            color: 'error',
            onClick: handleDel.bind(null, record)
          }]"
        />
      </template>
    </BasicTable>
    <DictDataTable ref="dictSubRef" class="w-2/4 xl:w-2/4"/>
    <!--弹出窗体区域-->
    <DictModal @register="registerModal" @success="handleRefreshTable"/>
  </PageWrapper>
</template>
<script lang="ts">
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用vben-动态表格表单封装组件编写,不采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { defineComponent, reactive, ref, toRaw } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema} from './dict.data';
  import { listDict, delDict } from '/@/api/platform/system/controller/dict';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import DictModal from './DictModal.vue';
  import DictDataTable from './DictDataTable.vue';

  /** 类型规范统一声明定义区域 */
  interface TableState {
    single: boolean;
    multiple: boolean;
  }

  export default defineComponent({
    name: 'DictManagement',
    components: { BasicTable, PageWrapper, DictModal, DictDataTable, TableAction },
    setup() {

      /** 通用变量统一声明区域 */
      const dictSubRef = ref();
      const state = reactive<TableState>({
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true
      });
      const { createConfirm, createMessage } = useMessage();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload, clearSelectedRowKeys, getSelectRows }] = useTable({
        title: '字典列表',
        api: listDict,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 80,
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
        state.single = rowSelection.length != 1;
        state.multiple = !rowSelection.length;
      }

      /** 新增按钮操作,行内新增与工具栏局域新增通用 */
      function handleAdd() {
        openModal(true,{ _tag: 'add' });
      }

      /** 编辑按钮操作,行内编辑 */
      function handleEdit(record?: Recordable) {
        record = record || { id: getSelectRows().map(item => item.id) };
        openModal(true, { _tag: 'edit', record });
      }

      /** 删除按钮操作,行内删除 */
      async function handleDel(record?: Recordable) {
        const types = record?.type || getSelectRows().map(item => item.type);
        createConfirm({
          iconType: 'warning',
          title: '警告',
          content: `是否确认删除字典类型为${types}字典吗?`,
          onOk: async () => {
            await delDict(types);
            createMessage.success('删除成功!');
            handleRefreshTable();
          }
        });
      }

      /** 处理点击字典子表 */
      function handleClickSubTable(record: Recordable) {
        dictSubRef.value.filterByDictType(record?.type);
      }

      /** 处理表格刷新 */
      function handleRefreshTable() {
        clearSelectedRowKeys();
        dictSubRef.value.handleRefreshTable();
        reload();
      }

      return {
        state,
        registerTable,
        registerModal,
        dictSubRef,
        handleClickSubTable,
        handleAdd,
        handleEdit,
        handleDel,
        handleRefreshTable,
        handleSelectionChange
      };
    }
  });
</script>
