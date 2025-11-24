import { Col, Row } from "react-bootstrap";
import { Product } from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import { Link, useParams } from "react-router-dom";
import PaginationComp from "../components/PaginationComp.jsx";
import { LandingComp } from "../components/LandingComp.jsx";

export const Homescreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <LandingComp />

      {keyword && (
        <div className="container-fluid px-3 px-sm-4 px-lg-5">
          <Link to="/" className="btn btn-light mb-4 mt-3">
            <i className="fas fa-arrow-left me-2"></i>
            Back to All Products
          </Link>
        </div>
      )}

      <div className="container-fluid px-3 px-sm-4 px-lg-5">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError.data?.message || isError.error}
          </Message>
        ) : (
          <>
            <div className="text-center text-lg-start mb-4 mt-5">
              <h1 className="text-black fw-bold display-6 display-lg-5">
                {keyword
                  ? `Search Results for "${keyword}"`
                  : "Latest Products"}
              </h1>
              {!keyword && (
                <p className="text-muted lead d-none d-md-block">
                  Discover our newest collection of premium products
                </p>
              )}
            </div>

            <Row className="g-4 g-md-4 g-lg-5 justify-content-center justify-content-lg-start">
              {(keyword ? data.products : data.products.slice(-4)).map(
                (product) => (
                  <Col
                    key={product._id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className="mb-4"
                  >
                    <div className="h-100 d-flex">
                      <div className="card border-0 shadow h-100 w-100">
                        <div
                          className="position-relative"
                          style={{ height: "250px" }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="card-img-top h-100 w-100 object-fit-cover"
                          />
                        </div>
                        <div className="card-body d-flex flex-column p-4">
                          <h5 className="card-title fw-bold text-black mb-3">
                            {product.name.length > 40
                              ? product.name.substring(0, 40) + "..."
                              : product.name}
                          </h5>
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="h4 mb-0 text-black fw-bold">
                                ${product.price}
                              </span>
                            </div>
                            <Link
                              to={`/product/${product._id}`}
                              className="btn btn-black bg-black w-100 py-2 text-decoration-none"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                )
              )}
            </Row>

            {!keyword && data.products.length > 4 && (
              <div className="text-center mt-4 mb-5">
                <Link
                  to="/allproducts"
                  className="btn btn-black bg-black text-white btn-lg px-5 py-3 fw-bold text-decoration-none"
                >
                  View All Products
                  <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </div>
            )}

            {keyword && data.pages > 1 && (
              <div className="mt-5">
                <PaginationComp
                  pages={data.pages}
                  page={data.page}
                  isAdmin={false}
                  keyword={keyword ? keyword : ""}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
