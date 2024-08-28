import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCssStore = defineStore('css', () => {
  const chipButton = ref({
    backgroundColor: ''
  })
  function updateColor() {
    const max = 360
    const min = 0
    const h = Math.floor(Math.random() * (max - min) + min)
    const s = '80%'
    const l = '80%'
    const hsl = `hsl(${h}, ${s}, ${l})`
    chipButton.value.backgroundColor = hsl
  }

  return { chipButton, updateColor }
})
