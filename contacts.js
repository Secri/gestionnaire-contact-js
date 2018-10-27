// Gestionnaire de contacts

var Contact = { //prototype d'un contact
	init: function (nom, prenom, num) {
		this.nom = nom.toUpperCase();
		this.prenom = prenom;
		this.num = num; // J'ajoute un ID numérique pour permettre de sélectionner ce que l'on veut supprimer
	},
	decrire: function () { // Renvoie la description d'un contact
		var desc = "N°" + this.num + " - Nom : " + this.nom + ", prénom : " + this.prenom;
		return desc;
	}
};

var contacts = []; // Création d'un tableau destiné à contenir les objets contacts

var check = 0; // Variable permettant de savoir si la liste des contacts à déjà été affichée au moins une fois

var commands = ["1 : Lister les contacts", "2 : Ajouter un nouveau contact", "3 : Recherche un contact", "4 : Supprimer un contact", "0 : Quitter"]; // Tableau des commandes. Ajout des commandes Recherche et Supprimer importantes pour la gestion d'une liste de contacts.

function commandList () { // Affiche la liste des commandes
	for (i=0; i < commands.length; i++) {
		console.log(commands[i]);
	}
}

/************************ LISTE ET TRI AUTO *****************************************/
function listerContacts () { // Affiche la liste des contacts contenus dans le tableau contacts et passe la variable check à 1
	tri ();
	console.log("\nVoici la liste de tous vos contacts :");
	for (i=0; i < contacts.length; i++) {
		console.log(contacts[i].decrire());
	}
	console.log("\n");
	check = 1;
}

function tri () { // Trie le tableau par ordre alphabétique
    contacts.sort (function (a, b) { // J'utilise la méthode sort () et je précise les règles de tri pour la chaîne prenom.
        if (a.prenom > b.prenom) {
        return 1;
    }
    if (a.prenom < b.prenom) {
        return -1;
    }
		return 0;
	});
    contacts.sort (function (a, b) { // J'utilise la méthode sort () et je précise les règles de tri pour la chaîne nom
        if (a.nom > b.nom) {
            return 1;
        }
        if (a.nom < b.nom) {
            return -1;
        }
            return 0;
	});
    for (i=0; i < contacts.length; i++) { // Renumérotation des contacts
        contacts[i].num = i + 1;
    }
}
/************************ FIN LISTE ET TRI AUTO *****************************************/

function addContact () { // Créé un nouvel objet basé sur le prototype Contact et le pousse dans le tableau contacts
	var newContact = Object.create(Contact);
	var newContactName = "";
	while (newContactName === "") { // L'utilisateur est obligé de renseigner ce champ
		newContactName = prompt("Entrez le nom du nouveau contact :"); // récupération de la chaîne
	}
	var newContactSurname = "";
	while (newContactSurname === "") {
		newContactSurname = prompt("Entrez le prénom du nouveau contact");
	}
	newContact.init(newContactName, newContactSurname.charAt(0).toUpperCase() + newContactSurname.substr(1).toLowerCase()); // Initialisation de l'Objet à partir du prenom + Mettre en majuscule la première lettre de la chaîne
	newContact.num = contacts.length + 1; // Attribution d'un numéro d'identification au contact
	contacts.push(newContact); // Pousse le nouveau contact dans le tableau contacts
	console.log("Contact ajouté avec succès\n\n");
}

function deleteContact () { // Supprime un contact
	var numDel = prompt("Choisissez le numéro de la personne que vous souhaitez supprimer."); // Demande à l'utilisateur de choisir le numéro d'identification du contact à supprimer
	contacts.splice ((numDel - 1), 1); // utilisation de la méthode splice trouvée sur https://developer.mozilla.org/fr/
	console.log("Le contact a bien été supprimé.\n\n");
}

/*************************************************** SYSTEME DE RECHERCHE ****************************************************************/
function rechercherContact () { // Agrégation et affichage des résultats de recherche
	var searchTool = []; // Création d'un tableau destiné à recueillir les correspondances de noms
	var searchSurname = []; // Création d'un tableau destiné à recueillir les correspondances de prénoms
	var searchString = prompt("Tapez tout ou partie du nom ou du prénom de la personne que vous recherchez"); // On demande à l'utilisateur de taper la chaîne qu'il souhaite recherche
	var find1 = stringsCompare (searchString, searchTool, "nom"); // Lance la recherche en passant en paramètres la chaîne de l'utilisateur, le nom du tableau à compléter et la nature de la chaîne + récupérer le nombre d'occurences trouvées
	var find2 = stringsCompare (searchString, searchSurname, "prenom");
	console.log("\nIl y a " + (find1 + find2) + " résultat(s) correspondant(s) à votre requête :"); // Comptabilise le nombre de résultats
	if (find1 > 0) {
		console.log("**** CLASSEMENT PAR NOM DE FAMILLE ****");
	}
	for (i=0; i < searchTool.length; i++) { // Affiche les objets contenus dans le tableau temporaire searchTool
		console.log(searchTool[i]);
	}
	if (find2 > 0) {
		console.log("******** CLASSEMENT PAR PRENOM ********");
	}
	for (i=0; i < searchSurname.length; i++) { // Affiche les objets contenus dans le tableau temporaire searchSurname
		console.log(searchSurname[i]);
	}
	console.log("\n");
}

function stringsCompare (searchElement, tableauTemp, target) { // Fonction de comparaison des chaînes
	var counter = 0; // Compteur du nombre de résultats
	for (i=0; i < contacts.length; i++) { // Parcourt le tableau contacts
		var match1 = ""; 
		var match2 = ""; 
		if (target === "nom") { // Définit la nature de la propriété à comparer
			var compareString = contacts[i].nom;
		} else { 
			var compareString = contacts[i].prenom;
		}
		var iteration = Math.min(searchElement.length, compareString.length); // Initialise le nombre de tours à faire dans la boucle
		for (a=0; a < iteration; a++) { // recompose les chaînes à la bonne taille et les mets en minuscule
			match1 = match1 + (searchElement[a]).toLowerCase();
			match2 = match2 + (compareString[a]).toLowerCase();
		}
		if ( match1.sansAccent() === match2.sansAccent() ) { // Compare les chaînes
			tableauTemp.push(contacts[i].decrire());
			counter++;
		}
	}
	return counter;
}

String.prototype.sansAccent = function () { // Ajoute la méthode sansAccent() au prototype de l'objet String (donc disponible pour toutes les chaînes). Ce tableau qui utilise des RegEx pour représenter des plages de caractères accentués. Nettement mois fastidieux que je faire un switch.
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var sansAccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
    var chaineSa = this;
    for(var i = 0; i < accent.length; i++){
        chaineSa = chaineSa.replace(accent[i], sansAccent[i]); // utilise la méthode replace () pour remplacer les RegEx par leur équivalent non accentué.
    }
    return chaineSa;
}
/*********************************************** FIN DU SYSTEME DE RECHERCHE *************************************************************/

var contact1 = Object.create(Contact);
contact1.init("Lévisse", "Carole", 1);
contacts.push(contact1);

var contact2 = Object.create(Contact);
contact2.init("Nelsonne", "Mélodie", 2);
contacts.push(contact2);

console.log("Bienvenue dans le gestionnaire de contacts de Secri !\n\n");
commandList ();

var commande;
while (commande !== 0) { // Permet d'afficher en boucle les commandes jusqu'à ce que l'utilisateur choisisse 0. Gère les problèmes de saisie.
	commande = Number(prompt("Choisissez une commande :"));
	if (commande === 0) {
		console.log("\nAu revoir !");
	} else if (commande > 4) { // Lance une alerte si le chiffre saisi ne correspond à aucune commande
		alert("Veuillez sélectionner une commande valide.");
	} else if (commande === 4) {
		if (check > 0) { // vérifie que la variable check n'est pas nulle
			deleteContact ();
			commandList ();
		} else {
		alert("Nous vous conseillons de consulter la liste des contacts au moins une fois avant de procéder à une suppression !");
		}
	} else if (commande === 3) {
		rechercherContact ();
		commandList ();
	} else if (commande === 2) {
		addContact ();
		commandList ();
	} else if (commande === 1) {
		listerContacts ();
		commandList ();
	} else { // Lance une alerte sur la commande saisie n'est pas un chiffre
		alert("Veuillez entrer un chiffre !");
	}
}