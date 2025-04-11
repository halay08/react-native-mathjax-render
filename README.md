# React Native LateX Render

[![Release NPM package](https://github.com/halay08/react-native-mathjax-render/actions/workflows/release.yml/badge.svg)](https://github.com/halay08/react-native-mathjax-render/actions/workflows/release.yml)
[![npm version](https://badge.fury.io/js/npm.svg)](https://badge.fury.io/js/angular2-expandable-list)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Render mathematical notation written in LaTeX or MathML markup in React Native Webview with auto height adjustment. This repository is forked and customized from the [react-native-mathjax](https://github.com/calvinkei/react-native-mathjax) repository.

Thanks to [Calvin Kei](https://github.com/calvinkei) for building the base code.

# Installation

1. `yarn add react-native-mathjax-render` or `npm install react-native-mathjax-render --save`
2. Install [react-native-webview](https://www.npmjs.com/package/react-native-webview)

# Usage

```javascript
<MathJax
  // HTML content with MathJax support
  html={
    "$sum_{i=0}^n i^2 = \frac{(n^2+n)(2n+1)}{6}$<br><p>This is an equation</p>"
  }
  // MathJax config option
  mathJaxOptions={{
    messageStyle: "none",
    extensions: ["tex2jax.js"],
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"],
      ],
      processEscapes: true,
    },
    TeX: {
      extensions: [
        "AMSmath.js",
        "AMSsymbols.js",
        "noErrors.js",
        "noUndefined.js",
      ],
    },
  }}
  {...WebViewProps}
/>
```

If you need to subscribe the dimensions (width, height) of the webview, you can use `onMessage` props. See the example below:

```tsx
const handleMessage = (event: any) => {
  try {
    const data = JSON.parse(event.nativeEvent.data)
    if (data.height && data.height > 0) {
      setHeight(data.height)
    }
    if (data.width && data.width > 0) {
      setWidth(data.width)
    }
  } catch (error) {
    console.error('Failed to parse message:', error, 'Raw data:', event.nativeEvent.data)
  }
}

<View style={styles.container}>
  <MathJax
    style={{
      height: height || 85,
      width: width || Dimensions.get('window').width,
      maxWidth: '100%',
      backgroundColor: 'transparent',
    }}
    onMessage={handleMessage}
    mathJaxOptions={mmlOptions}
    html={htmlContent}
  />
</View>
```
