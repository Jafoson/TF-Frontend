import * as React from "react";
import { SVGProps } from "react";
const SortIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M2 10H6V18.92L8.01 18.95V10H12L7 5L2 10Z" fill="currentColor" />
    <path
      d="M12 13.95H16V5.02995L18.01 4.99995V13.95H22L17 18.95L12 13.95Z"
      fill="currentColor"
    />
  </svg>
);
export default SortIcon;
