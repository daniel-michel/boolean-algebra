import BooleanAlgebraFormula, { FormulaEditor } from "./boolean-algebra.js";

let editor;
window.onload = main;
function main()
{
	// editor = new FormulaEditor(document.body, "A => B EQUALS not C & D || E != F and true or false");
	editor = new FormulaEditor(document.body, "A & B | C");
	editor = new FormulaEditor(document.body, "A & B | C");
}