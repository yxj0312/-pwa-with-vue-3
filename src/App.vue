<template>
    <div class="flex w-screen h-screen text-gray-700">
        <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
            <!-- Siderbar -->
        </div>
        <div class="flex flex-col flex-grow">
            <!-- Main Content -->
            <div class="flex flex-col flex-grow overflow-auto">
                <editor-content :editor="editor" />
            </div>
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
  editorProps: {
      attributes: {
          class: "prose my-6 mx-auto focus:outline-one"
      }
  }
})

let database = null

const getDatabase = async () => {
      return new Promise((resolve, reject) => {
        if (database) {
          resolve(database)
        }
        let request = window.indexedDB.open('notes', 2)
        request.onerror = event => {
          console.error('ERROR: Unable to open database', event)
          reject('Error')
        }
        request.onsuccess = event => {
          database = event.target.result
          resolve(database)
        }

        request.onupgradeneeded = event => {
          let database = event.target.result
          database.createObjectStore('notes', {
            autoIncrement: true,
            keyPath: 'id'
          })
        }
      })
    }

    getDatabase();

</script>