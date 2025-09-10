// ====== متغيّرات السلة ======
let cart = [];                      // المشتريات الحالية
let historyStack = [];              // تاريخ العمليات (للتراجع)
let historyIndex = -1;              // مؤشر التراجع الحالي
const MAX_HISTORY = 50;             // أقصى عدد عمليات نحتفظ بها

// ====== عناصر الـ DOM ======
const cartIcon       = document.getElementById('cartIcon');
const cartDropdown   = document.getElementById('cartDropdown');
const cartCount      = document.getElementById('cartCount');
const cartItems      = document.getElementById('cartItems');
const cartTotal      = document.getElementById('cartTotal');
const undoBtn        = document.getElementById('undoBtn');
const redoBtn        = document.getElementById('redoBtn');
const checkoutBtn    = document.getElementById('checkoutBtn');
const checkoutPage   = document.getElementById('checkoutPage');
const backBtn        = document.getElementById('backBtn');
const checkoutForm   = document.getElementById('checkoutForm');
const summaryItems   = document.getElementById('summaryItems');
const summaryTotal   = document.getElementById('summaryTotal');

// ====== وظيفة إضافة منتج إلى السلة ======
function addToCart(name, price) {
  const newItem = { name, price, id: Date.now() };
  cart.push(newItem);
  saveHistory('add', newItem);
  updateCartUI();
  // تأثير مؤقت على الزر
  const btn = event.target;
  btn.innerHTML = '✅ تمت الإضافة!';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = 'أضف إلى السلة';
    btn.disabled = false;
  }, 1200);
}

// ====== حفظ العملية في تاريخ التراجع ======
function saveHistory(action, item) {
  // نحذف أي عمليات بعد الـ index الحالي (لو كان هناك تراجع سابق)
  historyStack = historyStack.slice(0, historyIndex + 1);
  historyStack.push({ action, item });
  historyIndex++;
  if (historyStack.length > MAX_HISTORY) historyStack.shift();
}

// ====== التراجع Undo ======
undoBtn.addEventListener('click', () => {
  if (historyIndex < 0) return; // لا يوجد ما يُتراجع عنه
  const lastOp = historyStack[historyIndex];
  if (lastOp.action === 'add') {
    // نحذف آخر عنصر أُضيف
    const idx = cart.findIndex(it => it.id === lastOp.item.id);
    if (idx > -1) cart.splice(idx, 1);
  }
  historyIndex--;
  updateCartUI();
});

// ====== الإعادة Redo ======
redoBtn.addEventListener('click', () => {
  if (historyIndex >= historyStack.length - 1) return;
  historyIndex++;
  const nextOp = historyStack[historyIndex];
  if (nextOp.action === 'add') cart.push(nextOp.item);
  updateCartUI();
});

// ====== فتح/غلق قائمة السلة ======
cartIcon.addEventListener('click', () => cartDropdown.classList.toggle('active'));

// ====== تحديث واجهة السلة ======
function updateCartUI() {
  cartCount.textContent = cart.length;
  if (cart.length === 0) {
    cartItems.innerHTML = '<div style="text-align:center;padding:1rem 0">🍽️ لا توجد منتجات</div>';
    cartTotal.innerHTML  = 'الإجمالي: ٠ ريال';
    return;
  }
  let html = '';
  let total = 0;
  cart.forEach(item => {
    html += `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>${item.price} ريال</span>
      </div>`;
    total += item.price;
  });
  cartItems.innerHTML = html;
  cartTotal.innerHTML  = `الإجمالي: ${total} ريال`;
}

// ====== الانتقال إلى صفحة الدفع ======
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) { alert('السلة فارغة!'); return; }
  // إخفاء الصفحة الرئيسية
  document.querySelector('.products').style.display   = 'none';
  document.querySelector('.hero').style.display       = 'none';
  document.querySelector('footer').style.display      = 'none';
  checkoutPage.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // ملء ملخص الطلب
  let summaryHTML = '';
  let total = 0;
  cart.forEach(item => {
    summaryHTML += `<div class="summary-item"><span>${item.name}</span><span>${item.price} ريال</span></div>`;
    total += item.price;
  });
  summaryItems.innerHTML = summaryHTML;
  summaryTotal.innerHTML = `الإجمالي: ${total} ريال`;
});

// ====== زر العودة من صفحة الدفع ======
backBtn.addEventListener('click', () => {
  checkoutPage.classList.remove('active');
  document.querySelector('.products').style.display   = 'block';
  document.querySelector('.hero').style.display       = 'flex';
  document.querySelector('footer').style.display      = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ====== إرسال الطلب ======
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('🎉 تم استلام طلبك بنجاح! سنتصل بك قريباً لتأكيد التوصيل.');
  // إعادة التهيئة
  cart = []; historyStack = []; historyIndex = -1;
  updateCartUI();
  checkoutForm.reset();
  // العودة للصفحة الرئيسية
  backBtn.click();
});