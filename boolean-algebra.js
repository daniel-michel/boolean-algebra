
const SYMBOL_TYPES = {
	BOOLEAN_ALGEBRA: "Boolean Algebra",
	NUMERCAL_BOOLEAN: "Numerical Boolean Algebra",
	NAMES: "Names",
	PROGRMMING: "Programming",
	PYTHON: "Python",
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
	[SYMBOL_TYPES.BOOLEAN_ALGEBRA]: {
		symbols: {
			[OPERATOR_NAMES.BRACKET_OPEN]: "(",
			[OPERATOR_NAMES.BRACKET_CLOSE]: ")",
			[OPERATOR_NAMES.IMPLICATION]: ["⇒", "=>"],
			[OPERATOR_NAMES.EQUIVALENCE]: ["⇔", "<=>"],
			[OPERATOR_NAMES.NOT]: ["¬", "-"],
			[OPERATOR_NAMES.AND]: "∧",
			[OPERATOR_NAMES.OR]: "∨",
			[OPERATOR_NAMES.XOR]: "⊕",
			[OPERATOR_NAMES.TRUE]: "⊤",
			[OPERATOR_NAMES.FALSE]: "⊥",
		},
	},
	[SYMBOL_TYPES.NUMERCAL_BOOLEAN]: {
		fallback: SYMBOL_TYPES.BOOLEAN_ALGEBRA,
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
	[SYMBOL_TYPES.PROGRMMING]: {
		fallback: SYMBOL_TYPES.BOOLEAN_ALGEBRA,
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
	[SYMBOL_TYPES.PYTHON]: {
		fallback: SYMBOL_TYPES.PROGRMMING,
		symbols: {
			[OPERATOR_NAMES.NOT]: "not",
			[OPERATOR_NAMES.AND]: "and",
			[OPERATOR_NAMES.OR]: "or",
			[OPERATOR_NAMES.TRUE]: "True",
			[OPERATOR_NAMES.FALSE]: "False"
		},
	},
	[SYMBOL_TYPES.NAMES]: {
		fallback: SYMBOL_TYPES.BOOLEAN_ALGEBRA,
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
};
const DEFAULT_SYMBOLS = SYMBOL_TYPES.BOOLEAN_ALGEBRA;

function getStack()
{
	let array = [];
	return new Proxy(array, {
		get(target, property)
		{
			if (property === "top")
				return target[target.length - 1];
			if (!isNaN(+property))
				return target[((+property) % target.length + target.length) % target.length];
			return Reflect.get(...arguments);
		},
		set(target, property, value)
		{
			if (property === "top")
			{
				//target[target.length - 1] = value;
				return this[-1];
			}
			if (!isNaN(+property) && +property < 0)
			{
				target[target.length - +property] = value;
				return true;
			}
			return Reflect.set(...arguments);
		}
	});
}

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
		console.log(this.formula, this.variables);
	}

	get(inputs)
	{
		return BooleanAlgebraFormula.calculateWith(inputs, this.formula);
	}

	getFormulaText(symbolType = SYMBOL_TYPES.BOOLEAN_ALGEBRA)
	{
		return BooleanAlgebraFormula.getTextFromFormula(this.formula, SYMBOL_SETS[symbolType]);
	}
	getFormulaElement(symbolType = SYMBOL_TYPES.BOOLEAN_ALGEBRA)
	{
		return BooleanAlgebraFormula.getElementFromFormula(this.formula, SYMBOL_SETS[symbolType]);
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
	static getElementFromFormula(formula, symbolSet = SYMBOL_SETS[DEFAULT_SYMBOLS])
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
			elem.appendChild(document.createTextNode("("));
			if (operator.leftOperand)
			{
				elem.appendChild(this.getElementFromFormula(formula.operands[0], symbolSet));
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
				elem.appendChild(this.getElementFromFormula(formula.operands[operator.leftOperand ? 1 : 0], symbolSet));
			}
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
			return symbol;
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
		let symbols = [text];
		let index;
		while ((index = symbols.findIndex(symbol => typeof symbol === "string")) >= 0)
		{
			let textSegment = symbols[index];
			symbols.splice(index, 1, ...this.findSymbol(textSegment));
		}
		let bracketTree = [];
		let stack = getStack();
		stack.push(bracketTree);
		for (let symbol of symbols)
		{
			if (symbol.type === OPERATOR_NAMES.BRACKET_OPEN)
			{
				let elem = [];
				stack.top.push(elem);
				stack.push(elem);
			}
			else if (symbol.type === OPERATOR_NAMES.BRACKET_CLOSE)
			{
				stack.pop();
			}
			else if (symbol.type !== "nothing")
			{
				stack.top.push(symbol);
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
			if (operator && (operator.leftOperand || i === 0) && (!lowest || operator.precedence <= lowest.operator.precedence))
				//           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ this makes sure that operators which only have one operand aren't chosen before operators left of them
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

	static get TYPES()
	{
		return SYMBOL_TYPES;
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
	 * @param {HTMLElement} element 
	 * @param {BooleanAlgebraFormula} formula 
	 */
	constructor(element, formula = new BooleanAlgebraFormula())
	{
		this.element = element;
		this.element.setAttribute("tabIndex", "0");
		this.formula = formula;
	}
}