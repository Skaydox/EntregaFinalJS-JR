fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
  .then(response => response.json())
  .then(data => {
    dolarCompra = document.getElementById("dolarCompra");
    dolarVenta = document.getElementById("dolarVenta");
    let Dolar = data.find(item => item.casa.nombre === "Dolar Oficial");
    dolarCompra.innerText = Dolar.casa.compra;
    dolarVenta.innerText = Dolar.casa.venta;
  })
  .catch(error => {
    console.log("Error, no se pudo obtener el valor del dolar", error);
  });

let horaID = document.getElementById("hora")
let hora = new Date().toLocaleTimeString();
    horaID.innerText = hora;
setInterval(()=>{
    hora = new Date().toLocaleTimeString();
    horaID.innerText = hora;
},1000)


//Para que carguen los productos
let productosEnCarrito = JSON.parse(localStorage.getItem("carrito"));

const contenedorProductos = document.getElementById("contenedorProductos");
const comprar = document.getElementById("comprar");
let botonesEliminar = document.querySelectorAll("#eliminar");
let total = document.getElementById("total");
//Para que se actualice el numero de productos
let numeroCarrito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
const carrito = document.getElementById("carrito");
carrito.innerText = numeroCarrito;

function actualizarCarrito(){
    ActualizarTotal();
    numeroCarrito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    carrito.innerText = numeroCarrito;
}

function cargarProductos(){
    contenedorProductos.innerHTML = ``;
    productosEnCarrito.forEach(producto => {
        const div = document.createElement("div")
        div.classList.add("carrito-contenido")
        div.innerHTML = `
            <img src="${producto.imagen}" alt="">
            <div>
            <h3 class="carrito-titulo">Titulo</h4>
            <h4 class="carrito-titulo2">${producto.producto}</h4>
            </div>
            <div class="carrito-cantidad">
                <h3>Cantidad</h3>
                <h4>${producto.cantidad}</h4>
            </div>
            <div class="carrito-subtotal">
                <h3>Precio</h3>
                <h4>${producto.precio}$</h4>
            </div>
            <div class="carrito-subtotal">
                <h3>Subtotal</h3>
                <h4>${producto.precio * producto.cantidad}$</h4>
            </div>
            <div class="carrito-trash">
                <button id="${producto.id}" class="eliminar"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `
        contenedorProductos.append(div)
    })

    actualizarBotonesEliminar();
    actualizarCarrito();

}

cargarProductos();
ActualizarTotal();

function actualizarBotonesEliminar(){
    botonesEliminar = document.querySelectorAll(".eliminar")
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito)
    })
}

function eliminarDelCarrito(e){
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito.splice(index,1)
    console.log(productosEnCarrito)
    cargarProductos();
    localStorage.setItem("carrito",JSON.stringify(productosEnCarrito))
}

function ActualizarTotal(){
    total.innerText = productosEnCarrito.reduce((acc , producto) => acc + (producto.precio * producto.cantidad), 0)+"$"
    console.log(total.innerText)
}


comprar.addEventListener("click", () => {
    function comprarProductos(){
        productosEnCarrito.length = 1;
        localStorage.removeItem("carrito")
        localStorage.setItem("carrito",JSON.stringify(productosEnCarrito))
        cargarProductos();
        ActualizarTotal();
        console.log(productosEnCarrito)
    }

    if(productosEnCarrito.length>0){
    Swal.fire({
        title: '¿Desea comprar ahora?',
        text: "¡Una vez que compres no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, quiero continuar!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            '¡Compra con exito!',
            '¡Gracias por tu compra!',
            'success'
          )
            comprarProductos();
        }
      })
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que no tenes nada en el carrito...',
            footer: '(Necesitas tener al menos un producto para continuar)'
          })
    }
})