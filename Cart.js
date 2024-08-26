document.addEventListener('DOMContentLoaded', () => {
    const carritoGuardado = localStorage.getItem('carrito');
    let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    const cardCarrito = document.getElementById('card-carrito');
    const cartCount = document.getElementById('cart-count');
    const searchInput = document.getElementById('input');
    const cardResume = document.querySelector('.card-resume'); 

    const actualizarContadorCarrito = () => {
        const totalProductos = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
        cartCount.textContent = totalProductos;
    };

    const mostrarCarrito = (productosFiltrados) => {
        cardCarrito.innerHTML = '';
        cardResume.innerHTML = ''; 
        let totalPagar = 0;

        if (productosFiltrados.length === 0) {
            cardCarrito.innerHTML = '<p style="text-align: center;">Aún no hay productos en su carrito</p>';
            return;
        }

        const resumenHeader = document.createElement('h5');
        resumenHeader.textContent = "Resumen de compra";
        cardResume.appendChild(resumenHeader);

        const divider = document.createElement('hr');
        cardResume.appendChild(divider);

        const productosHeader = document.createElement('h5');
        productosHeader.textContent = "Productos:";
        cardResume.appendChild(productosHeader);

        productosFiltrados.forEach(item => {
            const article = document.createElement('article');
            article.classList.add('prueba');

            const spaceImgDiv = document.createElement('div');
            spaceImgDiv.classList.add('space_img');
            spaceImgDiv.innerHTML = `<img src="${item.image}" class="pruebaimg" alt="${item.title}">`;

            const contenerdorArticuleDiv = document.createElement('div');
            contenerdorArticuleDiv.classList.add('contenerdorArticule');
            contenerdorArticuleDiv.innerHTML = `
                <h2 class="reset">${item.title}</h2>
                <div><span>${item.description}</span></div>
                <div><span>Cantidad: ${item.cantidad}</span></div>
                <button class="card-btnEliminar" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
            `;

            const articuleRightDiv = document.createElement('div');
            articuleRightDiv.classList.add('articule-right');
            articuleRightDiv.innerHTML = `
                <button class="btnStock" onclick="actualizarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="btnStock" onclick="actualizarCantidad(${item.id}, 1)">+</button>
            `;

            const articuleRightPriceDiv = document.createElement('div');
            articuleRightPriceDiv.classList.add('articule-right');
            const totalPrice = item.price * item.cantidad;
            articuleRightPriceDiv.innerHTML = `<span class="pricePadding">$${totalPrice.toFixed(2)}</span>`;

            article.appendChild(spaceImgDiv);
            article.appendChild(contenerdorArticuleDiv);
            article.appendChild(articuleRightDiv);
            article.appendChild(articuleRightPriceDiv);

            cardCarrito.appendChild(article);

            totalPagar += totalPrice;

            const productoDiv = document.createElement('div');
            productoDiv.textContent = `${item.title}`;
            cardResume.appendChild(productoDiv);
        });

        const resumenDiv = document.createElement('div');
        resumenDiv.classList.add('resumen-compra');
        resumenDiv.innerHTML = `
            <h2>Total: $${totalPagar.toFixed(2)}</h2>
            <div style="text-align: center;">
                <a href="./form/form.html">
                    <button class="btnCompra">
                     <svg viewBox="0 0 16 16" class="bi bi-cart-check" height="24" width="24" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                      <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"></path>
                      <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                    </svg>
                      <p class="text">Comprar</p>
                    </button>
                </a>
            </div>
        `;
        cardResume.appendChild(resumenDiv);
    };

    const actualizarCantidad = (id, delta) => {
        carrito = carrito.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    cantidad: Math.min(Math.max(item.cantidad + delta, 1), item.stock)
                };
            }
            return item;
        });
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito(carrito);
        actualizarContadorCarrito();
    };

    const eliminarDelCarrito = (id) => {
        carrito = carrito.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito(carrito);
        actualizarContadorCarrito();
    };

    const filtrarProductos = (termino) => {
        const productosFiltrados = carrito.filter(item => 
            item.title.toLowerCase().includes(termino.toLowerCase()) ||
            item.description.toLowerCase().includes(termino.toLowerCase())
        );
        mostrarCarrito(productosFiltrados);
    };

    mostrarCarrito(carrito);
    actualizarContadorCarrito();

    window.actualizarCantidad = actualizarCantidad;
    window.eliminarDelCarrito = eliminarDelCarrito;

    searchInput.addEventListener('input', (e) => {
        filtrarProductos(e.target.value);
    });
});
