import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import user_dashboard from './components/user_dashboard.js'
import user_score from './components/user_score.js'
import quiz_taking from './components/quiz_taking.js'
import admin_dashboard from './components/admin_dashboard.js'
import add from './components/add.js'
import quiz_management from './components/quiz_management.js'
import summary from './components/summary.js'
import user_list from './components/user_list.js'
import edit from './components/edit.js'

const routes = [
    {path: '/',component:Home},
    {path: '/login', component:Login},
    {path: '/register', component:Register},
    {path: '/user_dashboard', component:user_dashboard},
    {path: '/admin_dashboard', component:admin_dashboard},
    {path: '/user_score', component:user_score},
    {path: '/quiz_management', component:quiz_management},
    { path: '/add/subject', component: add },
    { path: '/add/chapter/:subjectId', component: add },
    { path:'/add/quiz', component: add},
    { path: '/add/question/:quizId', component: add },
    { path: '/edit/subject/:subjectId', name:'subject_update', component: edit },
    { path: '/edit/chapter/:chapterId', name:'chapter_update', component: edit },
    { path: '/edit/quiz/:quizId', name:'quiz_update', component: edit },
    { path: '/edit/question/:questionId', name:'question_update', component: edit },
    {path: '/take_quiz/:id', component:quiz_taking},
    {path: '/summary',component:summary},
    {path: '/user_list', component:user_list},
]

const router = new VueRouter({
    routes
})

const app = new Vue ({
    el : "#app",
    router,
    template:`
    <div class="container">
        <nav-bar :loggedIn = 'loggedIn' @logout="handleLogout"></nav-bar>
        <router-view :loggedIn = 'loggedIn' @login="handleLogin"></router-view>
        <foot></foot>
    </div>
    `,
    data:{
        loggedIn: false
    },
    components:{
        "nav-bar": Navbar,
        "foot": Footer
    },
    methods:{
        handleLogout(){
            this.loggedIn = false
        },
        handleLogin(){
            this.loggedIn = true
        }
    },
    // Initialize loggedIn state based on localStorage when app starts
    created(){
        this.loggedIn = !!localStorage.getItem('auth_token')
    }
})