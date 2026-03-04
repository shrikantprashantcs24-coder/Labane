document.addEventListener("DOMContentLoaded", () => {
    
    // --- INTRO OVERLAY ---
    window.addEventListener('load', () => {
        const overlay = document.getElementById('intro-overlay');
        setTimeout(() => {
            overlay.classList.add('intro-hidden');
            document.body.classList.remove('is-loading');
        }, 2200); 
    });

    // --- NAVBAR ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- MENU GENERATION ---
    const menuData = {
        cakeGrid: ["Pistachio Basbousa", "Honey Kunafa", "Spiced Date Cake", "Rose Water Sponge", "Om Ali Crumble", "Orange Blossom Loaf", "Egyptian Velvet", "Almond Semolina", "Fig Honey Cake", "Saffron Delight"],
        icecreamGrid: ["Mastic Vanilla", "Dark Cocoa Nile", "Rose Petal", "Mango Alphonso", "Butter Toffee", "Roasted Pistachio", "Hibiscus Sorbet", "Apricot Swirl"],
        chocolateGrid: ["Gold Truffle", "Milk Silk Bar", "Hazelnut Cluster", "Sea Salt Date", "White Rose", "Orange Peel Dark", "Tahini Praline", "Cardamom Ganache"]
    };

    function getImg(id, i) {
        const sets = {
            cakeGrid: ["1578985545062-69928b1d9587", "1565958011703-44f9829ba187", "1535141192574-5d4897c12636", "1464349095431-e9a21285b5f3", "1588195538320-064989c70444", "1606890737304-57a1ca8a5b62", "1579306194872-6ed9cb589a58", "1621303837174-89787a7d4729", "1481391319762-47dcb7295cb6", "1550617931-e17a7b70dce2"],
            icecreamGrid: ["1563805042-7684c019e1cb", "1501443762994-82bd5dace89a", "1497034825429-c343d7c6a68f", "1555507015-d0c01e1e9ff9", "1515037893149-de7f840978e2", "1570197781417-050f03605f01", "1580915411954-36780e22701e", "1557142046-c704a3adf8ac"],
            chocolateGrid: ["1548907040-4baa42d10919", "1511381939415-e44015466834", "1549007994-cb92caebd54b", "1606312619070-abe5b10a40d5", "1587559070757-b72a87c8c439", "1614088012674-60195cdebd4b", "1600868779603-4554b7c6c747", "1545015451-f083d2c14515"]
        };
        const set = sets[id] || sets.cakeGrid;
        return set[i % set.length];
    }

    function buildMenu() {
        Object.keys(menuData).forEach(id => {
            const container = document.getElementById(id);
            if(!container) return;
            menuData[id].forEach((name, i) => {
                const isHidden = i >= 6 ? 'hidden-item' : '';
                const price = 450 + (i * 25);
                const imgSrc = `https://images.unsplash.com/photo-${getImg(id, i)}?w=600&fit=crop`;
                
                container.innerHTML += `
                    <article class="card ${isHidden}" onclick="openModal('${name}', ${price}, '${imgSrc}')">
                        <div class="img-wrap">
                            <img src="${imgSrc}" alt="${name}" loading="lazy">
                        </div>
                        <div class="card-content">
                            <h4 style="font-size:0.8rem; letter-spacing:2px; text-transform:uppercase; margin-bottom:5px;">${name}</h4>
                            <span class="price" style="color:var(--primary); font-weight:600;">₹${price}</span>
                        </div>
                    </article>
                `;
            });
        });
    }
    buildMenu();

    // --- REVIEWS ---
    const reviews = [
        { t: "The heritage of Egypt in every delicate morsel.", a: "Vogue Gourmet" },
        { t: "Unparalleled artisan craftsmanship. A true oasis of flavor.", a: "Le Figaro" },
        { t: "Authenticity reimagined for the modern palate.", a: "The Nile Post" }
    ];
    const reviewBox = document.getElementById('reviewDisplay');
    let rIndex = 0;
    if(reviewBox) {
        setInterval(() => {
            reviewBox.style.opacity = '0';
            setTimeout(() => {
                const r = reviews[rIndex];
                reviewBox.querySelector('.review-text').innerText = `"${r.t}"`;
                reviewBox.querySelector('.review-author').innerText = `— ${r.a}`;
                reviewBox.style.opacity = '1';
                rIndex = (rIndex + 1) % reviews.length;
            }, 600);
        }, 5000);
    }

    // --- SMOOTH MENU TABS ---
    const toggleBtn = document.getElementById('toggleCollectionBtn');
    
    function updateBtnState(targetId) {
        const grid = document.getElementById(targetId);
        const hasHidden = grid.querySelectorAll('.hidden-item').length > 0;
        const isExpanded = grid.dataset.expanded === "true";
        toggleBtn.style.display = (hasHidden || isExpanded) ? "inline-block" : "none";
        toggleBtn.innerText = isExpanded ? "VIEW LESS" : "VIEW FULL COLLECTION";
    }

    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            if(tab.classList.contains('active')) return;

            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.dataset.target;
            const currentGrid = document.querySelector('.menu-grid:not(.hidden)');
            const newGrid = document.getElementById(target);

            currentGrid.classList.add('fade-out');
            
            setTimeout(() => {
                currentGrid.classList.add('hidden');
                currentGrid.classList.remove('fade-out');
                
                newGrid.classList.remove('hidden');
                newGrid.classList.add('fade-out'); 
                
                void newGrid.offsetWidth; 
                
                newGrid.classList.remove('fade-out');
                updateBtnState(target);
            }, 300); 
        });
    });

    // --- SMOOTH EXPAND / COLLAPSE ---
    toggleBtn.addEventListener('click', () => {
        const activeGrid = document.querySelector('.menu-grid:not(.hidden)');
        const isExpanded = activeGrid.dataset.expanded === "true";

        if (!isExpanded) {
            activeGrid.querySelectorAll('.hidden-item').forEach((item, index) => {
                item.classList.remove('hiding', 'hidden-item');
                item.classList.add('revealing');
                item.style.animationDelay = `${index * 0.1}s`;
            });
            activeGrid.dataset.expanded = "true";
            toggleBtn.innerText = "VIEW LESS";
        } else {
            const revealingItems = activeGrid.querySelectorAll('.revealing');
            
            revealingItems.forEach((item) => {
                item.style.animationDelay = '0s'; 
                item.classList.remove('revealing');
                item.classList.add('hiding'); 
            });

            setTimeout(() => {
                revealingItems.forEach(item => {
                    item.classList.add('hidden-item');
                    item.classList.remove('hiding');
                });
                activeGrid.dataset.expanded = "false";
                toggleBtn.innerText = "VIEW FULL COLLECTION";
                document.getElementById('menu').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 400); 
        }
    });
    updateBtnState('cakeGrid');

    // --- MODAL LOGIC ---
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('closeModalBtn');
    
    window.openModal = function(name, price, imgSrc) {
        document.getElementById('modalImage').src = imgSrc;
        document.getElementById('modalTitle').innerText = name;
        document.getElementById('modalPrice').innerText = `₹${price}`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- SCROLL REVEAL ANIMATIONS ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach((section) => {
        observer.observe(section);
    });

    // --- OPTIMIZED PARALLAX EFFECT ---
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const viewportCenter = window.innerHeight / 2;
            
            parallaxImages.forEach(img => {
                const parent = img.parentElement;
                const rect = parent.getBoundingClientRect();
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const elementCenter = rect.top + (rect.height / 2);
                    const distance = viewportCenter - elementCenter;
                    const offset = distance * -0.15;
                    
                    img.style.transform = `translateY(${offset}px) scale(1.15)`;
                }
            });
        });
    });

    // --- NEW: BACK TO TOP BUTTON LOGIC ---
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
