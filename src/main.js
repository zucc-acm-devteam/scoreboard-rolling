import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import scoreboard_data from "../public/data.json";

Vue.use(ElementUI)
Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
    state: {
        name: String,
        page: null,
        teams: {},
        problems: [],
        penalty: Number
    },
    mutations: {
        initData(state) {
            state.name = scoreboard_data.data.contest_meta.name
            state.penalty = scoreboard_data.data.contest_meta.penalty
            state.problems = scoreboard_data.data.contest_meta.problems
            for (let team_id of scoreboard_data.data.contest_meta.teams) {
                let team = scoreboard_data['data']['teams'][team_id]
                let temp = {
                    id: team_id,
                    name: team.name,
                    rank: 1,
                    num_solved: 0,
                    penalty: 0,
                    problems: {}
                }
                for (let problem of state.problems) {
                    temp.problems[problem] = {
                        label: problem,
                        judged_list: [],
                        solved: false,
                        first_to_solve: false,
                        pending_list: [],
                        pending: false,
                        penalty: 0
                    }
                }
                for (let submission of team.submissions) {
                    let problem_id = submission.problem
                    let problem = temp.problems[problem_id]
                    if (submission.pending) {
                        problem.pending_list.push(submission)
                        problem.pending = true
                    } else {
                        if (problem.solved) continue
                        if (submission.pass) {
                            problem.solved = true
                            if (submission.first_to_solve) problem.first_to_solve = true
                            problem.penalty = state.penalty * problem.judged_list.length + submission.time
                            temp.penalty += problem.penalty
                            temp.num_solved++
                        }
                        problem.judged_list.push(submission)
                    }
                }
                state.teams[team_id] = temp
            }
            store.commit('sortTeams')
        },
        judgeProblem(state, data) {
            let team_id = data.team_id
            let problem_id = data.problem_id
            let team = state.teams[team_id]
            let problem = team.problems[problem_id]
            let pending_list = problem.pending_list
            for (let submission of pending_list) {
                if (problem.solved) continue
                if (submission.pass) {
                    problem.solved = true
                    problem.penalty = state.penalty * problem.judged_list.length + submission.time
                    team.penalty += problem.penalty
                    team.num_solved++
                    if (submission.first_to_solve) problem.first_to_solve = true
                }
                problem.judged_list.push(submission)
            }
            team.problems[problem_id].pending = false
            team.problems[problem_id].pending_list = []
            store.commit('sortTeams')
        },
        sortTeams(state) {
            let teams = []
            for (let team_id in state.teams) {
                let team = state.teams[team_id]
                teams.push(team)
            }
            teams.sort((b, a) => {
                if (a.num_solved !== b.num_solved) return a.num_solved - b.num_solved
                if (a.penalty !== b.penalty) return -(a.penalty - b.penalty)
                return parseInt(a.id) - parseInt(b.id)
            })
            let rank = 1
            for (let team of teams) {
                state.teams[team.id].rank = rank++
            }
        }
    }
})

new Vue({
    store,
    render: h => h(App),
    created() {
        store.commit('initData', this)
    }
}).$mount('#app')
