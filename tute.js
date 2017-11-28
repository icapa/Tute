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
		

		this.reiniciaMano();
				
	}

	/* Funciones de callback */
	setOnTurnoFinalizado(callback){
		this.onTurnoFinalizado=callback;
	}

	setOnManoFinalizada(callback){
		this.onManoFinalizada=callback;
	}





	reiniciaMano(){
		//this.turnoInicialMano = Math.floor(Math.random()*numJugadores);
		this.turnoInicialMano = 3;
		
		this.turnoActual = this.turnoInicialMano;
		this.numeroMano=0;
		this.cartasGanadorasJugador=[];
		this.cartasGanadorasMaquina=[];
		this.puntosMaquina=0;
		this.puntosJugador=0;


		this.todasLasCartas=this.baraja.todas();

		this.losCantes = [null,null,null,null];


		/* Esto es lo que habría que hacer en cada mano */
		this.laMano = this.barajea();


		this.cartaPinte = this.laMano[ (((this.turnoActual + this.numJugadores) % this.numJugadores)*10)+(this.numCartas-1)];


		this.reparte();

		this.cartaPinte = this.jugadores[(this.turnoActual + this.numJugadores)% this.numJugadores][this.numCartas-1];


		this.rellenaLosCantes();



 	
		console.log("Pinta la carta: " + this.cartaPinte + "que es: " + this.baraja.carta(this.cartaPinte).valor);

	}

	compruebaMano(){
		const paloPinte = this.baraja.carta(this.cartaPinte).getIndicePalo();
		const cartaGanadora = this.quienVaGanando();
		const tGanador = this.turnosCartas.indexOf(cartaGanadora);
		const ganadorReal = this.jugadorGanadorTurno(tGanador);
		console.log("De momento gana la carta: " + cartaGanadora + "que es del turno (0-3) ->" + tGanador + " jugador: " + ganadorReal );

		this.onTurnoFinalizado();

		if(this.turnosCartas.length==this.numJugadores){
			console.log("Mano completa!, a ver quién la gana: Mano:" + this.numeroMano);
			

			console.log("GANO LA MANO EL JUGADOR: " + ganadorReal);	

			this.calculaPuntosMano(ganadorReal);
			
			console.log("Maquina: " + this.puntosMaquina+ ", Jugador: " + this.puntosJugador);

			this.rellenaLosCantes();

			const puntosPinte = this.puntosPorCante(ganadorReal);
			console.log("Puntos por cante: " + puntosPinte);


			
			

			this.numeroMano++;
			
			this.turnosCartas = [];
			if (this.numeroMano==this.numCartas){
				console.log("BIEN ACABO LA PARTIDA !!!!");
				if (this.puntosMaquina>this.puntosJugador){
					console.log("Gano la maquina!!!");
				}else{
					console.log("Gano el jugador!!!");
				}
				this.onManoFinalizada();
				
			}
		}
	}

	calculaPuntosMano(ganadorReal){
		
		if (ganadorReal%2===0) {
			this.cartasGanadorasMaquina=this.cartasGanadorasMaquina.concat(this.turnosCartas);
			this.puntosMaquina = this.puntosMaquina + this.puntosEnMano(this.turnosCartas);
		}
		else{
			this.cartasGanadorasJugador=this.cartasGanadorasJugador.concat(this.turnosCartas);
			this.puntosJugador=this.puntosJugador + this.puntosEnMano(this.turnosCartas);
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
		const cartaGanadora = this.quienVaGanando();
		const tGanador = this.turnosCartas.indexOf(cartaGanadora);
		const ganadorReal = this.jugadorGanadorTurno(tGanador);
		if (this.turnosCartas.length===0){
			console.log("SOY EL PRIMERO EN TIRAR!");
			cartaElegida=this.cartaMasAltaSinPinte(turno);

		}
		else{
			const paloPrimera= this.baraja.carta(this.turnosCartas[0]).getIndicePalo();
			const disponibles = this.filtraPorPalo(this.jugadores[turno],paloPrimera);
			console.log("Del palo de la primera hay: " + disponibles);
			const disponiblesMayores = this.filtraSuperaCarta(disponibles,this.turnosCartas);
			console.log("Cartas que lo superan son las siguientes:" + disponiblesMayores);
			if (disponibles.length){
				if (disponiblesMayores.length){
					console.log("Tenemos opciones para tirar TODO");
					if (ganadorReal%2===0){
						cartaElegida = disponiblesMayores[0];
					}
					else{
						cartaElegida = disponiblesMayores[disponiblesMayores.length-1]
					}

				}else{
					console.log("No hay supeior, hay que tirar de pinte, tiramos cualquiera TODO");
					if (ganadorReal%2===0){	
						cartaElegida =disponibles[0];
					}
					else{
						cartaElegida = disponibles[disponibles.length-1];
					}	
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
						if (ganadorReal%2===0){
							traca.sort();
							console.log("Como gana el compañero tiro la de mas puntos: " + traca);
							cartaElegida = traca[0];
						}else{
							traca.reverse();
							console.log("Como voy perdiendo la mano tiro menos puntos: " + traca);
							cartaElegida = traca.reduce((carta,elemento) =>{
								if (carta===null){
									if (elemento!==null){
										carta=elemento;
									}
								}
								return carta;
							},null);
						}
					}
				}
				else{
					// Nadie tiró pinte hay que tirar
					if (cartasPinte.length){
						cartaElegida = cartasPinte[0];	// Envío la primera por mandar algo
					}else{
						/* Esto eslo mismo que el caso anterior */
						const traca = [...this.jugadores[turno]];
						if (ganadorReal%2===0){
							traca.sort();
							console.log("Como gana el compañero tiro la de mas puntos: " + traca);
							cartaElegida = traca[0];
						}else{
							traca.reverse();
							console.log("Como voy perdiendo la mano tiro menos puntos: " + traca);
							cartaElegida = traca.reduce((carta,elemento) =>{
								if (carta===null){
									if (elemento!==null){
										carta=elemento;
									}
								}
								return carta;
							},null);
						}
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
		
		// Si es el jugador no se hace nada
		if (this.jugadorGanadorTurno(this.turnoActual)===3){
			console.log("NO JUEGA LA MAQUINA");
			return;;
		}

		console.log("Juega la máquina el usuario: " + this.turnoActual);
		laTirada = this.juegaLaMaquina(this.turnoActual);
		callback(laTirada);
		/* Aqui anulamos la carta para que no se pueda usar */
		this.jugadores[laTirada[0]][laTirada[1]] = null;
			
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
		const paloPinte = laBaraja.carta(this.cartaPinte).getIndicePalo();
		return this.turnosCartas.reduce((maxima,carta,indice)=>{
			if (indice==0){
				maxima=carta;
			}else{
				if (Carta.esMayor(this.baraja.carta(carta),this.baraja.carta(maxima),paloPinte)){
					maxima=carta;
				}
			}
			return maxima;
		},this.turnoActual)
	}
	jugadorGanadorTurno(turno){
		return ((this.turnoInicialMano+1)+ this.numJugadores + turno) % this.numJugadores;
	}
	puntosEnMano(listaDeCartas){
		return listaDeCartas.reduce( (valor,carta) =>{
			valor =  valor + this.baraja.carta(carta).valor.valor;
			return valor;
		},0);
	}


	

	buscaCante(cartas,palo){
		let caballo = (palo * this.numCartas)+8;
		let rey = (palo * this.numCartas)+9;
		return (cartas.indexOf(caballo)!=-1 && cartas.indexOf(rey)!=-1) ? true: false;
	}

	rellenaLosCantes(){
		for (var i=0;i<this.numJugadores;i++){
			for (var palo=0;palo<4;palo++){
				if (this.buscaCante(this.jugadores[i],palo)){
					this.losCantes[palo]=i;
				}else{
					this.losCantes[palo]=null;
				}
			}
		}
	}

	puntosPorCante(elJugador,paloPinte){
		return this.losCantes.reduce((puntos,elemento,indice)=>{
			if (elemento==elJugador){		
				if (indice==paloPinte){
					puntos=puntos+40;
				}else{
					puntos=puntos+20;
				}
				this.losCantes[indice]=null;
			}
			return puntos;
		},0);
	}

	esElUltimoTurno(){
		return (this.turnosCartas.length===3) ? true:false;

	}


	/* Esto es cuando tiene que salir */
	cartaMasAltaSinPinte(jugador,pinte){
		const cartas = [...this.jugadores[jugador]];
		let  arrayCarta = cartas.reduce((carta,elemento)=>{
			if (elemento!=null){
				carta.push(elemento)
			}
			return carta;
		},[])
		return arrayCarta[0];
	}

	esUltimoTurno(){
		return (this.turnoActual===this.numCartas-1) ? true:false;  
	}
	

}
