// ====== تشغيل مكتبة AOS (الحركات) ======
AOS.init({
  offset: 80,          // بعدد البكسل عن أعلى الصفحة
  delay: 0,            // تأخير عام (يمكن تخصيصه لكل عنصر)
  duration: 700,       // مدة الحركة بالمللي ثانية
  easing: 'ease-out-quad',
  once: false,         // تكرار الحركة عند العودة للعنصر
  mirror: true
});

// ====== سكرول ناعم عند الضغط على الروابط الداخلية ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ====== تأثير Navbar أثناء السكرول ======
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.background = window.scrollY > 100 ? 'rgba(17, 17, 17, 0.98)' : 'rgba(17, 17, 17, 0.95)';
});