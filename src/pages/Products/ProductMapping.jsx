import PackageCard from "../../components/common/PackageCard";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import useLocationStore from "../../stores/locationStore";

const ProductMapping = ({
  arr,
  loading,
  handleRatingClick,
  NoProductsState,
  showProducts,
  showPackages,
  allProducts,
  packages,
  onResetFilters,
  onShowAll,
  handleCloseReviewsModal,
}) => {
  return arr.length > 0 ? (
    arr.map((item, index) => {
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
    })
  ) : (
    <NoProductsState
      showProducts={showProducts}
      showPackages={showPackages}
      allProducts={allProducts}
      packages={packages}
      onResetFilters={onResetFilters}
      onShowAll={onShowAll}
    />
  );
};

export default ProductMapping;
