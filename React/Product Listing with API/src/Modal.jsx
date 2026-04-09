import React from 'react'
import Swal from "sweetalert2";

function Modal({ product, setSelectedProduct }) {
    return (

        <div className="modal-container">
            {Swal.fire({
                title: product.title,
            imageUrl: product.image,
            imageWidth: 150,
            imageHeight: 180,
            html: `
            <p>${product.description}</p>
            <p style="font-weight: bold">Price: ₹ ${product.price}</p>
            `,
            showCloseButton: true,
            confirmButtonText: "Close",
            width: 600,
            customClass: {
                container: 'custom-modal'
            }
        }).then(() => setSelectedProduct(null))}
        </div>

    )
}

export default Modal