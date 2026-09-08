const modalContainer = document.getElementById("modal-container")
const modalOverlay = document.getElementById("modal-overlay")
const cartBtn = document.getElementById("cart-btn")
const cartCounter = document.getElementById("cart-counter");


const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
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
    if (cart.length > 0) {
    cart.forEach((product) => {
        const modalContent = document.createElement("div");
        modalContent.className = "product";
        modalContent.innerHTML = `
        <img class="product-img" src="${product.img}" />
        <div class="product-info">
            <h4>${product.productName}</h4>
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

        const decrease = modalContent.querySelector(".quantity-btn-decrease");
        decrease.addEventListener("click", () => {
            if (product.quanty > 1) {
                product.quanty--;
                displayCart();
            }

        });

        const increase = modalContent.querySelector(".quantity-btn-increase");
        increase.addEventListener("click", () => {
            product.quanty++;
            displayCart();
        });

        //delete
        const deleteProduct = modalContent.querySelector(".delete-product");

        deleteProduct.addEventListener("click", ()=> {
            deleteCartProduct(product.id)
        })
    })

    //modal footer
    const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
        <div class="total-price">Total: $${total} </div>
    `;
    modalContainer.append(modalFooter);
    } else {
        const modalText = document.createElement("h2");
        modalText.className = "modal-body";
        modalText.innerText = "Tu carrito está vacío";
        modalContainer.append(modalText);
    }

    displayCartCounter();
};

cartBtn.addEventListener("click", displayCart)

const deleteCartProduct =(id)=> {
    const foundID = cart.findIndex((element)=> element.id === id);
    console.log(foundID);
    cart.splice(foundID, 1);
    displayCart();
    displayCartCounter();
}
const displayCartCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0);
    if (cartLength > 0) {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    } else {
        cartCounter.style.display = "none";
    }
}