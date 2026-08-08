<script setup lang="ts">
import GameBoard from './components/GameBoard.vue'
import GameHud from './components/GameHud.vue'
import GameResult from './components/GameResult.vue'
import GameStart from './components/GameStart.vue'
import { useGameSession } from './composables/useGameSession'

const { session, remainingSeconds, resultTitle, start, registerShake } = useGameSession()
</script>

<template>
  <main class="app-shell">
    <GameStart v-if="session.phase === 'idle'" @start="start" />
    <section v-else-if="session.phase === 'playing'" class="game-layout">
      <GameHud
        :remaining-seconds="remainingSeconds"
        :score="session.score"
        :combo="session.combo"
        :modifier-active="session.modifier.active"
      />
      <GameBoard :combo="session.combo" @shake="registerShake" />
    </section>
    <GameResult
      v-else
      :score="session.score"
      :best-combo="session.bestCombo"
      :title="resultTitle"
      @replay="start"
    />
  </main>
</template>
