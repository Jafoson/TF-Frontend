import * as React from "react";
import { SVGProps } from "react";
const ALoadingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width	}
    height={props.height}
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={18} cy={12} r={0} fill="currentColor">
      <animate
        attributeName="r"
        begin={0.67}
        calcMode="spline"
        dur="1.5s"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
        repeatCount="indefinite"
        values="0;2;0;0"
      />
    </circle>
    <circle cx={12} cy={12} r={0} fill="currentColor">
      <animate
        attributeName="r"
        begin={0.33}
        calcMode="spline"
        dur="1.5s"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
        repeatCount="indefinite"
        values="0;2;0;0"
      />
    </circle>
    <circle cx={6} cy={12} r={0} fill="currentColor">
      <animate
        attributeName="r"
        begin={0}
        calcMode="spline"
        dur="1.5s"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
        repeatCount="indefinite"
        values="0;2;0;0"
      />
    </circle>
  </svg>
);
export default ALoadingIcon;