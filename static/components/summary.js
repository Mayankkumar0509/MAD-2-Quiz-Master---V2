export default {
    template: `
    <div class="dashboard-container" style="max-width: 800px;margin: 20px auto;border: 2px solid #0066cc;border-radius: 15px;padding: 20px;background-color: white;">
        <h1 class="dashboard-header" style="text-align: center;color: #0066cc;margin-bottom: 10px;font-weight: bold;font-size: 1.5rem;">Summary</h1>
        
        <div class="nav-bar" style="display: flex;justify-content: space-between;background-color: #87CEFA;padding: 10px;border-radius: 10px;margin-bottom: 20px;">
            <div class="nav-links" style="display: flex;gap: 10px;">
                <router-link to='/admin_dashboard' style="text-decoration: none;color: #000;" type="button">Home</router-link> |
                <router-link to="/quiz_management" style="text-decoration: none;color: #000;" type="button">Quiz</router-link> |
                <router-link to="/summary" style="text-decoration: none;color: #000;" type="button">Summary</router-link> |
                <router-link to="/user_list" style="text-decoration: none;color: #000;" type="button">User</router-link> 
            </div>
            <input type="text" class="search-box" style="padding: 5px 10px;border-radius: 5px;border: 1px solid #ccc;" placeholder="Search">
            <div class="welcome-text" style="font-weight: bold;color: #0066cc;">Welcome {{userData.fullname}}</div>
        </div>
        
        <div class="panel" style="border: 1px solid #4a90e2;border-radius: 10px;padding: 15px;margin-bottom: 20px;">
            <h3 class="panel-title" style="text-align: center;margin-top: 0;color: #4a90e2;margin-bottom: 15px;">Scores Summary</h3>
            
            <div class="table-responsive" style="overflow-x: auto;">
                <table style="width: 100%;border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Score ID</th>
                            <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">User ID</th>
                            <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">User Name</th>
                            <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Subject ID</th>
                            <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Chapter ID</th>
                            <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Quiz ID</th>
                            <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Date and Time</th>
                            <th style="background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!scores || scores.length === 0">
                            <td colspan="8" style="padding: 8px;text-align: center;border-bottom: 1px solid #e0e0e0;">No scores found</td>
                        </tr>
                        <tr v-for="score in scores" :key="score.id">
                            <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ score.id }}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ score.user_id }}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ getUserName(score.user_id) }}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ getSubjectId(score.quiz_id) }}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ getChapterId(score.quiz_id) }}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ score.quiz_id }}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ score.attempt_date }}</td>
                            <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{ score.score }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    data: function(){
        return {
            userData: "",
            scores: null,
            users: null,
            quizzes: null,
            chapters: null,
            subjects: null
        }
    },
    methods: {
        getUserName(userId) {
            if (!this.users) return 'Loading...';
            const user = this.users.find(u => u.id === userId);
            return user ? user.fullname : 'Unknown User';
        },
        
        getSubjectId(quizId) {
            if (!this.quizzes || !this.chapters) return 'Loading...';
            const quiz = this.quizzes.find(q => q.id === quizId);
            if (!quiz) return 'Unknown';
            const chapter = this.chapters.find(c => c.id === quiz.chapter_id);
            return chapter ? chapter.subject_id : 'Unknown';
        },
        
        getChapterId(quizId) {
            if (!this.quizzes) return 'Loading...';
            const quiz = this.quizzes.find(q => q.id === quizId);
            return quiz ? quiz.chapter_id : 'Unknown';
        }
    },
    
    mounted(){
        // Fetch admin user data
        fetch('/api/admin', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.userData = data)
        .catch(error => console.error('Error fetching admin data:', error));

        // Fetch scores data
        fetch('/apiscore/get', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.scores = data)
        .catch(error => console.error('Error fetching scores:', error));

        // Fetch users data (you'll need to create this endpoint)
        // For now, we'll create a placeholder
        // You'll need to implement a users API endpoint
        fetch('/apiuser/get', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.users = data)
        .catch(error => console.error('Error fetching scores:', error));

        // Fetch quizzes data
        fetch('/apiquiz/get', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.quizzes = data)
        .catch(error => console.error('Error fetching quizzes:', error));

        // Fetch chapters data
        fetch('/apichapter/get', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.chapters = data)
        .catch(error => console.error('Error fetching chapters:', error));

        // Fetch subjects data
        fetch('/apisubject/get', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.subjects = data)
        .catch(error => console.error('Error fetching subjects:', error));
    }
}