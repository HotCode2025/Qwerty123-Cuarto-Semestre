const shopContent = document.getElementById("shopContent");

productos.fotEach((product) =>{
    const content = document.createElement("div");
    content.innerHTML = `
    <img src="${product.img}">
    </h3>${product.productName}</h3>
    <p>${product.price} $</p>
    `;
    shopContent.append(content);
});