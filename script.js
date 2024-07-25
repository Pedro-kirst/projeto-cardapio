const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItens = document.getElementById("itens-cart");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
    updateCart();
});

// Fechar o modal quando clico fora
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const preco = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, preco);
    }
});

function addToCart(name, preco) {
    const existe = cart.find(item => item.Nome === name);
    if (existe) {
        existe.quantity += 1;
    } else {
        cart.push({
            Nome: name,
            Preco: preco,
            quantity: 1
        });
    }
    updateCart();
    updateCartCounter();
}

function updateCart() {
    cartItens.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const cartElement = document.createElement("div");
        cartElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.Nome}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">${item.Preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.Nome}">
                    Remover
                </button>
            </div>
        `;
        total += item.Preco * item.quantity;
        cartItens.appendChild(cartElement);
    });
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function updateCartCounter() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCounter.textContent = totalItems;
}

cartItens.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.Nome === name);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        updateCartCounter();
    }
}


addressInput.addEventListener("input", function(event){
    let value = event.target.value;
    if(value !== ""){
        addressWarn.classList.add("hidden")
    }
})


//Finalizar pedido

checkoutBtn.addEventListener("click", function(event){

    if(!isOpen){
        Toastify({
            text: "Olá, o restaurante está fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
          return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        return;
    }

    const cartItems = cart.map((item) => {
        return(
            `${item.Nome} Quantidade: (${item.quantity}) Preço: R$${item.Preco} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "51992576863"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCart();

    console.log(cartItems);
})

function checkRestaurante(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}


const spanItem = document.getElementById("data-span");
const check = document.getElementById("checkout-btn");
const isOpen = checkRestaurante();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    check.disabled = false; // Habilitar o botão de checkout
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
    check.disabled = true; // Desabilitar o botão de checkout
}
