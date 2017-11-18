class Partida{
	constructor(numJugadores,numCartas,baraja){
		this.baraja=baraja;
		this.numJugadores=numJugadores;
		this.indiceMano = 0;
		this.numCartas = numCartas;
		this.jugadores= new Array(numJugadores);
		this.laMano = new Array();
		this.cartasTiradas= new Array();
		
		for(var i = 0 ; i <this.numJugadores;i++){
			console.log('Creando jugador: ' + i);
			this.jugadores[i] = new Array(this.numCartas);
		}

		this.turnosCartas = new Array();
		//this.turnoActual = Math.floor(Math.random()*numJugadores);
		this.turnoActual = 2;
		this.numeroMano=0;

		this.todasLasCartas=baraja.todas();
		this.laMano = this.barajea();
		this.reparte();

		/* Debug */
				
	}



	compruebaMano(){
		if(this.turnosCartas.length==this.numJugadores){
			console.log("Mano completa!, a ver quién la gana: Mano:" + this.numeroMano);
			let ordenados = [...this.turnosCartas];
			ordenados.sort( (laCarta1, laCarta2) =>{
				if (Carta.esMayor(laBaraja.carta(laCarta1),laBaraja.carta(laCarta2))) {
					return -1;
				}else{
					return 1;
				}
			});

			console.log("El array de ordenados es: " + ordenados);


			const turnoGanador = this.turnosCartas.indexOf(ordenados[0]);

			console.log("GANO LA MANO EL JUGADOR: " + turnoGanador);	


			this.numeroMano++;
			
			this.turnosCartas = [];
			if (this.numeroMano==this.numCartas){
				console.log("BIEN ACABO LA PARTIDA !!!!");
			}
		}
	}


	juegaElUsuario(carta){
		console.log("El usuario tiro la carta: " + carta);
		this.turnosCartas.push(carta);
		this.compruebaMano();
	}

	juegaLaMaquina(turno){
	
		let cartaElegida;

		if (this.turnosCartas.length!=0){
			const paloPrimera= this.baraja.carta(this.turnosCartas[0]).getIndicePalo();
			const disponibles = this.filtraPorPalo(this.jugadores[turno],paloPrimera);
			console.log("Del palo de la primera hay: " + disponibles);
			const disponiblesMayores = this.filtraSuperaCarta(disponibles,this.turnosCartas);
			console.log("Cartas que lo superan son las siguientes:" + disponiblesMayores);
			if (disponibles.length){
				if (disponiblesMayores.length){
					console.log("Tenemos opciones para tirar TODO");
					cartaElegida = disponiblesMayores[0];	// TODO: Tiramos la primera no miramos mas, esto es muy cutre
				}else{
					console.log("No hay supeior, hay que tirar de pinte, tiramos cualquiera TODO");
					cartaElegida =disponibles[0];	
				}
			}
			else{
				cartaElegida = this.jugadores[turno][0];
			}

		}

		/* Deshabilitar la carta */
		/*
		const indiceABorrar = this.jugadores[turno].indexOf(cartaElegida);
		this.jugadores[turno][indiceABorrar] = null;	//Desaparece la carta
		*/

		this.turnosCartas.push(cartaElegida);
		this.compruebaMano();
		return [turno,this.jugadores[turno].indexOf(cartaElegida)];
	}

	siguienteTurno(callback){
		let laTirada;
		this.turnoActual = (this.turnoActual+1)%this.numJugadores;
		
		while(this.turnoActual!= this.numJugadores-1){
			
			console.log("Juega la máquina el usuario: " + this.turnoActual);
			laTirada = this.juegaLaMaquina(this.turnoActual);
			callback(laTirada);
			/* Aqui anulamos la carta para que no se pueda usar */
			this.jugadores[laTirada[0]][laTirada[1]] = null;
			this.turnoActual = (this.turnoActual+1)%this.numJugadores;
		}
	}




	barajea(){
		var enOrden = new Array();	// Ordenado
		var laMano = new Array();	// Desordenado
		var aleatorio;
		var seleccion;

		for (var i=0;i<this.todasLasCartas.length;i++){
			enOrden.push(i);
		}

		while(laMano.length<this.todasLasCartas.length){
			aleatorio = Math.floor(Math.random()*(enOrden.length));
			seleccion = enOrden[aleatorio];
			enOrden.splice(aleatorio,1);
			laMano.push(seleccion);
		}

		return laMano;		
	}


	reparte(){
		for (var i=0 ; i<this.numCartas; i++){
			for (var j=0 ; j<this.numJugadores;j++){
				this.jugadores[j][i]=(this.laMano[i+(j*this.numCartas)])
			}
		}
		// Ordenamos
		
		for (var j=0;j<this.numJugadores;j++){
			this.jugadores[j]=this.ordenaMano(this.jugadores[j]);
		}
		
	}

	dameCarta(jugador,indiceCarta){
		if (jugador<this.numJugadores && indiceCarta<this.numCartas){	
			return this.jugadores[jugador][indiceCarta];
		}
		return null;
	}

	ordenaMano(mano){
		var arrayOrdenado=[];

		for (var i=0;i<mano.length;i++){
			if (i==0){
				arrayOrdenado.push(mano[0]);
			}else{
				var j;
				for (j=0;j<arrayOrdenado.length;j++){
					if (Carta.esMayor( this.baraja.carta(mano[i]),
						this.baraja.carta(arrayOrdenado[j]) )==true){
						arrayOrdenado.splice(j,0,mano[i]);
						break;
					}

				}
				if (j==arrayOrdenado.length){
					arrayOrdenado.splice(j+1,0,mano[i]);
				}
			}
		}
		return arrayOrdenado;
	
	}

	/* La logiga del juego
	- Filtrar por palo
	- Sacar la mayor
	etc....
	*/
	

	filtraPorPalo(arrayCartas,elPalo){
		return arrayCartas.filter(laCarta => {
			if (laCarta==null){
				return false;
			}else
			{
				return this.baraja.carta(laCarta).getIndicePalo()==elPalo;
			}
		});
	}

	filtraSuperaCarta(cartasUsuario,cartasTiradas){
		return cartasUsuario.filter(laCarta =>{
			const cartaActual = this.baraja.carta(laCarta);
			for (let i=0;i<cartasTiradas.length;i++){
				const cartaTirada = this.baraja.carta(cartasTiradas[i]);
				if (Carta.esMayor(cartaActual,cartaTirada,cartaActual.getIndicePalo())){
					return 1;
				}
			}
		});
	}


}
