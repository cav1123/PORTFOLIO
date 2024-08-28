<script setup lang="ts">
import TagList from '@/components/TagList.vue';

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia';
// works
import { type Works, useWorksStore } from "@/stores/works"
const worksStore = useWorksStore()
const { works, filteredWorks, featuredWork, checkedWorks } = storeToRefs(worksStore)
const { getWorks, filterWorks, featureWork, addCheckedWorks, setIsChecked } = worksStore
// tags
import { useTagsStore } from "@/stores/tags"
const tagsStore = useTagsStore()
const { jobs, tools, contents, carts, selectedTag } = storeToRefs(tagsStore)
const { getTags, selectTag } = tagsStore
// フィルター
function updateWorks(tagId: string) {
  filterWorks(tagId)
  selectTag(tagId)
  closeMenu()
}
// モーダル
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { modal } = storeToRefs(modalStore)
const { showModal, closeModal } = modalStore
// メニュー
import { useMenuStore } from '@/stores/menu';
const menuStore = useMenuStore()
const { menu } = storeToRefs(menuStore)
const { showMenu, closeMenu } = menuStore
function openMenu() {
  closeModal()
  showMenu()
}
// モーダルコンテンツ
function updateFeature(work: Works) {
  showModal()
  closeMenu()
  featureWork(work.id)
  setIsChecked(work.id)
  addCheckedWorks(work)
}
// ローディング
import { useLoadingStore } from '@/stores/loading';
const loadingStore = useLoadingStore()
const { loading } = storeToRefs(loadingStore)
const { startLoading, stopLoading } = loadingStore
// マウント
onMounted(async () => {
  startLoading()
  await getWorks()
  await getTags()
  stopLoading()
})
</script>

<template>
  <div class="wrapper">
    <div v-if="loading" class="loading-wrapper">
      <div class="loading"></div>
    </div>
    <div class="container">
      <!-- 右側 -->
      <div class="right-wrapper">
        <Transition name="fade">
          <header v-show="!modal">
            <!-- ロゴ -->
            <div class="header-header">
              <span @click="updateWorks('')" class="text-title font-family-en cursor-pointer">PORTFOLIO</span>
              <button class="icon-button icon-button-sp material-symbols-rounded" @click="closeMenu">close</button>
            </div>
            <!-- タグリスト -->
            <div class="tags-list-wrapper">
              <TagList label-icon="folder" label-value="JOB" :tags="jobs" :chip-lg=true />
              <TagList label-icon="build" label-value="TOOL" :tags="tools" :chip-lg=false />
              <TagList label-icon="article" label-value="CONTENT" :tags="contents" :chip-lg=false />
              <TagList label-icon="shopping_cart" label-value="CART" :tags="carts" :chip-lg=false />
            </div>
            <!-- 履歴 -->
            <div class="checkedWorks-list-wrapper" v-if="checkedWorks.length > 0">
              <div class="d-flex align-items-center ga-sm">
                <span class="material-symbols-rounded icon-sm">history</span>
                <span class="font-family-en font-line-height-trim">HISTORY</span>
              </div>
              <ul class="checkedWorks-list">
                <li v-for="checkedWork in checkedWorks" :key="checkedWork.id" @click="updateFeature(checkedWork)"
                  class="checkedWorks-list-item">
                  <div class="checkedWork-thumbnail"
                    :style="{ 'background-image': `url(${checkedWork.thumbnail.url})` }">
                  </div>
                </li>
              </ul>
            </div>
          </header>
        </Transition>
        <!-- モーダル -->
        <Transition name="fade">
          <div class="modal-wrapper" v-show="modal">
            <div class="modal-container">
              <div class="modal-header">
                <button class="icon-button material-symbols-rounded" @click="closeModal">close</button>
                <button class="icon-button icon-button-sp material-symbols-rounded" @click="openMenu">menu</button>
              </div>
              <div class="modal-main">
                <img class="modal-thumbnail" :src="featuredWork.thumbnail.url">
                <div class="modal-content">
                  <span class="text-heading">{{ featuredWork.title }}</span>
                  <ul class="d-flex flex-wrap align-content-start ga-sm">
                    <li v-for="tag in featuredWork.tags" :key="tag.id" class="chip">
                      {{ tag.name }}
                    </li>
                  </ul>
                </div>
                <div v-html="featuredWork.content.html" class="modal-contents"></div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <!-- メイン -->
      <main>
        <div class="main-wrapper">
          <div class="main-container">
            <!-- タイトル -->
            <div class="works-list-header">
              <div class="d-flex align-items-center ga-sm">
                <span class="material-symbols-rounded">label</span>
                <span class="font-weight-bd font-size-lg font-line-height-trim mb-xs">{{ selectedTag.name }}</span>
              </div>
              <button class="icon-button icon-button-sp material-symbols-rounded" @click="showMenu">menu</button>
            </div>
            <!-- ワークリスト -->
            <ul class="works-list">
              <li class="works-list-item" v-for="work in filteredWorks.length > 0 ? filteredWorks : works"
                :key="work.id" @click="updateFeature(work)">
                <Transition name="bounce">
                  <span v-if="work.isChecked" class="material-symbols-rounded work-check-icon">check</span>
                </Transition>
                <img class="work-thumbnail" :src="work.thumbnail.url">
                <div class="work-main">
                  <div>
                    <span class="font-weight-bd">{{ work.title }}</span>
                    <span v-if="work.hasContent"
                      class="material-symbols-rounded icon-sm v-align-text-top ml-sm">more</span>
                  </div>
                  <ul class="d-flex flex-wrap align-content-start ga-sm">
                    <li v-for="tag in work.tags" :key="tag.id" class="chip">
                      {{ tag.name }}
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  background-color: var(--color-background-soft);
  background-image: linear-gradient(0deg, transparent calc(100% - 1px), var(--color-background) calc(100% - 1px)),
    linear-gradient(90deg, transparent calc(100% - 1px), var(--color-background) calc(100% - 1px));
  background-size: 1.6rem 1.6rem;
  background-repeat: repeat;
  background-position: center center;
  z-index: 0;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: linear-gradient(to bottom right, rgba(245, 245, 245, 0), rgba(245, 245, 245, 1), rgba(245, 245, 245, 0));
  }
}

.loading-wrapper {
  width: 100%;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  width: 4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px dotted transparent;
  border-top-color: var(--color-border-hover);
  animation: spinner 2s infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.container {
  display: flex;
  justify-content: center;
  gap: 2.4rem;
}

.right-wrapper {
  background-color: var(--color-background);
  width: 57.6rem;
  min-width: 57.6rem;
}

header {
  padding: 0.8rem 2.4rem;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.header-header {
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tags-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.checkedWorks-list-wrapper {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding-top: 1.6rem;
}

.checkedWorks-list {
  display: flex;
  gap: 0.4rem;
  overflow-x: scroll;
  width: calc(100% + 2.4rem);

  &::-webkit-scrollbar {
    display: none;
  }
}

.checkedWorks-list-item {
  min-width: 10rem;
  aspect-ratio: 1;
  border: 1px dotted var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: scale 0.4s ease;

  @media (hover: hover) {
    &:hover .checkedWork-thumbnail {
      scale: 1.08;
    }
  }

}

.checkedWork-thumbnail {
  width: 8rem;
  aspect-ratio: 1;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  transition: scale 0.4s ease;
}

.modal-wrapper {
  width: 100%;
  max-width: 57.6rem;
  height: 100svh;
  overflow-y: scroll;
  margin: 0 auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  translate: -4rem;
}

.modal-container {
  position: relative;
}

.modal-header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 2.4rem;
}

.modal-main {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  margin-top: -6rem;
}

.modal-thumbnail {
  width: 100%;
}

.modal-content {
  padding: 0 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.modal-contents {
  padding: 0 2.4rem 2.4rem;
}

main {
  /* order: -1; */
  flex-grow: 1;
}

.main-wrapper {
  padding: 0 1.6rem;
  height: 100svh;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.main-container {
  margin-bottom: 2.4rem;
}

.works-list-header {
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.works-list {
  display: grid;
  gap: 2.4rem;
  grid-template-columns: repeat(auto-fill, minmax(26rem, 1fr));
}

.works-list-item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  gap: 0;
  box-shadow: -0.8rem -0.8rem 1.2rem var(--color-background), 0.8rem 0.8rem 1.2rem var(--color-background-mute);
  border-radius: 0.8rem;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  @media (hover: hover) {
    &:hover {
      box-shadow: -0.4rem -0.4rem 0.8rem var(--color-background), 0.4rem 0.4rem 0.8rem var(--color-background-mute);
    }
  }
}

.work-check-icon {
  position: absolute;
  font-size: 2rem;
  width: 2.8rem;
  aspect-ratio: 1;
  background-color: var(--color-background);
  border-radius: 50%;
  top: -0.8rem;
  left: -0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bounce-enter-active,
.bounce-leave-active {
  animation: bounce 0.4s;
}

@keyframes bounce {
  0% {
    scale: 0;
  }

  50% {
    scale: 1.5;
  }

  100% {
    scale: 1;
  }
}

.work-thumbnail {
  width: 100%;
  border-radius: 0.8rem 0.8rem 0 0;
}

.work-main {
  padding: 1.2rem;
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 2;
  gap: 0.8rem;
}

@media (max-width: 1240px) {
  .right-wrapper {
    position: absolute;
    z-index: 1;
    width: 100%;
    min-width: auto;
  }

  header {
    display: v-bind('menu ? "flex" : "none"');
  }
}
</style>