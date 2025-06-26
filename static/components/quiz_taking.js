export default {
    template: `
    <div class="container" style="max-width: 900px; margin: 20px auto; background-color: white; border: 2px solid #4a90e2; border-radius: 15px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div v-if="!quizStarted" class="text-center">
            <h2>Quiz: {{ quizDetails.chapter_name }} - {{ quizDetails.subject_name }}</h2>
            <div class="card mt-4">
                <div class="card-body">
                    <h5>Quiz Information</h5>
                    <p><strong>Duration:</strong> {{ quizDetails.time_duration }} minutes</p>
                    <p><strong>Total Questions:</strong> {{ quizDetails.question_count }}</p>
                    <p><strong>Date:</strong> {{ quizDetails.date_of_quiz }}</p>
                    <button class="btn btn-primary btn-lg" @click="startQuiz">Start Quiz</button>
                    <router-link to="/user_dashboard" class="btn btn-secondary btn-lg ms-2">Back to Dashboard</router-link>
                </div>
            </div>
        </div>

        <div v-if="quizStarted && !quizCompleted">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>{{ quizDetails.chapter_name }} Quiz</h3>
                <div class="timer" style="font-size: 1.2em; font-weight: bold; color: #dc3545;">
                    Time Remaining: {{ formatTime(timeRemaining) }}
                </div>
            </div>

            <div class="progress mb-4">
                <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            
            <div class="question-counter mb-3">
                Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
            </div>

            <div v-if="currentQuestion" class="card">
                <div class="card-body">
                    <h5 class="card-title">{{ currentQuestion.question_text }}</h5>
                    <div class="mt-3">
                        <div class="form-check mb-2" v-for="(option, index) in getOptions(currentQuestion)" :key="index">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                :id="'option' + (index + 1)"
                                :value="index + 1"
                                v-model="answers[currentQuestion.id]"
                            >
                            <label class="form-check-label" :for="'option' + (index + 1)">
                                {{ option }}
                            </label>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <button 
                            class="btn btn-secondary me-2" 
                            @click="previousQuestion" 
                            :disabled="currentQuestionIndex === 0"
                        >
                            Previous
                        </button>
                        
                        <button 
                            v-if="currentQuestionIndex < questions.length - 1"
                            class="btn btn-primary" 
                            @click="nextQuestion"
                        >
                            Next
                        </button>
                        
                        <button 
                            v-else
                            class="btn btn-success" 
                            @click="submitQuiz"
                        >
                            Submit Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="quizCompleted" class="text-center">
            <div class="card">
                <div class="card-body">
                    <h2 class="text-success">Quiz Completed!</h2>
                    <div class="mt-4">
                        <h4>Your Score: {{ finalScore }}/{{ questions.length }}</h4>
                        <p class="text-muted">Percentage: {{ Math.round((finalScore / questions.length) * 100) }}%</p>
                    </div>
                    <router-link to="/user_dashboard" class="btn btn-primary mt-3">Back to Dashboard</router-link>
                    <router-link to="/user_score" class="btn btn-info mt-3 ms-2">View All Scores</router-link>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            quizId: null,
            quizDetails: {},
            questions: [],
            currentQuestionIndex: 0,
            answers: {},
            quizStarted: false,
            quizCompleted: false,
            timeRemaining: 0,
            timer: null,
            finalScore: 0,
            finalPercentage: 0,

        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex] || null;
        },
        progressPercentage() {
            return this.questions.length > 0 ? ((this.currentQuestionIndex + 1) / this.questions.length) * 100 : 0;
        }
    },
    mounted() {
        this.quizId = this.$route.params.id;
        this.loadQuizDetails();
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        loadQuizDetails() {
            // Get quiz details from the quizzes list in user dashboard
            // For now, we'll fetch it from the API
            fetch('/apiquiz/get', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.quizDetails = data.find(quiz => quiz.id == this.quizId) || {};
                this.loadQuestions();
            })
            .catch(error => {
                console.error('Error loading quiz details:', error);
                alert('Error loading quiz details');
            });
        },
        
        loadQuestions() {
            fetch('/apiquestion/get', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.questions = data.filter(question => question.quiz_id == this.quizId);
                if (this.questions.length === 0) {
                    alert('This quiz has no questions yet!');
                    this.$router.push('/user_dashboard');
                }
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                alert('Error loading questions');
            });
        },
        
        startQuiz() {
            this.quizStarted = true;
            this.timeRemaining = this.quizDetails.time_duration * 60; // Convert minutes to seconds
            this.startTimer();
        },
        
        startTimer() {
            this.timer = setInterval(() => {
                this.timeRemaining--;
                if (this.timeRemaining <= 0) {
                    this.submitQuiz();
                }
            }, 1000);
        },
        
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },
        
        getOptions(question) {
            return [question.option1, question.option2, question.option3, question.option4];
        },
        
        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
            }
        },
        
        previousQuestion() {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
            }
        },
        
        submitQuiz() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            
            // Calculate score
            this.finalScore = 0;
            this.questions.forEach(question => {
                if (this.answers[question.id] && this.answers[question.id] === question.correct_option) {
                    this.finalScore++;
                }
            });
            this.finalPercentage = this.questions.length > 0 ? 
                Math.round((this.finalScore / this.questions.length) * 100) : 0;
            
            // Submit score to backend
            const scoreData = {
                quiz_id: this.quizId,
                score: this.finalPercentage,
                total_questions: this.questions.length
            };
            
            fetch('/api/submit_quiz', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(scoreData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Quiz submitted successfully');
                this.quizCompleted = true;
            })
            .catch(error => {
                console.error('Error submitting quiz:', error);
                // Still show completion even if submission fails
                this.quizCompleted = true;
            });
        }
    }
}



