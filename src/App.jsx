import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventSections from './landing_page/components/EventsSection/EventsSection';
import Navbar from './landing_page/components/NavBar/NavBar';
import PhoneNavbar from './landing_page/components/PhoneNavBar/PhoneNavBar';
import EventPage from './pages/EventPage';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import ForgotPasswordPage from './pages/ForgotPassword';
import data from './Data/data.json';
import './App.css';

document.title = 'Tixon';

function App() {
  const [filters, setFilters] = useState({
    location: '',
    eventType: '',
    date: null
  });

  const handleSearch = (newFilters) => {
    setFilters({
      location: newFilters.location || '',
      eventType: newFilters.eventType || '',
      date: newFilters.date ? new Date(newFilters.date) : null
    });
  };

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <PhoneNavbar onSearch={handleSearch} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<EventSections filters={filters} />} />
          <Route path="/event/:id" element={<EventPage data={data} />} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/signin" element={<SigninPage/>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;