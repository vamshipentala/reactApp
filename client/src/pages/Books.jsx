import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const _host = process.env.REACT_APP_BACKEND_SERVICE_HOST;
const _port = process.env.REACT_APP_BACKEND_SERVICE_PORT;

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get(`http://${_host}:${_port}/api/books`);
        setBooks(res.data);
      } catch (err) {
        console.log("Error fetching books:",err);
      }
    };
    fetchAllBooks();
  }, []);

  console.log(books);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://${_host}:${_port}/api/books/${id}`);
      window.location.reload()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="content-container"> {/* Add a higher-level container */}
    <div>
      <h1>Available Films</h1>
      <p style={{ color: 'white' }}>Deployed application using K8s - v1</p>
      <div className="books">
        {books.map((book) => (
          <div key={book.id} className="book">
            <img src={book.cover} alt="" />
            <h2>{book.title}</h2>
           {/* <p>{book.desc}</p> */}
            <span style={{ color: 'green' }}>${book.price}.00</span>
            <div className="button-group">
              <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
              <button className="update">
                <Link
                  to={`/update/${book.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Update
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
      <button className="addHome">
        <Link to="/add" style={{ color: "inherit", textDecoration: "none" }}>
          Add new Film
        </Link>
      </button>
    </div>
  );
};

export default Books;
