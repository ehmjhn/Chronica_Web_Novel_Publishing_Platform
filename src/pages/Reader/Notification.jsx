import { useState } from "react";
import { useNavigate } from "react-router";
import './reader.css'

function Notification() {

    // samplessss
    const allNotifications = [
        { id: 1, name: "Notif 1", message: "Message 1", read: false },
        { id: 2, name: "Notif 2", message: "Message 2", read: true },
        { id: 3, name: "Notif 3", message: "Message 3", read: false },
        { id: 4, name: "Notif 4", message: "Message 4", read: true },
        { id: 5, name: "Notif 5", message: "Message 5", read: false },
        { id: 6, name: "Notif 6", message: "Message 6", read: true },
        { id: 7, name: "Notif 7", message: "Message 7", read: false },
        { id: 8, name: "Notif 8", message: "Message 8", read: true },
        { id: 9, name: "Notif 9", message: "Message 9", read: false },
        { id: 10, name: "Notif 10", message: "Message 10", read: true },
        { id: 11, name: "Notif 11", message: "Message 11", read: false },
        { id: 12, name: "Notif 12", message: "Message 12", read: true },
    ];

    const [filter, setFilter] = useState("all"); 
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 10;

    const filteredNotifications = allNotifications.filter(notif => {
        if (filter === "read") return notif.read;
        if (filter === "unread") return !notif.read;
        return true;
    });

    const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);
    const startIndex = (currentPage - 1) * notificationsPerPage;
    const currentNotifications = filteredNotifications.slice(startIndex, startIndex + notificationsPerPage);

    const handleFilter = (type) => {
        setFilter(type);
        setCurrentPage(1);
    }

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

    const navigate = useNavigate()
    const handleClose = () => {
        navigate(-1); 
    };

    return (
        <div className="notifacation">
            <div className='notif-cont'>
                <div className='top'>
                    <p className='series'>Notifications</p>

                    <div className='btn-top'>
                        <button className='unread' onClick={() => handleFilter("unread")}>
                            {`Unread${allNotifications.filter((notif) => !notif.read).length > 0 ? ` (${allNotifications.filter((notif) => !notif.read).length})`: ""}`}
                        </button>
                        <button className='read' onClick={() => handleFilter("read")}>Read</button>
                        <button onClick={() => handleFilter("all")}>All</button>
                    </div>

                    <button onClick={handleClose}>X</button>
                </div>

                <div className='notif-container'>
                    {currentNotifications.length === 0 ? (
                        <p>No notifications found.</p>
                    ) : (
                        currentNotifications.map(notif => (
                            <div key={notif.id} className='notif-item'>
                                <p className='notif-name'>{notif.name}</p>
                                <p className='message'>{notif.message}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className='bottom'>
                    <p>{currentPage}/{totalPages}</p>

                    <div className='btn-bot'>
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>Back</button>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notification;
