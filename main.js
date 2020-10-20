import BooleanAlgebraFormula, { FormulaEditor } from "./boolean-algebra.js";

//let formula = new BooleanAlgebraFormula("((B => C) || A) => (A == B)");
let editor;

window.onload = main;
function main()
{
	document.body.appendChild(document.createTextNode("Display symbol type: "));
	let select = document.createElement("select");
	for (let optionName in BooleanAlgebraFormula.TYPES)
	{
		let option = document.createElement("option");
		option.textContent = BooleanAlgebraFormula.TYPES[optionName];
		option.value = BooleanAlgebraFormula.TYPES[optionName];
		select.appendChild(option);
	}
	document.body.appendChild(select);
	select.onchange = e => {
		update();
	};
	document.body.appendChild(document.createElement("br"));

	let element = document.createElement("input");
	element.classList.add("formula");
	document.body.appendChild(element);
	element.setAttribute("type", "text");
	element.setAttribute("spellcheck", "false");
	element.value = "A => B EQUALS not C & D || E != F and true or false";
	let interpretation = document.createElement("div");
	document.body.appendChild(document.createTextNode(" is interpreted as: "));
	interpretation.classList.add("formula");
	document.body.appendChild(interpretation);
	let update = () =>
	{
		console.clear();
		try
		{
			let formula = new BooleanAlgebraFormula(element.value);
			// formula.variables.sort();
			let table = [];
			for (let i = 0; i < 2 ** formula.variables.length; i++)
			{
				let inputs = {};
				for (let j = 0; j < formula.variables.length; j++)
					inputs[formula.variables[j]] = (i >> (formula.variables.length - 1 - j)) & 1;
				table.push({ ...inputs, Output: formula.get(inputs) });
			}
			console.table(table);
			interpretation.innerHTML = "";
			//interpretation.textContent = formula.getFormulaText(select.value);
			interpretation.appendChild(formula.getFormulaElement(select.value));
		}
		catch (e)
		{
			interpretation.textContent = "Invalid formula";
		}
		//console.log(BooleanAlgebraFormula.calculate(element.value, { A: 1, B: 0, C: 1, D: 0 }));
	};
	element.oninput = () =>
	{
		update();
	};
	update();
	//editor = new FormulaEditor(element, formula);
}