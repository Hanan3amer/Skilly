import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer'
import Location from '../LocationModal/Location'
export default function Layout() {
    const location = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    return (
        <div className='flex flex-col justify-between items-center min-h-lvh'>
            <Location />
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}
