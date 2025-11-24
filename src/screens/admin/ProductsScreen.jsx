import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { Button, Col, Row } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import { useParams } from "react-router-dom";
import PaginationComp from "../../components/PaginationComp";
import Loader from "../../components/Loader";

const ProductsScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete the product")) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure to create new product")) {
      try {
        await createProduct().unwrap();
        refetch();
        toast.success("Product created successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4 text-black">
      <Row className="align-items-center mb-4">
        <Col xs={12} md={6}>
          <h1 className="h2 mb-0 fw-bold text-black">Products</h1>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button
            className="btn-black  px-4 py-2 text-white bg-black"
            onClick={createProductHandler}
            disabled={loadingCreate}
          >
            <FaPlus className="me-2" />
            {loadingCreate ? "Creating..." : "Create Product"}
          </Button>
        </Col>
      </Row>

      {(loadingCreate || loadingDelete) && (
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
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow-sm border-0  d-lg-block">
            <div className="card-body p-0">
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-striped table-hover align-middle mb-0 text-black">
                  <thead className="text-white bg-black rounded">
                    <tr>
                      <th className="ps-3 text-white">ID</th>
                      <th className="text-white">NAME</th>
                      <th className="text-white">PRICE</th>
                      <th className="text-white">BRAND</th>
                      <th className="text-center pe-3 text-white">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.products.map((product) => (
                      <tr key={product._id}>
                        <td className="ps-3 text-black">
                          <span
                            className="text-truncate d-inline-block text-black"
                            style={{
                              maxWidth: "120px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product._id}
                          </span>
                        </td>

                        <td className="text-black">
                          <span
                            className="d-inline-block text-black"
                            style={{
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.name.substring(0, 40)}
                          </span>
                        </td>

                        <td className="fw-bold text-black">${product.price}</td>

                        <td>
                          <span
                            className="badge bg-black text-white d-inline-block"
                            style={{
                              maxWidth: "120px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.brand}
                          </span>
                        </td>

                        <td className="text-center pe-3">
                          <div className="d-flex justify-content-center gap-2">
                            <LinkContainer
                              to={`/admin/product/${product._id}/edit`}
                            >
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="px-3 text-black"
                              >
                                <FaEdit />
                              </Button>
                            </LinkContainer>

                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="px-3 text-black"
                              onClick={() => deleteHandler(product._id)}
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
          </div>

          <div className="mt-4">
            <PaginationComp
              pages={data.pages}
              page={data.page}
              isAdmin={true}
              keyword={keyword ? keyword : ""}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsScreen;
