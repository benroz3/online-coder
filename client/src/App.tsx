import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Lobby from "./pages/lobby/Lobby";
import CodeBlock from "./pages/codeBlock/CodeBlock";
import './App.scss'

const serverUrl = process.env.REACT_APP_SERVER_URL || "";
const socket: Socket = io(serverUrl);

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby socket={socket} />} />
          <Route
            path="/code-block/:title"
            element={<CodeBlock socket={socket} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
