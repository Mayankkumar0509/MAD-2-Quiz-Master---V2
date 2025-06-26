export default{
    props: ['loggedIn'],
    template:`
    <div id="main">
        <div id="canvas">
            <div id="form-body">
                <h1>Welcome to Quiz Master</h1>
                
                <form>
                <h2>Login</h2>
                <div class="mb-3">
                    <label for="email" class="form-label">Username(Email address)</label>
                    <input type="email" id="email" class="form-control" placeholder="name@example.com" v-model="formData.email">
                </div>
                <div class="mb-3">
                    <label for="pass" class="form-label">Password</label>
                    <input type="password" class="form-control" id="pass" v-model="formData.password">
                </div>
                <button type="button" class="btn btn-primary" @click="loginUser">Login</button>

                <router-link to="/register">Create new user?</router-link>
                </form>
            </div>
        </div>
    </div>
    `,
    data: function(){
        return{
            formData:{
                email:"",
                password:""
            }
        }
    },
    methods:{
        loginUser: function(){
            fetch('/api/login',{
                method: 'POST',
                headers:{
                    "Content-Type":'application/json'
                },
                body:JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data=>{
                if(Object.keys(data).includes("auth-token")){
                    localStorage.setItem("auth_token",data["auth-token"])
                    localStorage.setItem("id",data.id)
                    localStorage.setItem("fullname",data.fullname)
                    localStorage.setItem("qualification",data.qualification)
                    localStorage.setItem("dob",data.dob)
                    this.$emit('login')
                    if(data.role.includes("admin")){
                        this.$router.push('/admin_dashboard')
                    }else{
                        this.$router.push('/user_dashboard')
                    }
                    
                }
                else{
                    alert(data.message)
                }
                
            })
        }
    }
}
