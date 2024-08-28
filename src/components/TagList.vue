<script setup lang="ts">
import { storeToRefs } from 'pinia';
// works
import { useWorksStore } from "@/stores/works"
const worksStore = useWorksStore()
const { worksCount } = storeToRefs(worksStore)
const { filterWorks } = worksStore
// tags
import { type Tags, useTagsStore } from "@/stores/tags"
const tagsStore = useTagsStore()
const { selectedTag } = storeToRefs(tagsStore)
const { selectTag } = tagsStore
// フィルター
function updateWorks(tagId: string) {
  filterWorks(tagId)
  selectTag(tagId)
  closeMenu()
}
// メニュー
import { useMenuStore } from '@/stores/menu';
const menuStore = useMenuStore()
const { closeMenu } = menuStore
// CSS
import { useCssStore } from '@/stores/css';
const cssStore = useCssStore()
const { chipButton } = storeToRefs(cssStore)
const { updateColor } = cssStore
// プロパティ
import { defineProps } from 'vue';
const { labelIcon, labelValue, tags, chipLg } = defineProps({ labelIcon: String, labelValue: String, tags: Array as () => Tags[], chipLg: Boolean })
</script>

<template>
  <div class="tags-list-container">
    <div class="d-flex align-items-center ga-sm">
      <span class="material-symbols-rounded icon-sm">{{ labelIcon }}</span>
      <span class="font-family-en font-line-height-trim">{{ labelValue }}</span>
    </div>
    <ul class="tags-list">
      <li v-for="tag in tags" :key="tag.id">
        <button @click="updateWorks(tag.id)" class="chip chip-button"
          :class="{ 'chip-lg': chipLg, active: selectedTag.id === tag.id }" @mouseenter="updateColor()">
          <span class="chip-name">{{ tag.name }}</span>
          <span class="chip-count">{{ worksCount[tag.name] }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tags-list-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip-button::after {
  background-color: v-bind('chipButton.backgroundColor');
}
</style>
