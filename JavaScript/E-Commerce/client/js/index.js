const shopContent = document.getElementById("shopContent");

productos.forEach((product) => {
    const content = document.createElement("div");
    content.innerHTML = `
        <img src="${product.img}" alt="${product.productName}">
        <h3>${product.productName}</h3>
        <p>${product.price} $</p>
    `;
    shopContent.appendChild(content);
});