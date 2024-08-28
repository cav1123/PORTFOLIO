import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menu = ref(false)
  function showMenu() {
    menu.value = true
  }
  function closeMenu() {
    menu.value = false
  }

  return { menu, showMenu, closeMenu }
})
