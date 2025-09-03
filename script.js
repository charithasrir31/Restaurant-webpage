// Order management system
let order = [];
let orderCount = 0;
let orderTotal = 0;

// DOM Elements
const navOrderBubble = document.getElementById('nav-order-bubble');
const orderCountEl = document.getElementById('order-count');
const orderPanel = document.getElementById('order-panel');
const closeOrderPanel = document.getElementById('close-order-panel');
const orderItemsEl = document.getElementById('order-items');
const orderSubtotalEl = document.getElementById('order-subtotal');
const orderTaxEl = document.getElementById('order-tax');
const orderGrandTotalEl = document.getElementById('order-grand-total');
const checkoutBtn = document.querySelector('.checkout-btn');

// Create notification element
const notification = document.createElement('div');
notification.className = 'order-notification';
document.body.appendChild(notification);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Menu Filtering Functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter menu items
            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Add to Order functionality
    const orderButtons = document.querySelectorAll('.menu-item-order');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const name = menuItem.querySelector('h3').textContent;
            const priceText = menuItem.querySelector('.menu-item-price').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            
            addToOrder(name, price);
        });
    });
    
    // Order bubble click event
    navOrderBubble.addEventListener('click', function() {
        orderPanel.classList.toggle('open');
    });
    
    // Close order panel
    closeOrderPanel.addEventListener('click', function() {
        orderPanel.classList.remove('open');
    });
    
    // Close panel when clicking outside (but not on remove buttons)
    document.addEventListener('click', function(e) {
        // Check if the click is on a remove button
        const isRemoveButton = e.target.closest('.remove-item');
        
        if (!orderPanel.contains(e.target) && !navOrderBubble.contains(e.target) && !isRemoveButton) {
            orderPanel.classList.remove('open');
        }
    });
    
    // Checkout button event
    checkoutBtn.addEventListener('click', function() {
        if (order.length > 0) {
            showNotification('Order placed successfully! Your food will be ready soon.', 'success');
            
            // Reset order
            order = [];
            orderCount = 0;
            orderTotal = 0;
            updateOrderDisplay();
            updateOrderPanel();
            
            // Close order panel after a delay
            setTimeout(() => {
                orderPanel.classList.remove('open');
            }, 2000);
        } else {
            showNotification('Your cart is empty. Add some items first!', 'error');
        }
    });
    
    // Reservation form handling
    const reservationForm = document.getElementById('reservationForm');
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        alert(`Thank you, ${name}! Your reservation for ${date} at ${time} has been received. We will confirm shortly.`);
        reservationForm.reset();
    });
    
    // Set minimum date for reservation to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    
    // Close order panel if open
    if (orderPanel) {
        orderPanel.classList.remove('open');
    }
}

// Add item to order
function addToOrder(name, price) {
    // Check if item already exists in order
    const existingItem = order.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        order.push({
            id: Date.now(), // Unique ID for each item
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    orderCount++;
    orderTotal += price;
    
    updateOrderDisplay();
    updateOrderPanel();
    
    // Show order panel when adding an item
    orderPanel.classList.add('open');
    
    // Show interactive notification instead of alert
    showNotification(`Added ${name} to your order!`, 'success');
}

// Remove item from order
function removeFromOrder(itemId) {
    const itemIndex = order.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const item = order[itemIndex];
        orderCount -= item.quantity;
        orderTotal -= item.price * item.quantity;
        
        order.splice(itemIndex, 1);
        
        updateOrderDisplay();
        updateOrderPanel();
        
        // Show notification
        showNotification(`Removed ${item.name} from your order`, 'info');
    }
}

// Update order display
function updateOrderDisplay() {
    if (orderCountEl) {
        orderCountEl.textContent = orderCount;
    }
}

// Update order panel
function updateOrderPanel() {
    if (order.length === 0) {
        orderItemsEl.innerHTML = '<div class="empty-order">Your order is empty</div>';
        orderSubtotalEl.textContent = '$0.00';
        orderTaxEl.textContent = '$0.00';
        orderGrandTotalEl.textContent = '$0.00';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    order.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
        <div class="order-item">
            <div class="item-info">
                <div class="item-name">${item.name} × ${item.quantity}</div>
                <div class="item-price">$${itemTotal.toFixed(2)}</div>
            </div>
            <button class="remove-item" onclick="removeFromOrder(${item.id})">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        `;
    });
    
    orderItemsEl.innerHTML = html;
    
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + tax;
    
    orderSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    orderTaxEl.textContent = `$${tax.toFixed(2)}`;
    orderGrandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
}

// Show notification function
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `order-notification ${type}`;
    notification.style.display = 'block';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
