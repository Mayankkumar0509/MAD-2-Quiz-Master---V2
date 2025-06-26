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
                            <th style=" background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">User ID</th>
                            <th style=" background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">User username</th>
                            <th style=" background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">User Full name</th>
                            <th style=" background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Qualification</th>
                            <th style=" background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">DOB</th>
                            <th style=" background-color: #e6f0ff;padding: 8px;text-align: left;border-bottom: 1px solid #4a90e2;">Action</th>
                        </tr>
                    </thead>
                    <tbody>

                            <tr v-for="u in users" :key="u.id" >
                                <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{u.id}}</td>
                                <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{u.email}}</td>
                                <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{u.fullname}}</td>
                                <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{u.qualification}}</td>
                                <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">{{u.dob}}</td>
                                <td style="padding: 8px;border-bottom: 1px solid #e0e0e0;">
                                    <a @click="delete_user(u.id)" class="btn btn-danger btn-sm" type="button"  >Delete</a>
                                </td>
                            </tr>

                           
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    data: function(){
        return {
            users: null,
            userData:"",
        }
        
    },
    mounted(){
        fetch('/apiuser/get', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.users = data)

        fetch('/api/admin', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
        })
        .then(response => response.json())
        .then(data => this.userData = data)
    },
    methods:{
        delete_user: function(u_id){
            // Add confirmation dialog
            if (!confirm('Are you sure you want to delete this user? This will also delete all associated  score.')) {
                return;
            }
            
            fetch(`/apiuser/delete/${u_id}`, {  // Fixed: Use backticks for template literal
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
    }
}