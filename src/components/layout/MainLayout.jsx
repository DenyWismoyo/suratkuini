import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import NotificationPanel from "../NotificationPanel";
import FloatingActionButton from "../UI/FloatingActionButton"; // Import FAB
import ModalRenderer from "../UI/ModalRenderer"; // Import ModalRenderer
import { useUI } from "../../contexts/UIContext";
import { useState } from "react";

export default function MainLayout({ userInfo, handleLogout, theme, toggleTheme }) {
    const [isNotifPanelOpen, setNotifPanelOpen] = useState(false);
    
    // Asumsi notifikasi akan datang dari context nantinya
    const notifications = []; 

    return (
        <div id="app-wrapper" className="flex h-screen bg-bg-base">
            <Sidebar 
                userInfo={userInfo} 
                onLogout={handleLogout} 
                theme={theme} 
                toggleTheme={toggleTheme} 
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    notifications={notifications} 
                    onNotifClick={() => setNotifPanelOpen(true)} 
                />
                <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-base">
                    <div className="content-wrapper">
                        <Outlet />
                    </div>
                </main>
            </div>

            <NotificationPanel 
                isOpen={isNotifPanelOpen} 
                onClose={() => setNotifPanelOpen(false)} 
                notifications={notifications} 
                userId={userInfo?.id}
            />

            {/* Render Tombol FAB dan Modal di sini */}
            <FloatingActionButton />
            <ModalRenderer />
        </div>
    );
}
