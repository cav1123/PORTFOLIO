import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export interface Works {
  id: string
  title: string
  thumbnail: {
    url: string
  }
  tags: Array<{
    id: string
    name: string
  }>
  hasContent: boolean
  content: {
    html: string
  }
  isChecked: boolean
}

export const useWorksStore = defineStore('works', () => {
  const works = ref<Works[]>([])
  async function getWorks() {
    try {
      const response = await axios.get(`https://85hz3u9qwx.microcms.io/api/v1/works?limit=100`, {
        headers: { 'X-API-KEY': import.meta.env.VITE_API_KEY }
      })
      works.value = response.data.contents
      works.value = works.value.map((work) => {
        return { ...work, isChecked: false }
      })
    } catch (error) {
      console.log(error)
    }
  }
  // ゲッター：カウント
  const worksCount = computed(() => {
    const allTags = works.value.map((work) => work.tags.map((tag) => tag.name)).flat()
    const tagKeys = Array.from(new Set(allTags))
    const count = Object.fromEntries(
      tagKeys.map((key) => {
        const count = allTags.filter((tag) => tag === key).length
        return [key, count]
      })
    )
    return count
  })
  // フィルター
  const filteredWorks = ref<Works[]>([])
  function filterWorks(tagId: string) {
    filteredWorks.value = works.value.filter((work) => work.tags.some((tag) => tag.id === tagId))
  }
  // モーダル
  const featuredWork = ref<Works>({
    id: '',
    title: '',
    thumbnail: {
      url: ''
    },
    tags: [
      {
        id: '',
        name: ''
      }
    ],
    hasContent: false,
    content: {
      html: ''
    },
    isChecked: false
  })
  function featureWork(id: string) {
    featuredWork.value = works.value.filter((work) => work.id === id)[0]
  }
  // 履歴
  const checkedWorks = ref<Works[]>([])
  function addCheckedWorks(work: Works) {
    if (checkedWorks.value.some((checkedWork) => checkedWork.id === work.id)) return
    checkedWorks.value.unshift(work)
  }
  function setIsChecked(workId: string) {
    works.value = works.value.map((work) => {
      if (work.id === workId) {
        return { ...work, isChecked: true }
      } else return work
    })
    filteredWorks.value = filteredWorks.value.map((work) => {
      if (work.id === workId) {
        return { ...work, isChecked: true }
      } else return work
    })
  }

  return {
    works,
    getWorks,
    worksCount,
    filteredWorks,
    filterWorks,
    featuredWork,
    featureWork,
    checkedWorks,
    addCheckedWorks,
    setIsChecked
  }
})
