import React, { Component } from "react";
import Flag from "./Flag";
import PropTypes from "prop-types";
import { onAnimatedScroll, Consumer, SectionContext } from "./utils";

export class Section extends Component {
  static Flag = Flag;
  static propTypes = {
    onRef: PropTypes.func.isRequired
  };
  flagsNode = {};
  flagsRef = {};

  componentDidMount() {
    if (!this.props.onRef) {
      throw new Error(
        `<Section onRef={ref => (this.section = ref)}/>
                            ^
                            onRef must be provided
        `
      );
    }
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

  inViewFlag = props => {
    let ignoreFlag = [];
    let offSetTop = 0;
    if (props && props.ignore) {
      ignoreFlag = props.ignore.split(" ");
    }
    if (props && props.offSetTop) {
      offSetTop = props.offSetTop;
    }
    let flags = this.getFlagsPosition();
    const filtered = Object.keys(flags)
      .filter(key => !ignoreFlag.includes(key))
      .reduce((obj, key) => {
        obj[key] = flags[key];
        return obj;
      }, {});

    const flagTop = Object.values(filtered).map((ele, index) => ele.top);
    const neg = flagTop.filter(ele => ele - offSetTop < 0);
    if (neg.length === 0) {
      const indexOfMin = flagTop.indexOf(Math.min(...flagTop));
      return Object.keys(filtered).find((ele, index) => index === indexOfMin);
    }
    if (neg.length === flagTop.length) {
      const indexOfMax = flagTop.indexOf(Math.max(...flagTop));
      return Object.keys(filtered).find((ele, index) => index === indexOfMax);
    } else {
      const indexOfMax = neg.indexOf(Math.max(...neg));
      return Object.keys(filtered).find((ele, index) => index === indexOfMax);
    }
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
