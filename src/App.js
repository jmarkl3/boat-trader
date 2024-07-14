import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home';
import Topnav from './Global/Topnav';
import BottomNav from './Global/BottomNav';
import Search from './Pages/Search/Search';
import Account from './Pages/Account/Account';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Topnav></Topnav>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/account' element={<Account></Account>}></Route>
          <Route path='/search' element={<Search></Search>}></Route>
        </Routes>
        <BottomNav></BottomNav>
      </BrowserRouter>
    </div>
  );
}

export default App;
