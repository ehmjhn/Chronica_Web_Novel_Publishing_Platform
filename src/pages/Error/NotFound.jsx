import './not-found.css'

// ako rito bawal iba ok -jz OK. try ko toh  ayaw lumabas omai
function NotFound (){

    return (
      <>
        <div className="box">
          <div className="main-container">
            <h1>Oops!</h1>
            <img src="https://i.imgur.com/9GLgWoW.png" alt="Error" />
            <h2>SORRY, THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST!</h2>
          </div>
        </div>
      </>
    );
}

export default NotFound