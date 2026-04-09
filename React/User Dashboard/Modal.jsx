import React, { useEffect } from 'react'
import Swal from 'sweetalert2'

function Modal({ user, onClose }) {

    useEffect(() => {
        Swal.fire({
            html: `
            <p><b>Name : </b>${user.name}</p>
            <p><b>Email : </b>${user.email}</</p>
            <p><b>Phone : </b>${user.phone}</p>
            <p><b>Company : </b>${user.company.name}</p>
            <p><b>Address : </b>${user.address.street + ', ' + user.address.suite + ', ' + user.address.city + '.'}</p>
            <p><b>Website : </b>${user.website}</p>
            `,
            showCloseButton: true,
            confirmButtonText: "Close",
        }).then(() => {
            onClose()
        })
    }, [user, onclose])

    return null
}

export default Modal