export default {
    template: `
<div v-if="formType === 'subject'">
    <div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
        <div class="form-container" style=" width: 350px;border: 2px solid #555;border-radius: 20px;padding: 20px;position: relative;">
            <div class="form-title" style=" text-align: center;color: #ff8c00;font-size: 20px;margin-bottom: 20px;font-weight: bold;">New Subject</div>
            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Name:</label>
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="name" v-model="subject.name">
            </div>
            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Description:</label>
                <textarea class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="description" v-model="subject.description" ></textarea>
            </div>
            
            
            <div class="button-row" style="display: flex;justify-content: center;gap: 20px;margin-top: 10px;">
                <button class="form-button" style="padding: 8px 20px;background-color: #a7d8ff;border: 1px solid #4682b4;border-radius: 5px;color: #000;cursor: pointer;" type="submit" @click="save_subject">Save</button>
                <router-link to="/admin_dashboard" class="form-button" style="padding: 8px 20px;background-color: #a7d8ff;border: 1px solid #4682b4;border-radius: 5px;color: #000;cursor: pointer;" type="reset">Cancel</router-link>
            </div>
        </div>
        </div>
    </div>
</div>

<div v-else-if="formType === 'chapter'">
    <div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
        <div class="form-container" style=" width: 350px;border: 2px solid #555;border-radius: 20px;padding: 20px;position: relative;">
            <div class="form-title" style=" text-align: center;color: #ff8c00;font-size: 20px;margin-bottom: 20px;font-weight: bold;">New Chapter</div>
            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Subject Id:</label>
                
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" v-model="chapter.subject_id" readonly>
            </div>

            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Name:</label>
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="name" v-model="chapter.name">
            </div>
            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Description:</label>
                <textarea class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="description" v-model="chapter.description" ></textarea>
            </div>
            
            
            <div class="button-row" style="display: flex;justify-content: center;gap: 20px;margin-top: 10px;">
                <button class="form-button" style="padding: 8px 20px;background-color: #a7d8ff;border: 1px solid #4682b4;border-radius: 5px;color: #000;cursor: pointer;" type="submit" @click="save_chapter">Save</button>
                <router-link to="/admin_dashboard" class="form-button" style="padding: 8px 20px;background-color: #a7d8ff;border: 1px solid #4682b4;border-radius: 5px;color: #000;cursor: pointer;" type="reset">Cancel</router-link>
            </div>
        </div>
        </div>
    </div>
</div>

<div v-else-if="formType === 'quiz'">
    <div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
        <div class="form-container" style=" width: 350px;border: 2px solid #555;border-radius: 20px;padding: 20px;position: relative;">
            <div class="form-title" style=" text-align: center;color: #ff8c00;font-size: 20px;margin-bottom: 20px;font-weight: bold;">New Quiz</div>
            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Chapter Id:</label>
                
                <select  type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" v-model="quiz.chapter_id">
                    <option value="">Select a Chapter</option>
                    <option v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
                        {{ chapter.id }}
                    </option>
                </select>
            </div>


            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Duration:</label>
                <input type="number" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="duration" v-model="quiz.time_duration" placeholder="Duration in minutes">
            </div>
            
            
            <div class="button-row" style="display: flex;justify-content: center;gap: 20px;margin-top: 10px;">
                <button class="form-button" style="padding: 8px 20px;background-color: #a7d8ff;border: 1px solid #4682b4;border-radius: 5px;color: #000;cursor: pointer;" type="submit" @click="save_quiz">Save</button>
                <router-link to="/quiz_management" class="form-button" style="padding: 8px 20px;background-color: #a7d8ff;border: 1px solid #4682b4;border-radius: 5px;color: #000;cursor: pointer;" type="reset">Cancel</router-link>
            </div>
        </div>
        </div>
    </div>
</div>

<div v-else-if="formType === 'question'">
    <div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
        <div class="form-container" style=" width: 350px;border: 2px solid #555;border-radius: 20px;padding: 20px;position: relative;">
            <div class="form-title" style=" text-align: center;color: #ff8c00;font-size: 20px;margin-bottom: 20px;font-weight: bold;">New Question</div>
            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">quiz ID:</label>
                
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" v-model="question.quiz_id" readonly>
            </div>


            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Question Statement:</label>
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="name" v-model="question.question_text" >
            </div>

            <div class="options-container" style="border: 2px solid #999;border-radius: 10px;padding: 15px;margin: 20px 0;">
            <div class="options-title" style="color: #f90;font-weight: bold;text-align: center;margin-bottom: 15px;">Single Option Correct</div>
      

            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Option 1)</label>
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="name" v-model="question.option1">
            </div>
            
            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Option 2)</label>
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="name" v-model="question.option2">
            </div>

            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Option 3)</label>
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="name" v-model="question.option3">
            </div>

            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">Option 4)</label>
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="name" v-model="question.option4">
            </div>

            <div class="form-row" style=" margin-bottom: 15px;display: flex;align-items: center;">
                <label class="form-label" style="color: #4682b4;width: 100px;text-align: right;padding-right: 10px;">correct_option</label>
                <input type="text" class="form-input" style="flex: 1;padding: 8px;border: 2px solid #4682b4;border-radius: 5px;" name="name" v-model="question.correct_option">
            </div>
            
            <div class="button-row" style="display: flex;justify-content: center;gap: 20px;margin-top: 10px;">
                <button class="form-button" style="padding: 8px 20px;background-color: #a7d8ff;border: 1px solid #4682b4;border-radius: 5px;color: #000;cursor: pointer;" type="submit" @click="save_question">Save</button>
                <router-link to="/quiz_management" class="form-button" style="padding: 8px 20px;background-color: #a7d8ff;border: 1px solid #4682b4;border-radius: 5px;color: #000;cursor: pointer;" type="reset">Cancel</router-link>
            </div>
        </div>
        </div>
    </div>
</div>
    `,
    data: function(){
        return {
            userData: "",
            formType: "",
            chapters:"",
            subject: {
                name: '',
                description: '',
            },
            chapter:{
                subject_id:'',
                name: '',
                description: '',
            },
            quiz:{
                chapter_id:'',
                time_duration:'',

            },
            question:{
                quiz_id:"",
                question_text:"",
                option1:"",
                option2:"",
                option3:"",
                option4:"",
                correct_option:"",
            },

            
        }
    },
    methods:{
        save_subject: function(){
            fetch('/apisubject/create',{
                method: 'POST',
                headers:{
                    "Content-Type":'application/json',
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body:JSON.stringify(this.subject)
            })
            .then(response => response.json())
            .then(data=>{
                alert(data.message)
                this.$router.push('/admin_dashboard')
                this.formType = null
            })
        },

        save_chapter: function(){
            fetch('/apichapter/create',{
                method: 'POST',
                headers:{
                    "Content-Type":'application/json',
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body:JSON.stringify(this.chapter)
            })
            .then(response => response.json())
            .then(data=>{
                alert(data.message)
                this.$router.push('/admin_dashboard')
                this.formType = ""
            })
        },
        save_quiz: function(){
            fetch('/apiquiz/create',{
                method: 'POST',
                headers:{
                    "Content-Type":'application/json',
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body:JSON.stringify(this.quiz)
            })
            .then(response => response.json())
            .then(data=>{
                alert(data.message)
                this.$router.push('/quiz_management')
                this.formType = ""
            })
        },

        save_question: function(){
            fetch('/apiquestion/create',{
                method: 'POST',
                headers:{
                    "Content-Type":'application/json',
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body:JSON.stringify(this.question)
            })
            .then(response => response.json())
            .then(data=>{
                alert(data.message)
                this.$router.push('/quiz_management')
                this.formType = ""
            })
        }
        // determineFormType() {
        //     console.log('Current route:', this.$route.path);
        //     if (this.$route.path === '/add/subject') {
        //         this.formType = 'subject';
        //     } else if (this.$route.path.startsWith('/add/chapter/')) {
        //         this.formType = 'chapter';
        //         this.chapter.subject_id = this.$route.params.subjectId;
        //     } else if (this.$route.path === '/add/quiz') {
        //         this.formType = 'quiz';
        //     } else {
        //         console.log('Unknown route, formType remains:', this.formType);
        //     }
        //     console.log('Form type set to:', this.formType);
        // }

        

    },
    // mounted() {
    //     this.determineFormType();
    // },
    
    // // Fixed watch to handle route changes
    // watch: {
    //     '$route'(to, from) {
    //         console.log('Route changed from', from.path, 'to', to.path);
    //         this.determineFormType();
    //     }
    // }

    // Add this mounted hook to set formType based on route
    mounted() {
         
        if (this.$route.path.startsWith('/add/chapter/')) {
            this.formType = 'chapter';
            // Set the subject_id from route params
            this.chapter.subject_id = this.$route.params.subjectId;
        }
        if (this.$route.path === '/add/subject') {
            this.formType = 'subject';
        }
        if (this.$route.path ==='/add/quiz') {
            this.formType = 'quiz';
            // Set the subject_id from route params
        }
        if (this.$route.path.startsWith('/add/question/')) {
            this.formType = 'question';
            // Set the subject_id from route params
            this.question.quiz_id = this.$route.params.quizId;
        }
        fetch('/apichapter/get',{
                method: 'GET',
                headers:{
                    "Content-Type":"application/json",
                    "Authentication-Token":localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.chapters = data)
    },
    
    // Add this watch to handle route changes
    watch: {
        '$route'(to, from) {
            if (to.path === '/add/subject') {
                this.formType = 'subject';
            } else if (to.path.startsWith('/add/chapter/')) {
                this.formType = 'chapter';
                this.chapter.subject_id = to.params.subjectId;
            }else if (to.path==='/add/quiz') {
                this.formType = 'quiz';
            }else if (to.path.startsWith('/add/question/')) {
                this.formType = 'question';
            }
        }
    }
}

