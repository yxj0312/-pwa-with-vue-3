<template>

  <div class="flex w-screen h-screen text-gray-700">
    <div class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100">
      <!-- Siderbar -->

      <div class="h-0 overflow-auto flex-grow">
        <div class="mt-4">
          <a href="#" class="flex item-center h-8 text-sm pl-8 pr-3" v-for="note in notes" :key="note.created"
          @click.prevent="openNote(note)">
            <span class="ml-2 leading-none">{{ new Date(note.created).toLocaleString() }}</span>
          </a>
        </div>
      </div>

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
</script>

<script>
export default {
  data: () => ({
    database: null,
    notes: [],
  }),

  methods: {
    async getDatabase() {
      return new Promise((resolve, reject) => {
        if (this.database) {
          resolve(this.database)
        }
        let request = window.indexedDB.open('notes', 2)
        request.onerror = event => {
          console.error('ERROR: Unable to open database', event)
          reject('Error')
        }
        request.onsuccess = event => {
          this.database = event.target.result
          resolve(this.database)
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
    },

    async saveNote() {
      return new Promise((resolve, reject) => {
        let transaction = this.database.transaction('notes', 'readwrite')
        transaction.oncomplete = () => {
          resolve();
        }
        transaction.onerror = () => {
          reject('Error')
        }

        let now = new Date();

        let note = {
          content: this.editor.getHTML(),
          created: now.getTime()
        }
        
        this.notes.unshift(note)
        
        transaction.objectStore('notes').add(note)
      })
    },

    async getNotes  () {
  // this.database = await this.getDatabase()
  return new Promise((resolve) => {
    this.database.transaction('notes', 'readonly').
    objectStore('notes')
    .getAll()
    .onsuccess = e => {
      resolve(e.target.result)
    }
  })
  },

  openNote(note) {
    this.editor.commands.setContent(note.content)
  }

  },

  async created() {
    this.database = await this.getDatabase()
    let notes = await this.getNotes()
    this.notes = notes.reverse()
  }

}
</script>