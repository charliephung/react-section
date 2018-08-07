import React from "react";
import { animateScroll } from "react-scroll";

export const onAnimatedScroll = (offsetHeight, duration = 500) => {
  animateScroll.scrollTo(offsetHeight, {
    duration
  });
};

export const loadLazyComponent = fn => {
  return fn().then(res => res.default);
};

export const Consumer = Context => props => (
  <Context.Consumer>
    {contextVal => {
      if (!contextVal) {
        throw new Error("Flag must be render inside Section");
      }
      return props.children(contextVal);
    }}
  </Context.Consumer>
);

export const SectionContext = React.createContext();
