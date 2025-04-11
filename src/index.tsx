import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useMemo, useState } from 'react'
import { WebView } from 'react-native-webview';
import { DEFAULT_MATH_JAX_OPTIONS, DEFAULT_MATH_JAX_HEIGHT } from './constants'

interface MathJaxProps {
  html: string
  mathJaxOptions?: Record<string, any>
	style?: StyleProp<ViewStyle>
}

const MathJax = (props: MathJaxProps) => {
  const [height, setHeight] = useState(DEFAULT_MATH_JAX_HEIGHT)

  const handleMessage = (event: any) => {
    if (isFinite(Number(event.nativeEvent.data))) {
      setHeight(Number(event.nativeEvent.data))
    }
  }

	// Wrap MathJax in a WebView. 
	// This is a workaround to get the height of the MathJax.
  const wrapMathJax = (content: string) => {
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

					document.getElementById("formula").style.visibility = '';
				});
			</script>

			<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"></script>
			<div id="formula" style="visibility: hidden;">
				${content}
			</div>
		`;
	}

	const mathJaxHtml = useMemo(() => wrapMathJax(props.html), [props.html]);
	
	// Create new props without `props.html` field. Since it's deprecated.
	const maxJaxProps = useMemo(() => {
		const { html: _, ...maxJaxProps } = props;
		return maxJaxProps;
	}, [props]);

  return (
    <View style={[props.style, { height }]}>
				<WebView
					scrollEnabled={false}
					onMessage={handleMessage}
					source={{ html: mathJaxHtml }}
					{...maxJaxProps}
				/>
			</View>
  )
}

export default MathJax

const styles = StyleSheet.create({})