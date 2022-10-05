import Login from "./Login.js"
import Dashboard from './Dashboard';

const code = new URLSearchParams(window.location.search).get("code");

function Homepage() {  

  return (
      <div className="app">
        {code
        ? <Dashboard code={code}/> 
        : <Login />}     
      </div>     
  );
}

export default Homepage;