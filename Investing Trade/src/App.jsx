import { Routes, Route } from 'react-router-dom';
import Login from './Start/Login.jsx'
import Password from './Start/Password.jsx'
import SignUp from './Start/SignUp.jsx'
import Invest from './Main/Invest.jsx';
import News from './Flatfform/News.jsx';

function App() {
  return (
    <div >
      <Routes>        
        <Route path="/" element={<SignUp />} />
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/invest" element={<Invest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password" element={<Password />} />
        <Route path="/signup" element={<SignUp />} /> 
      </Routes>
    </div>
  )
}
export default App