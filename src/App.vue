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
      <div class="h-16 bg-gray-100 border-t border-gray-300 text-right">
        <button @click="saveNote()" class="border-t bg-blue-400 text-white">Save Note</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
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
      // database.deleteObjectStore('notes')
      database.createObjectStore('notes', {
        // autoIncrement: true,
        keyPath: 'created'
      })
    }
  })
}

const saveNote = async () => {
  return new Promise((resolve, reject) => {
    let transaction = database.transaction('notes', 'readwrite')
    transaction.oncomplete = e => {
      resolve();
      console.log(e)
    }
    transaction.onerror = e => {
      console.log(e.target.result)
      reject('Error')
    }


    let now = new Date();
    transaction.objectStore('notes').add({
      content: editor.value.getHTML(),
      created: now.getTime()
    })
  })
  
}

getDatabase();

</script>