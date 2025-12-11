
        // DOM Elements
        const cartIcon = document.querySelector('.cart-icon');
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        const closeCartBtn = document.querySelector('.close-cart');

        const checkoutBtn = document.querySelector('#checkout');
        const cartItemsContainer = document.querySelector('#cart-items');
        const cartTotal = document.querySelector('#cart-total');
        const cartCount = document.querySelector('.cart-count');
        const productsContainer = document.querySelector('#products-container');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-links a');

        // Cart state
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Función para abrir el modal
function openModal() {
    document.body.style.overflow = 'hidden';
    document.getElementById('cart-sidebar').classList.remove('open'); // Cerrar el carrito
    document.getElementById('checkoutModal').style.display = 'block';
}

// Función para cerrar el modal
function closeModal() {
    document.body.style.overflow = '';
    document.getElementById('checkoutModal').style.display = 'none';
}

// Actualizar el manejador del botón de compra
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío');
            return;
        }
        openModal();
    });
}
        // Products data
        const products = [
            {
                id: 1,
                name: 'Manzanilla',
                price: 30000,
                category: 'belleza',
                image: './img/manzanilla.png',
                description: 'Despídete del rubio opaco , consigue un rubio radiante y lleno de vida , el poder ancestral de la manzanilla para cuidar tu color'
            },
            {
                id: 2,
                name: 'Premium',
                price: 30000,
                category: 'suplementos',
                image: './img/premium.png',
                description: 'La fórmula ideal para tu cabello enriquecido con extracto natural de hoja de guayaba especialmente para cabellos delicados débiles y tinturados, aporta billo y suavidad extrema.'
            },
            {
                id: 3,
                name: 'Cebolla',
                price: 30000,
                category: 'alimentos',
                image: './img/cebolla.png',
                description: 'Recomendado para cabellos no tinturados  , mejora el volumen y el brillo, nutre el folículo piloso y disminuye la caída'
            },
            {
                id: 4,
                name: 'Café',
                price: 30000,
                category: 'belleza',
                image: './img/cafe.png',
                description: 'El secreto de un cabello oscuro radiante le tiene la caída promueve el crecimiento nutre y da brillo.'
            },
            {
                id: 5,
                name: 'Romero',
                price: 30000,
                category: 'alimentos',
                image: './img/romero.png',
                description: 'Es la solución perfecta para cabellos débiles y con exceso de grasa fortalece la fibra capilar desde la raíz disfruta de una limpieza extrema detiene la caída'
            },
            {
                id: 6,
                name: 'Acondicionador',
                price: 25000,
                category: 'suplementos',
                image: './img/acondicionador.png',
                description: 'Con extracto de hoja de guayaba linaza y sábila nutre desenreda tu cabello como nunca antes consigue un cabello sedoso fuerte y radiante'
            },
            {
                id: 7,
                name: 'Tónico capilar',
                price: 15000,
                category: 'suplementos',
                image: './img/tonico.png',
                description: 'Tónico capilar con extracto de hoja de guayaba fortalece tu cabello desde la raíz hasta las puntas dile adiós a la caída y bienvenida a la fuerza.'
            }            
        ];

        // Initialize the app
        function init() {
            // Verificar si el contenedor de productos existe antes de intentar mostrar productos
            if (productsContainer) {
                displayProducts(products);
            }
            updateCartUI();
            setupEventListeners();
        }

        // Display products
        function displayProducts(productsToShow) {
            productsContainer.innerHTML = productsToShow.map(product => `
                <div class="product-card" data-category="${product.category}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <span class="product-price">$${product.price}</span>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            `).join('');

            // Add event listeners to "Add to Cart" buttons
           document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
            });
        }

        // Filter products
        function filterProducts(category) {
            if (category === 'todos') {
                displayProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category === category);
                displayProducts(filteredProducts);
            }
        }

        // Add to cart
        function addToCart(e) {
    // Prevenir comportamiento por defecto y propagación
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Obtener el botón más cercano
    const button = e ? e.target.closest('.add-to-cart') : this;
    if (!button) return;
    
    // Deshabilitar temporalmente el botón
    button.disabled = true;
    const originalText = button.innerHTML;
    button.innerHTML = 'Añadiendo...';
    
    // Obtener el ID del producto
    const productId = parseInt(button.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        button.disabled = false;
        button.innerHTML = originalText;
        return;
    }
    
    // Usar setTimeout para asegurar que la UI se actualice
    setTimeout(() => {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartUI();
        saveCart();
        showNotification(`${product.name} añadido al carrito`);
        
        // Restaurar el botón
        button.disabled = false;
        button.innerHTML = originalText;
    }, 100);
}

        // Remove from cart
        function removeFromCart(productId) {
            const product = products.find(p => p.id === productId);
            cart = cart.filter(item => item.id !== productId);
            updateCartUI();
            saveCart();
            
            // Mostrar notificación de eliminación
            if (product) {
                showNotification(`${product.name} eliminado del carrito`);
            }
            
            // Si el carrito queda vacío, cerrar el sidebar después de un breve retraso
            if (cart.length === 0) {
                setTimeout(closeCart, 1000);
            }
        }

        // Toggle cart
        function toggleCart() {
            if (cartSidebar) {
                cartSidebar.classList.toggle('active');
                if (cartOverlay) {
                    cartOverlay.classList.toggle('active');
                    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
                }
            }
        }

        // Close cart
        function closeCart() {
            if (cartSidebar) cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Update cart UI
        function updateCartUI() {
            // Verificar si los elementos del DOM existen
            if (!cartItemsContainer || !cartTotal || !cartCount) return;
            
            // Update cart items
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
                cartTotal.textContent = '$0.00';
                cartCount.textContent = '0';
                return;
            }

            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/80?text=Imagen+no+disponible'">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(3)}</span>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-quantity" data-id="${item.id}" aria-label="Reducir cantidad">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-quantity" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}" aria-label="Eliminar producto">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Update total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Update cart count
            const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (cartCount) {
                cartCount.textContent = itemCount;
                // Mostrar/ocultar el contador del carrito
                cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
            }

            // Delegación de eventos para los botones del carrito
            cartItemsContainer.addEventListener('click', (e) => {
                const target = e.target.closest('[data-id]');
                if (!target) return;
                
                const productId = parseInt(target.dataset.id);
                
                if (target.classList.contains('remove-item') || target.closest('.remove-item')) {
                    e.preventDefault();
                    removeFromCart(productId);
                } else if (target.classList.contains('decrease-quantity') || target.closest('.decrease-quantity')) {
                    e.preventDefault();
                    updateQuantity(productId, -1);
                } else if (target.classList.contains('increase-quantity') || target.closest('.increase-quantity')) {
                    e.preventDefault();
                    updateQuantity(productId, 1);
                }
            });
        }

        // Update item quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    // Si la cantidad llega a 0 o menos, eliminar el producto
                    removeFromCart(productId);
                } else {
                    // Actualizar la interfaz y guardar en localStorage
                    updateCartUI();
                    saveCart();
                    
                    // Mostrar notificación de actualización
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        showNotification(`Cantidad de ${product.name} actualizada a ${item.quantity}`);
                    }
                }
            }
        }

        // Buscar el botón de vaciar carrito
const clearCartBtn = document.querySelector('#clear-cart');

// Verificar si el botón existe
if (clearCartBtn) {
    // Agregar el event listener
    clearCartBtn.addEventListener('click', clearCart);
} else {
    console.error('No se encontró el botón de vaciar carrito');
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('El carrito ya está vacío');
        return;
    }
    
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        // Vaciar el array del carrito
        cart = [];
        
        // Actualizar la interfaz
        updateCart();
        
        // Guardar en localStorage
        saveCart();
        
        // Mostrar notificación
        showNotification('Carrito vaciado correctamente');
        
        // Cerrar el carrito
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
        }
    }
}function updateCart() {
    // Limpiar el contenedor de items
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';  // Limpiar el contenedor
        
        if (cart.length === 0) {
            // Mostrar mensaje de carrito vacío
            cartItemsContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
            // Actualizar total a 0
            document.getElementById('cart-total').textContent = '$0';
            // Actualizar contador
            document.querySelector('.cart-count').textContent = '0';
            return;
        }

        // Si hay productos, mostrarlos
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <p>$${product.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            }
        });

        // Actualizar total
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
        
        // Actualizar contador
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = itemCount;
    }
}

        // Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error al guardar el carrito:', e);
    }
}

        // Show notification
        function showNotification(message) {
            // Verificar si ya existe una notificación visible
            const existingNotification = document.querySelector('.notification.show');
            if (existingNotification) {
                // Si ya hay una notificación, actualizarla en lugar de crear una nueva
                existingNotification.textContent = message;
                existingNotification.style.animation = 'none';
                void existingNotification.offsetWidth; // Trigger reflow
                existingNotification.style.animation = null;
                return;
            }
            
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Forzar un reflow para que la animación funcione correctamente
            void notification.offsetWidth;
            
            notification.classList.add('show');
            
            // Eliminar la notificación después de 3 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                // Esperar a que termine la animación antes de eliminar el elemento
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        // Setup event listeners
        function setupEventListeners() {
            // Cart toggle
            if (cartIcon) {
                cartIcon.addEventListener('click', toggleCart);
            }

            if (closeCartBtn) {
                closeCartBtn.addEventListener('click', closeCart);
            }

            if (cartOverlay) {
                cartOverlay.addEventListener('click', closeCart);
            }
            
            // Delegación de eventos para los botones de añadir al carrito
// Dejar solo este manejador
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        e.preventDefault();  // Añade esta línea para prevenir comportamiento por defecto
        e.stopPropagation(); // Y esta para detener la propagación
        addToCart(e);
    }
});

            // Clear cart
           // Actualizar el manejador del botón de checkout
// Actualizar el manejador del botón de checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío');
            return;
        }
        document.getElementById('checkoutModal').style.display = 'block';
    });
}

// Manejar el envío del formulario de checkout
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const customerData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            address: document.getElementById('customerAddress').value
        };

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let message = 
            `📩 NUEVO PEDIDO - RUBY NATURALS%0A%0A` +
            `📋 INFORMACIÓN DEL CLIENTE%0A` +
            `----------------------------------------%0A` +
            `👤 Nombre completo:%0A${customerData.name}%0A%0A` +
            `📞 Teléfono:%0A${customerData.phone}%0A%0A` +
            `📧 Correo electrónico:%0A${customerData.email}%0A%0A` +
            `🏠 Dirección de envío:%0A${customerData.address}%0A%0A` +
            `🛒 DETALLE DEL PEDIDO%0A` +
            `----------------------------------------%0A`;
        
        cart.forEach(item => {
            message += `• ${item.quantity}x ${item.name}%0A` +
                      `  Precio unitario: $${item.price.toFixed(2)}%0A` +
                      `  Subtotal: $${(item.price * item.quantity).toFixed(2)}%0A%0A`;
        });
        
        message += 
            `----------------------------------------%0A` +
            `💰 TOTAL: $${total.toFixed(2)}%0A%0A` +
            `📅 Fecha del pedido: ${new Date().toLocaleString('es-CO')}%0A%0A` +
            `¡Gracias por tu compra! Pronto nos pondremos en contacto contigo para confirmar tu pedido.`;

        const phoneNumber = '573116942545';
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        
        window.open(url, '_blank');
        document.getElementById('checkoutModal').style.display = 'none';
        this.reset();
        // Opcional: Limpiar el carrito
        // clearCart();
    });
}

// Cerrar el modal al hacer clic en la X
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});
// Al final del DOMContentLoaded, después de definir todas las funciones
document.addEventListener('DOMContentLoaded', function() {
    // ... otro código ...
    
    // Configurar el botón de vaciar carrito
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    } else {
        console.error('No se encontró el botón de vaciar carrito');
    }
    
    // ... resto del código ...
});function updateCart() {
    // Limpiar el contenedor de items
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';  // Limpiar el contenedor
        
        if (cart.length === 0) {
            // Mostrar mensaje de carrito vacío
            cartItemsContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
            // Actualizar total a 0
            document.getElementById('cart-total').textContent = '$0';
            // Actualizar contador
            document.querySelector('.cart-count').textContent = '0';
            return;
        }

        // Si hay productos, mostrarlos
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <p>$${product.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            }
        });

        // Actualizar total
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
        
        // Actualizar contador
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = itemCount;
    }
}
// Cerrar el modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});
            // Filter products
            if (filterBtns.length > 0) {
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Remove active class from all buttons
                        filterBtns.forEach(b => b.classList.remove('active'));
                        // Add active class to clicked button
                        btn.classList.add('active');
                        // Filter products
                        filterProducts(btn.dataset.filter);
                    });
                });
            }

            // Mobile menu toggle
            if (hamburger && navLinks) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navLinks.classList.toggle('active');
                });

                // Close mobile menu when clicking on a link
                if (navLinksItems.length > 0) {
                    navLinksItems.forEach(link => {
                        link.addEventListener('click', () => {
                            hamburger.classList.remove('active');
                            navLinks.classList.remove('active');
                        });
                    });
                }
            }

            // Sticky header on scroll
            window.addEventListener('scroll', () => {
                const header = document.querySelector('.header');
                if (header) {
                    header.classList.toggle('scrolled', window.scrollY > 50);
                }
            });
        }

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);

        // Manejo del formulario de contacto
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                const message =
                    `📩 NUEVO MENSAJE DE CONTACTO - RUBY NATURALS\n\n` +
                    `📋 INFORMACIÓN DEL CONTACTO\n` +
                    `----------------------------------------\n` +
                    `👤 Nombre completo:\n${data.name}\n\n` +
                    `📧 Correo electrónico:\n${data.email}\n\n` +
                    `📝 Asunto:\n${data.subject}\n\n` +
                    `💬 Mensaje:\n${data.message}\n\n` +
                    `📅 Fecha de contacto:\n${new Date().toLocaleString('es-CO')}\n\n` +
                    `Este mensaje ha sido enviado desde el sitio web.`;

                window.open(
                    `https://wa.me/+573116942545?text=${encodeURIComponent(message)}`,
                    '_blank'
                );
                
                // Mostrar mensaje de éxito
                const statusElement = document.getElementById('form-status');
                if (statusElement) {
                    statusElement.style.display = 'block';
                    setTimeout(() => {
                        statusElement.style.display = 'none';
                    }, 5000);
                }
                
                // Limpiar el formulario
                this.reset();
            });
        }

        // Manejo del formulario de newsletter
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                alert(`¡Gracias por suscribirte con el correo ${email}!`);
                this.reset();
            });
        }
        document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const statusMessage = document.getElementById('form-status');
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            form.reset();
            statusMessage.style.display = 'block';
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        } else {
            throw new Error('Error al enviar el mensaje');
        }
    } catch (error) {
        alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
        console.error('Error:', error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
    }
});