
export default {
    template: `

    <div class="container" style="max-width: 800px;margin: 20px auto;background-color: white;border: 2px solid #4a90e2;border-radius: 15px;padding: 20px;box-shadow: 0 0 10px rgba(0,0,0,0.1);" >
        <h1 class="dashboard-header"  style="text-align: center;">User Dashboard</h1>

        <div class="header" style="border-bottom: 1px solid #e0e0e0;padding-bottom: 10px;margin-bottom: 20px;display: flex;justify-content: space-between;align-items: center;">
            
            <div class="nav" style="display: flex;gap: 10px;">
                <router-link to="/user_dashboard" class="nav-item" style="padding: 5px 10px;background-color: #e6f0ff;border-radius: 5px;cursor: pointer;"  type="button">Home</router-link>
                <a class="nav-item" style="padding: 5px 10px;background-color: #e6f0ff;border-radius: 5px;cursor: pointer;" @click="user_score" type="button">Scores</a>
                
                
            </div>
            <div>
                <input type="text" class="search-bar" style="padding: 5px;border: 1px solid #ccc;border-radius: 5px;" placeholder="Search" >
            </div>
            <div class="welcome" style="color: #4a90e2;">Welcome {{userData.fullname}}</div>
        </div>
        
        <div class="panel" style="border: 1px solid #4a90e2;border-radius: 10px;padding: 15px;margin-bottom: 20px;">
            <h3 class="panel-title"  style="margin-top: 0;color: #4a90e2;">Upcoming Quizzes</h3>
            <table style="width: 100%;border-collapse: collapse;">
                <thead>
                    <tr style="text-align: right;">
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Quiz ID</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">subject</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">chapter</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">No. of Questions</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Date</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Duration(Mins)</th>
                        <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Action</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for ="quiz in quizzes">
                        <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ quiz.id }}</td>
                        <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{quiz.subject_name }}</td>
                        <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{quiz.chapter_name }}</td>
                        <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ quiz.question_count }}</td>
                        <td type="date" style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ quiz.date_of_quiz }}</td>
                        <td type="time" style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ quiz.time_duration }}</td>
                        <td  style="padding: 8px;border-bottom: 1px solid #e0e0e0;">
                            <button class="btn btn-primary" style="background-color: #2196F3;" @click="startQuiz(quiz.id)">Start</button>
                        </td>
                    </tr>  
                </tbody>
            </table>
           
        </div>
    </div>
    `,
    data: function(){
        return{
            userData:"",
            quizzes:null
        }
    },
    mounted(){
        fetch('/api/home',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.userData=data)

        fetch('/apiquiz/get',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.quizzes=data)    

    },
    methods:{
        user_score: function(){
            this.$router.push('/user_score')
        },
        startQuiz: function(quizId) {
            // Navigate to quiz taking page
            this.$router.push(`/take_quiz/${quizId}`)
        },
        // logout: function(){
        //     localStorage.removeItem('auth_token');
        //     localStorage.removeItem('id');
        //     localStorage.removeItem('fullname');
        //     localStorage.removeItem('qualification');
        //     localStorage.removeItem('dob');
        //     this.$router.push('/');
        // }
    }

}