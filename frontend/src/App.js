import './App.css';
import { Homepage } from './Pages/Homepage';
import { MakeSurvey } from './Pages/MakeSurvey';
import { SurveyManagement } from './Pages/SurveyManagement'; 
import { Lottery } from './Pages/Lottery';
import { Register } from './Pages/Register';
import { Login } from './Pages/Login';


const App = () => {


  return (
    <>
      <Register /> 
      <Homepage /> 
      <Lottery />
    </>
  );
}

export default App;
