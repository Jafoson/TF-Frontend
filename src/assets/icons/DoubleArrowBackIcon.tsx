import * as React from "react";
import { SVGProps } from "react";
const  DoubleArrowBackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={25}
    height={24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.59 6L19 7.41L14.42 12L19 16.59L17.59 18L11.59 12L17.59 6Z"
      fill="currentColor"
    />
    <path
      d="M11.59 6L13 7.41L8.42 12L13 16.59L11.59 18L5.59 12L11.59 6Z"
      fill="currentColor"
    />
  </svg>
);
  export default DoubleArrowBackIcon;
