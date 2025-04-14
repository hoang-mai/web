
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
        {/* Nội dung trang chính sẽ ở đây */}
      </main>
      <Footer />

    </div>
  );
}
export default App;