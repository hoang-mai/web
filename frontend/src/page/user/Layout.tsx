import { Outlet } from "react-router";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

function Layout() {
    return (
        <div className="bg-white text-black min-h-screen flex flex-col">


            {/* Header: Navbar( ten web+searchbar+login button+location selector)*/}
            <Navbar />
            {/* Muon link den page nao thi them route vao day*/}
            <Outlet />
            <main className="flex-grow">
            </main>
            <Footer />

        </div>
    );
}

export default Layout;