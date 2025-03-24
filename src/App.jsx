import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventSections from './landing_page/components/EventsSection/EventsSection';
import Navbar from './landing_page/components/NavBar/NavBar';
import PhoneNavbar from './landing_page/components/PhoneNavBar/PhoneNavBar';
import EventPage from './pages/EventPage';
import data from './Data/data.json';
import './App.css'; // Import the CSS file for global styles

document.title = 'Tixon';

function App() {
  return (
    <Router>
      <Navbar />
      <PhoneNavbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<EventSections />} />
          <Route path="/event/:id" element={<EventPage data={data} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;