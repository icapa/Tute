let imgCartaAncho = 208;
let imgCartaAlto = 320;
let numeroJugadores=4;
let numeroCartasJugador=10;

let laBaraja = new Baraja();
var laPartida = new Partida (numeroJugadores,numeroCartasJugador,laBaraja);




function  nuevaTirada(){
	const esUltimoTurno = laPartida.esUltimoTurno();
	const esUltimoJugador = laPartida.esUltimoJugador();



	console.log("El turno de la carta: " +  laPartida.turnosCartas.length);

	console.log("El turno de la mano: " + laPartida.numeroMano);  


	console.log("Nueva tirada, esUltimoJugador: "+esUltimoJugador+ ", esUltimoTurno: " + esUltimoTurno);
	

	$('#carta1').removeClass("cartaGanaJugador");
	$('#carta2').removeClass("cartaGanaJugador");
	$('#carta3').removeClass("cartaGanaJugador");
	$('#carta4').removeClass("cartaGanaJugador");
	$('#carta1').removeClass("cartaGanaMaquina");
	$('#carta2').removeClass("cartaGanaMaquina");
	$('#carta3').removeClass("cartaGanaMaquina");
	$('#carta4').removeClass("cartaGanaMaquina");

	if (laPartida.esUltimoTurno()===false && laPartida.esUltimoJugador()===false){
		setTimeout(() => 
			laPartida.siguienteTurno(function(usuario){
				TiraLaCarta(usuario[0]+1,usuario[1]);
				console.log("TIRANDOOOOOOOOO....."+ laPartida.turnoActual);
		}),1000);
	}
} 

function acaboLaMano(ganador){
	var textoGanador = (ganador%2)?"Jugador":"Maquina";
	console.log("Acabo la mano, ganó: " + textoGanador);
}

function rondaFinalizada(ganadorReal){
	setTimeout(()=> {
		if (ganadorReal%2!==0){
			$('#carta1').addClass("cartaGanaJugador");
			$('#carta2').addClass("cartaGanaJugador");
			$('#carta3').addClass("cartaGanaJugador");
			$('#carta4').addClass("cartaGanaJugador");
		}else{
			$('#carta1').addClass("cartaGanaMaquina");
			$('#carta2').addClass("cartaGanaMaquina");
			$('#carta3').addClass("cartaGanaMaquina");
			$('#carta4').addClass("cartaGanaMaquina");
		}
		BorraCartasTiradas();
	},1000);
	setTimeout(() => {
			
		nuevaTirada();
	},2000);
	
}

$(document).ready(function(){
	CrearDiv('#jugador1');
	CrearDiv('#jugador2');
	CrearDiv('#jugador3');
	CrearDiv('#jugador4');


	AsignaEventosCartas('#jugador4');

	/* Callback de la partida */
	laPartida.setOnManoFinalizada(acaboLaMano);
	laPartida.setOnTurnoFinalizado(nuevaTirada);
	laPartida.setOnRondaFinalizada(rondaFinalizada);

	nuevaTirada();

	/* Arrancamos la primera tirada */	
	
	

})








function CrearDiv(jugador){
	var i;
	var direccion;
	var izquierda=0,arriba=0;
	var propiedades;
	var alineacionVertical;
	var alineacionHorizontal;

	var jugNum = parseInt(jugador.substr(-1,1));

	if (jugador==='#jugador1' || jugador==='#jugador3'){	
		direccion='vertical'; 
		if (jugador==='#jugador1'){
			alineacionHorizontal='left:';
		}else{
			alineacionHorizontal='right:';
		}
		alineacionVertical='top:';
	}
	else if(jugador==='#jugador2' ||jugador==='#jugador4'){
		direccion='horizontal';
		if(jugador==='#jugador2'){
			alineacionVertical='top:';
		}else{
			alineacionVertical='bottom:';
		}
		alineacionHorizontal='left:';
	}
	// Se crean los div
	for (i=0;i<10;i++){
		if (direccion==='vertical'){
			arriba=i*90;
		}
		else{
			izquierda=i*90;
		}
		propiedades=
			'position: absolute;'+			
			alineacionVertical + arriba+'px;'+
			alineacionHorizontal + izquierda+'px;'+
			'z-index: '+(i+100);
		

		d=document.createElement('div');
		$(d).addClass('carta')
			.attr('id',jugador.substring(1)+i)
			.attr('style',propiedades)			
			.appendTo($(jugador))

		
		var carNum = laPartida.dameCarta(jugNum-1,i);
		
		if (jugNum==4){
			AsignaCartaImagen(jugNum,i,laBaraja.carta(carNum));
		}
		else{	// La carta que pinta dada la vueltan
			if (laPartida.cartaPinte !== carNum){
				AsignaCartaImagen(jugNum,i,undefined);
			}else{
				AsignaCartaImagen(jugNum,i,laBaraja.carta(carNum))
			}
		}
	}
	
}

function BorraCartasTiradas(){
	TiraCartaImagen(1,null);
	TiraCartaImagen(2,null);
	TiraCartaImagen(3,null);
	TiraCartaImagen(4,null);

}


function TiraCartaImagen(jugador,carta){
	var i = IndiceCartaImagen(carta);
	$('#carta'+jugador)
		.css({'background':"url('baraja_completa.png') "+i[0]+"px "+i[1]+"px"});
	/* Hay que ocultar el div de la carta tirada */
}

function OcultaCartaTirada(jugador,indiceCarta){
	$('#jugador'+jugador+indiceCarta)
		.css({'display':'none'});
}

function AsignaCartaImagen(jugador,numero,carta){
	
	var i = IndiceCartaImagen(carta);
	

	$('#jugador'+jugador+numero)
		.css({'background':"url('baraja_completa.png') "+i[0]+"px "+i[1]+"px"});
}

function IndiceCartaImagen(carta){
	var arregla8y9=0;

	if (carta===null){
		return[0, 320];	// En blanco
	}
	if (carta===undefined){
		return [-imgCartaAncho, -(imgCartaAlto*4)];	// Dada la vuelta
	}

	if (carta.getIndiceValor()>6){
		arregla8y9 = carta.getIndiceValor()+2;
	}
	else{
		arregla8y9 = carta.getIndiceValor();
	}

	return [arregla8y9*-(imgCartaAncho),carta.getIndicePalo()*-(imgCartaAlto)];

}

function AsignaEventosCartas(eldiv){
	var i;
	for (i=0;i<10;i++){
		$(eldiv+i).hover(
			function(objeto){
				$(objeto.target).css({'z-index':200});
			},function(objeto){
				var indexTarget = objeto.currentTarget.id.substr(-1,1);
				var z = 100 + parseInt(indexTarget);
				$(objeto.target).css({'z-index': z});
			}
		);
		$(eldiv+i).click(
			function(objeto){
				var usuario = parseInt(objeto.target.id.substr(-2,1));
				if (usuario===4){
					var carta = parseInt(objeto.target.id.substr(-1,1));
					TiraLaCarta(usuario,carta);
					/*
					if (laPartida.esUltimoTurno()===false){
						nuevaTirada();
					}
					*/
				}
			}
		);
	}
}

function TiraLaCarta(usuario,numeroCarta){
	var cartaReal = laPartida.dameCarta(usuario-1,numeroCarta)
	TiraCartaImagen(usuario,laBaraja.carta(cartaReal));
	OcultaCartaTirada(usuario,numeroCarta);
	if (usuario==4){	// El suario de verdad	
		laPartida.juegaElUsuario(cartaReal);
		
	}

	/*
	
	*/
}
