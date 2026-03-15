import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, quantity) => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const deleteItemHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Row className="mt-4 app-cart-screen">
        <Col md={8}>
          <h1
            className="mb-4 app-cart-heading"
            style={{ color: "#000", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}
          >
            <strong>Shopping Cart</strong>
          </h1>
          {cartItems.length === 0 ? (
            <Message className="bg-black text-white p-4">
              <p className="text-black">
                <strong>Your cart is empty</strong>
              </p>
              <Link to={"/"} className="fw-bold" style={{ color: "#D4AF37" }}>
                Go Back
              </Link>
            </Message>
          ) : (
            <ListGroup variant="flush" className="app-cart-list">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <ListGroup.Item
                    className="py-3 px-0 app-cart-item"
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <Row className="align-items-center">
                      <Col md={2}>
                        <Image
                          src={item.image}
                          fluid
                          rounded
                          className="app-cart-image"
                          style={{ borderRadius: "16px" }}
                        />
                      </Col>

                      <Col md={3} className="fw-semibold app-item-name">
                        <Link to={`/product/${item._id}`} style={{ color: "#000" }}>
                          {item.name}
                        </Link>
                      </Col>

                      <Col md={2} className="fw-bold app-item-price" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        ${item.price}
                      </Col>

                      <Col md={3}>
                        <Form.Control
                          as="select"
                          value={item.quantity}
                          onChange={(e) =>
                            addToCartHandler(item, Number(e.target.value))
                          }
                          className="app-qty-select-cart"
                          style={{ borderRadius: "12px" }}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>

                      <Col md={2} className="text-end">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{ display: "inline-block" }}
                        >
                          <Button
                            variant="light"
                            type="button"
                            onClick={() => deleteItemHandler(item._id)}
                            className="app-remove-btn"
                            style={{
                              borderRadius: "12px",
                              border: "1px solid rgba(0,0,0,0.06)",
                            }}
                          >
                            <FaTrash style={{ color: "#ef4444" }} />
                          </Button>
                        </motion.div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </motion.div>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card
              className="p-4 app-summary-card border-0"
              style={{
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <ListGroup variant="flush">
                <ListGroup.Item className="py-3 border-0">
                  <h4 className="fw-bold app-subtotal-text">
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}) items
                  </h4>
                  <h3
                    className="fw-bold mt-3"
                    style={{ fontFamily: "'Outfit', sans-serif", color: "#000" }}
                  >
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.quantity * item.price, 0)
                      .toFixed(2)}
                  </h3>
                </ListGroup.Item>

                <ListGroup.Item className="pt-3 border-0">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      className="w-100 app-checkout-btn"
                      disabled={cartItems.length === 0}
                      onClick={checkOutHandler}
                    >
                      Proceed to Checkout
                    </Button>
                  </motion.div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default CartScreen;
