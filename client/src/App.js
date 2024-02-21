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

function App() {
  return (
    <>
      <Router>
      <Navbar />
        <Switch>
          <Route path="/" element={<Home />}/>
          <Route path="/verify" element={<Verify />}/>
          <Route path="/signup" element={<Home />}/>
        </Switch>
      <Footer />
      </Router>
    </>
  );
}

export default App;
