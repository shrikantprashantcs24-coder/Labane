document.addEventListener("DOMContentLoaded", () => {
    
    window.addEventListener('load', () => {
        const overlay = document.getElementById('intro-overlay');
        setTimeout(() => {
            overlay.classList.add('intro-hidden');
            document.body.classList.remove('is-loading');
        }, 2500); 
    });

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
                            <img src="${imgSrc}" alt="${name}">
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
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.dataset.target;
            document.querySelectorAll('.menu-grid').forEach(grid => {
                grid.classList.add('hidden');
                if(grid.id === target) grid.classList.remove('hidden');
            });
            updateBtnState(target);
        });
    });

    toggleBtn.addEventListener('click', () => {
        const activeGrid = document.querySelector('.menu-grid:not(.hidden)');
        const isExpanded = activeGrid.dataset.expanded === "true";

        if (!isExpanded) {
            activeGrid.querySelectorAll('.hidden-item').forEach((item, index) => {
                item.classList.add('revealing');
                item.style.animationDelay = `${index * 0.15}s`;
            });
            activeGrid.dataset.expanded = "true";
            toggleBtn.innerText = "VIEW LESS";
        } else {
            activeGrid.querySelectorAll('.revealing').forEach(item => {
                item.classList.remove('revealing');
                item.style.animationDelay = "0s";
            });
            activeGrid.dataset.expanded = "false";
            toggleBtn.innerText = "VIEW FULL COLLECTION";
            activeGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    updateBtnState('cakeGrid');

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

    if(closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});