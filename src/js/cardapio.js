const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItensContainer = document.getElementById("cart-itens");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const promoSpecial = document.getElementById("promo-special");
const cartEmpty = document.getElementById("cart-empty");
const spaceText = document.getElementById("space-text");
const iconHours = document.getElementById("icon-hours");


let cart = [];

// Cart-modal
cartBtn.addEventListener("click",function() {
       cartModal.style.display = "flex";
       updateCartModal();
});

closeModalBtn.addEventListener("click", function() {
   cartModal.style.display = "none";
});


menu.addEventListener("click",function() {
      cartModal.style.display = "none";
});

//

// Item produtos //

menu.addEventListener("click",function(event) {
        // console.log(event.target);

        let parentButton = event.target.closest(".add-to-cart-btn");

        //console.log(parentButton);

        if(parentButton ) {
             const name = parentButton.getAttribute("data-name");
             const price = parseFloat( parentButton.getAttribute("data-price"));

            // console.log(name)
             //console.log(price)

             addToCart(name,price);
        } 
});

// Funcão para adicionar no carrinho

function addToCart(name,price) {

    const existingItem = cart.find(item => item.name === name);


    if(existingItem) {
        // Se o item já existe, aumente apenas a quantidade + 1
          existingItem.quantity += 1;
       
    } else {
          
        cart.push({
            name,
            price,
            quantity:1,
        });
    }

    updateCartModal();
   
   
}


// Atualiza carrinho

function updateCartModal() {
   
    cartItensContainer.innerHTML = "";

    let total = 0;

    if(cart.length === 0) {
        cartEmpty.style.display = "block";
        cartItensContainer.style.display = "flex";
    } else {
        cartEmpty.style.display = "none";
        cartItensContainer.style.display = "block";
    }
 

    cart.forEach(item => {
          
        const cartItemElement = document.createElement("div");

        cartItemElement.innerHTML = `
        
           <div class="cart-drawer">
               <div class="wind-out">
                  <h3 class="name-main">${item.name}</h3>
                  <p class="product-quantity">Quantidade: <span class="color-orange">${item.quantity}</span></p>
                  <p class="desk-price"> R$ ${item.price.toFixed(2)}</p>
               </div>
               <div class="button-popup">
                 <div class="btn-remove" data-name="${item.name}">🗑️</div>
               </div>
           </div>
        
        `;

        total += item.price * item.quantity;

        
       cartItensContainer.appendChild(cartItemElement);

    });


    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;


}


// Função para remover item do carrinho

cartItensContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("btn-remove")) {
         const name = event.target.getAttribute("data-name");

       removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];

       if(item.quantity > 1) {
         item.quantity -=1;
         updateCartModal();
         return;
       }

       cart.splice(index,1);
        updateCartModal();

    }
}

addressInput.addEventListener("input", function(event) {
       let inputValue =  event.target.value;
     
       if(inputValue !== "") {
             addressInput.style.border = "1px solid #362B24 ";
             addressWarn.style.display = "none";
       }

});

// Finalizar Pedido
checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestaurantOpen();

    if(!isOpen) {
        
        Toastify({
             text: "Ops a hamburgueria está fechado no momento.",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "#eb2d2d",
  },
        }).showToast();

        return;
    }

     if(cart.length === 0) return;

     if(addressInput.value == "") {
        addressWarn.style.display="block";
        addressInput.style.border = "2px solid #eb2d2d";
        return;
     }

     //Enviar o pedido para api whats

     const cartItems = cart.map((item) => {
         return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
         )     
     }).join("")

     const message = encodeURIComponent(cartItems)
     const phone = "5524992630568"

     window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

     Toastify({
        text: "Seu pedido foi enviado com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#28a745",
            color: "#ffffff",
        }
}).showToast();

     cart = [];
     cart.length = 0;
     updateCartModal();
});

// Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
   const data = new Date();
   const hora = data.getHours();

   return hora >= 18 && hora <  22;
}

const spanItem = document.getElementById("space-hours");
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.style.background = "#28a745";
    spaceText.textContent = "Aberto Agora";

     iconHours.classList.remove("bi-x-octagon-fill");
    iconHours.classList.add("bi-flag-fill");
} else {
     spanItem.style.background = "#eb2d2d";
    spaceText.textContent = "Fechado Agora";

      iconHours.classList.remove("bi-flag-fill");
    iconHours.classList.add("bi-x-octagon-fill");
}


function showOpenToast() {
    if (checkRestaurantOpen()) {
        Toastify({
            text: "Oba! Restaurante aberto, Faça seu Pedido! 🍔",
            duration: 4000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#28a745",
                color: "#ffffff",
            }
        }).showToast();
    }
}

showOpenToast();
setInterval(showOpenToast, 60000); 