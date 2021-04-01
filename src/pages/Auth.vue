<template>
    <div id="auth">
        <div class="login-form">
            <div class="container form__container">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">Auth</div>
                            <div class="card-body">
                                <div>
                                    <div class="form-group row mb-2">
                                        <label class="col-md-4 col-form-label text-md-right">Login</label>
                                        <div class="col-md-6">
                                            <input v-model="user.userName" type="text" id="email_address" class="form-control" required/>
                                        </div>
                                    </div>
                                    <div class="form-group row mb-2">
                                        <label class="col-md-4 col-form-label text-md-right">Password</label>
                                        <div class="col-md-6">
                                            <input v-model="user.password" type="password" id="password" class="form-control" name="password"/>
                                        </div>
                                    </div>
                                    <div class="col-md-6 offset-md-4">
                                        <button v-on:click="login" type="submit" class="btn btn-primary ms-2">
                                            Login
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as axios from 'axios'
import router from '../router'
import './Auth.css'

export default {
    name: 'Auth',
    data() {
        return {
            user: {
                userName: '',
                password: ''
            }
        }
    },
    methods: {
        async login(){
            const { data } = await axios.post('https://itdbpromoserver.herokuapp.com/api/login', this.user)
            if(data.ok){
                sessionStorage.setItem('user', JSON.stringify(data.user))
                router.push('promos')
            }
        }
    }
}
</script>