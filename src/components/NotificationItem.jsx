import './components.css'
import './notification-item.css'

// mali pala, item lang pala here buo nalagay q haha tom nah antok na q ih - david feel ko si toni fowler to litsi  
function NotificationItem (){
    return( 
        <>
            <div className='main-container'>
                <div className='top'>
                    <p className='series'>Series</p>

                    <div className='btn-top'>
                        <button className='unread'>Unread</button>
                        <button className='read'>Read</button>
                    </div>
                    
                </div>
            
                {/* may mapping here for notif */}
                <div className='notif-container'>
                    <p className='notif-name'>Notif Name</p>
                    <p className='message'>hay tangina pagod na ako mag-aral gusto ko nalang makipag-live in tapos gabi gabi kaming makikinig kay niki tapos ulam namin lagi sinigang,,, cote m david </p>
                </div>

                <div className='bottom'>
                    <p>1/1</p>
                    
                    <div className='btn-bot'>
                        <button>Back</button>
                        <button>Next</button>
                    </div>
                </div>
            </div>
        </>
    );
} 

export default  NotificationItem
