import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { FormContainer } from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice.js";
import { useGetProductDetailsQuery } from "../../slices/productDetailsApiSlice.js";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      toast.success("Product Updated");
      refetch();
      navigate("/admin/productslist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/productslist" className="btn btn-light my-3 app-go-back-btn">
        Go Back
      </Link>

      <FormContainer>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1
            className="app-auth-heading text-center mb-4"
            style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}
          >
            Edit Product
          </h1>

          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error?.data?.message || error.error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-3 mb-4">
                <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="app-form-control-custom"
                />
              </Form.Group>

              <Form.Group controlId="price" className="my-3 mb-4">
                <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="app-form-control-custom"
                />
              </Form.Group>

              <Form.Group controlId="image" className="my-3 mb-4">
                <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="app-form-control-custom mb-3"
                />
                <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  label="Choose File"
                  onChange={uploadFileHandler}
                  className="app-form-control-custom"
                />
                {loadingUpload && <Loader />}
              </Form.Group>

              <Form.Group controlId="brand" className="my-3 mb-4">
                <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="app-form-control-custom"
                />
              </Form.Group>

              <Form.Group controlId="countInStock" className="my-3 mb-4">
                <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Count In Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter countInStock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                  className="app-form-control-custom"
                />
              </Form.Group>

              <Form.Group controlId="category" className="my-3 mb-4">
                <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="app-form-control-custom"
                />
              </Form.Group>

              <Form.Group controlId="description" className="my-3 mb-5">
                <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="app-form-control-custom"
                />
              </Form.Group>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-100 app-auth-btn-custom mt-2"
                >
                  Update Product
                </Button>
              </motion.div>
            </Form>
          )}
        </motion.div>
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
