import './App.scss';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Switch>
          <Route path="/" element={<Home />}/>
        </Switch>
      </Router>
      <Footer />
    </>
  );
}

export default App;
