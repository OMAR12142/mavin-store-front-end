import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  Button,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { clearCartItems } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.shippingAddress.address, navigate, cart.paymentMethod]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="app-place-order-row mt-4">
          <Col md={8}>
            <ListGroup variant="flush" className="app-order-sections">
              <ListGroupItem className="app-order-section-item mb-4 border-0 shadow-sm" style={{ borderRadius: '20px', background: '#fff' }}>
                <h2 className="app-section-heading mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Shipping</h2>
                <div className="app-shipping-info p-3 rounded" style={{ background: '#F8F9FA' }}>
                  <p className="mb-0">
                    <strong className="text-black">Address: </strong>
                    {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                    {cart.shippingAddress.postalCode},{" "}
                    {cart.shippingAddress.country}
                  </p>
                </div>
              </ListGroupItem>

              <ListGroupItem className="app-order-section-item mb-4 border-0 shadow-sm" style={{ borderRadius: '20px', background: '#fff' }}>
                <h2 className="app-section-heading mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Payment Method</h2>
                <div className="app-payment-info p-3 rounded" style={{ background: '#F8F9FA' }}>
                  <p className="mb-0">
                    <strong className="text-black">Method: </strong> {cart.paymentMethod}
                  </p>
                </div>
              </ListGroupItem>

              <ListGroupItem className="app-order-section-item border-0 shadow-sm" style={{ borderRadius: '20px', background: '#fff' }}>
                <h2 className="app-section-heading mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Order Items</h2>
                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListGroup variant="flush" className="app-order-items-list">
                    {cart.cartItems.map((item, index) => (
                      <ListGroupItem key={index} className="app-order-item py-3 px-0 border-0">
                        <Row className="align-items-center">
                          <Col md={2}>
                            <Image
                              src={item.image}
                              fluid
                              rounded
                              className="app-item-image"
                              style={{ borderRadius: '12px' }}
                            />
                          </Col>
                          <Col md={6}>
                            <Link
                              to={`/product/${item.product}`}
                              className="app-item-link text-decoration-none fw-semibold"
                              style={{ color: '#000' }}
                            >
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4} className="text-end app-item-price fw-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {item.quantity} x ${item.price} ={" "}
                            <span style={{ color: '#D4AF37' }}>
                              ${(item.quantity * item.price).toFixed(2)}
                            </span>
                          </Col>
                        </Row>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                )}
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card className="app-summary-card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <ListGroup variant="flush">
                <ListGroupItem className="app-summary-header text-center py-4" style={{ background: '#000' }}>
                  <h2 className="app-section-heading mb-0" style={{ color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>Order Summary</h2>
                </ListGroupItem>
                <ListGroupItem className="app-summary-item py-3">
                  <Row>
                    <Col className="fw-bold">Items:</Col>
                    <Col className="text-end fw-bold">${cart.itemsPrice}</Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem className="app-summary-item py-3">
                  <Row>
                    <Col className="fw-bold">Shipping:</Col>
                    <Col className="text-end fw-bold">${cart.shippingPrice}</Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem className="app-summary-item py-3">
                  <Row>
                    <Col className="fw-bold">Tax:</Col>
                    <Col className="text-end fw-bold">${cart.taxPrice}</Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem className="app-summary-total-item py-4" style={{ background: '#F8F9FA' }}>
                  <Row>
                    <Col className="fw-bold fs-5 app-final-total-text">Total:</Col>
                    <Col className="text-end fw-bold fs-5 app-final-total-price" style={{ color: '#D4AF37' }}>
                      ${cart.totalPrice}
                    </Col>
                  </Row>
                </ListGroupItem>

                {error && (
                  <ListGroupItem>
                    <Message variant="danger">
                      {error?.data?.message || error.error}
                    </Message>
                  </ListGroupItem>
                )}

                <ListGroupItem className="app-place-order-btn-section p-4 border-0">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      className="w-100 app-place-order-btn py-3"
                      disabled={cart.cartItems.length === 0}
                      onClick={placeOrderHandler}
                      style={{ borderRadius: '15px', fontWeight: '800', fontSize: '1.1rem' }}
                    >
                      PLACE ORDER
                    </Button>
                  </motion.div>
                  {isLoading && <Loader />}
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </>
  );
};

export default PlaceOrderScreen;
