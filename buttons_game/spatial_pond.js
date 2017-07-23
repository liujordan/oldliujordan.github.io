//toggle visibility of an instance's children
function Toggle(instanceId) {
	x = document.getElementById("container" + instanceId);
	instance = Instances[instanceId]; //the instance to toggle

	//if the instance is not grown, grow and list it
	if (instance.grown == false) {
		instance.Grow();
		instance.List();
	}

	//check the current display state of the instance and toggle its display
	if (instance.display) {
		document.getElementById("arrow" + instanceId).innerHTML = "+";
		// x.style.display = "none";
		$(x).slideToggle();
		instance.display = false;
		console.log("toggled container" + instanceId + " off");
	} else {
		document.getElementById("arrow" + instanceId).innerHTML = "-";
		// x.style.display = "block";
		$(x).slideToggle();
		instance.display = true;
		console.log("toggled container" + instanceId + " on");
	}
}

//choose random number between min and max
function Choose(min, max) {
		min = Math.ceil(min);
  	max = Math.ceil(max);
  	return Math.floor(Math.random() * (max - min + 1)) + min; //number between min and max inclusive
}

//types of things defined as ponds
//TODO generate and display names based on namegen
var Ponds = [];
var iP = 0;
function Pond(name, contains, namegen) {
	this.name = name;					//name of this type
	this.contains = contains;	//children of this type
	if (this.contains == undefined) {
		this.contains = [];
	}
	this.namegen = namegen;		//possible names for this type
	if (this.namegen == undefined) {
		this.namegen = [[name]];
	}
	this.id = iP;							//id of the new type
	Ponds[name] = this;				//types are stored in the dictionary as this.name:this
	iP++;
	console.log("added "+this.name);
}

//for debugging
Pond.prototype.toString = function() {
	return this.name;
}

//Instances of types to keep track of children, visibility etc
var Instances = [];	//a list of all instances created
var iI = 0;	//number of instances
function Instance(type) {
	this.type = Ponds[type];//type of this instance
	this.name = "pond";			//default name
	this.id = iI;						//id of this instance
	iI++;
	this.grown = false;			//if this has generated children before
	this.children = [];			//the list of generated children
	this.display = false;		//visibility in html document
	//add new instance to list of instances
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
			var toMake = instr[0];	//type of this child

			//How many to make
			var toMakeNum = 0;			//number of children of the same type
			if (instr[1] == undefined) {
				//Make one if not stated
				toMakeNum = 1;
			} else {
				//check if it's a percentage value and set makenum = 1 by percent chance
				 if (instr[1].indexOf('%') > -1) {
					var numInstr = instr[1].split("%");
					toMakeNum = (Choose(1,100) < numInstr[0]) ? 1 : 0;
				//check if it's a range and set namenuk to a value between the range
				} else {
					var numInstr = instr[1].split("-");
					//if there is no second value in the range then just make the stated amount
				 	if (numInstr[1] == undefined) {
						toMakeNum = parseFloat(numInstr[0]); //Make the stated amount since it's not a range
					//if there is a second value then make a random amount within that range
					} else {
						toMakeNum = Choose(parseFloat(numInstr[0]), parseFloat(numInstr[1])); //Choose amount to make in the range incusive
					}
				}
			}

			//Make makenum amount of the current type
			for(var i = 0; i < toMakeNum; i++) {
				var New = Make(toMake);	//make a new instance of the type
				New.name = "";
				//build the name
				for (var j = 0; j < New.type.namegen.length; j++) {
					New.name += New.type.namegen[j][Choose(0, New.type.namegen[j].length - 1)];
				}
				//TODO parse namegen and set the name of New.name accordingly
				this.children.push(New);				//add the child to this instance's list of children
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
	style = 'style="display: none;"';
	for (var c in this.children) {
		child = this.children[c];
		console.log("listing: current child " + child);
		containerStr += '<div id="div'+child.id+'" class="pond">' + //div holds dropdown click and children container
			'<p><a href="javascript:Toggle('+child.id+')" id="arrow'+child.id+'" class="button">+</a>'+child.name+'</p>' + //a holds clickable and name of this instance
			'<div id="container'+child.id+'"'+style+'></div>' + //div container for this children
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

function startPond(startType) {
	if (Ponds[startType] == undefined)
		startType = "Pond";
	var Seed = new Make(startType);
	Seed.Grow();
	Seed.List();
}

//shwos all current instances
function showInstances() {
	document.getElementById("instances").innerHTML = "Instances: " + Instances;
	console.log(Instances);
}

//shows all types available
function showPonds() {
	var str = "";
	for (var c in Ponds) {
		str += Ponds[c] + ", ";
	}
	document.getElementById("ponds").innerHTML = "Types: "+ str;
	console.log(Ponds);
}
