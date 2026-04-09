
function Header({ category, setCategory, search, setSearch }) {


    return (
        <>
            <div className="header-container">
                <h1 style={{ color: "blue", fontSize: "30px", marginRight: "100px" }}>E-Cart Shopping</h1>
                    <input type="text" className="searchBar" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search Here"/>

                    <select value={category} className="dropDown" onChange={(e) => setCategory(e.target.value)}>
                        <option value="All" className="All">All</option>
                        <option value="electronics" className="Electronics">Electronics</option>
                        <option value="jewelery" className="Jewelry">Jewelry</option>
                        <option value="men's clothing" className="Men">Men</option>
                        <option value="women's clothing" className="Women">Women</option>
                    </select>
                </div>
        </>
    )
}

export default Header