import React from "react";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const Rating = ({ value, text }) => {
  return (
    <div className="app-rating-container d-flex align-items-center">
      <div className="app-stars d-flex gap-1" style={{ color: '#D4AF37' }}>
        {[1, 2, 3, 4, 5].map((index) => (
          <motion.span 
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            {value >= index ? (
              <FaStar className="app-star-icon" />
            ) : value >= index - 0.5 ? (
              <FaStarHalfAlt className="app-star-icon" />
            ) : (
              <FaRegStar className="app-star-icon-empty" style={{ opacity: 0.4 }} />
            )}
          </motion.span>
        ))}
      </div>
      {text && (
        <span className="app-rating-text ms-2 small fw-semibold text-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;
