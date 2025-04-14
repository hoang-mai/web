import Header from './components/Header'
import Footer from './components/Footer'
import LocationSelector from "./components/LocationSelector";

function App() {
  function App() {
    return (
      <div className="p-4">
        <LocationSelector />
      </div>
    );
  };
  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Khuyến mãi Online</h1>
        {/* Nội dung trang chính sẽ ở đây */}
      </main>
      <Footer />
    </div>
  )
}

export default App
