
const SYMBOL_TYPES = {
	BOOLEAN_ALGEBRA: "boolean_algebra",
	BOOLEAN: "boolean",
	PROGRMMING: "programming",
	NAMES: "names",
};
Object.freeze(SYMBOL_TYPES);
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
	ANY: "any",
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
}
const SYMBOL_SETS = {
	[SYMBOL_TYPES.BOOLEAN_ALGEBRA]: {
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
		[OPERATOR_NAMES.ANY]: "∀",
	},
	[SYMBOL_TYPES.BOOLEAN]: {
		//[OPERATOR_NAMES.IMPLICATION]: ["⇒", "=>"],
		//[OPERATOR_NAMES.EQUIVALENCE]: ["⇔", "<=>"],
		//[OPERATOR_NAMES.NOT]: "¬",
		[OPERATOR_NAMES.AND]: ["·", "*"],
		[OPERATOR_NAMES.OR]: "+",
		[OPERATOR_NAMES.XOR]: "⊕",
		[OPERATOR_NAMES.TRUE]: "1",
		[OPERATOR_NAMES.FALSE]: "0",
	},
	[SYMBOL_TYPES.PROGRMMING]: {
		[OPERATOR_NAMES.IMPLICATION]: ">=",
		[OPERATOR_NAMES.EQUIVALENCE]: "==",
		[OPERATOR_NAMES.NOT]: ["!", "not"],
		[OPERATOR_NAMES.AND]: ["&&", "&", "and"],
		[OPERATOR_NAMES.OR]: ["||", "|", "or"],
		[OPERATOR_NAMES.XOR]: "!=",
		[OPERATOR_NAMES.TRUE]: ["true", "True"],
		[OPERATOR_NAMES.FALSE]: ["false", "False"]
	},
	[SYMBOL_TYPES.NAMES]: {
		[OPERATOR_NAMES.IMPLICATION]: "IMPLICATION",
		[OPERATOR_NAMES.EQUIVALENCE]: ["EQUAL", "EQUIVALENCE"],
		[OPERATOR_NAMES.NOT]: "NOT",
		[OPERATOR_NAMES.AND]: "AND",
		[OPERATOR_NAMES.OR]: "OR",
		[OPERATOR_NAMES.XOR]: "XOR",
		[OPERATOR_NAMES.TRUE]: "TRUE",
		[OPERATOR_NAMES.FALSE]: "FALSE",
	},
};
const DEFAULT_SYMBOLS = SYMBOL_TYPES.BOOLEAN_ALGEBRA;
Object.freeze(SYMBOL_SETS);

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

	getFormulaText()
	{
		return BooleanAlgebraFormula.getTextFromFormula(this.formula);
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
			let symbol = (symbolSet[formula.operator] ?? SYMBOL_SETS[DEFAULT_SYMBOLS][formula.operator]) ?? " <NO_SYMBOL_FOUND> ";
			let operator = OPERATORS[formula.operator];
			if (symbol instanceof Array)
				symbol = symbol[0];
			return "(" + (operator.leftOperand ? this.getTextFromFormula(formula.operands[0]) + " " : "") + symbol + (operator.rightOperand ? (operator.leftOperand ? " " : "") + this.getTextFromFormula(formula.operands[operator.leftOperand ? 1 : 0]) : "") + ")";
		}
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
			if (OPERATORS[symbol.type] && (!lowest || OPERATORS[symbol.type].precedence <= lowest.operator.precedence))
				lowest = { index: i, symbol, operator: OPERATORS[symbol.type] }
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
			for (let symbolName in SYMBOL_SETS[symbolSetName])
			{
				let symbolAlias = SYMBOL_SETS[symbolSetName][symbolName];
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