import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, ListGroup, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slices/productDetailsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useState } from "react";
import { addToCart } from "../slices/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useCreateProductReviewMutation } from "../slices/productsApiSlice.js";
import { toast } from "react-toastify";

export const SingleProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingReview }] =
    useCreateProductReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      toast.success("Review Submitted Successfully");
      setRating(0);
      setComment("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  function addToCartHandler() {
    dispatch(addToCart({ ...product, quantity }));
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link className="btn btn-light my-3 app-go-back-btn" to="/">
          Go Back
        </Link>
      </motion.div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error.data?.message || error.error}</Message>
      ) : (
        <>
          <Row className="app-product-details-row">
            <Col md={5}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  overflow: "hidden",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid"
                  style={{
                    width: "100%",
                    transition: "transform 0.5s ease",
                    borderRadius: "20px",
                  }}
                />
              </motion.div>
            </Col>

            <Col md={4} className="app-product-info-col">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <ListGroup variant="flush" className="border-0">
                  <ListGroup.Item className="border-0 p-0 mb-3">
                    <h3
                      className="app-product-name"
                      style={{ color: "#000", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}
                    >
                      {product.name}
                    </h3>
                  </ListGroup.Item>

                  <ListGroup.Item className="border-0 p-0 mb-3">
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </ListGroup.Item>

                  <ListGroup.Item className="border-0 p-0 app-product-description" style={{ color: "#555", lineHeight: 1.7 }}>
                    <p>{product.description}</p>
                  </ListGroup.Item>
                </ListGroup>
              </motion.div>
            </Col>

            <Col md={3} className="app-cart-box-col">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <Card
                  className="app-cart-card border-0"
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <ListGroup variant="flush">
                    <ListGroup.Item className="app-price-item" style={{ borderRadius: "20px 20px 0 0" }}>
                      <Row>
                        <Col className="fw-bold">Price :</Col>
                        <Col>
                          <strong
                            className="app-price-value"
                            style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.2rem" }}
                          >
                            ${product.price}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col className="fw-bold">Status :</Col>
                        <Col>
                          <strong
                            style={{
                              color: product.countInStock > 0 ? "#22c55e" : "#ef4444",
                            }}
                          >
                            {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row className="align-items-center">
                          <Col className="fw-bold">Quantity</Col>
                          <Col>
                            <Form.Control
                              as="select"
                              value={quantity}
                              onChange={(e) => {
                                setQuantity(Number(e.target.value));
                              }}
                              className="app-qty-select"
                              style={{ borderRadius: "12px" }}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item className="p-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="app-add-to-cart-btn w-100"
                          type="button"
                          onClick={addToCartHandler}
                          disabled={product.countInStock === 0}
                        >
                          Add To Cart
                        </Button>
                      </motion.div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </motion.div>
            </Col>
          </Row>

          <Row className="my-5 app-reviews-section">
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <h2
                  className="app-reviews-heading mb-4"
                  style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "0.05em" }}
                >
                  REVIEWS
                </h2>
                {product.reviews.length === 0 && (
                  <Message>No reviews yet</Message>
                )}
                <ListGroup variant="flush" className="app-review-list">
                  {product.reviews.map((review) => (
                    <ListGroup.Item
                      key={review._id}
                      className="app-review-item"
                      style={{
                        borderRadius: "16px",
                        marginBottom: "12px",
                        background: "#F8F9FA",
                        border: "none",
                        padding: "16px 20px",
                      }}
                    >
                      <strong className="d-block mb-1">{review.name}</strong>
                      <Rating value={review.rating} />
                      <p className="text-muted small my-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2">{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item
                    className="app-review-form-item"
                    style={{ border: "none", padding: "16px 0" }}
                  >
                    {loadingReview && <Loader />}
                    {userInfo ? (
                      <>
                        <h2
                          className="app-review-form-heading"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          Write A Review
                        </h2>
                        <Form onSubmit={submitHandler}>
                          <Form.Group controlId="rating" className="my-2">
                            <Form.Label className="fw-bold">Rating</Form.Label>
                            <Form.Control
                              as="select"
                              value={rating}
                              onChange={(e) => setRating(Number(e.target.value))}
                              className="app-form-control-custom"
                            >
                              <option value="">Select...</option>
                              <option value="1">1 - Poor</option>
                              <option value="2">2 - Fair</option>
                              <option value="3">3 - Good</option>
                              <option value="4">4 - Very Good</option>
                              <option value="5">5 - Excellent</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="comment" className="my-2">
                            <Form.Label className="fw-bold">Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={5}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="app-form-control-custom"
                            ></Form.Control>
                          </Form.Group>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="app-submit-review-btn my-2 w-100"
                              disabled={loadingReview}
                            >
                              Submit Review
                            </Button>
                          </motion.div>
                        </Form>
                      </>
                    ) : (
                      <Message>
                        Please <Link to="/login">log in</Link> to write a review
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </motion.div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default SingleProductScreen;
