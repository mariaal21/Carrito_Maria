document.addEventListener("DOMContentLoaded", () => {


  const arrayProductosSeleccionados = JSON.parse(localStorage.getItem("productos")) || [];


  const card = document.querySelector("#card");
  const tabla = document.querySelector("#tabla");
  const toggle = document.querySelector(".toggle");
  const fragment = document.createDocumentFragment();
  const carrito = document.getElementById("carrito");

  const PintarTodo = () => {
    let ruta = `https://dummyjson.com/products/`;
  
    let peticion = fetch(ruta, {
      method: "GET",
    });
  
    return peticion
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw "No funciona ";
        }
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  };
  
  

  const paginaPrincipal = async () => {
    let objProductos = await PintarTodo();
    const arrayProductos = objProductos.products;
  
    innerHTML = "";
  
    for (let i = 0; i < arrayProductos.length; i++) {
      let title = arrayProductos[i].title;
      let id = arrayProductos[i].id;
      let images = arrayProductos[i].images;
      let rating = arrayProductos[i].rating;
  
      const cardIndex = document.createElement("DIV");
      let estrellita = pintarEstrellas(rating);
      cardIndex.classList.add("cardIndex");
  
      cardIndex.innerHTML +=
        '<div><img src="' + images[0] + '" class="card-img"></div>' +
        '<h2 class="card-title text">' + title + '</h2>';
  
      cardIndex.append(estrellita);
  
      cardIndex.innerHTML +=
        '<button class="añadirBoton" id="' + id + '">comprar</button>';
  
      fragment.append(cardIndex);
    }
  
    card.append(fragment);
  };




  const pintarPagina = (numPagina) => {
    const numPorPagina = 9;
    const inicio = (numPagina - 1) * numPorPagina;
    const fin = inicio + numPorPagina;
    const productosPagina = arrayProductos.slice(inicio, fin);
  
    paginaPrincipal(productosPagina);
  };
  
  
  const setLocal = () => { localStorage.setItem("productos", JSON.stringify(arrayProductosSeleccionados)) };

  const getLocal = () => { return arrayProductosSeleccionados;};


  document.addEventListener("click", ({ target }) => {

    if (target.matches(".añadirBoton")) {

      let id = target.id;
      buscarProducto(id);
      pintarTabla()

    }

  })

  
  document.addEventListener("click", ({ target }) => {
    if (target.matches(".comprarBoton")) {

      location.href = "hmtl/menu.html";

    }

  })


  document.addEventListener("click", ({ target }) => {
    if (target.matches(".carrito i")) {

      toggle.classList.toggle("ocultar")

    }

  })

  
  const pintarTabla = async () => {
    tabla.innerHTML = "";
  
    const arrayProductosTabla = getLocal();
    let tablaHTML = "";
  
    tablaHTML += `<thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>`;
  
    arrayProductosTabla.forEach(({ titulo, precio, thumbnail, cantidad, subtotal }) => {
      tablaHTML += `<tr>
          <td class="cart-item"><div><img src="${thumbnail}" class="thumbnail"></div>
          <div>${titulo}</div></td>
          <td>${precio}</td>
          <td>${cantidad}</td>
          <td>${subtotal}</td>
        </tr>`;
    });
  
    tablaHTML += `</tbody>
      <tfoot>
        <tr>
          <td colspan="4" class="text-right">
            <button class="vaciar">Vaciar carrito</button>
          </td>
        </tr>
      </tfoot>`;
  
      tabla.innerHTML = tablaHTML;
  };
  
  const buscarProducto = async (id) => {
    const { products } = await PintarTodo();
    const producto = products.find((item) => item.id == id);
  
    if (producto) {
      let encontrado = false;
      for (let i = 0; i < arrayProductosSeleccionados.length; i++) {
        if (arrayProductosSeleccionados[i].id === producto.id) {
          encontrado = true;
          arrayProductosSeleccionados[i].cantidad++;
          arrayProductosSeleccionados[i].subtotal += arrayProductosSeleccionados[i].precio;
          break;
        }
      }
      if (!encontrado) {
        arrayProductosSeleccionados.push({
          id: producto.id,
          titulo: producto.title,
          cantidad: 1,
          precio: producto.price,
          subtotal: producto.price,
          thumbnail: producto.thumbnail,
          rating: producto.rating,
        });
      }
      carrito.textContent = arrayProductosSeleccionados.length;
      setLocal();
    }
  };
  

  document.addEventListener("click", ({ target }) => {

    if (target.matches(".vaciar")) {

      arrayProductosSeleccionados.length = 0;
      localStorage.removeItem("productos");
      carrito.textContent = arrayProductosSeleccionados.length;
      pintarTabla();

    }
    
  });

  const pintarEstrellas = (rating) => {

    const divEstrella = document.createElement("DIV");
    divEstrella.className = "divEstrella";
    
    const estrellaVacia = "estrellas/star2.png";
    const estrellaLlena = "estrellas/star1.png";
    
    for (let i = 1; i <= 5; i++) {

      const estrella = document.createElement("IMG");
      estrella.src = i <= Math.round(rating) ? estrellaLlena : estrellaVacia;
      divEstrella.append(estrella);

    }
    
    return divEstrella;
    
  };


  const init = () => {

      pintarTabla();
      getLocal();
      paginaPrincipal();
      pintarTabla();
      pintarPagina();

    }
  

  init()

});