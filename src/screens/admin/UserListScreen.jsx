import React from "react";
import Message from "../../components/Message";
import { FaTimes, FaTrash, FaEdit, FaCheck, FaEnvelope } from "react-icons/fa";
import { Button, Table, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  useDeleteUserMutation,
  useGetusersQuery,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetusersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container-fluid px-3 px-md-4 px-lg-5 py-4"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-black" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
          User Management
        </h1>
      </div>

      {loadingDelete && <Loader />}
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Card.Header className="py-4 px-4 border-0" style={{ background: '#000' }}>
            <h5 className="mb-0 fw-bold" style={{ color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>Registered Users</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover borderless className="app-orders-table mb-0 align-middle">
                <thead style={{ background: '#F8F9FA' }}>
                  <tr>
                    <th className="py-3 px-4 text-uppercase small fw-bold">ID</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold">Name</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold">Email</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold text-center">Admin Status</th>
                    <th className="py-3 px-4 text-uppercase small fw-bold text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td className="py-3 px-4 fw-mono small">
                        {user._id.substring(0, 12)}...
                      </td>
                      <td className="py-3 px-4 fw-semibold">
                        {user.name}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`mailto:${user.email}`}
                          className="text-decoration-none d-flex align-items-center"
                          style={{ color: '#D4AF37' }}
                        >
                          <FaEnvelope className="me-2" style={{ opacity: 0.7 }} />
                          <span>{user.email}</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.isAdmin ? (
                          <span className="badge bg-black text-white px-3 py-2" style={{ borderRadius: '8px' }}>
                            <FaCheck className="me-1 text-gold" style={{ color: '#D4AF37' }} /> ADMIN
                          </span>
                        ) : (
                          <span className="badge bg-secondary px-3 py-2 text-white" style={{ borderRadius: '8px', opacity: 0.6 }}>
                            <FaTimes className="me-1" /> USER
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <LinkContainer to={`/admin/user/${user._id}/edit`}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button variant="light" size="sm" className="shadow-sm" style={{ borderRadius: '8px' }}>
                                <FaEdit color="#000" />
                              </Button>
                            </motion.div>
                          </LinkContainer>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="light"
                              size="sm"
                              className="shadow-sm"
                              style={{ borderRadius: '8px' }}
                              onClick={() => deleteHandler(user._id)}
                              disabled={loadingDelete}
                            >
                              <FaTrash color="#ef4444" />
                            </Button>
                          </motion.div>
                        </div>
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

export default UserListScreen;
