const getData = async () => {
    const resp = await fetch('/js/stock.json');
    const data = await resp.json()
    
    return data;
}

const articles = async () => {
    const contenedor = document.getElementById('Container');
    const stock =  await getData ();
    stock.forEach(prod => {
        const div = document.createElement ('div');
        div.innerHTML += `
        <div class="minbox">
                <img src="${prod.img}">
                <p><strong>${prod.title}</strong></p>
                <p class="details">${prod.description}</p>
                <p>Color: <strong>${prod.color}</strong></p>
                <h3 class="price">${prod.price}</h3>
                <button class="lol" id="${prod.id}">AGREGAR AL CARRITO</button>
            </div>
            `
        contenedor.appendChild(div);
    });
}


articles();

let carrito = []

const carritoBtn = document.getElementById("ventanaModal");
const boton = document.getElementById("abrirModal");
const span = document.getElementsByClassName("cerrar") [0];


boton.addEventListener("click", () =>{
    carritoBtn.style.display = "block";
});

span.addEventListener("click", () =>{
    carritoBtn.style.display = "none";
});

window.addEventListener("click", (e) =>{
    if(e.target == carritoBtn){
        carritoBtn.style.display = "none";
    }
})

btnCompra = document.getElementById("Container");

btnCompra.addEventListener("click" ,(e) => {
    if (e.target.classList.contains ("lol")) {
        validarProductoCarrito(e.target.id)
      
      Toastify({
        text: "Producto Agregado",
        duration: 3000.,
        gravity: 'bottom',
        position: 'right',
        
        }).showToast();
  
    }
    console.log(carrito)
});

const validarProductoCarrito = async (idProducto) => {
    const data = await getData();
    const repetido = carrito.find(producto => producto.id == idProducto)

    if (!repetido) {
        const producto = await data.find(producto => producto.id == idProducto);
        carrito.push(producto)
        pintarProductosCarrito(producto)
        actualizarTotalCarrito(carrito)
    } else {
        repetido.Stock++
        const cantProducto = document.getElementById(`cantCarrito${repetido.id}`)
        cantProducto.innerHTML = `Cantidad: ${repetido.Stock}`
        actualizarTotalCarrito(carrito);
    }

};

const pintarProductosCarrito = (producto) => {
    console.log(producto)
    const contenedor = document.getElementById("contenedorCarrito");
    const div = document.createElement('div')
    div.classList.add("flex,justify-around,flex-wrap,text-center")
    div.innerHTML= `
    <p class="flex justify-around ml-8 mt-5 text-center text-black">${producto.title} ${producto.color}<span class="text-black text-center">${producto.price}</span></p>
    <p class="text-center text-black flex justify-end mr-10" id="cantCarrito${producto.id}">Cantidad: ${producto.Stock}</p>
    <button type="button" class=" px-6 py-2.5 bg-red-600 text-red font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out btn" id="delete-${producto.id}">Eliminar</button>
    `
    contenedor.appendChild(div);
    document.getElementById(`delete-${producto.id}`).addEventListener("click", function(){
        eliminarProductoCarrito(producto.id);
    });
};

const actualizarTotalCarrito =  (carrito) => {
    const totalCantidad =  carrito.reduce((acc, item) => acc + Number(item.Stock), 0);
    const totalCompra =  carrito.reduce((acc, item) => acc + Number(item.price.replace('$', '')) * Number(item.Stock), 0);

    pintarTotalesCarrito(totalCantidad, parseFloat(totalCompra).toFixed(3));
};

const pintarTotalesCarrito =  (totalCantidad, totalCompra) => {
    const precioTotal = document.querySelector("#precioTotal");
    const contadorCarrito = document.getElementById("contador");
    precioTotal.innerText = totalCompra;
    contadorCarrito.innerHTML = totalCantidad;
};


const eliminarProductoCarrito = (id) => {
    const producto = carrito.find(product => product.id === id);
    if (producto.Stock > 1) {
        producto.Stock--;
    } else {
        const index = carrito.findIndex(product => product.id === id);
        carrito.splice(index, 1);
    }
    actualizarTotalCarrito(carrito)
    actualizarCarrito(carrito)
};

const actualizarCarrito = (carrito) => {
    const contenedor = document.getElementById("contenedorCarrito");
    contenedor.innerHTML = " ";

    carrito.forEach(producto => {
        const div = document.createElement('div')
        div.classList.add("flex,justify-evenly,flex-wrap,mt-10")
        div.innerHTML= `
        <p class="flex justify-around ml-8 text-center text-black">${producto.title} ${producto.color}<span class="text-black text-center">${producto.price}</span></p>
        <p class="text-center text-black flex justify-end mr-10" id="cantCarrito">Cantidad: ${producto.Stock}</p>
        <button type="button" class=" px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out btn" id="delete-${producto.id}">Eliminar</button>
        `
        contenedor.appendChild(div);

        document.getElementById(`delete-${producto.id}`).addEventListener("click", function(){
            eliminarProductoCarrito(producto.id);
        });
    });
};

window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 200) { // Cambia este valor según tus necesidades
        nav.classList.add('scroll');
    } else {
        nav.classList.remove('scroll');
    }
});