<template>
  <div id="promos" class="promos">
    <div>
      <h2 class="d-flex justify-content-center mb-4">Промокоды</h2>
      <div class="search">
        <input
          type="text"
          class="searchTerm"
          placeholder="Поиск по..."
          v-on:input="searchPromos"
        />
       <select class="selectpicker" v-on:change="setSearchProperty">
         <option 
            v-for="(option, index) in Object.values(searchOptions)" 
            :key="index" 
            class="option" 
            :value="option[0]"
            >
            {{option[1]}}
          </option>
       </select>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <router-link to="/create-promo" class="btn btn-primary">
          Добавить промокод
        </router-link>
      </div>
      <div class="d-flex justify-content-center mt-5" v-if="!filtered.length">
        <PulseLoader />
      </div>
      <div
        v-else
        class="container"
        v-for="(promo, index) in filtered"
        :key="promo._id"
      >
        <h2>Номер: {{ index + 1 }}</h2>
        <div class="mb-4">
          <ul class="list-group mb-2 ms-4">
            <li class="list-group-item">
              ФИО:
              <span class="text-primary">{{
                promo.lastName + " " + promo.firstName
              }}</span>
            </li>
            <li class="list-group-item">
              Промокод:
              <span class="text-primary code">{{ promo.promoValue }}</span>
            </li>
            <div v-if="promo.guests.length">
              <li class="list-group-item">
                Гости:
                <button
                  class="btn btn-outline-primary ms-4"
                  v-for="guest in guests(promo)"
                  :key="guest._id"
                >
                  <router-link :to="{ path: 'promos/' + guest._id }">
                    {{ guest.lastName + " " + guest.firstName }}
                  </router-link>
                </button>
              </li>
            </div>
            <div v-else>
              <li class="list-group-item">Гостей пока нет</li>
            </div>
            <li class="list-group-item">
              Скидка: <span class="text-primary">{{ promo.discount }}$</span>
            </li>
          </ul>
          <div class="d-flex justify-content-between ms-4">
            <div>
              <button class="btn btn-primary" v-on:click="openModal(promo._id)">
                Добавить гостя
              </button>
            </div>
            <div>
              <router-link
                :to="{ path: 'promos/' + promo._id }"
                class="btn btn-outline-primary me-2"
                >Подробнее</router-link
              >
              <button
                class="btn btn-danger"
                v-on:click="removePromo(promo._id)"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <form>
                <div class="form-group">
                  <label class="form-label">Имя</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Введите имя"
                    v-model="guest.firstName"
                  />
                  <label class="form-label">Фамилия</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Введите фамилию"
                    v-model="guest.lastName"
                  />
                  <label class="form-label">Электронный адрес</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Введите email"
                    v-model="guest.email"
                  />
                  <label class="form-label">Номер телефона</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Введите номер телефона"
                    v-model="guest.phoneNumber"
                  />
                </div>
              </form>
              <div class="d-flex justify-content-between mt-2">
                <div>
                  <button
                    class="btn btn-outline-danger"
                    v-on:click="showModal = false"
                  >
                    Закрыть
                  </button>
                </div>
                <div>
                  <button class="btn btn-outline-primary" v-on:click="addGuest">
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import * as axios from "axios";
import router from "../router";
import "./Promos.css";

export default {
  name: "Promos",
  data() {
    return {
      promos: [],
      filtered: [],
      showModal: false,
      search: '',
      searchProperty: '',
      searchOptions: {
        promoValue: ["promoValue", "промокоду"],
        lastName: ["lastName", "фамилии"],
        firstName: ["firstName", "имени"],
      },
      guest: {
        parentId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      },
    };
  },
  components: {
    PulseLoader,
  },
  async created() {
    this.searchProperty = Object.values(this.searchOptions)[0][0]
    if (!sessionStorage.getItem("user")) {
      router.push("/")
    }
    try {
      const { data } = await axios.get("https://itdbpromoserver.herokuapp.com/api/promos")
      this.promos = data
      this.filtered = data
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    guests(promo) {
      return this.promos.filter((p) => promo.guests.includes(p._id))
    },
    openModal(id) {
      this.showModal = true
      this.guest.parentId = id
    },
    setSearchProperty(e){
      this.searchProperty = e.target.value
    },
    searchPromos(e) {
      this.search = e.target.value
      console.log(this.searchProperty)
      if (this.search) {
            this.filtered = [...this.promos]
        }
        this.filtered = [...this.promos].filter(el => el[this.searchProperty].toLowerCase().includes(this.search.toLowerCase()))
    },
    async addGuest() {
      try {
        const { data } = await axios.post(
          "https://itdbpromoserver.herokuapp.com/api/addGuest",
          this.guest
        );
        this.promos = [...this.promos, data];
        this.promos = this.promos.map((el) => {
          if (el._id === this.guest.parentId) {
            el.guests = [...el.guests, data._id]
            el.discount += 50;
            return el
          }
          return el
        });
        this.clearGuest()
        this.showModal = false
      } catch (error) {
        console.log(error)
      }
    },

    clearGuest() {
      const guest = this.guest
      guest.parentId = ""
      guest.firstName = ""
      guest.lastName = ""
      guest.email = ""
      guest.phoneNumber = ""
    },

    async removePromo(id) {
      try {
        axios.delete(`https://itdbpromoserver.herokuapp.com/api/removePromo/${id}`)
        this.promos = this.promos.reduce((acc, rec) => {
          if(rec._id === id){
            return acc
          }
          else if (rec.guests.includes(id)) {
            rec.discount -= 50;
            rec.guests = rec.guests.filter((el) => el !== id)
            return [...acc, rec]
          }
          return [...acc, rec]
        }, [])
      } catch (error) {
        console.log(error)
      }
    },
  },
};
</script>