class Partida{
	constructor(numJugadores,numCartas,cartas){
		this.numJugadores=numJugadores;
		this.indiceMano = 0;
		this.numCartas = numCartas;
		this.jugadores= new Array(numJugadores);
		this.laMano = new Array();
		this.cartasTiradas= new Array();
		console.log("Creando partida jug:"+this.numJugadores+' cartas:'+this.numCartas)
		for(var i = 0 ; i <this.numJugadores;i++){
			console.log('Creando jugador: ' + i);
			this.jugadores[i] = new Array(this.numCartas);
		}
		this.todasLasCartas=cartas;
		this.laMano = this.barajea();
		this.reparte();		
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
	}

	dameCarta(jugador,indiceCarta){
		if (jugador<this.numJugadores && indiceCarta<this.numCartas){	
			return this.jugadores[jugador][indiceCarta];
		}
		return null;
	}
}
