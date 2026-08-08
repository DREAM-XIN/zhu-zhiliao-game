<script setup lang="ts">
defineProps<{ score: number; bestCombo: number; title: string }>()
defineEmits<{ replay: [] }>()
</script>

<template>
  <section class="panel result-panel" aria-labelledby="result-title">
    <p class="eyebrow">本局结束</p>
    <h1 id="result-title">{{ title }}</h1>
    <div class="result-score"><span>最终分数</span><strong>{{ score }}</strong></div>
    <div class="result-meta"><span>最高 Combo</span><strong>×{{ bestCombo }}</strong></div>
    <p>竹林里的节奏已经记住你了。再来一局，冲击更高称号。</p>
    <button class="primary-button" type="button" @click="$emit('replay')">再来一局</button>
  </section>
</template>
