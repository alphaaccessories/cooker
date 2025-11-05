// Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGrBPjCSpnQ6kWaTsiU-ZVwTzTKQZ3oKu23eoRj2b9lNWb8kbQtf3rCXned9Ga3NG7/exec';

// Get form elements
const form = document.getElementById('orderForm');
const submitButton = form.querySelector('button[type="submit"]');
const buttonText = submitButton.querySelector('.button-text');

// Smooth scroll
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

// Form submission
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Mobile validation
  const mobile = form.mobile.value.trim();
  const phoneRegex = /^(01\d{9}|\+8801\d{9})$/;

  if (!phoneRegex.test(mobile)) {
    showErrorDialog("❌ সঠিক মোবাইল নম্বর দিন (01xxxxxxxxx বা +8801xxxxxxxx)");
    return;
  }

  // Disable button
  submitButton.disabled = true;
  buttonText.textContent = 'Submitting Order...';

  const formData = new FormData();
  formData.append('name', form.name.value.trim());
  formData.append('mobile', mobile);
  formData.append('address', form.address.value.trim());
  formData.append('product', form.product.value);

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.status === 'success') {
      form.reset();
      showSuccessDialog();
    } else {
      throw new Error(data.message || 'Unknown error occurred');
    }

  } catch (error) {
    console.error('Error:', error);
    showErrorDialog(error.message);
  } finally {
    submitButton.disabled = false;
    buttonText.textContent = 'Place Order Now';
  }
});

// Price calculation
const deliveryOptions = document.getElementsByName("delivery");
const priceBox = document.getElementById("priceBox");


deliveryOptions.forEach(option => {
  option.addEventListener("change", function() {
    if (this.value === "dhaka") {
      priceBox.textContent = "৯০০ টাকা";
    } else {
      priceBox.textContent = "৯৫০ টাকা";
    }
  });
});


// ✅ Success Dialog
function showSuccessDialog() {
  const message = `
আপনার অর্ডার টি নেয়া হয়েছে।
কিছুক্ষনের মধ্যে আমাদের প্রতিনিতিধি আপনাকে কল করে অর্ডার কন্ফার্ম করবে।
`;

  const dialog = document.createElement('div');
  dialog.style = overlayStyle();
  dialog.innerHTML = `
    <div style="${boxStyle()}">
      <p style="margin-bottom:15px;">${message}</p>
      <button id="okBtn" style="${okBtnStyle()}">OK</button>
      <button id="waBtn" style="${waBtnStyle()}">WhatsApp</button>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById("okBtn").onclick = () => {
    document.body.removeChild(dialog);
  }

  document.getElementById("waBtn").onclick = () => {
    window.open("https://wa.me/+8801869116691", "_blank");
  }
}

// ❌ Error Dialog
function showErrorDialog(errorMsg) {
  const dialog = document.createElement('div');
  dialog.style = overlayStyle();
  dialog.innerHTML = `
    <div style="${boxStyle()}">
      <p style="margin-bottom:15px;color:#c0392b;">${errorMsg}</p>
      <button id="errorOkBtn" style="${okBtnStyle()}">OK</button>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById("errorOkBtn").onclick = () => {
    document.body.removeChild(dialog);
  }
}

// Shared Styles
function overlayStyle(){
  return `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.6); display:flex; justify-content:center;
    align-items:center; z-index:9999;
  `;
}

function boxStyle(){
  return `
    background:#fff; padding:20px; border-radius:8px;
    width:300px; text-align:center; font-size:15px;
  `;
}

function okBtnStyle(){
  return `
    padding:8px 15px;background:#27ae60;color:#fff;border:none;
    border-radius:4px;margin:5px;cursor:pointer;
  `;
}

function waBtnStyle(){
  return `
    padding:8px 15px;background:#25D366;color:#fff;border:none;
    border-radius:4px;margin:5px;cursor:pointer;
  `;
}

// Scroll animations
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

document.querySelectorAll('.feature-card, .gallery-item, .spec-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Button spinner style
const style = document.createElement('style');
style.textContent = `
  .submit-button:disabled .button-text::after {
    content: '';
    display:inline-block;width:12px;height:12px;margin-left:10px;
    border:2px solid #fff;border-radius:50%;
    border-top-color:transparent;animation:spinner 0.6s linear infinite;
  }
  @keyframes spinner { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
