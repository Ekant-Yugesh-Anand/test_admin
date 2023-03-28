import { Link as RouterLink } from "react-router-dom";
import Link, { LinkProps } from "@mui/material/Link";

interface LinkRouterProps extends LinkProps {
  to: string | number|object;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link
    {...props}
    sx={{ textDecoration: "none", color: "inherit" }}
    component={RouterLink as any}
  />
);

export default LinkRouter;
