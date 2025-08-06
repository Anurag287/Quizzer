import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router'
import Signup from './components/Signup'
import Signin from './components/Signin'
import Createquiz from './components/Createquiz'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Signup/>}/>
        <Route path='/admin/signup' element = {<Signup/>}/>
        <Route path='/admin/signin' element = {<Signin/>}/>
        <Route path='/admin/quiz' element = {<Createquiz/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
