import { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Link, IconButton, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export var historyGoback: Function = () => {};

interface Props {
  onClick?: Function;
  disableHistoryBack?: boolean;
  color?: string;
}

export const BackButton = (props: Props) => {
  const matches = useMediaQuery("(max-width:335px)");
  let navigate = useNavigate();
  useEffect(() => {
    historyGoback = () => navigate(-1);
  }, [history]);
  return (
    <Link
      id="backBUTTON"
      onClick={() => {
        if (!props.disableHistoryBack) navigate(-1);
        if (props.onClick instanceof Function) props.onClick();
      }}
    >
      <IconButton
        size={matches ? "small" : "medium"}
        style={{ padding: 0, color: props?.color ?? "white" }}
      >
        <ArrowBack />
      </IconButton>
    </Link>
  );
};

BackButton.propTypes = {
  onClick: PropTypes.func,
  disableHistoryBack: PropTypes.bool,
  color: PropTypes.string,
};
