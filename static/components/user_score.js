

export default {
    template: `
    <div class="container" style="max-width: 800px; margin: 20px auto;background-color: white;border: 2px solid #4a90e2;border-radius: 15px;padding: 20px;box-shadow: 0 0 10px rgba(0,0,0,0.1);" >
        <h1 class="dashboard-header"  style="text-align: center;">Scores</h1>
        <div class="header" style="border-bottom: 1px solid #e0e0e0;padding-bottom: 10px;margin-bottom: 20px;display: flex;justify-content: space-between;align-items: center;">         
            <div class="nav" style="display: flex;gap: 10px;">
                <a class="nav-item" style="padding: 5px 10px;background-color: #e6f0ff;border-radius: 5px;cursor: pointer;"  @click="user_dashboard" type="button">Home</a>
                <router-link to="/user_score" class="nav-item" style="padding: 5px 10px;background-color: #e6f0ff;border-radius: 5px;cursor: pointer;" type="button">Scores</router-link>
                
            </div>
            <div>
                <input type="text" style="padding: 5px;border: 1px solid #ccc;border-radius: 5px;" class="search-bar" placeholder="Search">
            </div>
            <div class="welcome" style="color: #4a90e2;">Welcome {{userData.fullname}}</div>
        </div>
        
        <div class="panel" style="border: 1px solid #4a90e2;border-radius: 10px;padding: 15px;margin-bottom: 20px;">
            <h3 class="panel-title"  style="text-align: center;margin-top: 0;color: #4a90e2;">Quiz Score</h3>
            <div class="row border">
            <div class="text-end my-2">
                <button @click="download_csv(userData.id)" class="btn btn-secondary">Download CSV</button>
            </div>
            </div>
            <table style="width: 100%;border-collapse: collapse;">
                <thead>
                    <tr style="text-align: right;">
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Score ID</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Quiz id</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Date and Time</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Score</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="score in scores">
                        <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{score.id}}</td>
                        <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{score.quiz_id}}</td>
                        <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{score.attempt_date}}</td>
                        <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{score.score}}</td>
                    </tr>
                </tbody>
            </table>
           
        </div>
    </div>
    `,
    data: function(){
        return{
            scores:"",
            userData:""
        }
    },
    mounted(){
        fetch('/apiscore/get',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.scores=data)

        fetch('/api/home',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.userData=data)
    },
    methods:{
        user_dashboard: function(){
            this.$router.push('/user_dashboard')
        },
        logout: function(){
            localStorage.removeItem('auth_token');
            localStorage.removeItem('id');
            localStorage.removeItem('fullname');
            localStorage.removeItem('qualification');
            localStorage.removeItem('dob');
            this.$router.push('/');
        },
        download_csv(user_id){
            fetch(`/api/export/${user_id}`)
            .then(response => response.json())
            .then(data => {
                window.location.href = `/api/csv_result/${data.id}`
            })
        }
        
    }
}