document.addEventListener('DOMContentLoaded', function() {
    // 🔹 Authentication UI control
    const auth = JSON.parse(localStorage.getItem('aroma_auth'));
    const logoutBtn = document.getElementById('logoutBtn');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');

    // 🔐 Redirect guests if they are on order-page
const currentPage = document.querySelector('.page.active');
if (currentPage && currentPage.id === 'order-page' && !auth) {
  alert('Please sign in to place an order.');
  window.location.href = 'signin.html';
}

    if (auth) {
        // User logged in
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (loginLink) loginLink.style.display = "none";
        if (signupLink) signupLink.style.display = "none";
    } else {
        // User not logged in
        if (logoutBtn) logoutBtn.style.display = "none";
        if (loginLink) loginLink.style.display = "inline-block";
        if (signupLink) signupLink.style.display = "inline-block";
    }

    // 🔹 Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('aroma_auth');
            alert("You have been logged out.");
            window.location.href = "signin.html";
        });
    }
const welcomeUser = document.getElementById('welcome-user');
if (auth && welcomeUser) {
  const username = auth.username || auth.email || "Guest";
  welcomeUser.textContent = `Welcome, ${username.split('@')[0]}! 👋`;
} else if (welcomeUser) {
  welcomeUser.textContent = "";
}

    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // Hamburger menu toggle
    document.getElementById('hamburger').addEventListener('click', function() {
        document.getElementById('navbar').classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('#navbar ul li a').forEach(link => {
        link.addEventListener('click', function() {
            document.getElementById('navbar').classList.remove('active');
        });
    });
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            
            // Show feedback
            alert(`${name} added to cart!`);
        });
    });
    
    // Clear cart button
    document.getElementById('clear-cart')?.addEventListener('click', function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });
    
    // ✅ Order form submission with Paystack integration
   document.getElementById('order-form')?.addEventListener('submit', function(e) {
  e.preventDefault();

  // Check if user is logged in
  const authUser = JSON.parse(localStorage.getItem("aroma_auth"));
  if (!authUser) {
    alert("You must be logged in to place an order!");
    window.location.href = "signin.html";
    return;
  }

  // Check if cart is empty
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items before placing an order.');
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const name = document.getElementById("name").value;
  const email = authUser.email;
  const phone = document.getElementById("phone").value;

  // Initialize Paystack payment
  let handler = PaystackPop.setup({
    key: 'pk_test_9a558288d1670a641dafa6f4e899ddb24f2fe749', // 🔑 Replace with your Paystack public key
    email: email,
    amount: totalAmount * 100, // Amount in kobo
    currency: 'NGN',
    ref: 'AROMA_' + Math.floor((Math.random() * 1000000000) + 1),
    metadata: {
      custom_fields: [
        {
          display_name: name,
          variable_name: "mobile_number",
          value: phone
        }
      ]
    },
   

    callback: function(response) {
  alert('Payment successful! Reference: ' + response.reference);


  const order = {
    name,
    phone,
    address: document.getElementById("address").value,
    items: cart,
    total: totalAmount,
    date: new Date().toLocaleString(),
    status: "Pending"
  };

  let orders = JSON.parse(localStorage.getItem("aroma_orders")) || [];
  orders.push(order);
  localStorage.setItem("aroma_orders", JSON.stringify(orders));

  // Show confirmation modal
  document.getElementById('order-modal').style.display = 'flex';

  // Clear cart
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();

  // Reset form
  document.getElementById("order-form").reset();
}


  });

  handler.openIframe();
});

    
    // Modal close buttons
    document.getElementById('modal-close')?.addEventListener('click', function() {
        document.getElementById('order-modal').style.display = 'none';
    });
    
    document.getElementById('modal-ok')?.addEventListener('click', function() {
        document.getElementById('order-modal').style.display = 'none';
        showPage('home');
    });
    
    // Function to render cart
    function renderCart() {
        const cartItemsEl = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');
        
        if (!cartItemsEl) return;
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty. Add items from the menu.</p>';
            cartTotalEl.textContent = '0';
            return;
        }
        
        cartItemsEl.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.quantity} × ₦${item.price}</p>
                </div>
                <div class="cart-item-price">₦${itemTotal}</div>
                <div class="cart-item-remove" data-name="${item.name}">&times;</div>
            `;
            cartItemsEl.appendChild(itemEl);
        });


        
        
        // Add remove item functionality
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                cart = cart.filter(item => item.name !== itemName);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
        
        cartTotalEl.textContent = total;
    }
    
    // Function to show/hide pages
    function showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(`${pageId}-page`).classList.add('active');
        
        // Update document title
        let pageTitle = 'Aroma Kitchen - Nigerian Cuisine';
        if (pageId === 'menu') pageTitle = 'Menu - Aroma Kitchen';
        else if (pageId === 'order') {
            pageTitle = 'Order - Aroma Kitchen';
            renderCart();
        }
        else if (pageId === 'contact') pageTitle = 'Contact - Aroma Kitchen';
        document.title = pageTitle;
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    // Initialize the page
    renderCart();
});



// ==========================
// 💬 WhatsApp Order Function (with customer info)
// ==========================
const whatsappBtn = document.getElementById("whatsapp-order-btn");

if (whatsappBtn) {
  whatsappBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty. Add some items first!");
      return;
    }

    // 🧍‍♂️ Get customer info from the form
    const name = document.getElementById("name")?.value || "Customer";
    const phone = document.getElementById("phone")?.value || "Not provided";
    const address = document.getElementById("address")?.value || "Not provided";

    // 🛒 Calculate total and format message
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let message = `Hello Aroma Kitchen! 👋\n\nI'd like to order the following:\n\n`;
    cart.forEach((item) => {
      message += `• ${item.quantity} × ${item.name} - ₦${item.price * item.quantity}\n`;
    });

    message += `\nTotal: ₦${total}\n\n`;
    message += `🧍 Name: ${name}\n📞 Phone: ${phone}\n🏠 Address: ${address}\n\n`;
    message += `Please confirm delivery time.`;

    // ✅ WhatsApp link (replace with your restaurant number)
    const phoneNumber = "2349067377220"; // Use full country code, no "+"
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp chat
    window.open(whatsappURL, "_blank");
  });
}


// Highlight active nav item
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
