import './App.css';
import { Homepage } from './Pages/Homepage';
import { MakeSurvey } from './Pages/MakeSurvey';
import { MakeSurvey2 } from './Pages/MakeSurvey2';
import SurveyManagement from './Pages/SurveyManagement';
import { Lottery } from './Pages/Lottery';
import { Register } from './Pages/Register';
import { Instruction } from './Pages/Instruction';
import{ Profile } from './Pages/Profile';
import { Explore } from './Pages/Explore';
import { ForgetPassword } from './Pages/ForgetPassword';
import { EditProfile } from './Pages/EditProfile';
import { Fillin } from './Pages/Fill-in'
import { BrowseForm } from './Pages/Browse-form'
import { useEffect, useState, Link } from 'react';
import {SurveyStatistics} from './Pages/SurveyStatistics';


import  { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  // const [form_id, setFormid] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path='/browse/:form_id' element={<BrowseForm/>}/>
        <Route path='/lottery/:form_id' element={<Lottery/>} />
        <Route path='/instruction' element={<Instruction/>}/>
        <Route path='/SurveyManagement' element={<SurveyManagement/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/MakeSurvey' element={<MakeSurvey/>}/>
        <Route path='/MakeSurvey2' element={<MakeSurvey2/>}/>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/ForgetPassword' element={<ForgetPassword/>}/>
        <Route path='/editProfile' element={<EditProfile/>}/>
        <Route path='/Fillin/:form_id' element={<Fillin/>}/>
        <Route path='/SurveyStatistics' element={<SurveyStatistics/>}/>
      </Routes>
    </Router>
  );
}

export default App;

