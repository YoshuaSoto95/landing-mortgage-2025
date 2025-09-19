// =============================================
// THREE.JS ANIMATION SETUP
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    // Configuración básica de Three.js
    let scene, camera, renderer, particles;

    function initThreeJS() {
        // Crear escena
        scene = new THREE.Scene();

        // Crear cámara
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Crear renderizador
        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('three-canvas'),
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

        // Crear partículas decorativas
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;

        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
            colorArray[i] = Math.random();
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Animación de partículas
        function animate() {
            requestAnimationFrame(animate);

            particles.rotation.x += 0.0005;
            particles.rotation.y += 0.001;

            renderer.render(scene, camera);
        }

        animate();

        // Ajustar en redimensionamiento de ventana
        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Inicializar Three.js
    initThreeJS();

    // =============================================
    // INTERSECTION OBSERVER PARA ANIMACIONES AL SCROLL
    // =============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos para animar al hacer scroll
    document.querySelectorAll('.benefit-card').forEach(card => {
        observer.observe(card);
    });

    // =============================================
    // NAVEGACIÓN Y MENÚ RESPONSIVE
    // =============================================
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');

    // Toggle menu móvil
    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en close
    closeMenu.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Cambiar header al hacer scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // =============================================
    // CALCULADORA HIPOTECARIA
    // =============================================
    const mortgageForm = document.getElementById('mortgage-form');
    const calculateBtn = document.getElementById('calculate-btn');
    const calculatorResult = document.getElementById('calculator-result');
    const monthlyPaymentElement = document.getElementById('monthly-payment');

    calculateBtn.addEventListener('click', function () {
        const propertyValue = parseFloat(document.getElementById('property-value').value);
        const downPayment = parseFloat(document.getElementById('down-payment').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value);

        if (isNaN(propertyValue) || isNaN(downPayment) || isNaN(loanTerm) || isNaN(interestRate)) {
            alert('Por favor, completa todos los campos con valores válidos.');
            return;
        }

        if (downPayment >= propertyValue) {
            alert('El pago inicial debe ser menor al valor de la propiedad.');
            return;
        }

        const loanAmount = propertyValue - downPayment;
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        // Fórmula de cálculo de hipoteca: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
        const monthlyPayment = loanAmount *
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

        monthlyPaymentElement.textContent = '$' + monthlyPayment.toFixed(2);
        calculatorResult.classList.add('visible');
    });

    // =============================================
    // CARRUSEL DE TESTIMONIOS
    // =============================================
    const testimonialsSlider = document.getElementById('testimonials-slider');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    let currentTestimonial = 0;
    const testimonialCount = testimonialsSlider.children.length;

    testimonialNext.addEventListener('click', function () {
        currentTestimonial = (currentTestimonial + 1) % testimonialCount;
        updateTestimonialSlider();
    });

    testimonialPrev.addEventListener('click', function () {
        currentTestimonial = (currentTestimonial - 1 + testimonialCount) % testimonialCount;
        updateTestimonialSlider();
    });

    function updateTestimonialSlider() {
        testimonialsSlider.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    }

    // =============================================
    // MODAL DE SOLICITUD Y FORMULARIO MULTI-ETAPA
    // =============================================
    const applicationModal = document.getElementById('application-modal');
    const closeApplicationModal = document.getElementById('close-application-modal');
    const formProgress = document.getElementById('form-progress');
    const loanApplicationForm = document.getElementById('loan-application-form');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const thankYouModal = document.getElementById('thank-you-modal');
    const closeThankYouModal = document.getElementById('close-thank-you-modal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');

    // Abrir modal desde cualquier CTA
    openModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            applicationModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Cerrar modal de aplicación
    closeApplicationModal.addEventListener('click', function () {
        applicationModal.classList.remove('active');
        document.body.style.overflow = '';
        resetForm();
    });

    // Cerrar modal de agradecimiento
    closeThankYouModal.addEventListener('click', function () {
        thankYouModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Navegación entre pasos del formulario
    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            const currentStep = document.querySelector('.form-step.active');
            const nextStepId = this.getAttribute('data-next');
            const nextStep = document.getElementById('step-' + nextStepId);

            // Validar campos del paso actual antes de avanzar
            const inputs = currentStep.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });

            if (!isValid) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            // Avanzar al siguiente paso
            currentStep.classList.remove('active');
            nextStep.classList.add('active');

            // Actualizar barra de progreso
            updateProgressBar(parseInt(nextStepId));
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            const currentStep = document.querySelector('.form-step.active');
            const prevStepId = this.getAttribute('data-prev');
            const prevStep = document.getElementById('step-' + prevStepId);

            currentStep.classList.remove('active');
            prevStep.classList.add('active');

            // Actualizar barra de progreso
            updateProgressBar(parseInt(prevStepId) - 1);
        });
    });

    // Enviar formulario
    loanApplicationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simular envío exitoso
        setTimeout(function () {
            applicationModal.classList.remove('active');
            thankYouModal.classList.add('active');
            resetForm();

            // Aquí iría la lógica para mostrar fuegos artificiales con Three.js
            // En una implementación real, se agregarían partículas especiales
        }, 1000);
    });

    function updateProgressBar(step) {
        const progressPercentage = (step / formSteps.length) * 100;
        formProgress.style.width = progressPercentage + '%';
    }

    function resetForm() {
        // Restablecer formulario
        loanApplicationForm.reset();

        // Volver al primer paso
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('step-1').classList.add('active');

        // Restablecer barra de progreso
        updateProgressBar(1);
    }

    // Inicializar barra de progreso
    updateProgressBar(1);

    // =============================================
    // ANIMACIÓN DE ENTRADA PARA HERO SECTION
    // =============================================
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.animation = 'fadeInUp 1s ease forwards';
});