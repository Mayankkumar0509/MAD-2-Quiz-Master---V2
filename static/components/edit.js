export default {
    template: `
<div v-if="formType === 'subject'">
    <div class="form-container" style=" max-width: 600px;margin: 20px auto;border: 2px solid #0066cc;border-radius: 15px;padding: 20px;background-color: white;" >
        <h1 class="form-header" style="text-align: center;color: #0066cc;margin-bottom: 20px;font-weight: bold;font-size: 1.5rem;">Edit Subject</h1>
        
        
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Subject Name:</label>
                <input type="text" id="name" name="name" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="subject.name">
            </div>
            
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="description" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Description:</label>
                
                <input id="description" name="description" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" rows="4" v-model="subject.description">
            </div>
            
            <div class="form-buttons" style="display: flex;justify-content: space-between;margin-top: 20px;">
                <router-link to="/admin_dashboard" class="btn btn-secondary" style="background-color: #ccc;color: black;border: none;" type="reset">Cancel</router-link>
                <button type="submit" class="btn btn-primary" style="background-color: #0066cc;color: white;border: none;" @click="update_subject">Update Subject</button>
            </div>
        
    </div>
</div>

<div v-else-if="formType === 'chapter'">
    <div class="form-container" style=" max-width: 600px;margin: 20px auto;border: 2px solid #0066cc;border-radius: 15px;padding: 20px;background-color: white;" >
        <h1 class="form-header" style="text-align: center;color: #0066cc;margin-bottom: 20px;font-weight: bold;font-size: 1.5rem;">Edit Chapter</h1>
        
        
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Chapter Name:</label>
                <input type="text" id="name" name="name" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="chapter.name">
            </div>
            
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="description" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Description:</label>
                
                <input id="description" name="description" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" rows="4" v-model="chapter.description">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">subject Id:</label>
                <input type="integer" id="id" name="id" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="chapter.subject_id">
            </div>
            
            <div class="form-buttons" style="display: flex;justify-content: space-between;margin-top: 20px;">
                <router-link to="/admin_dashboard" class="btn btn-secondary" style="background-color: #ccc;color: black;border: none;" type="reset">Cancel</router-link>
                <button type="submit" class="btn btn-primary" style="background-color: #0066cc;color: white;border: none;" @click="update_chapter">Update chapter</button>
            </div>
        
    </div>
</div>

<div v-else-if="formType === 'quiz'">
    <div class="form-container" style=" max-width: 600px;margin: 20px auto;border: 2px solid #0066cc;border-radius: 15px;padding: 20px;background-color: white;" >
        <h1 class="form-header" style="text-align: center;color: #0066cc;margin-bottom: 20px;font-weight: bold;font-size: 1.5rem;">Edit quiz</h1>
        
        
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Chapter Id:</label>
                <input type="integer" id="id" name="id" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="quiz.chapter_id">
            </div>
            
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="description" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Time Duration:</label>
                
                <input id="integer" name="duration" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" rows="4" v-model="quiz.time_duration">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Date of Quiz </label>
                <input type="date" id="date" name="date" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="quiz.date_of_quiz">
            </div>
            
            <div class="form-buttons" style="display: flex;justify-content: space-between;margin-top: 20px;">
                <router-link to="/quiz_management" class="btn btn-secondary" style="background-color: #ccc;color: black;border: none;" type="reset">Cancel</router-link>
                <button type="submit" class="btn btn-primary" style="background-color: #0066cc;color: white;border: none;" @click="update_quiz">Update Quiz</button>
            </div>
        
    </div>
</div>

<div v-else-if="formType === 'question'">
    <div class="form-container" style=" max-width: 600px;margin: 20px auto;border: 2px solid #0066cc;border-radius: 15px;padding: 20px;background-color: white;" >
        <h1 class="form-header" style="text-align: center;color: #0066cc;margin-bottom: 20px;font-weight: bold;font-size: 1.5rem;">Edit question</h1>
        
        
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Quiz Id:</label>
                <input type="integer" id="id" name="id" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="question.quiz_id">
            </div>
            
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="description" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Question Statement:</label>
                
                <input id="text" name="text" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" rows="4" v-model="question.question_text">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Option 1 </label>
                <input type="text" id="option1" name="option1" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="question.option1">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Option 2 </label>
                <input type="text" id="option2" name="option2" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="question.option2">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Option 3 </label>
                <input type="text" id="option3" name="option3" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="question.option3">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Option 4 </label>
                <input type="text" id="option4" name="option4" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="question.option4">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" class="form-label" style="font-weight: bold;margin-bottom: 5px;display: block;">Correct Option</label>
                <input type="integer" id="correct_option" name="correct_option" class="form-control" style="width: 100%;padding: 8px;border: 1px solid #ccc;border-radius: 5px;" v-model="question.correct_option">
            </div>
            
            <div class="form-buttons" style="display: flex;justify-content: space-between;margin-top: 20px;">
                <router-link to="/quiz_management" class="btn btn-secondary" style="background-color: #ccc;color: black;border: none;" type="reset">Cancel</router-link>
                <button type="submit" class="btn btn-primary" style="background-color: #0066cc;color: white;border: none;" @click="update_question">Update Question</button>
            </div>
        
    </div>
</div>


    `,
    data: function(){
        return {

            formType: "",
            subjectId: null,
            chapterId:null,
            quizId:null,
            questionId:null,
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
                date_of_quiz:"",
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
        update_subject: function(){
            fetch(`/apisubject/update/${this.subjectId}`,{
                method: 'PUT',
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
        
        update_chapter: function(){
            fetch(`/apichapter/update/${this.chapterId}`,{
                method: 'PUT',
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
                this.formType = null
            })
        },

        update_quiz: function(){
            fetch(`/apiquiz/update/${this.quizId}`,{
                method: 'PUT',
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
                this.formType = null
            })
        },

        update_question: function(){
            fetch(`/apiquestion/update/${this.questionId}`,{
                method: 'PUT',
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
                this.formType = null
            })
        },

        loadSubjectData: function(){
            // Load existing subject data
            fetch('/apisubject/get', {
                method: 'GET',
                headers:{
                    "Content-Type":"application/json",
                    "Authentication-Token":localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                // Find the subject with matching ID
                const subject = data.find(s => s.id == this.subjectId);
                if(subject) {
                    this.subject.name = subject.name;
                    this.subject.description = subject.description;
                }
            })
        },
        loadChapterData: function(){
            // Load existing subject data
            fetch('/apichapter/get', {
                method: 'GET',
                headers:{
                    "Content-Type":"application/json",
                    "Authentication-Token":localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                // Find the subject with matching ID
                const chapter = data.find(c => c.id == this.chapterId);
                if(chapter) {
                    this.chapter.name = chapter.name;
                    this.chapter.description = chapter.description;
                    this.chapter.subject_id = chapter.subject_id;
                }
            })
        },
        loadQuizData: function(){
            // Load existing subject data
            fetch('/apiquiz/get', {
                method: 'GET',
                headers:{
                    "Content-Type":"application/json",
                    "Authentication-Token":localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                // Find the subject with matching ID
                const quiz = data.find(q => q.id == this.quizId);
                if(quiz) {
                    this.quiz.chapter_id = quiz.chapter_id;
                    this.quiz.date_of_quiz = quiz.date_of_quiz;
                    this.quiz.time_duration = quiz.time_duration
                }
            })
        },

        loadQuestionData: function(){
            // Load existing subject data
            fetch('/apiquestion/get', {
                method: 'GET',
                headers:{
                    "Content-Type":"application/json",
                    "Authentication-Token":localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                // Find the subject with matching ID
                const question = data.find(qu => qu.id == this.questionId);
                if(question) {
                    this.question.quiz_id = question.quiz_id;
                    this.question.question_text = question.question_text;
                    this.question.option1 = question.option1;
                    this.question.option2 = question.option2;
                    this.question.option3 = question.option3;
                    this.question.option4 = question.option4;
                    this.question.correct_option = question.correct_option;
                }
            })
        },
    },
    
    mounted(){
        // Get subject ID from route parameters
        
        
        // Load existing subject data
        

        if (this.$route.path.startsWith('/edit/chapter/')) {
            this.formType = 'chapter';
            this.chapterId = this.$route.params.chapterId;
            this.loadChapterData();
            
        }
        if (this.$route.path.startsWith('/edit/subject/')) {
            this.formType = 'subject';
            this.subjectId = this.$route.params.subjectId;
            this.loadSubjectData();
        }
        if (this.$route.path.startsWith('/edit/quiz/')) {
            this.formType = 'quiz';
            this.quizId = this.$route.params.quizId;
            this.loadQuizData();
            // Set the subject_id from route params
        }
        if (this.$route.path.startsWith('/edit/question/')) {
            this.formType = 'question';
            this.questionId = this.$route.params.questionId;
            this.loadQuestionData();
        }
    },
     watch: {
        '$route'(to, from) {
            if (to.path.startsWith('/edit/subject/')) {
                this.formType = 'subject';
                this.subjectId = to.params.subjectId;
                this.loadSubjectData();
            } else if (to.path.startsWith('/edit/chapter/')) {
                this.formType = 'chapter';
                this.chapterId = to.params.chapterId;
                this.loadChapterData();
            }else if (to.path.startsWith('/edit/quiz/')) {
                this.formType = 'quiz';
                this.quizId = to.params.quizId;
                this.loadQuizData();
            }else if (to.path.startsWith('/edit/question/')) {
                this.formType = 'question';
                this.questionId = to.params.questionId;
                this.loadQuestionData();
            }
        }
    }
    
}