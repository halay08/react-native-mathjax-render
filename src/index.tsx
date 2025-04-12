import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import React, { useMemo, useState } from 'react'
import { WebView, WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import { DEFAULT_MATH_JAX_OPTIONS, DEFAULT_MATH_JAX_HEIGHT } from './constants'

interface MathJaxProps extends WebViewProps {
  html: string
	width?: number
	height?: number
  mathJaxOptions?: Record<string, any>
	style?: StyleProp<ViewStyle>
	onMessage?: (event: WebViewMessageEvent, width?: number, height?: number) => void
	loader?: React.ReactNode
}

const MathJax = (props: MathJaxProps) => {
	const [loading, setLoading] = useState(true)
  const [height, setHeight] = useState(props.height ?? DEFAULT_MATH_JAX_HEIGHT)
	const [width, setWidth] = useState(props.width ?? Dimensions.get('window').width)

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (isFinite(Number(data.height))) {
      setHeight(Number(data.height))
    }
		if (isFinite(Number(data.width))) {
			setWidth(Number(data.width))
		}
    props.onMessage?.(event, width, height)
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
					loader={props.loader}
					source={{ html: mathJaxHtml }}
					onLoadStart={() => setLoading(true)}
					onLoadEnd={() => setLoading(false)}
					{...maxJaxProps}
					loading={loading}
				/>
			</View>
  )
}

export default MathJax

const styles = StyleSheet.create({})