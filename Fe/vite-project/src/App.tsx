import BackgroundContainer from './components/BackgroundContainer';
import NavbarContainer from './components/NavbarContainer';

import './App.css';

function App() {
  return (
    <div>
      <div className="MainContainer">
        <NavbarContainer />
        <BackgroundContainer />
      </div>
    </div>
  );
}

export default App;
