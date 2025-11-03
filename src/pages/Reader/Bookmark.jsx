import './reader.css';
import ResultCard from '../../components/ResultCard';
import JZ from '../../assets/jz.png';
import React from 'react';

function Bookmark() {
  const bookmarks = [
    {
      id: 1,
      title: "The Lost Kingdom",
      cover: JZ,
      rate: 9.5,
      status: "Ongoing",
      summary: "A hero ventures into a forgotten world filled with mystery and betrayal.",
      genres: ["Fantasy", "Adventure"],
      tags: ["Magic", "Revenge"],
      views: 1200,
      favorites: 85,
      chapters: 25
    },
    {
      id: 2,
      title: "Digital Heart",
      cover: "https://placehold.co/120x150",
      rate: 8.9,
      status: "Completed",
      summary: "An AI discovers emotions while exploring the human world.",
      genres: ["Sci-Fi", "Romance"],
      tags: ["AI", "Drama"],
      views: 2500,
      favorites: 134,
      chapters: 32
    }
  ];

  const handleRemoveBook = (id) => {
    console.log("Removed bookmark with ID:", id);
  };

  return (
    <div className="bookmark-wrap">
      <div className="bookmark-cont">
        <div className="bookmark-settings">
          <h2>Bookmarked Series</h2>
          <input type="text" placeholder="Search..." />
          <select name="limit" id="limit">
            {
                [10,25,50,75,100].map((i)=>{
                    return(<option value={i}>{i}</option>);
                })
            }
          </select>
        </div>

        <hr />

        <div className="results-grid">
          {bookmarks.map((book) => (
            <ResultCard
              key={book.id}
              {...book}
              isBookmark={true}
              onRemove={handleRemoveBook}
            />
          ))}
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

export default Bookmark;
