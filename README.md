# react-section

> npm -i react-section

[Live_Demo](https://charliephung.github.io/react-section-demo/)

[Live-Demo-Code](https://github.com/charliephung/react-section-demo/blob/master/README.md)

### Marking dom element mostly use for getting element position and offsets, scroll to element or implement lazy loading

---

### All functions and props

```javascript
 componentDidMount() {
    console.log(this.section);
    this.section.getFlagsOffSet()
    this.section.getFlagsPosition()
    this.section.flagsNode
    this.section.flagsRef
    this.section.inViewFlag
    this.section.scrollToFlag()
}
```

#### Scroll to section

```javascript
class App extends Component {
  constructor(props) {
    super(props);
    this.section = React.createRef();
  }

  onClick = flag => {
    this.section.scrollToFlag(flag);
  };
  render() {
    return (
      <Section onRef={ref => (this.section = ref)}>
        <button onClick={() => this.onClick("header")}>Go to header</button>
        <button onClick={() => this.onClick("body")}>Go to body</button>
        <Section.Flag
          style={{ height: "30vh", marginTop: "60px" }}
          flagName="header"
        >
          <h1>Header</h1>
        </Section.Flag>
        <Section.Flag className="body" flagName="body">
          <h1>Body</h1>
        </Section.Flag>
      </Section>
    );
  }
}
```

**scrollToFlag** = (flagName, top = 0, duration = 500) => {..}

flagName: Name of marking flag is required  
top: Offset from top default is 0  
duration: Duration default is 500

---

### Lazyload

```javascript
<Section onRef={ref => (this.section = ref)}>
  <!-- Flag will not accept children is lazyLoad props is provided -->
  <Section.Flag
    lazyLoad={{
        // Loaded delay time
        delay: 2000,
        loading: () => <h1>I will load after 2s</h1>,
        loaded: () => import("./component/Loaded"),
        loadedProps: { onClick: () => alert("Hi i'm lazy 1") }
    }}
    flagName="lazyheader"
    className="header__lazy"
  />
  <Section.Flag
    lazyLoad={{
        // Component will be loaded when appear in to viewport
        loadOnView: true,
        //Component will be loaded when scroll down 200px from it
        fromBottom: 200,
        loading: () => <h1>Scroll down 200px from me to load</h1>,
        loaded: () => import("./component/Loaded2"),
        loadedProps: {
            onClick: () => alert("Hi i'm lazy 2")
        }
    }}
    flagName="lazyheader2"
    className="header__lazy"
  />
</Section>
```

### Peer dependencies: "react-scroll": "^1.7.10"
