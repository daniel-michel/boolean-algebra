import { FormulaEditor } from "./boolean-algebra.js";

window.onload = main;
function main()
{
	// new FormulaEditor(document.body, "A => B EQUALS not C & D || E != F and true or false");
	new FormulaEditor(document.body, "A & B | C");
	new FormulaEditor(document.body, "A & B | C");
}