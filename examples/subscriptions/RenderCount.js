import React from "react";
import styled from "styled-components";

export default function RenderCount() {
  const renders = React.useRef(0);

  return <Circle>{++renders.current}</Circle>;
}

const size = 30;
const Circle = styled.i`
  position: absolute;
  top: 0;
  right: 0;
  font-style: normal;
  text-align: center;
  height: ${size}px;
  width: ${size}px;
  line-height: ${size}px;
  border-radius: ${size / 2}px;
  border: 1px solid #ddd;
  background: #eee;
`;
