<template>
<div>
  <div v-if="!promo" class="spinner">
    <PulseLoader />
  </div>
  <div v-else id="promo-details" class="container single-promo">
    <button class="btn btn-outline-danger" v-on:click="goBack">Назад</button>
    <h2 class="d-flex justify-content-center mb-4">Подробнее</h2>
    <div class="mb-4">
      <ul v-if="!isEditing" class="pl-5 list-group">
        <li class="list-group-item">
          Имя: <span class="text-primary">{{promo.firstName}}</span>
        </li>
        <li class="list-group-item">
          Фамилия: <span class="text-primary">{{promo.lastName}}</span>
        </li>
        <li class="list-group-item">
          Email: <span class="text-primary">{{promo.email}}</span>
        </li>
        <li class="list-group-item">
          Номер телефона:
          <span class="text-primary">{{promo.phoneNumber}}</span>
        </li>
        <li class="list-group-item">
          Промокод:
          <span class="text-primary code">{{promo.promoValue}}</span>
        </li>
      </ul>
      <div v-else>
          <label for="" class="form-label">Имя</label>
          <input type="text" class="form-control" v-model="promo.firstName">
          <label for="" class="form-label">Фамилия</label>
          <input type="text" class="form-control" v-model="promo.lastName">
          <label for="" class="form-label">Электронный адрес</label>
          <input type="text" class="form-control" v-model="promo.email">
          <label for="" class="form-label">Номер телефона</label>
          <input type="text" class="form-control" v-model="promo.phoneNumber">
      </div>
      <div class="d-flex justify-content-end">
        <button v-if="!isEditing" class="btn btn-outline-warning mt-2" v-on:click="isEditing = !isEditing">{{!isEditing && 'Редактировать'}}</button>
        <div class="mt-2" v-else>
          <button class="btn btn-outline-warning me-2" v-on:click="isEditing = false">Отмена</button>
          <button class="btn btn-primary" v-on:click="savePromo">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import * as axios from 'axios'
import router from '../../router'
import './PromoDetails.css'

export default {
  name: "PromoDetails",
  data(){
    return {
      promo: null,
      isEditing: false
    }
  },
  components: {
    PulseLoader
  },
  async created(){
    try {
      const { data } = await axios(`https://itdbpromoserver.herokuapp.com/api/promos/${this.$route.params.id}`)
      this.promo = data 
    } catch (error) {
        console.log(error)
    }
  },
  methods: {
    goBack(){
      router.push('/promos')
    },
    async savePromo(){
      try {
        const { data } = await axios.put(`https://itdbpromoserver.herokuapp.com/api/updatePromo/${this.promo._id}`, this.promo)
        this.promo = data
        this.isEditing = !this.isEditing
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>