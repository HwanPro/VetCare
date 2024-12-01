import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <nav aria-label="Pagination">
            <ul className="pagination justify-content-center">
                {/* Botón Previous */}
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Anterior
                    </button>
                </li>

                {/* Números de página */}
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={`page-item ${currentPage + 1 === number ? 'active' : ''}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(number - 1)}
                        >
                            {number}
                        </button>
                    </li>
                ))}

                {/* Botón Next */}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
