# react-section

### Peer dependencies: "react-scroll": "^1.7.10"

## Example

```javascript
import React, { Component } from "react";
import Section from "react-section";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.section = React.createRef();
  }

  onClick = flag => {
    this.section.scrollToFlag(flag);
  };

  componentDidMount() {
    // List out all functions and props
    console.log(this.section);
    // Most uses function
    console.log(this.section.getFlagsOffSet());
    console.log(this.section.getFlagsPosition());
  }

  render() {
    return (
      <div className="App">
        <Section onRef={ref => (this.section = ref)}>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <button onClick={() => this.onClick("header")}>Go to header</button>
          <button onClick={() => this.onClick("body")}>Go to body</button>
          <Section.Flag style={{ height: "100vh" }} flagName="header">
            <h1>Header</h1>
          </Section.Flag>
          <Section.Flag style={{ height: "100vh" }} flagName="body">
            <h1>Body</h1>
          </Section.Flag>
        </Section>
      </div>
    );
  }
}

export default App;
```

**scrollToFlag** = (flagName, top = 0, duration = 500) => {..}  

flagName: Name of marking flag is required  
top: Offset from top default is 0  
duration: Duration default is 500  
