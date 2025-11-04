// Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGrBPjCSpnQ6kWaTsiU-ZVwTzTKQZ3oKu23eoRj2b9lNWb8kbQtf3rCXned9Ga3NG7/exec';

// Get form elements
const form = document.getElementById('orderForm');
const submitButton = form.querySelector('button[type="submit"]');
const buttonText = submitButton.querySelector('.button-text');

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Form submission handler
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Disable button and show loading state
  submitButton.disabled = true;
  buttonText.textContent = 'Submitting Order...';
  
  // Prepare form data
  const formData = new FormData();
  formData.append('name', form.name.value.trim());
  formData.append('mobile', form.mobile.value.trim());
  formData.append('address', form.address.value.trim());
  formData.append('product', form.product.value);
  
  try {
    // Send data to Google Sheets
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (data.status === 'success') {
      // Success message
      showSuccessMessage();
      form.reset();
    } else {
      // Error from server
      throw new Error(data.message || 'Unknown error occurred');
    }
    
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage(error.message);
  } finally {
    // Re-enable button
    submitButton.disabled = false;
    buttonText.textContent = 'Place Order Now';
  }
});

// Success message function
function showSuccessMessage() {
  const message = `
    ✅ Order Placed Successfully!
    
    Thank you for your order. Our team will contact you shortly to confirm your delivery details.
    
    Your YN Rice Cooker 1.8L will be delivered soon!
  `;
  alert(message);
}

// Error message function
function showErrorMessage(errorMsg) {
  const message = `
    ❌ Order Submission Failed
    
    ${errorMsg}
    
    Please try again or contact us directly.
  `;
  alert(message);
}

// Phone number validation (Bangladesh format)
const mobileInput = form.querySelector('input[name="mobile"]');
mobileInput.addEventListener('input', function(e) {
  // Remove non-numeric characters
  let value = e.target.value.replace(/\D/g, '');
  
  // Limit to 11 digits for Bangladesh numbers
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  
  e.target.value = value;
});

// Form validation on blur
const nameInput = form.querySelector('input[name="name"]');
const addressInput = form.querySelector('textarea[name="address"]');

nameInput.addEventListener('blur', function() {
  if (this.value.trim().length < 3) {
    this.style.borderColor = '#f56565';
  } else {
    this.style.borderColor = '#48bb78';
  }
});

mobileInput.addEventListener('blur', function() {
  const phoneRegex = /^01[3-9]\d{8}$/;
  if (phoneRegex.test(this.value)) {
    this.style.borderColor = '#48bb78';
  } else {
    this.style.borderColor = '#f56565';
  }
});

addressInput.addEventListener('blur', function() {
  if (this.value.trim().length < 10) {
    this.style.borderColor = '#f56565';
  } else {
    this.style.borderColor = '#48bb78';
  }
});

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all feature cards and gallery items
document.querySelectorAll('.feature-card, .gallery-item, .spec-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add loading state styles dynamically
const style = document.createElement('style');
style.textContent = `
  .submit-button:disabled .button-text::after {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-left: 10px;
    border: 2px solid #fff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spinner 0.6s linear infinite;
  }
  
  @keyframes spinner {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
