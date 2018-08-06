import React, { Component } from "react";
import PropTypes from "prop-types";
import { loadLazyComponent, Consumer, SectionContext } from "./utils";

const SectionConsumer = Consumer(SectionContext);

class Flag extends Component {
  state = { Component: null, isLoaded: false };
  node = React.createRef();
  static propTypes = {
    lazyLoad: PropTypes.shape({
      delay: PropTypes.number,
      loading: PropTypes.func,
      loaded: PropTypes.func.isRequired,
      loadOnView: PropTypes.bool,
      initProps: PropTypes.object,
      preClassName: PropTypes.string
    }),
    flagName: PropTypes.string.isRequired,
    className: PropTypes.string
  };
  componentWillMount() {
    if (this.props.lazyLoad) {
      // If is lazyload add onScroll listener
      window.addEventListener("scroll", this.onScroll);
      const { loading = null } = this.props.lazyLoad;
      this.setState({
        Component: loading
      });
    }
  }
  componentDidMount() {
    if (this.props.lazyLoad) {
      const { delay = 0, loaded, loadOnView } = this.props.lazyLoad;
      // Load component if loadOnVIew is not provided
      if (!loadOnView) {
        loadLazyComponent(loaded).then(res => {
          setTimeout(() => {
            this.setState({
              Component: res,
              isLoaded: true
            });
          }, delay);
          // Remove listner
          window.removeEventListener("scroll", this.onScroll);
        });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }
  onScroll = () => {
    if (this.props.lazyLoad) {
      const {
        loadOnView,
        delay = 0,
        loaded,
        fromBottom = 0
      } = this.props.lazyLoad;
      if (loadOnView) {
        // If loadOnView provided then apply scroll
        // that trigger import when comp is in viewport +  fromBottom
        const { top } = this.node.current.getBoundingClientRect();
        const {} = this.props.lazyLoad;
        if (top - window.innerHeight + fromBottom < 0) {
          loadLazyComponent(loaded).then(res => {
            setTimeout(() => {
              this.setState({
                Component: res,
                isLoaded: true
              });
            }, delay);
            window.removeEventListener("scroll", this.onScroll);
          });
        }
      }
    }
  };

  check = () => {
    // Warn user if provide children when provided lazyload
    const { children, lazyLoad = {} } = this.props;
    const lazy = Object.keys(lazyLoad).length !== 0;
    if (lazy && children) {
      throw new Error(
        "Children will not be render if lazyLoad props is provided"
      );
    }
  };

  render() {
    this.check();
    const { children, flagName, lazyLoad = {}, ...rest } = this.props;
    const { Component, isLoaded } = this.state;
    const lazy = Object.keys(lazyLoad).length !== 0;
    let props = rest;
    // Check if component is lazy load
    if (lazy) {
      // Then apply provided initProps
      // If lazy comp is loaded apply rest props not initProps
      props = !isLoaded ? lazyLoad.initProps : rest;
    }
    // If is lazy then render from lazyload comp else render children
    const ui = !lazy ? children : <Component {...lazyLoad.loadedProps} />;

    return (
      <SectionConsumer>
        {value => {
          value.onRef(this);
          return (
            <div {...props} ref={this.node}>
              {ui}
            </div>
          );
        }}
      </SectionConsumer>
    );
  }
}

export default Flag;
