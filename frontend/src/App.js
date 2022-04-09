import './App.css';
import { Homepage } from './Pages/Homepage';
import { MakeSurvey } from './Pages/MakeSurvey';
import { SurveyManagement } from './Pages/SurveyManagement'; 
import { Lottery } from './Pages/Lottery';
import { Register } from './Pages/Register';
import { Instruction } from './Pages/Instruction';

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
      </Routes>
    </Router>
  );
}

export default App;
