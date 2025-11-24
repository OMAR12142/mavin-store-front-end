import React from "react";
import Message from "../../components/Message";
import { FaTimes, FaTrash, FaEdit, FaCheck, FaEnvelope } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  useDeleteUserMutation,
  useGetusersQuery,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetusersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete the user")) {
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
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 fw-bold text-black">Users</h1>
      </div>
      {loadingDelete && (
        <div className="d-flex justify-content-center py-3">
          <Loader />
        </div>
      )}
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
                      <th>EMAIL</th>
                      <th>ADMIN</th>
                      <th className="text-center pe-3">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="ps-3">
                          <span
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: "120px" }}
                          >
                            {user._id}
                          </span>
                        </td>
                        <td>
                          <span className="fw-semibold">{user.name}</span>
                        </td>
                        <td>
                          <a
                            href={`mailto:${user.email}`}
                            className="text-decoration-none d-flex align-items-center"
                          >
                            <FaEnvelope className="me-2 text-muted" />
                            <span className="text-primary">{user.email}</span>
                          </a>
                        </td>
                        <td>
                          {user.isAdmin ? (
                            <span
                              className="badge bg-danger d-flex align-items-center"
                              style={{ width: "fit-content" }}
                            >
                              <FaCheck className="me-1" />
                              Admin
                            </span>
                          ) : (
                            <span
                              className="badge bg-secondary d-flex align-items-center"
                              style={{ width: "fit-content" }}
                            >
                              <FaTimes className="me-1" />
                              User
                            </span>
                          )}
                        </td>
                        <td className="text-center pe-3">
                          <div className="d-flex justify-content-center gap-2">
                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                              <Button
                                variant="outline-primary bg-black text-white"
                                size="sm"
                                className="px-3"
                              >
                                <FaEdit className="me-1" />
                                Edit
                              </Button>
                            </LinkContainer>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="px-3"
                              onClick={() => deleteHandler(user._id)}
                              disabled={loadingDelete}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-none d-md-block d-lg-none">
              <div className="row g-3 p-3">
                {users.map((user) => (
                  <div key={user._id} className="col-12 col-sm-6">
                    <div className="card border shadow-sm h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1 me-3">
                            <h6 className="card-title mb-1">{user.name}</h6>
                            <small className="text-muted text-truncate d-block">
                              ID: {user._id}
                            </small>
                          </div>
                          <div>
                            {user.isAdmin ? (
                              <span className="badge bg-danger d-flex align-items-center">
                                <FaCheck className="me-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="badge bg-secondary d-flex align-items-center">
                                <FaTimes className="me-1" />
                                User
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">
                            Email
                          </small>
                          <a
                            href={`mailto:${user.email}`}
                            className="text-decoration-none d-flex align-items-center"
                          >
                            <FaEnvelope className="me-2 text-muted" />
                            <span className="text-primary text-truncate">
                              {user.email}
                            </span>
                          </a>
                        </div>

                        <div className="d-flex gap-2">
                          <LinkContainer
                            to={`/admin/user/${user._id}/edit`}
                            className="flex-fill"
                          >
                            <Button
                              variant="outline-primary bg-black text-white"
                              size="sm"
                              className="w-100"
                            >
                              <FaEdit className="me-1" />
                              Edit
                            </Button>
                          </LinkContainer>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="flex-fill"
                            onClick={() => deleteHandler(user._id)}
                            disabled={loadingDelete}
                          >
                            <FaTrash className="me-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-block d-md-none">
              <div className="row g-2 p-2">
                {users.map((user) => (
                  <div key={user._id} className="col-12">
                    <div className="card border shadow-sm">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1 me-2">
                            <h6 className="card-title mb-1">{user.name}</h6>
                            <small className="text-muted text-truncate d-block">
                              ID: {user._id}
                            </small>
                          </div>
                          <div>
                            {user.isAdmin ? (
                              <span className="badge bg-success">
                                <FaCheck className="me-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="badge bg-secondary">
                                <FaTimes className="me-1" />
                                User
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">
                            Email
                          </small>
                          <a
                            href={`mailto:${user.email}`}
                            className="text-decoration-none d-flex align-items-center"
                          >
                            <FaEnvelope className="me-2 text-muted" />
                            <span className="text-primary text-truncate">
                              {user.email}
                            </span>
                          </a>
                        </div>

                        <div className="d-flex gap-2">
                          <LinkContainer
                            to={`/admin/userlist/${user._id}/edit`}
                            className="flex-fill"
                          >
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="w-100"
                            >
                              <FaEdit />
                            </Button>
                          </LinkContainer>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="flex-fill "
                            onClick={() => deleteHandler(user._id)}
                            disabled={loadingDelete}
                          >
                            <FaTrash />
                          </Button>
                        </div>
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

export default UserListScreen;
