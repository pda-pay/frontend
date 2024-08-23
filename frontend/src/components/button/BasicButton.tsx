import React from "react";

import styled from "styled-components";

interface ButtonProps {
  type?: "blue" | "gray";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const StyledButton = styled.button<ButtonProps>`
  width: ${(props) => (props.type === "blue" ? "66%" : "33%")};
  padding: "8px 16px";
  border: none;
  border-radius: 7px;
  font-size: "12px";
  color: white;
  background-color: ${(props) => (props.type === "blue" ? "blue" : "gray")};

  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #f8f8f8;
    cursor: not-allowed;
  }
`;

export default function BasicButton({
  type,
  disabled,
  children,
  onClick,
}: ButtonProps) {
  return (
    <StyledButton type={type} disabled={disabled} onClick={onClick}>
      {children}
    </StyledButton>
  );
}
