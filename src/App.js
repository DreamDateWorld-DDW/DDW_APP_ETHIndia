import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserDasBoard from "./components/UserDashboard/UserDashboard"
import MatchProfile from './components/MatchProfile/MatchProfile'
import Navbar from './components/Navbar/Navbar'
import Profile from './components/Profile/Profile'
import SearchProfile from "./components/SearchProfile/SearchProfile"
import Logo from "./components/Logo/Logo"
 
function App() {
  
  return (
    <>
    <Logo/>
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Navbar/>} />
      <Route exact path="/Profile"   element={<Profile />} />
      <Route exact path="/Matchprofile"   element={<MatchProfile/>} />
      <Route exact path="/Userdashboard"   element={<UserDasBoard />} /> 
      <Route exact path="/Searchprofile"   element={<SearchProfile />} />
     </Routes>
  </BrowserRouter>
  </>
  );
}

export default App;
