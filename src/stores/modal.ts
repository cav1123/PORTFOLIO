import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const modal = ref(false)
  function showModal() {
    modal.value = true
  }
  function closeModal() {
    modal.value = false
  }

  return { modal, showModal, closeModal }
})
