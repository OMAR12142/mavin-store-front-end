import { Button, Table, Row, Col, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "../../slices/productsApiSlice.js";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import PaginationComp from "../../components/PaginationComp";
import { motion } from "framer-motion";

const ProductsScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success("Product Deleted Successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product template?")) {
      try {
        await createProduct();
        refetch();
        toast.success("Product Template Created");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
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
      <Row className="align-items-center mb-4 g-3">
        <Col>
          <h1 className="fw-bold text-black mb-0" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
            Products
          </h1>
        </Col>
        <Col className="text-end">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'inline-block' }}>
            <Button
              className="app-auth-btn-custom py-2 px-4 d-flex align-items-center gap-2"
              onClick={createProductHandler}
              style={{ borderRadius: '15px', fontWeight: '700' }}
            >
              <FaPlus size={14} /> CREATE PRODUCT
            </Button>
          </motion.div>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {loadingCreate && <Loader />}
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Card.Header className="py-4 px-4 border-0" style={{ background: '#000' }}>
              <h5 className="mb-0 fw-bold" style={{ color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>Catalogue Management</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover borderless className="app-orders-table mb-0 align-middle">
                  <thead style={{ background: '#F8F9FA' }}>
                    <tr>
                      <th className="py-3 px-4 text-uppercase small fw-bold">ID</th>
                      <th className="py-3 px-4 text-uppercase small fw-bold">Name</th>
                      <th className="py-3 px-4 text-uppercase small fw-bold">Price</th>
                      <th className="py-3 px-4 text-uppercase small fw-bold">Category</th>
                      <th className="py-3 px-4 text-uppercase small fw-bold">Brand</th>
                      <th className="py-3 px-4 text-uppercase small fw-bold text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((product) => (
                      <tr key={product._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td className="py-3 px-4 fw-mono small">{product._id.substring(0, 10)}...</td>
                        <td className="py-3 px-4 fw-semibold">{product.name}</td>
                        <td className="py-3 px-4 fw-bold" style={{ color: '#D4AF37' }}>${product.price.toFixed(2)}</td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4">{product.brand}</td>
                        <td className="py-3 px-4 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
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
                                onClick={() => deleteHandler(product._id)}
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
          <div className="mt-4">
            <PaginationComp
              pages={data.pages}
              page={data.page}
              isAdmin={true}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ProductsScreen;
