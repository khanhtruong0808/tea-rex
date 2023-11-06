import styled from "styled-components";

const SectionTitleStyle = styled.div`
  text-align: center;
  p {
    font-family: "RobotoMono Regular";
    font-size: 2rem;
  }
  h2 {
    font-family: "Montserrat Bold";
    font-size: 6rem;
    text-transform: uppercase;
  }
  @media only screen and (max-width: 768px) {
    text-align: center;
    p {
      font-size: 1.2rem;
    }
    h2 {
      font-size: 3.6rem;
    }
  }
`;

interface SectionTitleProps {
  subheading?: string;
  heading?: string;
}

export default function SectionTitle({
  subheading = "Need Subheading",
  heading = "need heading",
}: SectionTitleProps) {
  return (
    <SectionTitleStyle className="section-title">
      <h2>{heading}</h2>
      <p>{subheading}</p>
    </SectionTitleStyle>
  );
}
