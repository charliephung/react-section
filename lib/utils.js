import React from "react";
import * as Scroll from "react-scroll";

export const onAnimatedScroll = (offsetHeight, duration = 500) => {
  Scroll.animateScroll.scrollTo(offsetHeight, {
    duration
  });
};

export async function loadLazyComponent(fn, props) {
  const { default: Component } = await fn();
  return () => <Component {...props} />;
}
