import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import WebRoute from "./routers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const defaultTheme = createTheme();


function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="App">
        <WebRoute />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
}

export default App;
