
import EventSections from './landing_page/components/EventsSection/EventsSection'
import Navbar from './landing_page/components/NavBar/NavBar'
import PhoneNavbar from './landing_page/components/PhoneNavBar/PhoneNavBar'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <Navbar></Navbar>
    <PhoneNavbar></PhoneNavbar>
    <EventSections></EventSections>
    </>
  )
}

export default App
