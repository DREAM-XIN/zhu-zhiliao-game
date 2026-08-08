<script setup lang="ts">
import { computed } from 'vue'
import { usePointerShake } from '../composables/usePointerShake'

const props = defineProps<{ combo: number }>()
const emit = defineEmits<{ shake: [atMs: number] }>()
const { activePointerId, offsetX, offsetY, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = usePointerShake(
  (atMs) => emit('shake', atMs),
)
const transform = computed(() => `translate3d(${offsetX.value}px, ${offsetY.value}px, 0)`)
</script>

<template>
  <section class="board" aria-label="游戏区域">
    <p class="board-hint">按住下方竹知了并快速来回拖动</p>
    <div
      class="cicada-target"
      :class="{ dragging: activePointerId !== null, hot: props.combo >= 5 }"
      :style="{ transform }"
      role="button"
      tabindex="0"
      aria-label="竹知了互动目标。请使用触摸、鼠标或触控笔按住并快速来回拖动。"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
      @lostpointercapture="onPointerCancel"
    >
      <span class="wing wing-left" aria-hidden="true" />
      <span class="wing wing-right" aria-hidden="true" />
      <span class="body" aria-hidden="true"><i /><i /><i /></span>
      <strong aria-hidden="true">鸣!</strong>
    </div>
    <p class="combo-callout" aria-live="polite">{{ combo >= 5 ? `连鸣 ×${combo}` : '左右反转即可得分' }}</p>
  </section>
</template>
