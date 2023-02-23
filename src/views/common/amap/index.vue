<template>
  <AMapDesigner ref="aMapDesigner"
                :toolbar="state.toolbar"
                :siderWidth="300"
                :sidebarControl="true"
                @success="handleSubmit"
  />
</template>

<script lang="ts" setup>
  import { AMapDesigner } from '/@/components/AMap';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  interface MState {
    toolbar: string[];
  }

  const state = reactive<MState>({
    toolbar: ['save', 'zoomIn', 'zoomOut', 'reset']
  });

  async function handleSubmit() {
    createMessage.success("保存成功!")
  }

</script>
