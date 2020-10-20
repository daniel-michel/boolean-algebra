import BooleanAlgebraFormula, { FormulaEditor } from "./boolean-algebra.js";

//let formula = new BooleanAlgebraFormula("((B => C) || A) => (A == B)");
let editor;

window.onload = main;
function main()
{
	let element = document.createElement("input");
	element.classList.add("formula");
	document.body.appendChild(element);
	element.setAttribute("type", "text");
	element.setAttribute("spellcheck", "false");
	element.value = "((B => C) || A) => (A == B)";
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
			interpretation.textContent = formula.getFormulaText();
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