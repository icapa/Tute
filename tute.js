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

		/* Esto es lo que habría que hacer en cada mano */
		this.laMano = this.barajea();


		this.cartaPinte = this.laMano[ (((this.turnoActual + this.numJugadores) % numJugadores)*10)+(numCartas-1)];


		this.reparte();

		this.cartaPinte = this.jugadores[(this.turnoActual + this.numJugadores)% numJugadores][numCartas-1];






		console.log("Pinta la carta: " + this.cartaPinte + "que es: " + laBaraja.carta(this.cartaPinte).valor);

		/* Debug */
				
	}



	compruebaMano(callbackAcabado){
		const paloPinte = laBaraja.carta(this.cartaPinte).getIndicePalo();
		const cartaGanadora = this.quienVaGanando();
		const usuarioGanador = this.turnosCartas.indexOf(cartaGanadora);
		console.log("De momento gana la carta: " + cartaGanadora + "que es del usuario (0-3) ->" + usuarioGanador);

		if(this.turnosCartas.length==this.numJugadores){
			console.log("Mano completa!, a ver quién la gana: Mano:" + this.numeroMano);
			let ordenados = [...this.turnosCartas];
			ordenados.sort( (laCarta1, laCarta2) =>{
				if (Carta.esMayor(laBaraja.carta(laCarta1),laBaraja.carta(laCarta2),paloPinte)) {
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
				if (callbackAcabado){
					callbackAcabado()
				}
			}
		}
	}


	juegaElUsuario(carta){
		console.log("El usuario tiro la carta: " + carta);
		this.turnosCartas.push(carta);
		this.compruebaMano();
	}

	juegaLaMaquina(turno){
	
		let cartaElegida=null;
		const paloPinte = this.baraja.carta(this.cartaPinte).getIndicePalo(); 
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
				console.log("El usuario falla, buscando cartas por pinte");
				const cartasPinte = this.filtraPorPalo(this.jugadores[turno],paloPinte);
				console.log("Buscando cartas de pinte, las cartas que hay: " + cartasPinte);
				console.log("Ahora hay que mirar si hay tirada alguna con pinte");
				const tiradasPinte = this.filtraPorPalo(this.turnosCartas, paloPinte);
				console.log("Hay tiradas con pinte las siguientes: " + tiradasPinte);
				if (tiradasPinte.length){
					console.log("Hay cartas tiradas con pinte, hay que superar si se puede");
					const disponiblesMayoresPinte = this.filtraSuperaCarta(cartasPinte,tiradasPinte);
					if (disponiblesMayoresPinte.length){
						console.log("Algún usuario falló y hay que superar y podemos: " + disponiblesMayoresPinte);
						cartaElegida = disponiblesMayoresPinte[0];	// DE MOMENTO TIRO LA PRIMERA QUE SE PUEDEA
					}else{
						/* No tenemos pinte, si la mano es nuestra tiramos puntos, si es del otro no tiramos nada
						*/
						/* ESTO FALLA CUIDADO CON LOS ARRAYS ORDENADOS */
						const traca = [...this.jugadores[turno]];
						traca.sort();
						console.log("Esto no vale TODO: " + traca);
						cartaElegida = traca[0];
					}
				}
				else{
					// Nadie tiró pinte hay que tirar
					if (cartasPinte.length){
						cartaElegida = cartasPinte[0];	// Envío la primera por mandar algo
					}else{
						/* Esto eslo mismo que el caso anterior */
						const traca = [...this.jugadores[turno]];
						traca.sort();
						console.log("Esto no vale TODO: " + traca);
						cartaElegida = traca[0];
					}
				}	
			}

		}

		if (cartaElegida==null){
			console.error("NO SE HA SELECCIONADO CARTA!!!!");
		}

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

		const paloPinte = laBaraja.carta(this.cartaPinte).getIndicePalo();
		for (var i=0;i<mano.length;i++){
			if (i==0){
				arrayOrdenado.push(mano[0]);
			}else{
				var j;
				for (j=0;j<arrayOrdenado.length;j++){
					if (Carta.esMayor( this.baraja.carta(mano[i]),
						this.baraja.carta(arrayOrdenado[j]),null )==true){
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
		if (cartasTiradas.length===0){
			return cartasUsuario;
		}
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

	quienVaGanando(){
		return this.turnosCartas.reduce((maxima,carta,indice)=>{
			if (indice==0){
				maxima=carta;
			}else{
				if (Carta.esMayor(this.baraja.carta(carta),this.baraja.carta(maxima))){
					maxima=carta;
				}
			}
			return maxima;
		})
	}




}
