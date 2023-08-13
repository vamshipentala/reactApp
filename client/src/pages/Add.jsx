import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const _host = process.env.REACT_APP_BACKEND_SERVICE_HOST;
const _port = process.env.REACT_APP_BACKEND_SERVICE_PORT;
const Add = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: "https://i.pinimg.com/474x/9c/cd/d4/9ccdd4f3d6876e37b21e31c4abbeeb56.jpg",
  });
  const [error,setError] = useState(false)

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://${_host}:${_port}/api/books`, book);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true)
    }
  };

  return (
    <div className="form">
      <h1>Add New Book</h1>
      <input
        type="text"
        placeholder="Book title"
        name="title"
        onChange={handleChange}
        required // Mark the field as required
      />
      <textarea
        rows={5}
        type="text"
        placeholder="Book Description"
        name="desc"
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Book price"
        name="price"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Book cover image URL"
        name="cover"
        onChange={handleChange}
      />
      <button onClick={handleClick} className="addHome">Add</button>
      {error && "Something went wrong!"}
      <Link to="/" style={{ color: 'white' }}>See all books</Link>
    </div>
  );
};

export default Add;
