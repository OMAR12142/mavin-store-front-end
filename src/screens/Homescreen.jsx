import { Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import { Product } from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import { Link, useParams } from "react-router-dom";
import PaginationComp from "../components/PaginationComp.jsx";
import { LandingComp } from "../components/LandingComp.jsx";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const Homescreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <LandingComp />

      {keyword && (
        <div className="container-fluid px-3 px-sm-4 px-lg-5">
          <Link to="/" className="btn btn-light mb-4 mt-3 app-go-back-btn">
            <i className="fas fa-arrow-left me-2"></i>
            Back to All Products
          </Link>
        </div>
      )}

      <div className="container-fluid px-3 px-sm-4 px-lg-5">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError.data?.message || isError.error}
          </Message>
        ) : (
          <>
            <motion.div
              className="text-center text-lg-start mb-4 mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className="fw-bold display-6 display-lg-5"
                style={{ color: "#000", letterSpacing: "-0.02em" }}
              >
                {keyword
                  ? `Search Results for "${keyword}"`
                  : "Latest Products"}
              </h1>
              {!keyword && (
                <p style={{ color: "#888", fontSize: "1.05rem" }} className="d-none d-md-block">
                  Discover our newest collection of premium products
                </p>
              )}
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Row className="g-4 g-md-4 g-lg-5 justify-content-center justify-content-lg-start">
                {(keyword ? data.products : data.products.slice(-4)).map(
                  (product) => (
                    <Col
                      key={product._id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={3}
                      className="mb-4"
                    >
                      <motion.div variants={cardVariants} className="h-100 d-flex">
                        <div
                          className="card border-0 h-100 w-100"
                          style={{
                            borderRadius: "20px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                            overflow: "hidden",
                            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                          }}
                        >
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
                          <div className="card-body d-flex flex-column p-4">
                            <h5
                              className="card-title fw-bold mb-3"
                              style={{
                                color: "#000",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.95rem",
                              }}
                            >
                              {product.name.length > 40
                                ? product.name.substring(0, 40) + "..."
                                : product.name}
                            </h5>
                            <div className="mt-auto">
                              <div className="d-flex justify-content-between align-items-center mb-3">
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
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Link
                                  to={`/product/${product._id}`}
                                  className="btn w-100 py-2 text-decoration-none"
                                  style={{
                                    background: "#000",
                                    color: "#D4AF37",
                                    borderRadius: "20px",
                                    fontWeight: 600,
                                    border: "none",
                                    transition: "all 0.3s",
                                  }}
                                >
                                  View Details
                                </Link>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Col>
                  )
                )}
              </Row>
            </motion.div>

            {!keyword && data.products.length > 4 && (
              <motion.div
                className="text-center mt-4 mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-block" }}
                >
                  <Link
                    to="/allproducts"
                    className="btn btn-lg px-5 py-3 fw-bold text-decoration-none"
                    style={{
                      background: "#000",
                      color: "#D4AF37",
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    }}
                  >
                    View All Products
                    <i className="fas fa-arrow-right ms-2"></i>
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {keyword && data.pages > 1 && (
              <div className="mt-5">
                <PaginationComp
                  pages={data.pages}
                  page={data.page}
                  isAdmin={false}
                  keyword={keyword ? keyword : ""}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Homescreen;
