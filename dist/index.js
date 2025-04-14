import { StyleSheet, Dimensions, View } from 'react-native';
import React, { useState, useMemo } from 'react';
import { WebView } from 'react-native-webview';

const DEFAULT_MATH_JAX_OPTIONS = {
  messageStyle: "none",
  extensions: ["tex2jax.js"],
  jax: ["input/TeX", "output/HTML-CSS"],
  tex2jax: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true
  },
  TeX: {
    extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]
  }
};
const DEFAULT_MATH_JAX_HEIGHT = 85;

const MathJax = (props) => {
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(props.height ?? DEFAULT_MATH_JAX_HEIGHT);
  const [width, setWidth] = useState(props.width ?? Dimensions.get("window").width);
  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (isFinite(Number(data.height))) {
      setHeight(Number(data.height));
    }
    if (isFinite(Number(data.width))) {
      setWidth(Number(data.width));
    }
    props.onMessage?.(event, width, height);
  };
  const wrapMathJax = (content) => {
    const options = JSON.stringify(
      Object.assign({}, DEFAULT_MATH_JAX_OPTIONS, props.mathJaxOptions)
    );
    return `
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
			<script type="text/x-mathjax-config">
				MathJax.Hub.Config(${options});

				MathJax.Hub.Queue(function() {
					var height = document.documentElement.scrollHeight;
					var width = document.documentElement.scrollWidth;

					window.ReactNativeWebView.postMessage(JSON.stringify({
						height,
						width
					}));
				});
			<\/script>

			<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"><\/script>
			<div id="formula">
				${content}
			</div>
		`;
  };
  const mathJaxHtml = useMemo(() => wrapMathJax(props.html), [props.html]);
  const maxJaxProps = useMemo(() => {
    const { html: _, ...maxJaxProps2 } = props;
    return maxJaxProps2;
  }, [props]);
  return /* @__PURE__ */ React.createElement(View, { style: [props.style, { height }] }, /* @__PURE__ */ React.createElement(
    WebView,
    {
      scrollEnabled: false,
      onMessage: handleMessage,
      source: { html: mathJaxHtml },
      onLoadStart: () => setLoading(true),
      onLoadEnd: () => setTimeout(() => setLoading(false), 500),
      onLoadProgress: () => setTimeout(() => setLoading(false), 500),
      ...maxJaxProps,
      loading
    }
  ), loading && props.loader);
};
StyleSheet.create({});

export { MathJax as default };
