<template>
  <div ref="wrap">
    <slot/>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { MaybeElementRef, onClickOutside } from '@vueuse/core';
  export default defineComponent({
    name: 'ClickOutSide',
    emits: ['mounted', 'clickOutside'],
    setup(_, { emit }) {
      const wrap = ref<ElRef>(null);

      onClickOutside(wrap as MaybeElementRef, () => {
        emit('clickOutside');
      });

      onMounted(() => {
        emit('mounted');
      });

      return { wrap };
    },
  });
</script>
