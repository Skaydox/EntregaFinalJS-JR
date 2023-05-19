let horaID = document.getElementById("hora")
let hora = new Date().toLocaleTimeString();
    horaID.innerText = hora;
setInterval(()=>{
    hora = new Date().toLocaleTimeString();
    horaID.innerText = hora;
},1001)



let menuPanel = document.querySelectorAll('.menu-botones')

const contenedorProductos = document.getElementById("contenedorProductos");
const botonesCategorias = document.querySelectorAll(".menu-botones");
let botonesAgregar = document.querySelectorAll(".producto-agregar")
const carrito = document.getElementById("carrito")
let carritoNum = document.getElementsByClassName("carritoNum")


cargarProductos(productos)

function cargarProductos(productosElegidos){

    contenedorProductos.innerHTML = ``;
    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto")
        div.innerHTML = `
        <div class="card">
            <div class="info">
                <h4>${producto.producto}</h4>
                <img src="${producto.imagen}" alt="">
            </div>
            <div class="precio">
                <p>$ <span class="total">${producto.precio}</span></p><button class="producto-agregar" id="${producto.id}">Comprar</button>
            </div>
        </div>
        `
        contenedorProductos.append(div)
    })

    actualizarBotonesAgregar();

}

function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar")
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    })
}

let productosEnCarrito;
const productosEnCarritoJSON = JSON.parse(localStorage.getItem("carrito"));
 if(productosEnCarritoJSON){
    productosEnCarrito = productosEnCarritoJSON;
    actualizarCarrito();
}else{productosEnCarrito = []};

function agregarAlCarrito(e){
    
    Toastify({
        text: "Producto agregado "+e.currentTarget.id,
        duration: 3000
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    //para comprobar que el producto no se duplique en el array
    if(productosEnCarrito.some(producto => producto.id === idBoton)){
        //Para que encuentre el index del producto elegido y se sume 1 producto más
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    }else{
        productoAgregado.cantidad = 1; 
        productosEnCarrito.push(productoAgregado);
    }

    localStorage.setItem("carrito",JSON.stringify(productosEnCarrito))
    actualizarCarrito();

}

function actualizarCarrito(){
    let numeroCarrito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    carrito.innerText = numeroCarrito;
}

//Por cada boton los recorre y les agrega un evento click
menuPanel.forEach(boton => boton.addEventListener("click", (e) => {

    menuPanel.forEach(boton => boton.classList.remove('active'))
    e.currentTarget.classList.add('active')

    //Filtra los elemento del array productos
    if(e.currentTarget.id != "todos"){
        const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id)
        console.log(productosBoton)
        cargarProductos(productosBoton);
    }else{
        cargarProductos(productos)
    }
}))