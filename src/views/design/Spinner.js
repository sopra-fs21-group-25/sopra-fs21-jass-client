import React from "react";
import "./spinner.css";

export const Spinner = props => {
  return (
    <div className={"lds-ellipsis" + props.black ? ' black-theme' : ''}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
