import styled from "@emotion/styled";
import LogoPng from "../../assets/logo.png";

const Image = styled("img")`
  display: block;
  max-width: 100%;
  height: auto;
`;

export default function Logo() {
  return <Image src={LogoPng} alt="Logo" />;
}
