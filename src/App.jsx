import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import BookingPage from "./components/BookingPage.jsx";
import Landing from "./components/Landing.jsx";
import History from "./components/History.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Report from "./components/Report.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bookingpage" element={<BookingPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/report" element={<Report />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
