import './App.scss';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";
import Verify from './pages/verify/Verify';
import Generate from './pages/generate/Generate';
import { useState } from 'react';
import Manage from './pages/manage/Manage';

function App() {
  const tempUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(tempUser);
  return (
    <>
      <Router>
      <Navbar user={user} setUser={setUser}/>
        <Switch>
          <Route path="/" element={<Home user={user} setUser={setUser}/>}/>
          <Route path="/verify" element={<Verify />}/>
          <Route path="/signup" element={<Home user={user} setUser={setUser}/>}/>
          <Route path="/generate" element={<Generate user={user}/>}/>
          <Route path="/manage" element={<Manage user={user} />}/>
        </Switch>
      <Footer />
      </Router>
    </>
  );
}

export default App;
