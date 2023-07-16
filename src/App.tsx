import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import WebRoute from "./routers";
const defaultTheme = createTheme();

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="App">
        <WebRoute />
      </div>
    </ThemeProvider>
  );
}

export default App;
