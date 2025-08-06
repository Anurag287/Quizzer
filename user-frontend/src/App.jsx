import {BrowserRouter,Routes,Route} from 'react-router';
import './App.css'
import Signup from './components/Signup';
import Signin from './components/Signin';
import Attendquiz from './components/Attendquiz';
import Quizresults from './components/Quizresults';

function App() {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Signup/>}/>
        <Route path='/user/signup' element = {<Signup/>}/>
        <Route path='/user/signin' element = {<Signin/>}/>
        <Route path='/user/quiz' element = {<Attendquiz/>}/>
        <Route path='/user/result/:quizId' element = {<Quizresults/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
