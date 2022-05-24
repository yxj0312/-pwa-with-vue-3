<template>
  <div class="flex flex-col flex-grow">
    <div class="flex flex-col flex-grow overflow-auto">
      <editor-content :editor="editor" />
    </div>
    <div class="h-16 bg-gray-100 border-t border-gray-300 text-right">
      <button class="save-note" @click="$store.dispatch('saveNote')">Save Note</button>
    </div>
  </div>
</template>
<script>
import { EditorContent } from "@tiptap/vue-3";
export default {
  components: {
    EditorContent,
  },
  computed: {
      editor() {
          return this.$store.state.editor;
      }
  }
};
</script> 