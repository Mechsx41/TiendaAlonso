document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
});

document.getElementById('pedidoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('name').value;
    const apellido = document.getElementById('lastName').value;
    const telefono = document.getElementById('phoneNumber').value;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const pedido = { 
        cliente: { nombre, apellido, telefono },
        carrito
    };

    try {
        const response = await fetch('http://localhost:3000/guardar-pedido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        if (response.ok) { 
           
            localStorage.setItem('mostrarNotificacion', 'true');
            localStorage.removeItem('carrito');
            actualizarContadorCarrito();
            document.getElementById('pedidoForm').reset();

            window.location.href = '../../../index.html';
        } else {
            const errorData = await response.json();
            alert("Hubo un problema al enviar el pedido: " + errorData.message);
        }
    } catch (error) {
        if (error.message === 'Failed to fetch') {
           alert("Error de conexión: No se pudo conectar al servidor. Por favor, intente más tarde.");
        } 
    }
});

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    document.getElementById('cart-count').textContent = totalProductos;
}
