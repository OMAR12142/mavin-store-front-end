import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useGetProductsQuery } from "../slices/productsApiSlice.js";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import PaginationComp from "../components/PaginationComp";
import { useParams } from "react-router-dom";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export const AllProductsScreen = () => {
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { pageNumber = 1 } = useParams();

  const { data, isLoading, isError } = useGetProductsQuery({ pageNumber });

  const filteredProducts = data?.products.filter((p) => {
    return (
      (brand ? p.brand === brand : true) &&
      (maxPrice ? p.price <= maxPrice : true)
    );
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mt-4" style={{ color: "#000", letterSpacing: "-0.02em" }}>
          <strong>All Products</strong>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
      >
        <Row
          className="mb-4"
          style={{
            background: "#F8F9FA",
            borderRadius: "20px",
            padding: "20px",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Col md={3}>
            <label className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>Brand</label>
            <select
              className="form-select"
              onChange={(e) => setBrand(e.target.value)}
              style={{ borderRadius: "16px" }}
            >
              <option value="">All</option>
              <option value="Clothes">Clothes</option>
              <option value="watches">watches</option>
              <option value="bag">bags</option>
              <option value="headphones">headphones</option>
              <option value="Phones">Phones</option>
            </select>
          </Col>

          <Col md={3}>
            <label className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>Max Price</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 500"
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ borderRadius: "16px" }}
            />
          </Col>
        </Row>
      </motion.div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">Something went wrong</Message>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <motion.div variants={itemVariants}>
                    <Product product={product} />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          <PaginationComp
            pages={data.pages}
            page={data.page}
            keyword=""
            isAdmin={false}
          />
        </>
      )}
    </>
  );
};

export default AllProductsScreen;
