import BooleanAlgebraFormula, { FormulaEditor } from "./boolean-algebra.js";

/**
 * @type {FormulaEditor[]}
 */
let formulas = [];
/**
 * @type {HTMLDivElement}
 */
let container;
/**
 * @type {HTMLDivElement}
 */
let addFormula;
/**
 * @type {HTMLDivElement}
 */
let tableContainer;
/**
 * @type {HTMLSelectElement}
 */
let notationSelect;
/**
 * @type {HTMLButtonElement}
 */
let showAllParentheses;
/**
 * @type {HTMLButtonElement}
 */
let showTruthTable;

window.onload = main;
function main()
{
	container = document.querySelector(".container");

	tableContainer = document.querySelector(".truth-table");
	addFormula = document.querySelector(".add");

	notationSelect = document.querySelector("#notation-selection");
	for (let optionName in BooleanAlgebraFormula.NOTATIONS)
	{
		let option = document.createElement("option");
		option.textContent = BooleanAlgebraFormula.NOTATIONS[optionName];
		option.value = BooleanAlgebraFormula.NOTATIONS[optionName];
		notationSelect.appendChild(option);
	}
	notationSelect.onchange = e => updateEditorSettings();
	showAllParentheses = document.querySelector("#show-all-parentheses");
	showAllParentheses.onclick = e =>
	{
		showAllParentheses.classList.toggle("active");
		updateEditorSettings();
	};
	showTruthTable = document.querySelector("#show-truth-table");
	showTruthTable.onclick = e =>
	{
		showTruthTable.classList.toggle("active");
		tableContainer.classList.toggle("show", showTruthTable.classList.contains("active"));
	};
	document.querySelector("#scroll-container").onclick = e =>
	{
		showTruthTable.classList.remove("active");
		tableContainer.classList.remove("show");
	};


	updateFormulas();

	addFormula.onclick = e =>
	{
		let url = getStateParams() + ",";
		window.history.pushState({}, "Boolean algebra", url);
		updateFormulas();
	};
}

function updateFormulas()
{
	let formulaStrings = [""];
	let searchParams = new URL(location.href).searchParams;
	let formulasString = searchParams.get("formulas");
	if (formulasString)
		formulaStrings = formulasString.split(",").map(v => decodeURIComponent(atob(v)));
	loadFormulas(formulaStrings);
}

function getStateParams(f = formulas)
{
	let formulaStrings = f.map(formula => formula.inputElement.value);
	let url = "?formulas=" + formulaStrings.map(v => btoa(encodeURIComponent(v))).join(",");
	return url;
}

let updateTimeout;
let ignoreUpdates = false;
function onupdate(e)
{
	if (updateTimeout)
		clearTimeout(updateTimeout);
	updateTimeout = setTimeout(() =>
	{
		updateTable();
		if (ignoreUpdates)
			return;
		let url = getStateParams();
		if (location.href.endsWith(url))
			return;
		window.history.pushState({}, "Boolean algebra", url);
		updateTimeout = undefined;
	}, 500);
}

function updateTable()
{
	tableContainer.innerHTML = "";
	tableContainer.appendChild(BooleanAlgebraFormula.createTableOfFormulas(formulas.map(editor => editor.formula).filter(f => f), notationSelect.value));
}

function updateEditorSettings()
{
	ignoreUpdates = true;
	for (let editor of formulas)
	{
		editor.displayNotation = notationSelect.value;
		editor.showAllParentheses = showAllParentheses.classList.contains("active");
		editor.update();
	}
	ignoreUpdates = false;
	onupdate({ vlaid: true });
}

function onclose(target)
{
	let index = formulas.indexOf(target);
	if (index >= 0)
	{
		let url = getStateParams(formulas.filter(f => f !== target));
		window.history.pushState({}, "Boolean algebra", url);
		updateFormulas();
	}
}

function loadFormulas(formulaStrings)
{
	ignoreUpdates = true;
	for (let i = 0; i < formulaStrings.length; i++)
	{
		if (formulas[i])
		{
			formulas[i].inputElement.value = formulaStrings[i];
			formulas[i].update();
		}
		else
		{
			formulas[i] = new FormulaEditor(formulaStrings[i], showAllParentheses.classList.contains("active"), notationSelect.value, `Formula ${i}`);
			container.insertBefore(formulas[i].element, addFormula);
			formulas[i].on("updated", onupdate);
			formulas[i].on("close", onclose);
		}
	}
	while (formulas.length > formulaStrings.length)
	{
		let formula = formulas.pop();
		cleanup(formula);
	}
	ignoreUpdates = false;
	updateTable();
}

function cleanup(editor)
{
	editor.removeListener("updated", onupdate);
	editor.removeListener("close", onclose);
	container.removeChild(editor.element);
}

window.onpopstate = e =>
{
	updateFormulas();
	updateEditorSettings();
};