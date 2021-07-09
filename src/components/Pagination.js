import React from 'react'

function Pagination({ postPerPage, totalPost, paginate }) {

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPost / postPerPage); i++) {
        pageNumbers.push(i)
    }
    return (
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <button onClick={() => paginate(number)} className="page-link">{number}</button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination
