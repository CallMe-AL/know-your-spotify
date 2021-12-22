import './styles/main.scss';
import './App.css';
import Login from "./Login.js"
import Dashboard from './Dashboard';

const code = new URLSearchParams(window.location.search).get("code");

function App() {  

  return (
      <div className="app">
        {code
        ? <Dashboard code={code}/> 
        : <Login />}     
      </div>     
  );
}

export default App;
