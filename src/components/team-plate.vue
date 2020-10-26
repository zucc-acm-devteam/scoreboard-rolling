<template>
  <div class="wrap" ref="wrapper">
    <div style="text-align: left; margin-bottom: 10px">
      <div style="font-size: 50px" class="team-info">{{ team.rank }}</div>
      <div class="team-info">{{ team.name }}</div>
      <div class="team-info">{{ '解题数:' + team.num_solved }}</div>
      <div class="team-info">{{ '总罚时:' + team.penalty }}</div>
    </div>
    <div style="display: flex; width: 100%">
      <problem-plate
          v-for="problem in team.problems"
          :key="problem.label"
          :team_id="team.id"
          :problem="problem"
          @click.native="judgeProblem(problem)"
      />
    </div>
  </div>
</template>

<script>
import ProblemPlate from "@/components/problem-plate";

export default {
  name: "team-plate",
  inject: ['forceRefresh'],
  components: {ProblemPlate},
  props: {
    team: {
      id: String,
      name: String,
      rank: Number,
      num_solved: Number,
      penalty: Number,
      problems: Array
    }
  },
  methods: {
    judgeProblem(problem) {
      if (!problem.pending) return
      this.$store.commit('judgeProblem', {
        team_id: this.team.id,
        problem_id: problem.label,
      })
      this.forceRefresh()
    }
  }
}
</script>

<style scoped>
.team-info {
  display: inline-block;
  font-size: 25px;
  font-weight: 600;
  margin-right: 10px;
}
</style>
