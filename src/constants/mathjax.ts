export const DEFAULT_MATH_JAX_OPTIONS = {
	messageStyle: 'none',
	extensions: ['tex2jax.js'],
	jax: ['input/TeX', 'output/HTML-CSS'],
	tex2jax: {
		inlineMath: [['$', '$'], ['\\(', '\\)']],
		displayMath: [['$$', '$$'], ['\\[', '\\]']],
		processEscapes: true,
	},
	TeX: {
		extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
	}
};

export const DEFAULT_MATH_JAX_HEIGHT = 85
