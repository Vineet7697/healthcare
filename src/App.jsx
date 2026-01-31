import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "./routes/Router";
import { LanguageProvider } from "./context/LanguageContext";

const App = () => {
  return (
    <LanguageProvider>
      <Router />
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </LanguageProvider>
  );
};

export default App;
