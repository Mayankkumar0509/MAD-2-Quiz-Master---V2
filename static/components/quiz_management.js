export default {
    template: `
 
        <div class="dashboard-container" style="max-width: 800px;margin: 20px auto;border: 2px solid #0066cc;border-radius: 15px;padding: 20px;background-color: white;height: 700px;">
        <h1 class="dashboard-header" style="text-align: center;color: #0066cc;margin-bottom: 10px;font-weight: bold;font-size: 1.5rem;">Admin Dashboard</h1>
        <div class="nav-bar" style="display: flex;justify-content: space-between;background-color: #87CEFA;padding: 10px;border-radius: 10px;margin-bottom: 20px;">
            <div class="nav-links" style="display: flex;gap: 10px;">
                <a style="text-decoration: none;color: #000;" @click="goHome" type="button">Home</a> |
                <router-link to="/quiz_management" style="text-decoration: none;color: #000;" type="button">Quiz</router-link> |
                <router-link to="/summary" style="text-decoration: none;color: #000;" type="button">Summary</router-link> |
                <router-link to="/user_list" style="text-decoration: none;color: #000;" type="button">User</router-link>  
            </div>
            <input type="text" class="search-box" style="padding: 5px 10px;border-radius: 5px;border: 1px solid #ccc;" placeholder="Search">
            <div class="welcome-text" style="font-weight: bold;color: #0066cc;">Welcome {{userData.fullname}}</div>
        </div>
        

        <div v-if="!quizzes" style="text-align: center; padding: 20px;">
            <p>Loading quizzes...</p>
        </div>
        

        <div v-else-if="quizzes.length === 0" style="text-align: center; padding: 20px;">
            <p>No quizzes found. Create your first quiz!</p>
        </div>
        

        <div v-else class="content-section" style="display: grid;grid-template-columns: 1fr 1fr;gap: 20px;margin-bottom: 20px;max-height: 500px;overflow-y: auto;padding-right: 5px; " >
            <div class="subject-panel" style="border: 1px solid #000;border-radius: 15px;padding: 15px;" v-for="quiz in quizzes" :key="quiz.id">
                <h2 class="subject-header" style="text-align: center;font-weight: bold;font-size: 1.2rem;margin-bottom: 10px;">
                    Quiz id:{{quiz.id}}  
                    <router-link :to="{name: 'quiz_update', params: {quizId: quiz.id}}" class="btn btn-warning">Edit</router-link> / 
                    <a @click="delete_quiz(quiz.id)" class="btn btn-danger" type="button"  >Delete</a>
                </h2>
                <p style="text-align: center; margin-bottom: 10px;">
                    <strong>Subject:</strong> {{ getSubjectName(quiz.chapter_id) }}<br>
                    <strong>Chapter:</strong> {{getChapterName(quiz.chapter_id) }}<br>
                    <strong>Duration:</strong> {{ quiz.time_duration }} minutes<br>
                    <strong>Questions:</strong> {{ quiz.question_count || 0 }}
                </p>
                <table class="chapter-table" style="width: 100%;border-collapse: collapse;margin-bottom: 15px;">
                    <thead>
                        <tr>
                            <th style="background-color: #87CEFA;padding: 8px;text-align: left;border: 1px solid #87CEFA;">ID</th>
                            <th style="background-color: #87CEFA;padding: 8px;text-align: left;border: 1px solid #87CEFA;">Q Title</th>
                            <th style="background-color: #87CEFA;padding: 8px;text-align: left;border: 1px solid #87CEFA;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="question in getQuizQuestions(quiz.id)" :key="question.id">
                            <td style="padding: 8px;border-bottom: 1px solid #ddd;">{{question.id}}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #ddd;">{{question.question_text}}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #ddd;">
                                <router-link :to="{name: 'question_update', params: {questionId: question.id}}" class="btn btn-warning">Edit</router-link> / 
                                <a @click="delete_question(question.id)" class="btn btn-danger btn-sm" type="button"  >Delete</a>
                            </td>
                        </tr>
                        <tr v-if="getQuizQuestions(quiz.id).length === 0">
                            <td colspan="3" style="padding: 8px;text-align: center;font-style: italic;">No questions added yet</td>
                        </tr>
                    </tbody>
                </table>
                <a @click="addquestion(quiz.id)" class="add-button" style="background-color: #FFB6C1;border: none;padding: 5px 10px;border-radius: 5px;cursor: pointer;color: #000;margin-left: 63%;" type="button">+ Question</a>
            </div>
        </div>
        <button @click="addQuiz" class="btn btn-primary" style="width: 40px;height: 40px;background-color: white;border: 2px solid #FFA500;border-radius: 50%;display: flex;justify-content: center;align-items: center;margin: 0 auto;color: #FFA500;font-size: 24px;cursor: pointer;">+</button>
        </div>
    
    `,
    data: function(){
        return{
            userData: "",
            subjects: null,
            chapters: null,
            quizzes: null,
            questions: null,
            loading: true
        }
    },

    methods:{
        goHome() {
            this.$router.push('/admin_dashboard');
        },
        
        getChapterName(chapterId) {
            if (!this.chapters || this.chapters.length === 0) return 'Loading...';
            const chapter = this.chapters.find(chapter => chapter.id === chapterId);
            return chapter ? chapter.name : 'Unknown Chapter';
        },
        
        getSubjectName(chapterId) {
            if (!this.chapters || !this.subjects) return 'Loading...';
            const chapter = this.chapters.find(chapter => chapter.id === chapterId);
            if (!chapter) return 'Unknown Subject';
            const subject = this.subjects.find(subject => subject.id === chapter.subject_id);
            return subject ? subject.name : 'Unknown Subject';
        },
        
        getQuizQuestions(quizId) {
            if (!this.questions || this.questions.length === 0) return [];
            return this.questions.filter(question => question.quiz_id === quizId);
        },
        addQuiz: function(){
            this.$router.push('/add/quiz')
        },
        addquestion: function(quizId){
            this.$router.push(`/add/question/${quizId}`)
        },
        delete_quiz: function(quiz_id){
            // Add confirmation dialog
            if (!confirm('Are you sure you want to delete this quiz? This will also delete all associated  questions.')) {
                return;
            }
            
            fetch(`/apiquiz/delete/${quiz_id}`, {  // Fixed: Use backticks for template literal
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
                // Removed body since DELETE doesn't need it for this endpoint
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                // Refresh the data instead of routing
                this.$router.go(0);
                
            })
        },
        delete_question: function(question_id){
            // Add confirmation dialog
            if (!confirm('Are you sure you want to delete this question?')) {
                return;
            }
            
            fetch(`/apiquestion/delete/${question_id}`, {  // Fixed: Use backticks for template literal
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
                // Removed body since DELETE doesn't need it for this endpoint
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                // Refresh the data instead of routing
                this.$router.go(0);
                
            })
        },
    },

    mounted(){
        fetch('/api/admin',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.userData=data)


        fetch('/apisubject/get',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.subjects=data)
        
        fetch('/apichapter/get',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.chapters=data)

        
        fetch('/apiquiz/get',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.quizzes=data)

        fetch('/apiquestion/get',{
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.questions=data)

    }
}