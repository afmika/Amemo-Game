//Programmé par afmika 2018

$(document).ready(function() {
	var timer = null;
	var rapiditeTimer = null;
	var actual = 0; //le nombre actuel qui va changer
	var choices = []; //les choix actuel (3)
	var millisecond = 0; //valeur dans le compteur de seconde de reponse
	var digitsNumber = 3; //nombre de digit, en fonction du niveau
	var level = 1; //niveau
	var correct = 0; //rep corretes
	var wrong = 0; //rep incorrectes
	var score = 0; //points
	var lifepoint = 100;
	var main_time_millis = 3000 / digitsNumber; //vitesse de rafraichissement (en fonction des digits)
	function regulateDigitsSize() {
		var pixel;
		if(digitsNumber <= 3) {
			pixel = 64;
		} else if(digitsNumber > 3 && digitsNumber <= 6) {
			pixel = 54;
		} else if(digitsNumber > 6 && digitsNumber <= 10) {
			pixel = 48;
		} else if(digitsNumber > 10 && digitsNumber <= 15) {
			pixel = 40;
		} else {
			pixel = 32;
		}
		$(".menubtn").css({
			"font-size" : pixel+"px"
		});
	}
	function creerAnagram(nombre) {
		var $tab = ""+nombre;
		var tab = $tab.split("");
		for(var i=0; i < tab.length; i++) {
			var ran = Math.floor(Math.random() * tab.length) % tab.length;
			// syntaxe E6 : 
			//[tab[i], tab[ran]] = [tab[ran], tab[i]];
			var tmp = tab[i];
			tab[i] = tab[ran];
			tab[ran] = tmp;
		}
		return tab;
	}
	function addScore(name, score) {
		// nom1+score1|nom2+score2|..........
		if(!localStorage.getItem("AMEMO_SCORE")) {
			localStorage.setItem("AMEMO_SCORE", name+"+"+score);
		} else {
			var elem = localStorage.getItem("AMEMO_SCORE");
			localStorage.setItem("AMEMO_SCORE", elem + "|" + name+"+"+score);
		}
	}
	
	function num() {
		return (Math.floor(Math.random()*10));
	}

	function constructRandomNumber(digits) {
		var s = 0;
		for(var i=0; i < digits; i++) {
			var N =num(); 
			N = (N == 0 && i == digits-1) ? 1 : N;
			s +=  N * Math.pow(10, i);
		}
		return s;
	}
	function generateRandom() {
		for(var i=0; i < 3; i++) {
			choices[i] = constructRandomNumber(digitsNumber);
		}
		actual = choices[Math.floor(Math.random() * choices.length)];
		$("#c1").text(choices[0]);
		$("#c2").text(choices[1]);
		$("#c3").text(choices[2]);
	}
	function cycle(id, nombre) {
		var tab = creerAnagram(nombre);
		var el = document.getElementById(id);
		var q = 0;
		if(timer != null) {
			clearInterval(timer);
		}
			$("#"+id).text("");
		timer = setInterval(function() {
			q %= tab.length;
			//fade In + fadeOut = interval
			$("#"+id).fadeIn(main_time_millis/4);
			$("#"+id).fadeOut(3*main_time_millis/4);
			$("#"+id).html(tab[q]);
			q++;
		}, main_time_millis);
	}
	
	function newNumber() {
		if(rapiditeTimer != null) clearInterval(rapiditeTimer);
		rapiditeTimer = setInterval(function(){
			millisecond++;
		}, 1);
		regulateDigitsSize();
		updateGameStats();
		millisecond = 0;
		generateRandom();
		cycle("number", actual);	
	}
	function updateGameStats() {
		$("#score").text("Score : "+score);
		$("#taux").text("Erreur x "+wrong);
		$("#level").text("Niveau : "+level);
		$("#lifepoint").text("Vie : "+lifepoint+"%");
		if(lifepoint <= 0) {
			alert("Vous avez perdu!");
			var name = prompt("Entrer votre nom", "Anonyme");
			name = name || "Anonyme";
			addScore(name, score);
			window.open("score.html");
		}
	}
	function choice(i) {
		var n = choices[i];
		if(n == actual) {
			var vitesse = "";
			var dt = main_time_millis / 3;
			if(millisecond < 2*dt) {
				score += 100;
				vitesse = "Rapide +100 points";
			} else if (millisecond >= 2*dt && millisecond < 2.5*dt) {
			   score += 80;
			   vitesse = "Moyen +80 points";
			} else if(millisecond >= 2.5*dt && millisecond < main_time_millis){
				score += 30;
			   vitesse = "Lente +30 points";
			} else {
				score += 5;
			    vitesse = "Très lente +5 points";
			}
			correct++;
			if(correct % 5 == 0) {
				//bonne reponse
				level++;
				if(level % 2 == 0) {
					if(digitsNumber <= 20) {
						//max digits 20
						digitsNumber++;
					}
					var pixel = (digitsNumber / 3) * 64;
					$(".menubtn").css({
						"font-size" : pixel+"px"
					});
					// 1000 -> 3 donc digitsNumber -> ?
					main_time_millis = 3000 / digitsNumber;
				}
			}
			$("#choicegroup").css({
				"background-color":"yellowgreen",
				"transition":"0.3s"
			});
			setTimeout(function(){
				$("#choicegroup").css({
					"background-color":"white",
					"transition":"0.3s"
				});				
			}, 100);
			$("#commentaire").text(vitesse);
			$("#commentaire").fadeIn(20);
			$("#commentaire").fadeOut(300);
		} else {
			lifepoint -= 20;
			wrong++;
			$("#choicegroup").css({
				"background-color":"red",
				"transition":"0.3s"
			});
			setTimeout(function(){
				$("#choicegroup").css({
					"background-color":"white",
					"transition":"0.3s"
				});				
			}, 100);
			$("#commentaire").text("Faux! -30 points");
			score-=30;
			$("#commentaire").fadeIn(20);
			$("#commentaire").fadeOut(300);
		}
			newNumber();
	}
	newNumber();
	
	$("#c1").click(function(){
		choice(0);
	});
	$("#c2").click(function(){
		choice(1);
	});
	$("#c3").click(function(){
		choice(2);
	});
});