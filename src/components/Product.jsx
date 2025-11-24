import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

export const Product = ({ product }) => {
  return (
    <Card className="app-product-card border-0 shadow-sm h-100 w-100">
      <Link to={`/product/${product._id}`} className="text-decoration-none">
        <Card.Img
          src={product.image}
          variant="top"
          className="card-image-custom w-100"
          style={{
            height: "200px",
            objectFit: "contain",
          }}
        />
      </Link>

      <Card.Body className="p-3 d-flex flex-column h-100">
        <Link
          to={`/product/${product._id}`}
          className="text-decoration-none text-black flex-grow-1 d-flex flex-column"
        >
          <Card.Title
            as="div"
            className="product-title-custom fw-bold mb-2 fs-6 lh-sm"
            style={{
              minHeight: "48px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name.substring(0, 50)}
          </Card.Title>
        </Link>

        <div className="app-product-rating mb-2">
          <Rating value={product.rating} />
        </div>

        <div className="mt-auto pt-2">
          <Card.Text
            as="h5"
            className="app-product-price text-black fw-bold mb-0 fs-5"
          >
            $ {product.price}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;
