export default {
    template: `
    <div class="dashboard-container" style="max-width: 800px;margin: 20px auto;border: 2px solid #0066cc;border-radius: 15px;padding: 20px;background-color: white;height: 700px;">
        <h1 class="dashboard-header" style="text-align: center;color: #0066cc;margin-bottom: 10px;font-weight: bold;font-size: 1.5rem;">Admin Dashboard</h1>
        
        <div class="nav-bar" style="display: flex;justify-content: space-between;background-color: #87CEFA;padding: 10px;border-radius: 10px;margin-bottom: 20px;">
            <div class="nav-links" style="display: flex;gap: 10px;">
                <router-link to='/admin_dashboard' style="text-decoration: none;color: #000;" type="button">Home</router-link> |
                <a style="text-decoration: none;color: #000;" @click="Quiz" type="button">Quiz</a> |
                <a style="text-decoration: none;color: #000;" @click="summary">Summary</a> |
                <a style="text-decoration: none;color: #000;" @click="user">User</a>
            </div>
            <input type="text" class="search-box" style="padding: 5px 10px;border-radius: 5px;border: 1px solid #ccc;" placeholder="Search">
            <div class="welcome-text" style="font-weight: bold;color: #0066cc;">Welcome {{userData.fullname}}</div>
        </div>
        
        <div class="content-section" style="display: grid;grid-template-columns: 1fr 1fr;gap: 20px;margin-bottom: 20px;max-height: 500px;overflow-y: auto;padding-right: 5px;">
            <div class="subject-panel" style="border: 1px solid #000;border-radius: 15px;padding: 15px;" v-for="subject in subjects" :key="subject.id">
                <h2 class="subject-header" style="text-align: center;font-weight: bold;font-size: 1.2rem;margin-bottom: 10px;">id:{{subject.id}}  {{subject.name}} <router-link :to="{name: 'subject_update', params: {subjectId: subject.id}}" class="btn btn-warning" >Edit</router-link> / <a @click="delete_subject(subject.id)" class="btn btn-danger" type="button"  >Delete</a></h2>
                
                <table class="chapter-table" style="width: 100%;border-collapse: collapse;margin-bottom: 15px;">
                    <thead>
                        <tr>
                            <th style="background-color: #87CEFA;padding: 8px;text-align: left;border: 1px solid #87CEFA;">Chapter id</th>
                            <th style="background-color: #87CEFA;padding: 8px;text-align: left;border: 1px solid #87CEFA;">Chapter name</th>
                            <th style="background-color: #87CEFA;padding: 8px;text-align: left;border: 1px solid #87CEFA;">No.of Quiz</th>
                            <th style="background-color: #87CEFA;padding: 8px;text-align: left;border: 1px solid #87CEFA;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="chapter in filteredChapters(subject.id)" :key="chapter.id">
                            <td style="padding: 8px;border-bottom: 1px solid #ddd;">{{chapter.id}}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #ddd;">{{chapter.name}}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #ddd;">{{quizCount(chapter.id)}}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #ddd;"><router-link :to="{name: 'chapter_update', params: {chapterId: chapter.id}}" class="btn btn-warning" >Edit</router-link> / <a @click="delete_chapter(chapter.id)" class="btn btn-danger btn-sm" type="button"  >Delete</a></td>
                        </tr>
                    </tbody>
                
                </table>
                
                <a @click="addChapter(subject.id)" class="add-button" style="background-color: #FFB6C1;border: none;padding: 5px 10px;border-radius: 5px;cursor: pointer;color: #000;margin-left: 63%;" type="button">+ Chapter</a>
            </div>
        </div>
        <a @click="addSubject" class="btn btn-primary add-circle ;" style="width: 40px;height: 40px;background-color: white;border: 2px solid #FFA500;border-radius: 50%;display: flex;justify-content: center;align-items: center;margin: 0 auto;color: #FFA500;font-size: 24px;cursor: pointer;" >+</a>
        
        
        
    </div>
    `,
    data: function(){
        return{
            userData:"",
            subjects:null,
            chapters:null,
            quizzes:null
        }
    },
    methods: {
        filteredChapters(subjectId) {
            if (!this.chapters || this.chapters.length === 0) return [];
            return this.chapters.filter(chapter => chapter.subject_id === subjectId);
        },
        
        quizCount(chapterId) {
            if (!this.quizzes || this.quizzes.length === 0) return 0;
            return this.quizzes.filter(quiz => quiz.chapter_id === chapterId).length;
        },
        addSubject: function(){
            this.$router.push('/add/subject')
        },
        
        addChapter: function(subjectId){
            this.$router.push(`/add/chapter/${subjectId}`)
        },
        Quiz: function(){
            this.$router.push('/quiz_management')
        },
        summary: function(){
            this.$router.push('/summary')
        },
        user: function(){
            this.$router.push('/user_list')
        },
        delete_subject: function(subject_id){
            // Add confirmation dialog
            if (!confirm('Are you sure you want to delete this subject? This will also delete all associated chapters, quizzes, and questions.')) {
                return;
            }
            
            fetch(`/apisubject/delete/${subject_id}`, {  // Fixed: Use backticks for template literal
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
        delete_chapter: function(chapter_id){
            // Add confirmation dialog
            if (!confirm('Are you sure you want to delete this chapter? This will also delete all associated  quizzes, and questions.')) {
                return;
            }
            
            fetch(`/apichapter/delete/${chapter_id}`, {  // Fixed: Use backticks for template literal
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

    },
}