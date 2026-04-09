import React from 'react'
import download from './assets/download.png'
import useFetch from './useFetch'

function CardLayout({ image, title, price, onClick }) {
  return (
    <>
      <div className="main-container" onClick={onClick}>
        <div className="layout-container">
          <img src={image} alt={download} className="image" /><br />
          <p className="title"><b>Title</b> : {title}</p>
          <p className="price"><b>Price</b> : ₹ {price}</p>
        </div>
      </div>
    </>
  )
}

function List({ category, search, setSelectedProduct }) {

  const [list, error] = useFetch('https://fakestoreapi.com/products')

  let filteredList = list

  if (!list) {
    return (<>
      {!error && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
    </>)
  }

  if (category !== "All") {
    filteredList = filteredList.filter((items) => {
      return items.category === category
    }
    )
  }

  if (search !== '') {
    filteredList = filteredList.filter((items) =>
      items.title.toLowerCase().includes(search.toLowerCase())
    )
  }

  const productList = filteredList.map((item, index) => {
    return <CardLayout className='card-layout'
      key={index}
      image={item.image}
      title={item.title}
      price={item.price}
      onClick={() => setSelectedProduct(item)}
    />
  })

  return (

    <div className="card-layout">
      {productList}
    </div>
  )
}

export { CardLayout, List }