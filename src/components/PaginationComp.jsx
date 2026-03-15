import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PaginationComp = ({ pages, page, isAdmin = false, keyword = "" }) => {
  if (pages <= 1) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Pagination className="app-pagination gap-1">
        {[...Array(pages).keys()].map((x) => {
          let link;

          if (isAdmin) {
            link = `/admin/productslist/${x + 1}`;
          } else {
            if (keyword) {
              link = `/allproducts/search/${keyword}/page/${x + 1}`;
            } else {
              link = `/allproducts/page/${x + 1}`;
            }
          }

          const isActive = x + 1 === page;

          return (
            <Link key={x + 1} to={link} className="text-decoration-none">
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`d-flex align-items-center justify-content-center fw-bold ${isActive ? 'active-page' : ''}`}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '12px',
                  background: isActive ? '#000' : '#F8F9FA',
                  color: isActive ? '#D4AF37' : '#000',
                  border: isActive ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'background 0.3s, color 0.3s'
                }}
              >
                {x + 1}
              </motion.div>
            </Link>
          );
        })}
      </Pagination>
    </motion.div>
  );
};

export default PaginationComp;
