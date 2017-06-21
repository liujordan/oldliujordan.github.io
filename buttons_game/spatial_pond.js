//toggle visibility of an instance's children
function Toggle(instanceId) {
	x = document.getElementById("container" + instanceId);
	instance = Instances[instanceId]

	//if the instance is not grown, grow and list it
	if (instance.grown == false) {
		instance.Grow();
		instance.List();
	}

	if (instance.display) {
		document.getElementById("arrow" + instanceId).innerHTML = "+";
		x.style.display = "none";
		instance.display = false;
		console.log("toggled container" + instanceId + " off");

	} else {
		document.getElementById("arrow" + instanceId).innerHTML = "-";
		x.style.display = "block";
		instance.display = true;
		console.log("toggled container" + instanceId + " on");
	}
}

//choose random number between min and max
function Choose(min, max) {
	min = Math.ceil(min);
  	max = Math.ceil(max);
  	return Math.floor(Math.random() * (max - min)) + min; //number between min and max inclusive
}

//types of things defined as ponds
//TODO generate and display names based on namegen
var Ponds = [];
var iP = 0;
function Pond(name, contains, namegen) {
	this.name = name;
	this.contains = contains;
	if (this.contains == undefined) {
		this.contains = [];
	}
	this.namegen = namegen;
	if (namegen == undefined) {
		this.namegen = name;
	}
	this.id = iP;
	Ponds[name] = this;
	iP++;
	console.log("added "+this.name);
}
//for debugging
Pond.prototype.toString = function() {
	return this.name;
}

//Instances of types to keep track of children, visibility etc
var Instances = [];
var iI = 0;
function Instance(type) {
	this.name = "pond";
	this.type = Ponds[type];
	this.id = iI;
	iI++;
	this.grown = false;
	this.children = [];
	this.display = false;
	Instances.push(this);
}

//give itself children based on specifications defined in its type
Instance.prototype.Grow = function() {
	console.log("growing " + this.id);
	if (this.grown == false) {
		for (var c in this.type.contains) {
			var instr = this.type.contains[c].split(","); //instruction string in the form "<whattomake>,<min>-<max>(or)<chance>%"
			//eg ["apple pie,2-3"] makes 2 to 3 applie pie children
			//eg ["apple pie,3%"] makes 1 apple pie child at a 3% chance
			//eg ["apple pie,4"] makes 4 apple pie children

			//What to make
			var toMake = instr[0];

			//How many to make
			var toMakeNum = 0;
			if (instr[1] == undefined) {
				toMakeNum = 1;	//Make one if not stated
			} else {
				//check if it's a percentage value
				 if (instr[1].indexOf('%') > -1) {
					var numInstr = instr[1].split("%");
					toMakeNum = (Choose(1,100) < numInstr[0]) ? 1 : 0;
				//otherwise it is a range
				} else {
					var numInstr = instr[1].split("-");
				 	if (numInstr[1] == undefined) {
						toMakeNum = parseFloat(numInstr[0]); //Make the stated amount since it's not a range
					} else {
						toMakeNum = Choose(parseFloat(numInstr[0]), parseFloat(numInstr[1])); //Choose amount to make in the range incusive
					}
				}
			}

			//Make those things
			for(var i = 0; i < toMakeNum; i++){
				//TODO name things based on namegen
				var New = Make(toMake);
				this.children.push(New);
			}
		}
		//growing is done
		this.grown = true;
	}
}

//Write the html for its children in their respective containers & divs 
Instance.prototype.List = function() {
	container = document.getElementById("container" + this.id);	//the container that holds the children
	containerStr = "";
	for (var c in this.children) {
		child = this.children[c];
		console.log("listing: current child " + child);
		containerStr += '<div id="div'+child.id+'" class="pond">' + //div holds dropdown click and children container
			'<p><a href="javascript:Toggle('+child.id+')" id="arrow'+child.id+'">+</a>'+child.type+'</p>' + //a holds clickable and name of this instance
			'<div id="container'+child.id+'" style="display: none;"></div>' + //div container for this children
			'</div>';
	}
	container.innerHTML = containerStr;
}

//for debugging
Instance.prototype.toString = function() {
	return this.type + " ";
	//return this.name+"("+this.type+")";
}

//create a new instance of type
function Make(type) {
	return new Instance(type);
}

/*All the different things there are
new things can be made by adding:
	
	new Pond("name", ["contains this", "or two of this,2, "or 1 to 3 of this,1-3", "or even 50 percent chance of having this,50%"]);

above example will have at least one of the first three items and 50% chance of having the fourth one.
things without children can be made by omitting the second argument

	new Pond("i cant have children");
*/

//the big splash
new Pond("Pond", ["grass,1-2", "water", "fish,1-2", "hole,20%", "seaweed", "ocean monument"]);
//subatomic
new Pond("proton", ["up quark", "down quark"]);
new Pond("up quark", ["qwubble"]);
new Pond("down quark", ["qwubble"]);
new Pond("qwubble", ["Pond"]);
new Pond("neutron");
new Pond("atom",["proton","neutron"]);
new Pond("hydrogen",["atom"]);
new Pond("oxygen",["atom"]);
new Pond("nitrogen",["atom"]);
new Pond("carbon",["atom"]);
new Pond("calcium",["atom"]);
new Pond("helium",["atom"]);
new Pond("neon",["atom"]);
new Pond("silicon",["atom"]);
new Pond("iron",["atom"]);
new Pond("electron", ["interdimentional horror"]);
//spatial bodies
new Pond("universe", ["supercluster,5-10"]);
new Pond("supercluster",["galaxy,4-8"]);
new Pond("galaxy", ["solar system,3-5"]);
new Pond("solar system", ["gas giant,1-2", "habitable planet,1-2", "meteorite,3-4","moon,0-5","star"]);
new Pond("gas giant", ["helium"]);
new Pond("habitable planet", ["Pond"]);
new Pond("moon", ["Pond"]);
new Pond("meteorite",["iron","water"]);
new Pond("star",["hydrogen", "helium","carbon","neon","oxygen","silicon","iron,10%"]);
//chemical compounds
new Pond("water", ["hydrogen", "oxygen,2"]);
new Pond("adenine",["carbon","hydrogen","nitrogen"]);
new Pond("guanine",["carbon","hydrogen","nitrogen", "oxygen"]);
new Pond("cytosine",["carbon","hydrogen","nitrogen","oxygen"]);
new Pond("thymine",["carbon","hydrogen","nitrogen","oxygen"]);
new Pond("uracil",["carbon","hydrogen","nitrogen","oxygen"]);
new Pond("protein", ["carbon", "hydrogen", "oxygen"]);
//basic life
new Pond("DNA", ["adenine", "guanine", "cytosine", "thymine"]);
new Pond("RNA", ["adenine", "guanine", "cytosine", "uracil"]);
new Pond("nucleus", ["DNA"]);
new Pond("ribosome", ["protein"]);
new Pond("cytoplasm",["RNA"]);
new Pond("mitochondria",["protein"]);
new Pond("plant cells", ["nucleus", "ribosome", "cytoplasm", "mitochondria"]);
new Pond("red blood cells", ["protein", "oxygen"]);
new Pond("white blood cells", ["protein"]);
new Pond("virus", ["DNA", "RNA"]);
new Pond("bug", ["exoskeleton"]);
new Pond("grass", ["plant cells", "bug,1-2"]);
new Pond("spine", ["carbon", "calcium"]);
new Pond("ribs", ["carbon", "calcium"]);
new Pond("skull", ["carbon", "calcium"]);
new Pond("flesh", ["protein","red blood cells", "white blood cells", "virus,10%"]);
new Pond("fin", ["carbon", "calcium"]);
new Pond("scales", ["carbon", "calcium"]);
new Pond("exoskeleton", ["carbon", "calcium"]);
new Pond("fish", ["spine", "ribs", "skull", "flesh", "fin", "scales"]);
new Pond("seaweed", ["plant cells"]);
//new worlds
////dwarf
new Pond("hole");
//structures
new Pond("ocean monument");
//TODO add dwarf world
//TODO add namegen for each item
//fictional creatures
new Pond("interdimentional horror", ["gas pouch", "exoskeleton", "flesh", "man", "space ship", "blue star"]);

function startPond(startType) {
	if (Ponds[startType] == undefined)
		startType = "Pond";
	var Seed = new Make(startType);
	Seed.Grow();
	Seed.List();
}

function showInstances() {
	document.getElementById("instances").innerHTML = "Instances: " + Instances;
	console.log(Instances);
}
function showPonds() {
	var str = "";
	for (var c in Ponds) {
		str += Ponds[c] + ", ";
	}
	document.getElementById("ponds").innerHTML = "Types: "+ str;
	console.log(Ponds);
}