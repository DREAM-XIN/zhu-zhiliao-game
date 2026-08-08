<script setup lang="ts">
defineEmits<{ start: [] }>()
</script>

<template>
  <section class="panel start-panel" aria-labelledby="game-title">
    <p class="eyebrow">30 秒竹林挑战</p>
    <h1 id="game-title">竹知了大作战</h1>
    <p class="lede">按住竹知了，快速来回拖动。每次有效反转都会得分，连续摇动还能叠加 Combo。</p>
    <div class="rules" aria-label="玩法提示">
      <span>↔ 快速来回</span><span>🔥 连击加成</span><span>×2 竹鸣加倍</span>
    </div>
    <button class="primary-button" type="button" @click="$emit('start')">开始游戏</button>
  </section>
</template>
