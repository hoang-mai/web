
import Footer from './components/Footer'
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import Home from './page/Home';
function App() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      
      
      {/* Header: Navbar( ten web+searchbar+login button+location selector)*/}
      <Navbar/>
      {/* Muon link den page nao thi them route vao day*/}
        <Routes>
            <Route path="/" element={<Home/>} /> 
            <Route path="/login" element={<Login />} /> {/* Định tuyến đến trang login */}
        </Routes>
      <main className="flex-grow">
      </main>
      <Footer />

    </div>
  );
}
export default App;