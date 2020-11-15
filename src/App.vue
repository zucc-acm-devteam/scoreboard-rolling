<template>
  <div id="app">
    <span style="font-size: 40px; font-weight: 600">{{ $store.state.name }}</span>
    <transition-group move-class="team-list-move">
      <team-plate
          style="margin-top: 15px; margin-bottom: 15px"
          v-for="team in teams"
          :key="team.id"
          :team="team"/>
    </transition-group>
  </div>
</template>

<script>
import TeamPlate from "@/components/team-plate";

export default {
  name: 'App',
  provide() {
    return {
      forceRefresh: this.forceRefresh
    }
  },
  components: {TeamPlate},
  data() {
    return {
      refreshing: false,
      teams: []
    }
  },
  methods: {
    forceRefresh() {
      this.sortTeams()
    },
    sortTeams() {
      this.teams.sort((b, a) => {
        if (a.num_solved !== b.num_solved) return a.num_solved - b.num_solved
        if (a.penalty !== b.penalty) return -(a.penalty - b.penalty)
        return parseInt(a.id) - parseInt(b.id)
      })
    }
  },
  created() {
    this.teams = []
    for (let team_id in this.$store.state.teams) {
      this.teams.push(this.$store.state.teams[team_id])
    }
    this.sortTeams()
  }
}
</script>

<style>
.team-list-move {
  transition: transform ease-in-out 1.5s;
}

html, body {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
}

#app {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  width: 1500px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
