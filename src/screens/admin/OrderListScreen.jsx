import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaTimes } from "react-icons/fa";
import { useGetAllOrdersQuery } from "../../slices/ordersApiSlice";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  // console.log(orders);

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 fw-bold text-black">Orders</h1>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Loader />
        </div>
      ) : error ? (
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <Message />
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="d-none d-lg-block">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead className="table-black">
                    <tr>
                      <th className="ps-3">ID</th>
                      <th>USER</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>PAID</th>
                      <th>DELIVERED</th>
                      <th className="text-center pe-3">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="ps-3">
                          <span
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: "120px" }}
                          >
                            {order._id}
                          </span>
                        </td>
                        <td>{order.user.name}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td className="fw-bold">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td>
                          {order.isPaid ? (
                            <span className="badge bg-black text-white">
                              {order.paidAt.substring(0, 10)}
                            </span>
                          ) : (
                            <FaTimes className="text-danger" />
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <span className="badge bg-black text-white">
                              {order.deliveredAt.substring(0, 10)}
                            </span>
                          ) : (
                            <FaTimes className="text-danger" />
                          )}
                        </td>
                        <td className="text-center pe-3">
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="px-3"
                            >
                              Details
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-none d-md-block d-lg-none">
              <div className="row g-3 p-3">
                {orders.map((order) => (
                  <div key={order._id} className="col-12">
                    <div className="card border shadow-sm">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted">ID</small>
                            <p className="mb-2 text-truncate">{order._id}</p>

                            <small className="text-muted">USER</small>
                            <p className="mb-2">{order.user.name}</p>

                            <small className="text-muted">DATE</small>
                            <p className="mb-0">
                              {order.createdAt.substring(0, 10)}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">TOTAL</small>
                            <p className="mb-2 fw-bold">
                              ${order.totalPrice.toFixed(2)}
                            </p>

                            <small className="text-muted">PAID</small>
                            <p className="mb-2">
                              {order.isPaid ? (
                                <span className="badge bg-black text-white">
                                  {order.paidAt.substring(0, 10)}
                                </span>
                              ) : (
                                <FaTimes className="text-danger" />
                              )}
                            </p>

                            <small className="text-muted">DELIVERED</small>
                            <p className="mb-3">
                              {order.isDelivered ? (
                                <span className="badge bg-black text-white">
                                  {order.deliveredAt.substring(0, 10)}
                                </span>
                              ) : (
                                <FaTimes className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button
                              variant="outline-primary bg-black text-white"
                              size="sm"
                              className="w-100"
                            >
                              View Details
                            </Button>
                          </LinkContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-block d-md-none">
              <div className="row g-2 p-2">
                {orders.map((order) => (
                  <div key={order._id} className="col-12">
                    <div className="card border shadow-sm">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <small className="text-muted d-block">
                              ORDER ID
                            </small>
                            <small
                              className="text-truncate d-inline-block"
                              style={{ maxWidth: "150px" }}
                            >
                              {order._id}
                            </small>
                          </div>
                          <span className="badge bg-black text-white">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </div>

                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block">USER</small>
                            <small>{order.user.name}</small>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">DATE</small>
                            <small>{order.createdAt.substring(0, 10)}</small>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-6">
                            <small className="text-muted d-block">PAID</small>
                            {order.isPaid ? (
                              <span className="badge bg-success">
                                {order.paidAt.substring(0, 10)}
                              </span>
                            ) : (
                              <FaTimes className="text-danger" />
                            )}
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">
                              DELIVERED
                            </small>
                            {order.isDelivered ? (
                              <span className="badge bg-black text-white">
                                {order.deliveredAt.substring(0, 10)}
                              </span>
                            ) : (
                              <FaTimes className="text-danger" />
                            )}
                          </div>
                        </div>

                        <LinkContainer to={`/order/${order._id}`}>
                          <Button
                            variant="outline-primary bg-black text-white"
                            size="sm"
                            className="w-100"
                          >
                            View Details
                          </Button>
                        </LinkContainer>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;
