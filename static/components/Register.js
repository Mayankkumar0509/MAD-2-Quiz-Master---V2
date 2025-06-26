export default{
    template:`
    <div id="main">
        <div id="canvas">
            <div id="form-body">
                <h1>Welcome to Quiz Master</h1>
                <h2>Register</h2>
                <form action="/register" method="post">
                <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="email" placeholder="name@example.com" v-model="formData.email">
                    
                </div>
                <div class="mb-3">
                    <label for="pass" class="form-label">Password</label>
                    <input type="password" class="form-control" id="pass" v-model="formData.password">
                </div>
                <div class="mb-3">
                    <label for="fullname" class="form-label">Full name</label>
                    <input type="text" class="form-control" id="fullname" v-model="formData.fullname">
                </div>
                <div class="mb-3">
                    <label for="Qualification" class="form-label">Qualification</label>
                    <input type="text" class="form-control" id="Qualification" v-model="formData.qualification">
                </div>
                <div class="mb-3">
                    <label for="dob" class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" id="dob" v-model ="formData.dob">
                </div>
                <button type="button" class="btn btn-primary" @click="adduser">register</button>

                <a href="/login">Existing user?</a>
                </form>
            </div>
        </div>
    </div>
    `,
    data: function(){
        return{
            formData:{
                email:"",
                password:"",
                fullname:"",
                qualification:"",
                dob:""
            }
        }
    },
    methods:{
        adduser: function(){
            fetch('/api/register',{
                method: 'POST',
                headers:{
                    "Content-Type":'application/json'
                },
                body:JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data=>{
                alert(data.message)
                this.$router.push('/login')
            })
        }
    }
}