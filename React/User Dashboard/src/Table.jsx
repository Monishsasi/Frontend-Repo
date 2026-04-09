import React, { useState } from 'react'
import useFetch from './useFetch'
import { FaSearch } from "react-icons/fa";
import Modal from '../Modal';


function Table({ user, onView }) {


  return (
    <tr className='body-row'>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>{user.company.name}</td>
      <td>{user.address.street + ', ' + user.address.suite + ', ' + user.address.city + '.'}</td>
      <td><button className="view-details" onClick={() => onView(user)}>View</button></td>
    </tr>
  )

}



function TableList() {

  const [data, error] = useFetch('https://jsonplaceholder.typicode.com/users')

  const [search, setSearch] = useState('')

  const [selectedUser, setSelectedUser] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 4



  if (!data) {
    return <>
      {!error && <p className='Loading-tag'>Loading....</p>}
      {error && <p>{error}</p>}
    </>
  }

  let filteredList = data.filter((user) => (
    `${user.name} ${user.email} ${user.company.name}`.toLowerCase().includes(search.toLowerCase())
  ))

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = filteredList.slice(indexOfFirstRow, indexOfLastRow)

  const totalPages = Math.ceil(filteredList.length / rowsPerPage)

  let tableList =
    <div className="table-container">
      <table className='table'>
        <thead className='table-head'>
          <tr className='head-row'>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody className='table-body'>
          {currentRows.map((user) => {
            return <Table
              key={user.id}
              user={user}
              onView={setSelectedUser}
            />
          })}
        </tbody>
      </table>
    </div>

  return (
    <>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
      </div>
      {tableList}
      {selectedUser && <Modal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)} 
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  )
}

export { Table, TableList }