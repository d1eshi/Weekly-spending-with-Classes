// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')

// Eventos
eventListeners()
function eventListeners() {
	document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

	formulario.addEventListener('submit', agregarGasto)
}

// Classes
class Presupuesto {
	constructor(presupuesto) {
		this.presupuesto = Number(presupuesto)
		this.restante = Number(presupuesto)
		this.gastos = []
	}

	agregarGasto(gasto) {
		this.gastos = [...this.gastos, gasto]
		this.calcularRestante()
	}

	calcularRestante() {
		const gastado = this.gastos.reduce(
			(total, gasto) => total + gasto.cantidad,
			0
		)
		this.restante = this.presupuesto - gastado
	}

	eliminarGasto(id) {
		this.gastos = this.gastos.filter(gasto => gasto.id !== id)
		this.calcularRestante()
	}
}

class UI {
	insertarPresupuesto(cantidad) {
		// Extraer los valores
		const { presupuesto, restante } = cantidad
		// Insertar en el HTML
		document.querySelector('#total').textContent = presupuesto
		document.querySelector('#restante').textContent = restante
	}

	imprimirAlerta(mensaje, tipo) {
		const divMensaje = document.createElement('div')
		divMensaje.classList.add('text-center', 'alert')

		if (tipo === 'error') {
			divMensaje.classList.add('alert-danger')
		} else {
			divMensaje.classList.add('alert-success')
		}

		// Insertar mensasje
		divMensaje.textContent = mensaje

		document.querySelector('.primario').insertBefore(divMensaje, formulario)

		setTimeout(() => {
			divMensaje.remove()
		}, 3000)
	}

	mostrarGastos(gastos) {
		this.limpiarHTML()

		// Iterar sobre gastos
		gastos.forEach(gasto => {
			const { cantidad, nombre, id } = gasto

			// Crear un li
			const nuevoGasto = document.createElement('li')
			nuevoGasto.className =
				'list-group-item d-flex justify-content-between alig-items-center'
			nuevoGasto.dataset.id = id

			// Agregar el HTML del gasto
			nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad}</span>`

			// Boton para borrar el gasto
			const btnBorrar = document.createElement('button')
			btnBorrar.className = 'btn btn-danger borrar-gasto'
			btnBorrar.onclick = () => {
				eliminarGasto(id)
			}
			btnBorrar.innerHTML = `Borrar &times;`
			nuevoGasto.appendChild(btnBorrar)

			// Agregar al HTML
			gastoListado.appendChild(nuevoGasto)
		})
	}

	limpiarHTML() {
		while (gastoListado.firstChild) {
			gastoListado.removeChild(gastoListado.firstChild)
		}
	}

	actualizarRestante(restante) {
		document.querySelector('#restante').textContent = restante
	}

	comprobarPresupuesto(presupuestoObj) {
		const { presupuesto, restante } = presupuestoObj
		const restanteDiv = document.querySelector('.restante')

		// Comprobar 25%
		if (presupuesto / 4 > restante) {
			restanteDiv.classList.remove('alert-success', 'alert-warning')
			restanteDiv.classList.add('alert-danger')
		} else if (presupuesto / 2 > restante) {
			restanteDiv.classList.remove('alert-success')
			restanteDiv.classList.add('alert-warning')
		} else {
			restanteDiv.classList.remove('alert-danger', 'alert-warning')
			restanteDiv.classList.add('alert-success')
		}

		// Si el total es 0 o menor
		if (restante <= 0) {
			ui.imprimirAlerta('El presupuesto se ha agotado', 'error')
			formulario.querySelector('button[type="submit"]').disabled = true
		}
	}
}

// Instanciar
const ui = new UI()
let presupuesto

// Funciones

function preguntarPresupuesto() {
	const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?')

	// console.log(Number(presupuestoUsuario));

	if (
		presupuestoUsuario === '' ||
		presupuestoUsuario === null ||
		presupuestoUsuario <= 0 ||
		isNaN(presupuestoUsuario)
	) {
		window.location.reload()
	}

	// Presuspuesto válido
	presupuesto = new Presupuesto(presupuestoUsuario)
	// console.log(presupuesto);

	ui.insertarPresupuesto(presupuesto)
}

//
function agregarGasto(e) {
	e.preventDefault()

	// Leer Datos
	const nombre = document.querySelector('#gasto').value
	const cantidad = Number(document.querySelector('#cantidad').value)

	if (nombre === '' || cantidad === '') {
		ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

		return
	} else if (cantidad <= 0 || isNaN(cantidad)) {
		ui.imprimirAlerta('Cantidad no válida', 'error')

		return
	}

	console.log('Agregando gasto...')

	// Generar un objeto con el gasto
	const gasto = { nombre, cantidad }

	// Añade un nuevo gasto
	presupuesto.agregarGasto(gasto)

	ui.imprimirAlerta('Gasto agregado correctamente')

	// Imprimir los gastos
	const { gastos, restante } = presupuesto

	ui.mostrarGastos(gastos)
	ui.actualizarRestante(restante)
	ui.comprobarPresupuesto(presupuesto)

	// Reinicia el formulario
	formulario.reset()
}

function eliminarGasto(id) {
	// Elimina dle objeto
	presupuesto.eliminarGasto(id)

	// Elimina los objetos del HTML
	const { gastos, restante } = presupuesto
	ui.mostrarGastos(gastos)

	ui.actualizarRestante(restante)

	ui.comprobarPresupuesto(presupuesto)
}
