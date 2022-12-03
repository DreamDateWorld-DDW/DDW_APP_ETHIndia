import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"



function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route>
        <Route exact path="/" element={<Navbar/>} />
        </Route>
      </Routes>
     </BrowserRouter>
      
    </div>
  );
}

export default App;
