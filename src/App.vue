<template>
    <div class="flex w-screen h-screen text-gray-700">
        <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
            <!-- Siderbar -->
        </div>
        <div class="flex flex-col flex-grow">
            <!-- Main Content -->
            <editor-content :editor="editor" />
        </div>
    </div>
</template>

<script setup>
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [
    StarterKit,
  ],
})

</script>