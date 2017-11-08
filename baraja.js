
let losPalos=['OROS','COPAS','ESPADAS','BASTOS'];
let losValores=[
	{nombre:'AS',valor:11},
	{nombre:'DOS',valor:0},
	{nombre:'TRES',valor:10},
	{nombre:'CUATRO',valor:0},
	{nombre:'CINCO',valor:0},
	{nombre:'SEIS',valor:0},
	{nombre:'SIETE',valor:0},
	{nombre:'SOTA',valor:2},
	{nombre:'CABALLO',valor:3},
	{nombre:'REY',valor:4}
];

class Carta
{
	constructor(palo,valor)
	{
		this.palo = palo;
		this.valor = valor;
		this.indicePalo = losPalos.indexOf(this.palo)
		this.indiceValor= losValores.indexOf(this.valor);
		this.puntos = this.valor.valor;
		//console.log(`Creando carta ${this.palo} y ${this.valor}`)
		//console.log(`Indices ${this.indicePalo} y ${this.indiceValor}`);
	};

	getIndicePalo(){
		return this.indicePalo;
	}

	getIndiceValor(){
		return this.indiceValor;
	}

	static esMayor(carta1,carta2,palo){
		
		if (carta1.palo == carta2.palo){
		
			if (carta1.puntos > carta2.puntos){
				return true;
			}
			else if(carta1.puntos<carta2.puntos){
				return false;
			}
			else{
				// Son iguales
				if (carta1.getIndiceValor() > carta2.getIndiceValor() ){
					return true;
				}
				else{
					return false;
				}
			}
		}
		else{
			if (carta1.getIndicePalo()<carta2.getIndicePalo()){
				return true;
			}
			else{
				return false;
			}
		}
		return true;
	}

}

class Baraja
{
	constructor(){
		this.listaCartas = new Array();
		for (var i=0;i<losPalos.length;i++){
			for (var j=0;j<losValores.length;j++){
				var carta = new Carta(losPalos[i],losValores[j]);
				this.listaCartas.push(carta);
			}
		}
		console.log('Se creao la baraja: ' + this.listaCartas.length);
	}
	display(){
		this.listaCartas.forEach(function(elemento,indice,array){
			console.log(elemento,indice);
		});
	}

	carta(indice){
		
		return this.listaCartas[indice];
	}

	todas(){
		return this.listaCartas;
	}

}



