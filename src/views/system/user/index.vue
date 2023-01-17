<template>
  <PageWrapper contentClass="flex"
               contentFullHeight
               fixedHeight
               dense
  >
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect"/>
    <BasicTable class="w-3/4 xl:w-5/5"
                @register="registerTable"
                @selection-change="handleSelectionChange"
    >
      <template #toolbar>
        <a-button v-auth="['user_add']"
                  type="primary"
                  @click="handleAdd()"
        >新增用户</a-button>
        <a-button v-auth="['user_edit']"
                  type="primary"
                  :disabled="state.single"
                  @click="handleEdit()"
        >修改用户</a-button>
        <a-button v-auth="['user_del']"
                  type="primary"
                  :disabled="state.multiple"
                  @click="handleDel()"
        >删除用户</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            label: '重置密码',
            icon: 'fa6-brands:battle-net',
            auth: ['user_reset'],
            onClick: handleResetPassword.bind(null, record),
          },
          {
            label: '编辑',
            icon: 'fa6-regular:pen-to-square',
            auth: ['user_edit'],
            onClick: handleEdit.bind(null, record)
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: ['user_del'],
            onClick: handleDel.bind(null, record)
          }]"
        />
      </template>
    </BasicTable>
    <!--弹出窗体区域-->
    <UserModal @register="registerModal" @success="handleRefreshTable"/>
    <ResetPwdModal @register="registerResetPwdModal" @success="handleRefreshTable"/>
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
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listUser, delUser } from '/@/api/platform/system/controller/user';
  import ResetPwdModal from './ResetPwdModal.vue';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';
  import { useModal } from '/@/components/Modal';
  import UserModal from './UserModal.vue';
  import { columns, searchFormSchema } from './user.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  /** 类型规范统一声明定义区域 */
  interface TableState {
    ids: string[];
    single: boolean;
    multiple: boolean;
    searchInfo: Recordable;
  }

  export default defineComponent({
    name: 'UserManagement',
    components: {
      BasicTable,
      PageWrapper,
      DeptTree,
      TableAction,
      UserModal,
      ResetPwdModal
    },
    setup() {

      /** 通用变量统一声明区域 */
      const state = reactive<TableState>({
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 搜索信息
        searchInfo: {}
      });
      const { createConfirm, createMessage } = useMessage();
      const [registerModal, { openModal }] = useModal();
      const [registerResetPwdModal, { openModal: openResetPwdModal }] = useModal();
      const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
        title: '用户列表',
        api: listUser,
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
        searchInfo: state.searchInfo,
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
        openModal(true,{ _tag: 'add' });
      }

      /** 编辑按钮操作,行内编辑 */
      function handleEdit(record?: Recordable) {
        record = record || { id: toRaw(state.ids) };
        openModal(true, { _tag: 'edit', record });
      }

      /** 处理重置用户密码 */
      function handleResetPassword(record: Recordable) {
        record = record || { id: toRaw(state.ids) };
        openResetPwdModal(true, { record });
      }

      /** 删除按钮操作,行内删除 */
      async function handleDel(record?: Recordable) {
        const ids = record?.id || toRaw(state.ids);
        createConfirm({
          iconType: 'warning',
          title: '警告',
          content: `是否确认删除用户编号为${ids}用户吗?`,
          onOk: async () => {
            await delUser(ids);
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

      /** 处理部门管理点击 */
      function handleSelect(departId) {
        state.searchInfo.deptId = departId;
        handleRefreshTable();
      }

      return {
        state,
        registerTable,
        registerModal,
        registerResetPwdModal,
        handleAdd,
        handleEdit,
        handleDel,
        handleSelectionChange,
        handleRefreshTable,
        handleSelect,
        handleResetPassword
      };
    }
  });
</script>
