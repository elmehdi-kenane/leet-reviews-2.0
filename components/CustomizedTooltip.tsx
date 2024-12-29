import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

const CustomizedTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#d1d5db",
    color: "#00224D",
    fontSize: 11,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#d1d5db",
  },
}));

export default CustomizedTooltip;
