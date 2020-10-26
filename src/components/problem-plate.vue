<template>
  <div
      style="width: 100%; max-width: 200px"
      class="problem-result"
      :class="getClass()">
    <div class="problem-info">
      <span>{{ problem.label }}</span>
      <template v-if="problem.judged_list.length + problem.pending_list.length > 0">
        <span v-if="problem.pending" style="margin-left: 5px;">
          {{ problem.judged_list.length + ' + ' + problem.pending_list.length }}
        </span>
        <span v-if="problem.solved"> ({{ problem.penalty }})</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "problem-plate",
  props: {
    team_id: String,
    problem: {
      label: String,
      judged_list: Array,
      solved: Boolean,
      first_to_solve: Boolean,
      pending_list: Array,
      pending: Boolean,
      penalty: Number
    }
  },
  methods: {
    getClass() {
      let result = {}
      let problem = this.problem
      if (problem.pending_list.length + problem.judged_list.length === 0) result['never-submitted'] = true
      else if (problem.pending) result['pending'] = true
      else if (problem.first_to_solve) result['first-to-solve'] = true
      else if (problem.solved) result['solved'] = true
      else result['failed'] = true
      return result
    }
  }
}
</script>

<style scoped>
.problem-result {
  height: 50px;
  margin-right: 5px;
  border-radius: 5px;
  border: grey solid 1px;
  font-size: 22px;
}

.problem-info {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
}

.pending {
  background-color: lightblue;
  cursor: pointer;
}

.first-to-solve {
  background-color: #00bb00;
}

.solved {
  background-color: lightgreen;
}

.failed {
  background-color: #f67b7b;
}

.never-submitted {
  background-color: white;
}

</style>
