const shopContent = document.getElementById("shopContent");
const cart = []; //Este es nuestro carrito, un array vació

productos.forEach((product) => {
    const content = document.createElement("div");
    content.innerHTML = `
        <img src="${product.img}" alt="${product.productoName}">
        <h3>${product.productoName}</h3>
        <p>$ ${product.price}</p>
    `;
    shopContent.appendChild(content);

    const buyButton = document.createElement("button");
    buyButton.innerText = "Comprar";

    content.append(buyButton);

    buyButton.addEventListener("click", ()=>{
        cart.push({
            id: product.id,
            productName: product.productoName,
            price: product.price,
            quanty: product.quanty,
            img: product.img,
        })
        console.log(cart)
    })

});