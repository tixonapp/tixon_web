import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EventSections from './landing_page/components/EventsSection/EventsSection'
import Navbar from './landing_page/components/NavBar/NavBar'
import PhoneNavbar from './landing_page/components/PhoneNavBar/PhoneNavBar'
import EventPage from './pages/EventPage' 

function App() {
  return (
    <Router>
      <Navbar />
      <PhoneNavbar />
      <Routes>
        <Route path="/" element={<EventSections />} />
        <Route path="/event" element={<EventPage />} />
      </Routes>
    </Router>
  )
}

export default App
