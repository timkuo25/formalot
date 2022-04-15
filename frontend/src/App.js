import './App.css';
import { Homepage } from './Pages/Homepage';
import { MakeSurvey } from './Pages/MakeSurvey';
import { MakeSurvey2 } from './Pages/MakeSurvey2';
import { SurveyManagement } from './Pages/SurveyManagement'; 
import { Lottery } from './Pages/Lottery';
import { Register } from './Pages/Register';
import { Instruction } from './Pages/Instruction';
import { Explore } from './Pages/Explore';
import{ Profile } from './Pages/Profile';

import  { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/lottery' element={<Lottery/>}/>
        <Route path='/instruction' element={<Instruction/>}/>
        <Route path='/survey_management' element={<SurveyManagement/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/MakeSurvey' element={<MakeSurvey/>}/>
        <Route path='/MakeSurvey2' element={<MakeSurvey2/>}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/Profile' element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default App;

