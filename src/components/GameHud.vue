<script setup lang="ts">
defineProps<{ remainingSeconds: number; score: number; combo: number; modifierActive: boolean }>()
</script>

<template>
  <header class="hud" aria-live="polite">
    <div><span>时间</span><strong>{{ remainingSeconds }}s</strong></div>
    <div><span>分数</span><strong>{{ score }}</strong></div>
    <div><span>Combo</span><strong>×{{ combo }}</strong></div>
  </header>
  <p class="modifier-banner" :class="{ active: modifierActive }">
    {{ modifierActive ? '竹鸣加倍 · 得分 ×2' : '保持节奏，竹鸣加倍可能随时出现' }}
  </p>
</template>
