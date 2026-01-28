import { Routes, Route } from 'react-router-dom';
import Login from './Start/Login.jsx'
import Password from './Start/Password.jsx'
import SignUp from './Start/SignUp.jsx'
import Invest from './Main/Invest.jsx';
import News from './Platform/News.jsx';
import Trade from './Platform/Trade.jsx';
import Portfolio from './Platform/Portfolio.jsx';

function App() {
  return (
    <div >
      <Routes>        
        <Route path="/" element={<Invest />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/news" element={<News />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password" element={<Password />} />
        <Route path="/signup" element={<SignUp />} /> 
      </Routes>
    </div>
  )
}
export default App