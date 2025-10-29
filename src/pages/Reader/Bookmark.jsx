import './reader.css'
import JZ from '../../assets/jz.png'

function Bookmark (){

    return(
        <div className="bookmark-wrap">
            <div className="bookmark-cont">
                <div className="bookmark-settings">
                    <h2>Series</h2>
                    <input type="text" placeholder='Search...'/>
                    <select name="limit" id="limit">
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="60">60</option>
                        <option value="80">80</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <hr />
                {/* Database Retrieval */}
                <div className="saved-story">
                    <div className="story-img">
                        <img src={JZ} alt="story" />
                        <div className="story-status">
                            <span><i className="fa-solid fa-star"></i> 9.5</span>
                            <p>Status: Ongoing</p>
                        </div>
                    </div>
                    <div className="story-info">
                        <h2>Story Title</h2>
                        <p>genre</p>
                        <p style={{marginBottom: "40px"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                        <p>25 Chapters</p>
                        <hr />
                        <button>Remove</button>
                    </div>
                </div>
                <hr />
                <div className="bookmark-pagination">
                    <h3>1/1</h3>
                    <button>Previous</button>
                    <button>Next</button>
                </div>
            </div>
        </div>
    );
}

export default Bookmark