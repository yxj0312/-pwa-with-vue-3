import { createApp } from 'vue'
import App from './App.vue'
import './app.css'
import './registerServiceWorker'
import { Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            editor: null,
            database: null,
            notes: [],
            activeNote: {},
            isOffline: !navigator.onLine
        }
    },
    mutations: {
        updateEditor(state, editor) {
            state.editor = editor
        },
        updateDatabase(state, database) {
            state.database = database
        },
        updateNotes(state, notes) {
            state.notes = notes
        },
        updateActiveNote(state, note) {
            state.activeNote = note
        },
        updateIsOffline(state, isOffline) {
            state.isOffline = isOffline
        }
    },
    actions: {
        init({ dispatch }) {
            dispatch('initDatabase').then(() => {
                dispatch('initEditor');
                dispatch('initNotes')
            }).catch((e) => {
                console.error(e)
            })
        },
        initDatabase({ commit }) {
            return new Promise((resolve, reject) => {
                // initialize the database
                let db = window.indexedDB.open("notes", 2);

                db.onerror = () => {
                    reject('Error opening the database.');
                };

                db.onsuccess = e => {
                    console.log('db.onsuccess', e);
                    commit('updateDatabase', e.target.result);
                    resolve('Test');
                };

                db.onupgradeneeded = e => {
                    console.log('db.onupgradeneeded', e);

                    if (e.oldVersion === 1) {
                        e.target.result.deleteObjectStore("notes");
                    }
                    e.target.result.createObjectStore("notes", { keyPath: "created" });
                };
            });
        },
        initEditor({ commit }) {
            let editor = new Editor({
                content: "",
                extensions: [StarterKit],
                editorProps: {
                  attributes: {
                    class: "prose my-6 mx-auto focus:outline-none",
                  },
                },
              });

            commit('updateEditor', editor);
        },
        initNotes({ commit, state }) {
            state.database.transaction('notes')
                .objectStore('notes')
                .getAll()
                .onsuccess = e => {
                    commit('updateNotes', e.target.result.reverse());
                };
        },
        saveNote({ commit, state }) {
            let noteStore = state.database.transaction('notes', 'readwrite')
                .objectStore('notes');
            let noteRequest = noteStore.get(state.activeNote.created);

            noteRequest.onerror = () => {
                console.error('Error saving the note in the database.');
            };

            noteRequest.onsuccess = e => {
                let note = e.target.result;
                note.content = state.editor.getHTML();

                let updateRequest = noteStore.put(note);

                updateRequest.onerror = () => {
                    console.error('Error storing the updated note in the database.');
                };

                updateRequest.onsuccess = () => {
                    let notes = state.notes;
                    let noteIndex = notes.findIndex(n => n.created === note.created);
                    notes[noteIndex] = note;

                    commit('updateNotes', notes);
                };
            };
        },
        addNewNote({ commit, state }) {
            let transaction = state.database.transaction('notes', 'readwrite');

            let now = new Date();
            let note = {
                content: '',
                created: now.getTime()
            };

            let notes = state.notes;
            notes.unshift(note);
            commit('updateNotes', notes);

            commit('updateActiveNote', note);

            transaction.objectStore('notes').add(note);
        },
        destroyEditor({ commit, state }) {
            state.editor.destroy();
            commit('updateEditor', null);
        }
    }
})

const app = createApp(App)

app.use(store)

app.mount('#app')

store.dispatch('init')