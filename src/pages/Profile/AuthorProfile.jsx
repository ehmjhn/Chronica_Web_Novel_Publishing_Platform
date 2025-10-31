import './profile.css'
import './author-profile.css'

// pure design lang - david
function AuthorProfile (){

    return(
   <div className='author-container'>
      <div className='top'>
        <p className='header-font'>Author's Profile</p>
      </div>

      <div className='profile-container'>
        <div className='profile-left'>
          <img src='' alt='Author' className='profile-pic' />
        </div>

        <div className='profile-right'>
          <div className='author-header'>
            <h2 className='author-name'>Jhaezer Anne David</h2>
            <span className='dot'>•</span>
            <p className='author-username'>@jhaezer</p>
          </div>

          <p className='author-follow'>Followers: 999 &nbsp; • &nbsp; Following: 10</p>
          <p className='author-joined'>Joined: July 2023</p>
        </div>
      </div>

       {/*  guys here nilagyan q muna hardcode na sample para makita ko css, pero mapping here*/}
      <div className='series-container'>
        <h2>Series by Jhaezer</h2>

        <div className='series-list'>
          <div className='series-card'>
            <div className='series-img' style={{ backgroundImage: 'none' }}></div>
            <h3 className='series-title'>Series Title 1</h3>
            <p className='series-author'>by Jhaezer</p>
          </div>

          <div className='series-card'>
            <div className='series-img' style={{ backgroundImage: 'none' }}></div>
            <h3 className='series-title'>Series Title 2</h3>
            <p className='series-author'>by Jhaezer</p>
          </div>

          <div className='series-card'>
            <div className='series-img' style={{ backgroundImage: 'none' }}></div>
            <h3 className='series-title'>Series Title 3</h3>
            <p className='series-author'>by Jhaezer</p>
          </div>

          <div className='series-card'>
            <div className='series-img' style={{ backgroundImage: 'none' }}></div>
            <h3 className='series-title'>Series Title 3</h3>
            <p className='series-author'>by Jhaezer</p>
          </div>

        </div>
      </div>
    </div>
    );
}

export default AuthorProfile