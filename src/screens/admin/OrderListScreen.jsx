import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaTimes, FaCheck } from "react-icons/fa";
import { useGetAllOrdersQuery } from "../../slices/ordersApiSlice.js";
import { Button, Table, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { motion } from "framer-motion";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container-fluid px-3 px-md-4 px-lg-5 py-4"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-black" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
          Orders Management
        </h1>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Card.Header className="py-4 px-4 border-0" style={{ background: '#000' }}>
            <h5 className="mb-0 fw-bold" style={{ color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>All Orders History</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover borderless className="app-orders-table mb-0 align-middle">
                <thead style={{ background: '#F8F9FA' }}>
                  <tr>
                    <th className="py-3 px-4 text-uppercase small fw-bold">Order ID</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold">User</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold">Date</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold">Total</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold text-center">Paid</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold text-center">Delivered</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td className="py-3 px-4 fw-mono small">
                        {order._id.substring(0, 12)}...
                      </td>
                      <td className="py-3 px-4 fw-semibold">
                        {order.user?.name || 'DELETED USER'}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 fw-bold">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {order.isPaid ? (
                          <div className="d-flex flex-column align-items-center">
                            <span className="badge bg-success mb-1">PAID</span>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{order.paidAt.substring(0, 10)}</small>
                          </div>
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {order.isDelivered ? (
                          <div className="d-flex flex-column align-items-center">
                            <span className="badge bg-black text-white mb-1">DELIVERED</span>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{order.deliveredAt.substring(0, 10)}</small>
                          </div>
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <LinkContainer to={`/order/${order._id}`}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                            <Button
                              variant="outline-dark"
                              size="sm"
                              className="px-3"
                              style={{ borderRadius: '10px', fontWeight: '600' }}
                            >
                              Details
                            </Button>
                          </motion.div>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </motion.div>
  );
};

export default OrderListScreen;
