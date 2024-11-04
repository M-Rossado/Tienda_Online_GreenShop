let shoppingList = {};  

for (const product of products) {
    console.log("Nombre del producto:", product.productName);
    console.log("Imagen del producto:", product.image);
}

// Tarjetas de productos 
function paintCharacters(){
    let $container = document.querySelector('#charactersContainer');

    for(const product of products){
        let $pill = document.createElement('div');
        $pill.classList.add('character-pill');

        $pill.dataset.id = product.id;                      
        $pill.dataset.productName = product.productName; 
        $pill.dataset.price = product.price; 
        $pill.dataset.stock = product.stock; 

        $pill.innerHTML = `
            <div class="character-pill-container">
                <div class="character-header">
                    <img src="${product.image}" alt="">
                </div>
                <div class="character-body">
                    <h3 class="character-name">${product.productName}</h3>
                    <h5 class="character-name">${product.description}</h5>
                    <h5 class="character-name"><span class="price">${product.price}€</span></h5>
                    <div class="character-summary">
                        <button class="add-to-cart character-summary-btn">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        `
        let $btn = $pill.querySelector('button.add-to-cart'); //Botón de añadir al carrito
        $btn.addEventListener('click', addItemToShoppingList); //

        function addItemToShoppingList() {   
            let $pill = this.closest('.character-pill'); 
            
            let id = $pill.dataset.id;
            let productName = $pill.dataset.productName;
            let price = $pill.dataset.price;
            let stock = $pill.dataset.stock; 
            
            if(!shoppingList.hasOwnProperty(id)){ 
                shoppingList[id] = {
                    id: parseInt(id),
                    productName: productName,
                    price: parseInt(price),
                    count:  0,
                    stock: parseInt(stock)
                };
            }
            changeItemCountFromShoppingList(id, 1);
            refreshShoppingList();
        }
        $container.appendChild($pill);
    } 
}

function refreshShoppingList() {   
    let $shoppingListBody = document.querySelector('#shoppingList tbody'); 
    $shoppingListBody.innerHTML = '';

    let totalPrice = 0;
    for (let productId in shoppingList){ //Utilizando el objeto del carrito vuelvo a crear los elementos
        let product = shoppingList[productId];
        let $tr = document.createElement('tr');
        $tr.dataset.id = product.id;
        $tr.innerHTML = `
            <td>${product.productName}</td>
            <td>${product.price}€</td>
            <td>${product.count}</td>
            <td>${product.count * product.price}</td>
            <td>
                <button class="add-item-to-cart fa-solid fa-plus"></button>   
                <button class="remove-item-from-cart fa-solid fa-minus"></button>
            </td>
        `;
        

        let $addBtn = $tr.querySelector('.add-item-to-cart');
        let $removeBtn = $tr.querySelector('.remove-item-from-cart');
        $addBtn.addEventListener('click', addItemToShoppingListFromCart);
        $removeBtn.addEventListener('click', removeItemFromShoppingListFromCart);

        $shoppingListBody.appendChild($tr); 

        totalPrice += product.count * product.price;
    }

    let $totaPrice = document.querySelector('#totalPrice');
    $totaPrice.textContent = totalPrice + '€';

}

function addItemToShoppingListFromCart(){
    let $row = this.closest('tr');
    let productId = parseInt($row.dataset.id);
    changeItemCountFromShoppingList(productId, 1);
}

function removeItemFromShoppingListFromCart(){
    let $row = this.closest('tr');
    let productId = parseInt($row.dataset.id);
    changeItemCountFromShoppingList(productId, -1);
}

function changeItemCountFromShoppingList(productId, change){
    if(!shoppingList.hasOwnProperty(productId)) {
        console.error('The product is not in the shopping list');
        return;
    }
    if(shoppingList[productId].count + change > shoppingList[productId].stock){
        alert('No quedan más unidades de este producto.');
    }else{    
        shoppingList[productId].count += change;
        if(shoppingList[productId].count <= 0) {
            delete shoppingList[productId];
        }
    }
    refreshShoppingList();
}


function doOrder() {
    if(Object.keys(shoppingList).length === 0){
        alert('El carrito está vacío.')
    }else{
        alert('Compra realizada con éxito!');
        shoppingList = {};
        refreshShoppingList();
    }
}
paintCharacters();
let $doOrderBtn = document.querySelector('#doOrderBtn');
$doOrderBtn.addEventListener('click', doOrder);

//Para que al clicar en el carrito aparezca la Shopping List
document.getElementById("toggleShoppingListBtn").addEventListener("click", function() {
     document.getElementById("shoppingListContainer").classList.toggle("show");
});

