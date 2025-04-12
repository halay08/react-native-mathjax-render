import { StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { WebViewProps, WebViewMessageEvent } from 'react-native-webview';

interface MathJaxProps extends WebViewProps {
    html: string;
    width?: number;
    height?: number;
    mathJaxOptions?: Record<string, any>;
    style?: StyleProp<ViewStyle>;
    onMessage?: (event: WebViewMessageEvent, width?: number, height?: number) => void;
    loader?: React.ReactNode;
}
declare const MathJax: (props: MathJaxProps) => React.JSX.Element;

export { MathJax as default };
