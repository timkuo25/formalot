import './App.css';
import { Homepage } from './Pages/Homepage';
import { MakeSurvey } from './Pages/MakeSurvey';
import { MakeSurvey2 } from './Pages/MakeSurvey2';
import SurveyManagement from './Pages/SurveyManagement';
import { Register } from './Pages/Register';
import { Instruction } from './Pages/Instruction';
import{ Profile } from './Pages/Profile';
import { Explore } from './Pages/Explore';
import { ForgetPassword } from './Pages/ForgetPassword';
import { EditProfile } from './Pages/EditProfile';
import { Form } from './Pages/Form'
import SendEmail from './Pages/SendEmail';
import  { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path='/form/:form_id' element={<Form/>}/>
        <Route path='/form/:form_id/:send_email' element={<Form/>}/>
        <Route path='/sendEmail' element={<SendEmail />}/>
        {/* <Route path='/lottery/:form_id' element={<Lottery/>} /> */}
        {/* <Route path='/Fillin/:form_id' element={<Fillin/>}/> */}
        {/* <Route path='/SurveyStatistics' element={<SurveyStatistics/>}/> */}
        <Route path='/instruction' element={<Instruction/>}/>
        <Route path='/SurveyManagement' element={<SurveyManagement/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/MakeSurvey' element={<MakeSurvey/>}/>
        <Route path='/MakeSurvey2' element={<MakeSurvey2/>}/>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/ForgetPassword' element={<ForgetPassword/>}/>
        <Route path='/editProfile' element={<EditProfile/>}/>
      </Routes>
    </Router>
    
  );
}

export default App;

