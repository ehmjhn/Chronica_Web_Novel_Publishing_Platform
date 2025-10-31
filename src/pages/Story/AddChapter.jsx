import './story.css'
import './add-chapter.css'

function AddChapter (){

    return(
        <>
        <div className="addchapter-container">
            <div className="addchapter-header">
                <h1>Add Chapter</h1>
                <p className="breadcrumb">Dashboard / Series / Add Chapter</p>
            </div>

            <div className="series-info">
                <h2>Selected Series</h2>

                <div className="series-card">
                <div className="series-image">
                    <img src="" alt="Series cover" />
                </div>

                <div className="series-details">
                    <h3 className="series-title">Series Title</h3>
                    <p className="series-genre">Genre: (Mapping here)</p>
                    <p className="series-description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
                    repellendus cum voluptates, provident itaque quod esse, in
                    expedita recusandae fugiat saepe reprehenderit maiores sapiente
                    illum, reiciendis suscipit accusamus? Quasi, necessitatibus.
                    </p>
                </div>
                </div>
            </div>

            <div className="chapter-form">
                <h2>New Chapter Details</h2>

                <label>Chapter Title</label>
                <input type="text" placeholder="chapter title here" />

                <div className="form-actions">
                <button className="cancel-btn">Cancel</button>
                <button className="save-btn">Save Chapter</button>
                </div>
            </div>
        </div>
        </>
    ); 
}

export default AddChapter