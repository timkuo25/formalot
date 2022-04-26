import './App.css';
import { Homepage } from './Pages/Homepage';
import { MakeSurvey } from './Pages/MakeSurvey';
import { MakeSurvey2 } from './Pages/MakeSurvey2';
import { SurveyManagement } from './Pages/SurveyManagement'; 
import { Lottery } from './Pages/Lottery';
import { Register } from './Pages/Register';
import { Instruction } from './Pages/Instruction';
import{ Profile } from './Pages/Profile';
import { Explore } from './Pages/Explore';
import { ForgetPassword } from './Pages/ForgetPassword';
import { EditProfile } from './Pages/EditProfile';
import { Fillin} from './Pages/Fill-in'


import  { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/lottery' element={<Lottery/>}/>
        <Route path='/instruction' element={<Instruction/>}/>
        <Route path='/SurveyManagement' element={<SurveyManagement/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/MakeSurvey' element={<MakeSurvey/>}/>
        <Route path='/MakeSurvey2' element={<MakeSurvey2/>}/>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/ForgetPassword' element={<ForgetPassword/>}/>
        <Route path='/editProfile' element={<EditProfile/>}/>
        <Route path='/Fillin' element={<Fillin/>}/>

      </Routes>
    </Router>
  );
}

export default App;

