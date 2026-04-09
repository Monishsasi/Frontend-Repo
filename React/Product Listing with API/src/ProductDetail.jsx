function ProductDetail({ product, setSelectedProduct }) {

  return (
    <div className="detail-container">
      <div className="prod-img-container">
        <button onClick={() => setSelectedProduct(null)}>
          Back
        </button><br /><br />

        <img src={product.image} width="200" />

        <h2>{product.title}</h2>

        <p style={{fontSize:"20px"}}><b>Price:</b> ₹ {product.price}</p>
      </div>
      <div className="prod-detail-container">
        <p><b>Category:</b> {(product.category).toUpperCase()}</p>

        <p style={{fontSize:"18px"}}>{product.description}</p>
      </div>
    </div>
  )
}

export default ProductDetail