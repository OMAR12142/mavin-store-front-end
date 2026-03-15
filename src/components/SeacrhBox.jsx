import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const SearchBox = () => {
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="app-search-form">
      <motion.div 
        className="app-search-wrapper"
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="app-search-input-group">
          <FaSearch className="app-search-prefix-icon" />
          <Form.Control
            type="text"
            name="q"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            placeholder="Search for perfection..."
            className="app-search-input border-0"
            style={{ fontSize: '0.9rem', boxShadow: 'none' }}
          />
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" className="app-search-submit-btn border-0 py-2">
            SEARCH
          </Button>
        </motion.div>
      </motion.div>
    </Form>
  );
};

export default SearchBox;
