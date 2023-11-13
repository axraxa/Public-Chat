import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import LostPage from "./LostPage";
import "./scss/index.scss";
import JWTverify from "./JWTverify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/*" element={<LostPage />} />
        <Route path="/jwtverify/:token" element={<JWTverify />} />
      </Routes>
    </Router>
  );
}

export default App;
