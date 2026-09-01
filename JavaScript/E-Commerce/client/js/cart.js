const modalContainer = document.getElementById("modal-container")
const modalOverlay = document.getElementById("modal-overlay")
const cartBtn = document.getElementById("cart-btn")


const displayCart = () => {
    modalContainer.innerHTML= "";
    modalContainer.style.display ="block";
    modalOverlay.style.display = "block";

    //modal Header
    const modalHeader = document.createElement("div");
    
    const modalClose = document.createElement("div");
    modalClose.innerText = "✖️"
    modalClose.className = "modal-close";
    modalHeader.append(modalClose)

    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none",
        modalOverlay.style.display = "none"
    })

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Cart"
    modalTitle.className = "modal-title"
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    //modal body
    cart.forEach((product) => {
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.innerHTML = `
        <div class="product-info">
            <img class="product-img" src="${product.img}" />
            <div class="product-info">
                <h4>${product.productName}</h4>
            </div>
        </div>
        <div class="quantity">
            <span class="quantity-btn-decrease">-</span>
            <span class="quantity-input">${product.quanty}</span>
            <span class="quantity-btn-increase">+</span>
        </div>
        <div class="price">${product.price * product.quanty} $</div>
        <div class="delete-product">❌</div>
        `;
        modalContainer.append(modalContent);
    });
};

cartBtn.addEventListener("click", displayCart)