import React, { Component } from "react";
import * as Scroll from "react-scroll";

const onAnimatedScroll = (offsetHeight, duration = 500) => {
  Scroll.animateScroll.scrollTo(offsetHeight, {
    duration
  });
};

const SectionContext = React.createContext();
const Consumer = props => {
  return (
    <SectionContext.Consumer>
      {contextVal => {
        if (!contextVal) {
          throw new Error("Flag must be render inside Section");
        }
        return props.children(contextVal);
      }}
    </SectionContext.Consumer>
  );
};

class Flag extends Component {
  render() {
    const { children, flagName, ...rest } = this.props;
    return (
      <Consumer>
        {value => {
          value.onRef(this);
          return (
            <div {...rest} ref={(this.node = React.createRef())}>
              {children}
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export class Section extends Component {
  static Flag = Flag;
  flagsNode = {};
  flagsRef = {};

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
      Object.keys(this.flagsRef).forEach((ele, index) => {
        this.flagsNode[ele] = {
          node: this.flagsRef[ele].node.current
        };
      });
    }
  }
  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(undefined);
    }
  }

  getFlagsPosition = () => {
    if (Object.keys(this.flagsNode).length === 0) return {};
    let result = {};
    Object.keys(this.flagsNode).forEach(ele => {
      result[ele] = this.flagsNode[ele].node.getBoundingClientRect();
    });
    return result;
  };
  getFlagsOffSet = () => {
    if (Object.keys(this.flagsNode).length === 0) return {};
    let result = {};
    Object.keys(this.flagsNode).forEach(ele => {
      result[ele] = {
        offsetHeight: this.flagsNode[ele].node.offsetHeight,
        offsetLeft: this.flagsNode[ele].node.offsetLeft,
        offsetTop: this.flagsNode[ele].node.offsetTop,
        offsetWidth: this.flagsNode[ele].node.offsetWidth
      };
    });
    return result;
  };

  scrollToFlag = (flag, top = 0, duration) => {
    try {
      onAnimatedScroll(this.getFlagsOffSet()[flag].offsetTop - top, duration);
      return;
    } catch (error) {
      return null;
    }
  };

  inViewFlag = () => {
    const flags = this.getFlagsPosition();
    const flagTop = Object.values(flags).map((ele, index) => Math.abs(ele.top));
    const indexOfMin = flagTop.indexOf(Math.min(...flagTop));
    return Object.keys(flags).find(
      ele => Math.abs(flags[ele].top) === flagTop[indexOfMin]
    );
  };

  render() {
    return (
      <SectionContext.Provider
        value={{
          onRef: node => {
            if (node.props.flagName === undefined) {
              throw new Error("Flag is missing flagName props");
            }
            this.flagsRef[node.props.flagName] = node;
          }
        }}
      >
        {this.props.children}
      </SectionContext.Provider>
    );
  }
}

export default Section;
