<template>
  <PageWrapper dense
               contentFullHeight
               fixedHeight
               contentClass="flex"
  >
    <BasicTable @register="registerTable"
                @selection-change="handleSelectionChange"
    >
      <template #tableTitle>
        <ATag color="red"
              style="font-size: 14px;font-weight: 700;"
        >>>字典数据列表[{{ state.dictType }}]</ATag>
      </template>
      <template #toolbar>
        <a-button v-auth="['dictData_add']"
                  type="primary"
                  :disabled="!state.dictType"
                  @click="handleAdd()"
        >新增字典数据</a-button>
        <a-button v-auth="['dictData_edit']"
                  type="primary"
                  :disabled="state.single"
                  @click="handleEdit()"
        >修改字典数据</a-button>
        <a-button v-auth="['dictData_del']"
                  type="primary"
                  :disabled="state.multiple"
                  @click="handleDel()"
        >删除字典数据</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '编辑',
            icon: 'fa6-regular:pen-to-square',
            auth: ['dictData_edit'],
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            auth: ['dictData_del'],
            color: 'error',
            onClick: handleDel.bind(null, record)
          }]"
        />
      </template>
    </BasicTable>
    <DictDataModal @register="registerModal" @success="handleRefreshTable"/>
  </PageWrapper>
</template>
<script lang="ts">
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用vben-动态表格表单封装组件编写,不采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { defineComponent, reactive, toRaw } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './dictdata.data';
  import { listDictData, delDictData } from '/@/api/platform/system/controller/dictdata';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import DictDataModal from './DictDataModal.vue';
  import { Tag } from 'ant-design-vue';

  /** 类型规范统一声明定义区域 */
  interface TableState {
    dictType: string;
    single: boolean;
    multiple: boolean;
  }

  export default defineComponent({
    name: 'DictDataManagement',
    components: { BasicTable, PageWrapper, DictDataModal, TableAction, ATag: Tag },
    setup() {

      /** 通用变量统一声明区域 */
      const state = reactive<TableState>({
        // 父表字典类型
        dictType: '',
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true
      });
      const { createConfirm, createMessage } = useMessage();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload, clearSelectedRowKeys, getSelectRowKeys, getForm, setProps }] = useTable({
        api: listDictData,
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

      /** 根据字典类型查找字典数据 */
      function filterByDictType(dictType: string) {
        state.dictType = dictType;
        getForm().setFieldsValue({ dictType });
        setProps({ searchInfo: { dictType } });
        reload();
      }

      /** 处理多选框选中数据 */
      function handleSelectionChange(selection?: Recordable) {
        const rowSelection = toRaw(selection?.keys) || [];
        state.single = rowSelection.length != 1;
        state.multiple = !rowSelection.length;
      }

      /** 新增按钮操作,行内新增与工具栏局域新增通用 */
      function handleAdd() {
        openModal(true,{ _tag: 'add', dictType: state.dictType });
      }

      /** 编辑按钮操作,行内编辑 */
      function handleEdit(record?: Recordable) {
        record = record || { id: getSelectRowKeys() };
        openModal(true, { _tag: 'edit', record, dictType: state.dictType });
      }

      /** 删除按钮操作,行内删除 */
      async function handleDel(record?: Recordable) {
        const ids = record?.id || getSelectRowKeys();
        createConfirm({
          iconType: 'warning',
          title: '警告',
          content: `是否确认删除字典数据编号为${ids}字典数据吗?`,
          onOk: async () => {
            await delDictData(ids);
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

      return {
        state,
        registerTable,
        registerModal,
        handleAdd,
        handleEdit,
        handleDel,
        handleRefreshTable,
        filterByDictType,
        handleSelectionChange
      };
    }
  });
</script>
