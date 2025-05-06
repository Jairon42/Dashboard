import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import './styles/style.css';
import { useUser } from "./context/UserContext";
import Login from "./pages/Login";

function App() {
  const { user } = useUser();

  return (
    <BrowserRouter>
      {!user ? <Login /> : <Router />}
    </BrowserRouter>
  );
}

export default App;