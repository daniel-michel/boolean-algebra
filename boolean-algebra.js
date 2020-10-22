
const NOTATIONS = {
	BOOLEAN_ALGEBRA: "Boolean Algebra",
	NUMERCAL_BOOLEAN: "Numerical Boolean Algebra",
	NAMES: "Names",
	PROGRMMING: "Programming",
	PYTHON: "Python",
	JAVASCRIPT: "JavaScript",
	LATEX: "LaTeX",
	HTML: "HTML",
};
const OPERATOR_NAMES = {
	BRACKET_OPEN: "bracket_open",
	BRACKET_CLOSE: "bracket_close",
	IMPLICATION: "implication",
	EQUIVALENCE: "equivalence",
	NOT: "not",
	AND: "and",
	OR: "or",
	XOR: "xor",
	TRUE: "top",
	FALSE: "bottom",
};
const OPERATORS = {
	[OPERATOR_NAMES.IMPLICATION]: { precedence: 0, leftOperand: true, rightOperand: true, func: (a, b) => (a ^ 1) | b },
	[OPERATOR_NAMES.EQUIVALENCE]: { precedence: 0, leftOperand: true, rightOperand: true, func: (a, b) => (a ^ b) ^ 1 },
	[OPERATOR_NAMES.NOT]: { precedence: 4, rightOperand: true, func: (a) => a ^ 1 },
	[OPERATOR_NAMES.AND]: { precedence: 2, leftOperand: true, rightOperand: true, func: (a, b) => a & b },
	[OPERATOR_NAMES.OR]: { precedence: 1, leftOperand: true, rightOperand: true, func: (a, b) => a | b },
	[OPERATOR_NAMES.XOR]: { precedence: 3, leftOperand: true, rightOperand: true, func: (a, b) => a ^ b },
	[OPERATOR_NAMES.TRUE]: { precedence: Infinity, func: () => 1 },
	[OPERATOR_NAMES.FALSE]: { precedence: Infinity, func: () => 0 },
};
const SYMBOL_SETS = {
	[NOTATIONS.BOOLEAN_ALGEBRA]: {
		symbols: {
			[OPERATOR_NAMES.BRACKET_OPEN]: "(",
			[OPERATOR_NAMES.BRACKET_CLOSE]: ")",
			[OPERATOR_NAMES.IMPLICATION]: ["⇒", "=>"],
			[OPERATOR_NAMES.EQUIVALENCE]: ["⇔", "<=>"],
			[OPERATOR_NAMES.NOT]: ["¬", "-"],
			[OPERATOR_NAMES.AND]: "∧",
			[OPERATOR_NAMES.OR]: "∨",
			[OPERATOR_NAMES.XOR]: "⊻",
			[OPERATOR_NAMES.TRUE]: "⊤",
			[OPERATOR_NAMES.FALSE]: "⊥",
		},
	},
	[NOTATIONS.NUMERCAL_BOOLEAN]: {
		fallback: NOTATIONS.BOOLEAN_ALGEBRA,
		symbols: {//[OPERATOR_NAMES.IMPLICATION]: ["⇒", "=>"],
			//[OPERATOR_NAMES.EQUIVALENCE]: ["⇔", "<=>"],
			//[OPERATOR_NAMES.NOT]: "¬",
			[OPERATOR_NAMES.AND]: ["·", "*"],
			[OPERATOR_NAMES.OR]: "+",
			[OPERATOR_NAMES.XOR]: "⊕",
			[OPERATOR_NAMES.TRUE]: "1",
			[OPERATOR_NAMES.FALSE]: "0",
		},
	},
	[NOTATIONS.NAMES]: {
		fallback: NOTATIONS.BOOLEAN_ALGEBRA,
		symbols: {
			[OPERATOR_NAMES.IMPLICATION]: "IMPLIES",
			[OPERATOR_NAMES.EQUIVALENCE]: ["EQUALS", "EQUIVALENCE"],
			[OPERATOR_NAMES.NOT]: "NOT",
			[OPERATOR_NAMES.AND]: "AND",
			[OPERATOR_NAMES.OR]: "OR",
			[OPERATOR_NAMES.XOR]: "XOR",
			[OPERATOR_NAMES.TRUE]: ["TRUE", "ONE"],
			[OPERATOR_NAMES.FALSE]: ["FALSE", "ZERO"],
		},
	},
	[NOTATIONS.LATEX]: {
		fallback: NOTATIONS.BOOLEAN_ALGEBRA,
		symbols: {
			[OPERATOR_NAMES.IMPLICATION]: ["\\Rightarrow", "\\to", "\\rightarrow", "\\supset", "\\implies"],
			[OPERATOR_NAMES.EQUIVALENCE]: ["\\Leftrightarrow", "\\equiv", "\\leftrightarrow", "\\iff"],
			[OPERATOR_NAMES.NOT]: ["\\lnot", "\\neg", "\\sim"],
			[OPERATOR_NAMES.AND]: ["\\land", "\\wedge", "\\cdot", "\\&"],
			[OPERATOR_NAMES.OR]: ["\\lor", "\\vee", "\\parallel"],
			[OPERATOR_NAMES.XOR]: ["\\veebar", "\\oplus", "\\not\\equiv"],
			[OPERATOR_NAMES.TRUE]: ["\\top"],
			[OPERATOR_NAMES.FALSE]: ["\\bot"],
		},
	},
	[NOTATIONS.PROGRMMING]: {
		fallback: NOTATIONS.BOOLEAN_ALGEBRA,
		symbols: {
			[OPERATOR_NAMES.IMPLICATION]: "<=",
			[OPERATOR_NAMES.EQUIVALENCE]: "==",
			[OPERATOR_NAMES.NOT]: ["!", "not"],
			[OPERATOR_NAMES.AND]: ["&&", "&", "and"],
			[OPERATOR_NAMES.OR]: ["||", "|", "or"],
			[OPERATOR_NAMES.XOR]: ["!=", "^"],
			[OPERATOR_NAMES.TRUE]: "true",
			[OPERATOR_NAMES.FALSE]: "false"
		},
	},
	[NOTATIONS.PYTHON]: {
		fallback: NOTATIONS.PROGRMMING,
		symbols: {
			[OPERATOR_NAMES.NOT]: "not",
			[OPERATOR_NAMES.AND]: "and",
			[OPERATOR_NAMES.OR]: "or",
			[OPERATOR_NAMES.TRUE]: "True",
			[OPERATOR_NAMES.FALSE]: "False"
		},
	},
	[NOTATIONS.JAVASCRIPT]: {
		fallback: NOTATIONS.PROGRMMING,
		symbols: {
			[OPERATOR_NAMES.EQUIVALENCE]: "===",
			[OPERATOR_NAMES.XOR]: "!==",
		},
	},
	[NOTATIONS.HTML]: {
		fallback: NOTATIONS.BOOLEAN_ALGEBRA,
		symbols: {
			[OPERATOR_NAMES.BRACKET_OPEN]: "(",
			[OPERATOR_NAMES.BRACKET_CLOSE]: ")",
			[OPERATOR_NAMES.IMPLICATION]: ["&rArr;", "&rarr;", "&sup;", "&#8658;", "&#8594;", "&#8835;"],
			[OPERATOR_NAMES.EQUIVALENCE]: ["&hArr;", "&equiv;", "&harr;", "&#8660;", "&#8801;", "&#8596;"],
			[OPERATOR_NAMES.NOT]: ["&not;", "&tilde;", "&excl;", "&#172;", "&#732;", "&#33;"],
			[OPERATOR_NAMES.AND]: ["&and;", "&middot;", "&amp;", "&#8743;", "&#183;", "&#38;"],
			[OPERATOR_NAMES.OR]: ["&or;", "&plus;", "&parallel;", "&#8744;", "&#43;", "&#8741;"],
			[OPERATOR_NAMES.XOR]: ["&veebar;", "&oplus;", "&nequiv;", "&#8891;", "&#8853;", "&8802;"],
			[OPERATOR_NAMES.TRUE]: ["&top;", "&#8868;"],
			[OPERATOR_NAMES.FALSE]: ["&perp;", "&#8869;"],
		},
	},
};
const DEFAULT_SYMBOLS = NOTATIONS.BOOLEAN_ALGEBRA;

export default class BooleanAlgebraFormula
{
	/**
	 * 
	 * @param {string} text 
	 */
	constructor(text = "")
	{
		this.formula = BooleanAlgebraFormula.parseText(text);
		this.variables = BooleanAlgebraFormula.getVariables(this.formula);
	}

	get(inputs)
	{
		return BooleanAlgebraFormula.calculateWith(inputs, this.formula);
	}

	getFormulaText(symbolType = NOTATIONS.BOOLEAN_ALGEBRA)
	{
		return BooleanAlgebraFormula.getTextFromFormula(this.formula, SYMBOL_SETS[symbolType]);
	}
	getFormulaElement(symbolType = NOTATIONS.BOOLEAN_ALGEBRA, putAllParentheses = true)
	{
		return BooleanAlgebraFormula.getElementFromFormula(this.formula, SYMBOL_SETS[symbolType], putAllParentheses);
	}
	createTable(symbolType = NOTATIONS.BOOLEAN_ALGEBRA)
	{
		let t = document.createElement("table");
		let table = [];
		let vars = this.variables.sort();
		for (let i = 0; i < 2 ** vars.length; i++)
		{
			let inputs = {};
			for (let j = 0; j < vars.length; j++)
				inputs[vars[j]] = (i >> (vars.length - 1 - j)) & 1;
			table.push({ ...inputs, Output: this.get(inputs) });
		}
		table = [Object.keys(table[0]), ...table.map(row => Object.values(row).map(cell => BooleanAlgebraFormula.getSymbol(cell ? OPERATOR_NAMES.TRUE : OPERATOR_NAMES.FALSE, SYMBOL_SETS[symbolType])))];
		for (let row of table)
		{
			let tr = document.createElement("tr");
			for (let cell of row)
			{
				let td = document.createElement("td");
				td.textContent = cell;
				tr.appendChild(td);
			}
			t.appendChild(tr);
		}
		return t;
	}

	/**
	 * 
	 * @param {BooleanAlgebraFormula[]} formulas 
	 */
	static createTableOfFormulas(formulas, symbolType = NOTATIONS.NUMERCAL_BOOLEAN)
	{
		let variables = [...new Set(formulas.map(formula => formula.variables).flat()).values()];
		let tableArray = [];
		variables.sort();
		for (let i = 0; i < 2 ** variables.length; i++)
		{
			let inputs = {};
			for (let j = 0; j < variables.length; j++)
				inputs[variables[j]] = (i >> (variables.length - 1 - j)) & 1;
			let outputs = {};
			for (let j = 0; j < formulas.length; j++)
				outputs[`O<sub>${j}</sub>`] = formulas[j].get(inputs);
			tableArray.push({ ...inputs, ...outputs });
		}
		tableArray = [Object.keys(tableArray[0]), ...tableArray.map(row => Object.values(row))];


		let table = document.createElement("table");
		for (let row of tableArray)
		{
			let trow = document.createElement("tr");
			for (let i = 0; i < row.length; i++)
			{
				let cell = row[i];
				let tcell = document.createElement("td");
				if (typeof cell === "number")
				{
					tcell.textContent = BooleanAlgebraFormula.getSymbol(cell ? OPERATOR_NAMES.TRUE : OPERATOR_NAMES.FALSE, SYMBOL_SETS[symbolType]);
					tcell.classList.add(cell ? "true" : "false");
				}
				else
				{
					if (i < variables.length)
						tcell.textContent = cell;
					else
						tcell.innerHTML = cell;
				}
				trow.appendChild(tcell);
			}
			table.appendChild(trow);
		}
		return table;
	}

	static calculate(formulaText, inputs)
	{
		let formula = this.parseText(formulaText);
		return this.calculateWith(inputs, formula);
	}

	static calculateWith(inputs, formula)
	{
		if (formula.type === "variable")
			return inputs[formula.name];
		if (formula.type === "operator")
			return OPERATORS[formula.operator].func(...formula.operands.map(operand => this.calculateWith(inputs, operand)));
		throw "Invalid type: " + formula.type;
	}

	static getTextFromFormula(formula, symbolSet = SYMBOL_SETS[DEFAULT_SYMBOLS])
	{
		if (formula.type === "variable")
			return formula.name;
		else if (formula.type === "operator")
		{
			//let symbol = (symbolSet.symbols[formula.operator] ?? SYMBOL_SETS[DEFAULT_SYMBOLS][formula.operator]) ?? " <NO_SYMBOL_FOUND> ";
			let symbol = this.getSymbol(formula.operator, symbolSet);
			let operator = OPERATORS[formula.operator];
			if (symbol instanceof Array)
				symbol = symbol[0];
			return "(" + (operator.leftOperand ? this.getTextFromFormula(formula.operands[0], symbolSet) + " " : "") + symbol + (operator.rightOperand ? (operator.leftOperand || /[\w]/.test(symbol) ? " " : "") + this.getTextFromFormula(formula.operands[operator.leftOperand ? 1 : 0], symbolSet) : "") + ")";
		}
		return "<INVALID_FORMULA>";
	}
	static getElementFromFormula(formula, symbolSet = SYMBOL_SETS[DEFAULT_SYMBOLS], putAllParentheses = true, prevSymbolPrecedence = -Infinity)
	{
		let elem = document.createElement("div");
		if (formula.type === "variable")
		{
			elem.classList.add("variable");
			elem.textContent = formula.name;
		}
		else if (formula.type === "operator")
		{
			let symbol = this.getSymbol(formula.operator, symbolSet);
			let operator = OPERATORS[formula.operator];
			if (symbol instanceof Array)
				symbol = symbol[0];
			let parentheses = (operator.precedence <= prevSymbolPrecedence || putAllParentheses) && (operator.leftOperand || operator.rightOperand) && prevSymbolPrecedence !== -Infinity;
			if (parentheses)
				elem.appendChild(document.createTextNode("("));
			if (operator.leftOperand)
			{
				elem.appendChild(this.getElementFromFormula(formula.operands[0], symbolSet, putAllParentheses, operator.precedence));
				elem.appendChild(document.createTextNode(" "));
			}
			let operatorElem = document.createElement("div");
			operatorElem.classList.add("operator");
			operatorElem.textContent = symbol;
			elem.appendChild(operatorElem);
			if (operator.rightOperand)
			{
				if (operator.leftOperand || /[\w]/.test(symbol))
					elem.appendChild(document.createTextNode(" "));
				elem.appendChild(this.getElementFromFormula(formula.operands[operator.leftOperand ? 1 : 0], symbolSet, putAllParentheses, operator.precedence - 0.5));
			}
			if (parentheses)
				elem.appendChild(document.createTextNode(")"));
			//return "(" + (operator.leftOperand ? this.getTextFromFormula(formula.operands[0]) + " " : "") + symbol + (operator.rightOperand ? (operator.leftOperand ? " " : "") + this.getTextFromFormula(formula.operands[operator.leftOperand ? 1 : 0]) : "") + ")";
		}
		else
		{
			elem.textContent = "<INVALID_FORMULA>";
		}
		return elem;
	}

	static getSymbol(operator, symbolSet)
	{
		let symbol = symbolSet.symbols[operator];
		if (symbol)
		{
			if (symbol instanceof Array)
				return symbol[0];
			return symbol;
		}
		if (symbolSet.fallback)
			return this.getSymbol(operator, SYMBOL_SETS[symbolSet.fallback])
		return "<NO_SYMBOL_FOUND>";
	}

	/**
	 * 
	 * @param {{type: "variable" | "operator", name: string, operands: []}} formula 
	 * @returns {string[]}
	 */
	static getVariables(formula)
	{
		if (formula.type === "variable")
			return [formula.name];
		else if (formula.type === "operator")
			return [...new Set(formula.operands.map(operand => this.getVariables(operand)).flat()).values()];
	}

	/**
	 * 
	 * @param {string} text 
	 */
	static parseText(text)
	{
		/**
		 * @type {(string | {type: string, text: string, name?: string})[]}
		 */
		let symbols = [text];
		let index;
		while ((index = symbols.findIndex(symbol => typeof symbol === "string")) >= 0)
		{
			let textSegment = symbols[index];
			symbols.splice(index, 1, ...this.findSymbol(textSegment));
		}
		let bracketTree = [];
		let stack = [];
		stack.push(bracketTree);
		for (let symbol of symbols)
		{
			if (symbol.type === OPERATOR_NAMES.BRACKET_OPEN)
			{
				let elem = [];
				stack[stack.length - 1].push(elem);
				stack.push(elem);
			}
			else if (symbol.type === OPERATOR_NAMES.BRACKET_CLOSE)
			{
				stack.pop();
			}
			else if (symbol.type !== "nothing")
			{
				stack[stack.length - 1].push(symbol);
			}
		}
		let tree = this.resolveToTree(bracketTree);
		return tree;
	}

	static resolveToTree(symbols)
	{
		if (symbols instanceof Array)
		{
			let index = this.getIndexOfOperatorWithLowestPrecedence(symbols);
			if (index >= 0)
			{
				let symbol = symbols[index];
				let operator = OPERATORS[symbol.type];
				let operands = [];
				if (operator.leftOperand)
					operands.push(this.resolveToTree(symbols.slice(0, index)));
				if (operator.rightOperand)
					operands.push(this.resolveToTree(symbols.slice(index + 1, symbols.length)));
				return { type: "operator", operator: symbol.type, operands };
			}
			else if (symbols.length === 1)
				return this.resolveToTree(symbols[0]);
			throw "Invalid symbols";
		}
		else
		{
			return symbols;
		}
	}
	static getIndexOfOperatorWithLowestPrecedence(symbols)
	{
		let lowest;
		for (let i = 0; i < symbols.length; i++)
		{
			let symbol = symbols[i];
			let operator = OPERATORS[symbol.type];
			if (operator && (operator.leftOperand || i === 0) && (operator.rightOperand || i === symbols.length - 1) && (!lowest || operator.precedence < lowest.operator.precedence))
				//           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ this makes sure that operators which only have one operand aren't chosen before operators on the side where they don't have an operand
				lowest = { index: i, symbol, operator: operator }
		}
		return lowest?.index ?? -1;
	}

	/**
	 * 
	 * @param {string} text 
	 * @returns {(string | {type: string, text: string, name?: string})[]}
	 */
	static findSymbol(text)
	{
		let best;
		for (let symbolSetName in SYMBOL_SETS)
		{
			for (let symbolName in SYMBOL_SETS[symbolSetName].symbols)
			{
				let symbolAlias = SYMBOL_SETS[symbolSetName].symbols[symbolName];
				if (!(symbolAlias instanceof Array))
					symbolAlias = [symbolAlias];
				for (let symbol of symbolAlias)
				{
					//let i = text.indexOf(symbol);
					let i = text.search(new RegExp(`(?:(?<!\\w)|(?!\\w))` + symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + `(?:(?<!\\w)|(?!\\w))`));
					if (i >= 0)
					{
						let result = {
							type: symbolName,
							text: text.substr(i, symbol.length)
						};
						if (!best || result.text.length > best.result.text.length)
							best = { i, result };
						//return [text.substring(0, i), result, text.substring(i + symbol.length, text.length)].filter(v => v);
					}
				}
			}
		}
		if (best)
			return [text.substring(0, best.i), best.result, text.substring(best.i + best.result.text.length, text.length)].filter(v => v);
		return [{ type: text.trim() ? "variable" : "nothing", name: text.trim(), text }];
	}

	static get NOTATIONS()
	{
		return NOTATIONS;
	}
	static get SYMBOL_SETS()
	{
		return SYMBOL_SETS;
	}
}

export class FormulaEditor
{
	/**
	 * 
	 * @param {string} formula 
	 */
	constructor(formula = "", showAllParentheses = true, displayNotation = NOTATIONS.BOOLEAN_ALGEBRA, name = "Formula")
	{
		this.element = document.createElement("div");
		this.element.classList.add("formula-editor");

		this.formula;
		this.showAllParentheses = showAllParentheses;
		this.displayNotation = displayNotation;

		this.element.appendChild(document.createTextNode(name + ":"));

		this.closeButton = document.createElement("button");
		this.closeButton.classList.add("close");
		this.closeButton.textContent = "+";
		this.closeButton.onclick = e => this.fireEvent("close", this);
		this.element.appendChild(this.closeButton);

		this.inputElement = document.createElement("input");
		this.inputElement.classList.add("formula", "formula-input");
		this.inputElement.setAttribute("type", "text");
		this.inputElement.setAttribute("spellcheck", "false");
		this.inputElement.value = formula;
		this.element.appendChild(this.inputElement);
		this.interpretation = document.createElement("div");
		this.interpretation.classList.add("formula", "formula-interpretation");
		this.element.appendChild(this.interpretation);

		this.events = {};

		this.inputElement.oninput = () =>
		{
			this.update();
		};
		this.update();
		//editor = new FormulaEditor(element, formula);
	}
	on(type, callback)
	{
		if (!this.events[type])
			this.events[type] = [];
		this.events[type].push(callback);
	}
	removeListener(type, callback)
	{
		if (this.events[type])
		{
			let index = this.events[type].indexOf(callback);
			if (index >= 0)
				this.events[type].splice(index, 1);
		}
	}
	fireEvent(type, ...args)
	{
		if (this.events[type])
			this.events[type].forEach(callback => callback(...args));
	}

	update()
	{
		this.interpretation.innerHTML = "";
		try
		{
			this.formula = new BooleanAlgebraFormula(this.inputElement.value);
			// formula.variables.sort();
			let table = [];
			for (let i = 0; i < 2 ** this.formula.variables.length; i++)
			{
				let inputs = {};
				for (let j = 0; j < this.formula.variables.length; j++)
					inputs[this.formula.variables[j]] = (i >> (this.formula.variables.length - 1 - j)) & 1;
				table.push({ ...inputs, Output: this.formula.get(inputs) });
			}
			// interpretation.textContent = this.formula.getFormulaText(select.value);
			this.interpretation.appendChild(this.formula.getFormulaElement(this.displayNotation, this.showAllParentheses));
			// this.tableContainer.appendChild(this.formula.createTable(this.select.value));
			this.valid = true;
		}
		catch (e)
		{
			this.interpretation.textContent = "Invalid formula";
			this.valid = false;
		}
		this.fireEvent("updated", { valid: this.valid });
		//console.log(BooleanAlgebraFormula.calculate(element.value, { A: 1, B: 0, C: 1, D: 0 }));
	}
}