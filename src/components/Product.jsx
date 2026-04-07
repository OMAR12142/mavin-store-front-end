import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Rating from "./Rating";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";

export const Product = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, quantity: 1 }));
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <motion.div className="h-100 d-flex">
      <div
        className="card border-0 h-100 w-100 app-product-card"
        style={{
          borderRadius: "20px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <div
            className="position-relative"
            style={{ height: "250px", overflow: "hidden" }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="card-img-top h-100 w-100"
              style={{
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
            />
          </div>
        </Link>

        <div className="card-body d-flex flex-column p-4">
          <Link
            to={`/product/${product._id}`}
            className="text-decoration-none text-black"
          >
            <h5
              className="card-title fw-bold mb-2"
              style={{
                color: "#000",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "44px",
              }}
            >
              {product.name}
            </h5>
          </Link>

          <div className="mb-3">
            <Rating value={product.rating} />
          </div>

          <div className="mt-auto">
            <div className="mb-3">
              <span
                className="h4 mb-0 fw-bold"
                style={{
                  color: "#000",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                ${product.price}
              </span>
            </div>

            <div className="d-flex flex-column gap-2 flex-xl-row">
              <motion.div
                className="flex-grow-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/product/${product._id}`}
                  className="btn w-100 py-2 text-decoration-none d-flex align-items-center justify-content-center"
                  style={{
                    background: "#000",
                    color: "#D4AF37",
                    borderRadius: "20px",
                    fontWeight: 600,
                    border: "none",
                    transition: "all 0.3s",
                    fontSize: "0.85rem",
                  }}
                >
                  <i className="fas fa-eye me-2"></i> Details
                </Link>
              </motion.div>

              <motion.div
                className="flex-grow-1"
                whileHover={product.countInStock > 0 ? { scale: 1.02 } : {}}
                whileTap={product.countInStock > 0 ? { scale: 0.98 } : {}}
              >
                <Button
                  className="btn w-100 py-2 d-flex align-items-center justify-content-center"
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  style={{
                    background: "#000",
                    color: "#D4AF37",
                    borderRadius: "20px",
                    fontWeight: 600,
                    border: "none",
                    transition: "all 0.3s",
                    fontSize: "0.85rem",
                  }}
                >
                  <i className="fas fa-shopping-cart me-2"></i> Add
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
