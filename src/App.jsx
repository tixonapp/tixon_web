import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventSections from './landing_page/components/EventsSection/EventsSection';
import Navbar from './landing_page/components/NavBar/NavBar';
import PhoneNavbar from './landing_page/components/PhoneNavBar/PhoneNavBar';
import EventPage from './pages/EventPage';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import ForgotPasswordPage from './pages/ForgotPassword';
import { FilterProvider } from './Context/FilterContext';
import data from './Data/data.json';
import './App.css';

document.title = 'Tixon';

function App() {
  return (
    <FilterProvider>
      <Router>
        <Navbar />
        <PhoneNavbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<EventSections />} />
            <Route path="/event/:id" element={<EventPage data={data} />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/signin" element={<SigninPage/>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
          </Routes>
        </div>
      </Router>
    </FilterProvider>
  );
}

export default App;
