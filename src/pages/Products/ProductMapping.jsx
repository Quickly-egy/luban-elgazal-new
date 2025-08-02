import PackageCard from "../../components/common/PackageCard";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import useLocationStore from "../../stores/locationStore";

<<<<<<< HEAD
=======
const ProductMapping = ({
  arr,
  loading,
  handleRatingClick,
  handleCloseReviewsModal,
}) => {
  return arr.map((item, index) => {
    const key = `${item.type}-${item.id}-${useLocationStore.getState().countryCode}`;
    if (item.type === "package") {
      return (
        <div key={key} className="product-card-wrapper">
          <PackageCard
            packageData={item}
            onRatingClick={handleRatingClick}
            style={{
              animationDelay: `${(index % 6) * 0.1}s`,
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="product-card-wrapper" key={key}>
          <ProductCard
            product={item}
            onRatingClick={handleRatingClick}
            showTimer={true}
            style={{
              animationDelay: `${(index % 6) * 0.1}s`,
              opacity: loading ? 0.5 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        </div>
      );
    }
  });
};
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df

const ProductMapping = ({ arr, loading, handleRatingClick }) => {
  const countryCode = useLocationStore((state) => state.countryCode);

  return arr.map((item, index) => {
    const key = `${item.type}-${item.id}-${countryCode}`;
    const commonStyle = {
      animationDelay: `${(index % 6) * 0.1}s`,
    };

    return (
      <div key={key} className="product-card-wrapper">
        {item.type === "package" ? (
          <PackageCard
            packageData={item}
            onRatingClick={handleRatingClick}
            style={commonStyle}
          />
        ) : (
          <ProductCard
            product={item}
            onRatingClick={handleRatingClick}
            showTimer={true}
            style={{
              ...commonStyle,
              opacity: loading ? 0.5 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        )}
      </div>
    );
  });
};
export default ProductMapping;
