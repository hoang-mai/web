import { Outlet, useNavigate } from "react-router";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useEffect } from "react";
import { get } from "@/services/callApi";
import { checkTokenRoute } from "@/services/api";

function Layout() {
    const navigate = useNavigate();
    
    useEffect(() => {
        get(checkTokenRoute)
          .then((res) => {
            if (res.data.data.role === "admin") {
              navigate("/admin", { replace: true });
            }
          });
    }, [navigate]);
    return (
        <div className="bg-white text-black min-h-screen flex flex-col">
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