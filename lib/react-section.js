import React, { Component } from "react";
import PropTypes from "prop-types";
import { onAnimatedScroll, loadLazyComponent } from "./utils";

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
  state = { Component: null, preStyle: {}, isLoaded: false };
  node = React.createRef();
  static propTypes = {
    lazyLoad: PropTypes.shape({
      delay: PropTypes.number,
      loading: PropTypes.func,
      loaded: PropTypes.func.isRequired,
      loadOnView: PropTypes.bool,
      preStyle: PropTypes.object,
      preClassName: PropTypes.string
    }),
    flagName: PropTypes.string.isRequired,
    className: PropTypes.string
  };
  componentWillMount() {
    if (this.props.lazyLoad) {
      const { loading = null, preStyle = {} } = this.props.lazyLoad;
      this.setState({
        Component: loading,
        preStyle
      });
    }
  }
  componentDidMount() {
    if (this.props.lazyLoad) {
      window.addEventListener("scroll", this.onScroll);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.lazyLoad) {
      const { isLoaded } = this.state;
      const { delay = 0, loaded, loadedProps, loadOnView } = nextProps.lazyLoad;
      //   if comp is not loaded => load comp then add props
      if (!loadOnView && !isLoaded) {
        loadLazyComponent(loaded, loadedProps).then(res => {
          setTimeout(() => {
            this.setState({ Component: res, preStyle: {}, isLoaded: true });
          }, delay);
          window.removeEventListener("scroll", this.onScroll);
        });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }
  onScroll = () => {
    const { top } = this.node.current.getBoundingClientRect();
    const { fromBottom = 0 } = this.props.lazyLoad;
    if (top - window.innerHeight + fromBottom < 0) {
      const { delay = 0, loaded, loadedProps } = this.props.lazyLoad;
      loadLazyComponent(loaded, loadedProps).then(res => {
        setTimeout(() => {
          this.setState({ Component: res, preStyle: {}, isLoaded: true });
        }, delay);
        window.removeEventListener("scroll", this.onScroll);
      });
    }
  };

  render() {
    const {
      children,
      flagName,
      lazyLoad = {},
      style,
      className,
      ...rest
    } = this.props;
    const { Component, preStyle, preClassName } = this.state;
    const lazy = Object.keys(lazyLoad).length !== 0;
    if (lazy && children) {
      throw new Error(
        "Children will not be render if lazyLoad props is provided"
      );
    }
    return (
      <Consumer>
        {value => {
          value.onRef(this);
          return (
            <div
              style={preStyle ? preStyle : style}
              className={preClassName ? preClassName : className}
              {...rest}
              ref={this.node}
            >
              {!lazy && children}
              {lazy && Component && <Component />}
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
