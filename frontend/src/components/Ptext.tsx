import React from "react";
import styled from "styled-components";

const PStyle = styled.div`
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.3em;
`;

interface PTextProps {
  children: React.ReactNode;
}

export default function PText({ children }: PTextProps) {
  return (
    <PStyle className="para">
      <p className="text-lg">{children}</p>
    </PStyle>
  );
}
