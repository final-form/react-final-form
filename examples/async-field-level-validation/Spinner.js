import styled, { keyframes } from "styled-components";

const rotation = keyframes`
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(359deg);
    }
`;
export default styled.div`
  height: 12px;
  width: 12px;
  margin-left: 5px;
  position: absolute;
  right: 0;
  top: 0;
  animation: ${rotation} 0.6s infinite linear;
  border-left: 6px solid rgba(0, 174, 239, 0.15);
  border-right: 6px solid rgba(0, 174, 239, 0.15);
  border-bottom: 6px solid rgba(0, 174, 239, 0.15);
  border-top: 6px solid rgba(0, 174, 239, 0.8);
  border-radius: 100%;
`;
