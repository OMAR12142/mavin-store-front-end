import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import Message from "./../components/Message";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import {
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
  Badge,
} from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("Payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment successful");
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice.toFixed(2),
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const DeliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order Delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="app-order-id-heading mb-4" style={{ color: "#888", fontSize: '1rem' }}>
        ORDER ID: <span className="text-black fw-bold">{order._id}</span>
      </h1>
      <Row className="app-order-details-row">
        <Col md={8}>
          <ListGroup variant="flush" className="app-order-info-list gap-4">
            <ListGroupItem className="app-order-section-item p-4 shadow-sm border-0" style={{ borderRadius: '20px', background: '#fff' }}>
              <h2 className="app-section-heading mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Shipping</h2>
              <div className="p-3 rounded mb-3" style={{ background: '#F8F9FA' }}>
                <p className="mb-2">
                  <strong className="text-black">Name: </strong>
                  {order.user.name}
                </p>
                <p className="mb-2">
                  <strong className="text-black">Email: </strong>
                  <a href={`mailto:${order.user.email}`} className="text-decoration-none" style={{ color: '#D4AF37' }}>
                    {order.user.email}
                  </a>
                </p>
                <p className="mb-0">
                  <strong className="text-black">Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on: {new Date(order.deliveredAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroupItem>

            <ListGroupItem className="app-order-section-item p-4 shadow-sm border-0" style={{ borderRadius: '20px', background: '#fff' }}>
              <h2 className="app-section-heading mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Payment</h2>
              <div className="p-3 rounded mb-3" style={{ background: '#F8F9FA' }}>
                <p className="mb-0">
                  <strong className="text-black">Method: </strong> {order.paymentMethod}
                </p>
              </div>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on: {new Date(order.paidAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroupItem>

            <ListGroupItem className="app-order-section-item p-4 shadow-sm border-0" style={{ borderRadius: '20px', background: '#fff' }}>
              <h2 className="app-section-heading mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Order Items</h2>
              <ListGroup variant="flush">
                {order.orderItems.map((item, index) => (
                  <ListGroupItem key={index} className="py-3 px-0 border-0">
                    <Row className="align-items-center">
                      <Col md={2}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                          style={{ borderRadius: '12px' }}
                        />
                      </Col>
                      <Col>
                        <Link to={`/products/${item.product}`} className="text-decoration-none fw-semibold" style={{ color: '#000' }}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={4} className="text-end fw-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {item.quantity} x ${item.price} = <span style={{ color: '#D4AF37' }}>${(item.quantity * item.price).toFixed(2)}</span>
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </ListGroupItem>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="app-summary-card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <ListGroup variant="flush">
              <ListGroupItem className="app-summary-header text-center py-4" style={{ background: '#000' }}>
                <h2 className="app-section-heading mb-0" style={{ color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>Order Summary</h2>
              </ListGroupItem>
              <ListGroupItem className="py-3">
                <Row>
                  <Col className="fw-bold">Items:</Col>
                  <Col className="text-end fw-bold">${order.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem className="py-3">
                <Row>
                  <Col className="fw-bold">Shipping:</Col>
                  <Col className="text-end fw-bold">${order.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem className="py-3">
                <Row>
                  <Col className="fw-bold">Tax:</Col>
                  <Col className="text-end fw-bold">${order.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem className="py-4" style={{ background: '#F8F9FA' }}>
                <Row>
                  <Col className="fw-bold fs-5">Total:</Col>
                  <Col className="text-end fw-bold fs-5" style={{ color: '#D4AF37' }}>
                    ${order.totalPrice.toFixed(2)}
                  </Col>
                </Row>
              </ListGroupItem>

              {!order.isPaid && (
                <ListGroupItem className="p-4">
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div className="d-grid gap-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={onApproveTest}
                          className="w-100 app-auth-btn-custom py-3"
                          style={{ borderRadius: '15px' }}
                        >
                          TEST PAY ORDER
                        </Button>
                      </motion.div>
                      <PayPalButtons
                        onError={onError}
                        createOrder={createOrder}
                        onApprove={onApprove}
                      ></PayPalButtons>
                    </div>
                  )}
                </ListGroupItem>
              )}

              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroupItem className="p-4 border-0">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      className="w-100 app-auth-btn-custom py-3"
                      style={{ borderRadius: '15px' }}
                      onClick={DeliverOrderHandler}
                    >
                      MARK AS DELIVERED
                    </Button>
                  </motion.div>
                </ListGroupItem>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default OrderScreen;
