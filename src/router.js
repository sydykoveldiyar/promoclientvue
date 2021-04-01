import Vue from 'vue'
import VueRouter from 'vue-router'
import Promos from './pages/Promos.vue'
import Auth from './pages/Auth.vue'
import PromoDetails from './components/PromoDetails/PromoDetails.vue'
import CreatePromo from './components/CreatePromo/CreatePromo.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', name: 'Auth', component: Auth},
    { path: '/promos', name: 'Promos', component: Promos},
    { path: '/promos/:id', name: 'PromoDetails', component: PromoDetails },
    { path: '/create-promo', name: 'CreatePromo', component: CreatePromo },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })

export default router