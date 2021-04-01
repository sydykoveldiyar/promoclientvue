<template>
  <div id="create-promo">
      <div class="promo-create">
            <h2 class="d-flex justify-content-center text-primary pt-5">Добавление промокода</h2>
            <div class="container promo-create__container">
                <form v-on:submit="addPromo">
                    <div class="row promo-create__form">
                        <div class="col">
                            <label class="form-label">Имя</label>
                            <input v-model="promo.firstName" type="text" class="form-control" placeholder="Введите имя" required />
                            <label class="form-label">Электронный адрес</label>
                            <input v-model="promo.email" type="text" class="form-control" placeholder="Введите email" required />
                        </div>
                        <div class="col">
                            <label class="form-label">Фамилия</label>
                            <input v-model="promo.lastName" type="text" class="form-control" placeholder="Введите фамилию" required />
                            <label class="form-label">Номер телефона</label>
                            <input v-model="promo.phoneNumber" type="text" class="form-control" placeholder="Введите номер телефона" required />
                        </div>
                    </div>
                    <div class="d-flex justify-content-around mt-4">
                        <router-link to='/promos' class="btn btn-danger" >Назад</router-link>
                        <button class="btn btn-primary">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
  </div>
</template>

<script>
import * as axios from 'axios'
import router from '../../router'

export default {
    name: 'CreatePromo',
    data(){
        return {
            promo: {
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: ''
            }
        }
    },
    methods: {
        async addPromo(e){
            e.preventDefault()
            try {
                const { data } = await axios.post('https://itdbpromoserver.herokuapp.com/api/createPromo', this.promo)
                router.push('/promos')
            } catch (error) {
                console.log(error)
            }            
        }
    }
}
</script>