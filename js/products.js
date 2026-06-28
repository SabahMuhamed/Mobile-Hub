/*
====================================================
MOBILEHUB PRODUCTS
====================================================
*/

let products = [];

async function loadProducts() {

    try {

        const response = await fetch("data/products.json");

        products = await response.json();

        initializeProducts();

    } catch (error) {

        console.error("Unable to load products.", error);

    }

}

loadProducts();

function formatPrice(price) {

    return "₹" + price.toLocaleString("en-IN");

}

function createProductCard(product) {

    return `

    <div class="product-card">

        <div class="product-image">

            <span class="product-badge">

                ${product.badge}

            </span>

            <img src="${product.image}" alt="${product.name}">

        </div>

        <div class="product-content">

            <p class="product-brand">

                ${product.brand}

            </p>

            <h3 class="product-name">

                ${product.name}

            </h3>

            <p class="product-price">

                ${formatPrice(product.price)}

            </p>

            <button
                class="btn product-btn"
                onclick="openProduct(${product.id})">

                View Details

            </button>

        </div>

    </div>

    `;

}

const featuredContainer = document.getElementById("featured-products");
const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const chips = document.querySelectorAll(".chip");
const priceFilter = document.getElementById("priceFilter");
const productCount = document.getElementById("productCount");
let selectedBrand = "All";

let searchText = "";

let selectedPrice = "all";

function displayProducts(list) {

    if (!productsContainer) return;

    productsContainer.innerHTML =

        list.map(createProductCard).join("");

    if (productCount) {

        productCount.textContent = list.length;

    }

}



function applyFilters() {

    let filtered = [...products];

    if (selectedBrand !== "All") {

        filtered = filtered.filter(product =>

            product.brand === selectedBrand

        );

    }

    if (searchText) {

        filtered = filtered.filter(product =>

            product.name.toLowerCase().includes(searchText) ||

            product.brand.toLowerCase().includes(searchText)

        );

    }

    if (selectedPrice !== "all") {

        if (selectedPrice === "100000") {

            filtered = filtered.filter(product =>

                product.price >= 100000

            );

        } else {

            const [min, max] =

                selectedPrice.split("-").map(Number);

            filtered = filtered.filter(product =>

                product.price >= min &&

                product.price <= max

            );

        }

    }

    displayProducts(filtered);

}

function initializeProducts() {

    /*==========================
    HOME PAGE
    ==========================*/

    if (featuredContainer) {

        featuredContainer.innerHTML = products
            .filter(product => product.featured)
            .map(createProductCard)
            .join("");

    }

    /*==========================
    PRODUCT PAGE
    ==========================*/

    if (productsContainer) {

        displayProducts(products);

    }

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            searchText = searchInput.value.toLowerCase();

            applyFilters();

        });

    }

    chips.forEach(chip => {

        chip.addEventListener("click", () => {

            chips.forEach(c => c.classList.remove("active"));

            chip.classList.add("active");

            selectedBrand = chip.dataset.brand;

            applyFilters();

        });

    });

    if (priceFilter) {

        priceFilter.addEventListener("change", () => {

            selectedPrice = priceFilter.value;

            applyFilters();

        });

    }

}
function setField(id, value) {

    const cell = document.getElementById(id);

    if (!cell) return;

    const row = cell.parentElement;

    if (value) {

        cell.textContent = value;

        row.style.display = "";

    } else {

        cell.textContent = "-";

        row.style.display = "none";

    }

}

/*==================================================
PRODUCT MODAL
==================================================*/

function setField(id, value) {

    const cell = document.getElementById(id);

    if (!cell) return;

    cell.textContent = value || "Not Available";

}

function openProduct(id) {

    console.log("Clicked:", id);

    const product = products.find(p => p.id === id);

    if (!product) return;

    // Image
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalImage").alt = product.name;

    // Basic Details
    document.getElementById("modalBadge").textContent =
        product.badge || "";

    document.getElementById("modalName").textContent =
        product.name;

    document.getElementById("modalPrice").textContent =
        formatPrice(product.price);

    document.getElementById("modalDescription").textContent =
        product.description || "No description available.";

    // Specifications
    setField("modalBrand", product.brand);
    setField("modalStorage", product.storage);
    setField("modalRam", product.ram);
    setField("modalDisplay", product.display);
    setField("modalProcessor", product.processor);
    setField("modalCamera", product.camera);
    setField("modalBattery", product.battery);
    setField("modalOS", product.os);
    setField("modalWarranty", product.warranty);
    setField("modalColor", product.color);

    // OPEN MODAL
    document.getElementById("productModal").classList.add("active");

}

/*==================================================
CLOSE MODAL
==================================================*/

const modal = document.getElementById("productModal");

const closeBtn = document.getElementById("closeModal");

if (closeBtn) {

    closeBtn.addEventListener("click", () => {

        modal.classList.remove("active");

    });

}

if (modal) {

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.classList.remove("active");

        }

    });

}

/*==================================================
ESC KEY CLOSE
==================================================*/

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        modal.classList.remove("active");

    }

});