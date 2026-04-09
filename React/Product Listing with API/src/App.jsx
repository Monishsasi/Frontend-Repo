import { useState, useEffect } from 'react'
import './App.css'
import { List } from './CardLayout'
import Header from './Header'
import ProductDetail from './ProductDetail'
import Modal from './Modal'

function App() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  // restore selected product from localStorage
  const [selectedProduct, setSelectedProductState] = useState(() => {
    try {
      const raw = localStorage.getItem('selectedProduct')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // wrapper to persist selected product
  const setSelectedProduct = (product) => {
    setSelectedProductState(product)
    try {
      if (product) localStorage.setItem('selectedProduct', JSON.stringify(product))
      else localStorage.removeItem('selectedProduct')
    } catch {
      // ignore
    }
  }

  // optional: persist simple filters
  useEffect(() => {
    try { localStorage.setItem('category', category) } catch {}
  }, [category])
  useEffect(() => {
    try { localStorage.setItem('search', search) } catch {}
  }, [search])

  return (
    <>
      <div>
        <Header
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
        />
        {selectedProduct ? (
          <Modal
            product={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        ) : (
          <List
            category={category}
            search={search}
            setSelectedProduct={setSelectedProduct}
          />
        )}
      </div>
    </>
  )
}

export default App