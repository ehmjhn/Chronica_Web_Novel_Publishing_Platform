import './components.css'
import './notification-item.css'

function NotificationItem (){
// alis aq here - david
    return( 
        <>
            <div className='main-container'>
                <div className='top'>
                    <h1>Series</h1>

                    <div className='btn-top'>
                        <button className='unread'>Unread</button>
                        <button className='read'>Read</button>
                    </div>
                    
                </div>
            
                {/* may mapping here for notif */}
                <div className='notif-container'>
                    <p className='notif-name'>Notif Name</p>
                    <p className='message'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique vitae et tempora, aspernatur doloremque est. Rerum est tenetur laborum? Recusandae est dolor dolorum adipisci quaerat exercitationem velit, aperiam eveniet quidem!</p>
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
