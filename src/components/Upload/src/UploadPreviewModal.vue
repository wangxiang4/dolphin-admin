<template>
  <BasicModal
    width="800px"
    :title="t('component.upload.preview')"
    class="upload-preview-modal"
    v-bind="$attrs"
    :showOkBtn="false"
    @register="register"
  >
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn"/>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, watch, ref } from 'vue';
  import FileList from './FileList.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { previewProps } from './props';
  import { FileBasicColumn, PreviewFileItem } from './typing';
  import { downloadByUrl } from '/@/utils/file/download';
  import { createPreviewColumns, createPreviewActionColumn } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isArray } from '/@/utils/is';
  import { useGlobSetting } from '/@/hooks/setting';
  const { apiUrl } = useGlobSetting();

  export default defineComponent({
    components: { BasicModal, FileList },
    props: previewProps,
    emits: ['list-change', 'register', 'delete'],
    setup(props, { emit }) {
      const [register, { closeModal }] = useModalInner();
      const { t } = useI18n();

      const fileListRef = ref<PreviewFileItem[]>([]);
      watch(
        () => props.value,
        (value) => {
          if (!isArray(value)) value = [];
          fileListRef.value = value
              .filter((item) => !!item)
              .map((item) => {
                return {
                  url: item,
                  type: item.split('.').pop() || '',
                  name: item.split('/').pop() || '',
                };
              });
        },
        { immediate: true },
      );

      // 删除
      function handleRemove(record: PreviewFileItem) {
        const index = fileListRef.value.findIndex((item) => item.url === record.url);
        if (index !== -1) {
          const removed = fileListRef.value.splice(index, 1);
          emit('delete', removed[0].url);
          emit(
              'list-change',
              fileListRef.value.map((item) => item.url),
          );
        }
      }

      // 下载
      function handleDownload(record: PreviewFileItem) {
        const { url = '' } = record;
        downloadByUrl({ url: `${apiUrl}${url}` });
      }

      return {
        t,
        register,
        closeModal,
        fileListRef,
        columns: createPreviewColumns() as FileBasicColumn[],
        actionColumn: createPreviewActionColumn({ handleRemove, handleDownload }) as FileBasicColumn,
      };
    },
  });
</script>
<style lang="less">
.upload-preview-modal {
  .ant-upload-list {
    display: none;
  }

  .ant-table-wrapper .ant-spin-nested-loading {
    padding: 0;
  }
}
</style>
