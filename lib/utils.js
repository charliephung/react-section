import React from "react";
import * as Scroll from "react-scroll";

export const onAnimatedScroll = (offsetHeight, duration = 500) => {
  Scroll.animateScroll.scrollTo(offsetHeight, {
    duration
  });
};

export async function loadLazyComponent(fn) {
  const { default: Component } = await fn();
  return Component;
}

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
