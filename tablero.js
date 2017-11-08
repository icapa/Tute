let imgCartaAncho = 208;
let imgCartaAlto = 320;
let numeroJugadores=4;
let numeroCartasJugador=10;

let laBaraja = new Baraja();
var laPartida = new Partida(numeroJugadores,numeroCartasJugador,laBaraja);


$(document).ready(function(){
	CrearDiv('#jugador1');
	CrearDiv('#jugador2');
	CrearDiv('#jugador3');
	CrearDiv('#jugador4');

	AsignaEventosCartas('#jugador1');
})







function CrearDiv(jugador){
	var i;
	var direccion;
	var izquierda=0,arriba=0;
	var propiedades;
	var alineacionVertical;
	var alineacionHorizontal;

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

		var jugNum = parseInt(jugador.substr(-1,1));
		var carNum = laPartida.dameCarta(jugNum-1,i);

		AsignaCartaImagen(jugNum,i,laBaraja.carta(carNum));
		
	}
	
}

function AsignaCartaImagen(jugador,numero,carta){
	
	var i = IndiceCartaImagen(carta);
	

	$('#jugador'+jugador+numero)
		.css({'background':"url('baraja_completa.png') "+i[0]+"px "+i[1]+"px"});
}

function IndiceCartaImagen(carta){
	var arregla8y9=0;
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
				console.log('Pulse:'+objeto.target.id);
			}
		);
	}

}
