<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree title="部门列表"
               toolbar
               search
               :clickRowToExpand="false"
               :treeData="treeData"
               :replaceFields="{ key: 'deptId', title: 'name' }"
               @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  /**
   * 提供模板规范代码参考,请尽量保证编写代码风格跟模板规范代码一致
   * 采用vben-树形选择封装组件编写,不采用 setup 写法
   * Copyright © 2020-2022 <a href="http://www.entfrm.com/">entfrm</a> All rights reserved.
   * author entfrm开发团队-王翔
   */
  import { defineComponent, onMounted, ref } from 'vue';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { listDept } from '/@/api/platform/system/controller/dept';
  import { listToTree } from '/@/utils/helper/treeHelper';

  export default defineComponent({
    name: 'DeptTree',
    components: { BasicTree },
    emits: ['select'],
    setup(props, { emit }) {

      /** 通用变量统一声明区域 */
      const treeData = ref<TreeItem[]>([]);

      /** 生命周期钩子回调处理区域 */
      onMounted(() => handleFetch());

      /** 处理获取树形数据 */
      async function handleFetch() {
        treeData.value = listToTree(await listDept(), { id: 'deptId' });
      }

      /** 处理树形选择 */
      function handleSelect(selectedKeys: string) {
        emit('select', selectedKeys[0]);
      }

      return {
        treeData,
        handleSelect
      };
    }
  });
</script>
