import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export interface Tags {
  id: string
  name: string
  type: Array<string>
}

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<Tags[]>([])
  async function getTags() {
    try {
      const response = await axios.get('https://85hz3u9qwx.microcms.io/api/v1/tags?limit=100', {
        headers: { 'X-API-KEY': import.meta.env.VITE_API_KEY }
      })
      tags.value = response.data.contents
    } catch (error) {
      console.log(error)
    }
  }
  const jobs = computed(() => tags.value.filter((tag) => tag.type[0] === 'JOB'))
  const tools = computed(() => tags.value.filter((tag) => tag.type[0] === 'TOOL'))
  const contents = computed(() => tags.value.filter((tag) => tag.type[0] === 'CONTENT'))
  const carts = computed(() => tags.value.filter((tag) => tag.type[0] === 'CART'))
  const selectedTag = ref<Tags>({
    id: '',
    name: 'ALL',
    type: []
  })
  function selectTag(tagId: string) {
    if (tagId === '') {
      selectedTag.value = {
        id: '',
        name: 'ALL',
        type: []
      }
      return
    }
    selectedTag.value = tags.value.filter((tag) => tag.id === tagId)[0]
  }
  return { tags, getTags, jobs, tools, contents, carts, selectedTag, selectTag }
})
