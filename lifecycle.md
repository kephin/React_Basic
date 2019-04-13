# Life Cycle of React - How and when to use them

## Initialization

### constructor(props)

| Questions | Comments |
|----------|----------|
| **Timing** | Initialization |
| **Executing times** | 1 |
| **Most common use case** | Set initial state. |
| **Can call setState()**  | The only place to use this.state = {...} |

## Mounting

### componentWillMount()

| Questions | Comments |
|----------|----------|
| **Timing** | Before render() |
| **Executing times** | 1, before render.  |
| **Useful?** | Probably no use..., nothing has changed since component’s constructor was called, which is where you should be setting up your component’s default configuration anyway. |
| **Most common use case** | App configuration in your root component and side effects(AJAX calls) for **server-side-rendering** only|
| **Can call setState()**  | No. Use default state instead. |

Notes:

1. The exception is any setup that can only be done at runtime — namely, connecting to external APIs. For example, if you use Firebase for your app, you’ll need to get that set up as your app is first mounting. But the key is that such configuration should be done at the highest level component of your app (the root component). That means 99% of your components should probably not use componentWillMount.
2. After React 16, componentWillMount might end up being called multiple times before the initial render is called
3. It is important to note that this function is called when using server-side-rendering while its counterpart — componentDidMount will not be called on the server but on the client in such case. So if some side-effect is desired on the server part this function should be used as an exception.

### componentDidMount()

| Questions | Comments |
| -------- | -------- |
| **Timing** | Your component is out there, mounted and ready to be used. |
| **Executing times** | 1, after first render |
| **Useful?** | All the time, here you want to do all the setup you couldn’t do without a DOM, and start getting all the data you need. |
| **Most common use case** | Starting AJAX calls to load in data for your component. |
| **Can call setState()**  | Yes. |
| **Use cases** | Draw on a canvas element that you just rendered |
| | Initialize a masonry grid layout from a collection of elements |
| | Add event listeners |

> You can’t guarantee the AJAX request won’t resolve before the component mounts. If it did, that would mean that you’d be trying to setState on an unmounted component, which not only won’t work, but React will yell at you for.
> Doing AJAX in componentDidMount will guarantee that there’s a component to update.

## Updating

The component can be updated by two ways, sending new props or updating the state.

### componentWillReceiveProps(nextProps)

> This function will be called in each update life-cycle caused by changes to props (parent component re-rendering) and will be passed an object map of all the props passed, no matter if the prop value has changed or not since previous re-render phase.

| Questions | Comments |
| -------- | -------- |
| **Timing** | A stream of new props arrive to mess things up. Perhaps some data that was loaded in by a parent component’s componentDidMount finally arrived, and is being passed down.|
| **How we do?** | 1. Check which props will change |
|                | 2. If the props will change in a way that is significant, act on it |
| **Most common use case** | Acting on particular prop changes to trigger state transitions. |
| **Can call setState()**  | Yes. |
| **Use cases** | Update the process bar or circle. |
| **One more caveat** | componentWillReceiveProps is not called on initial render. Technically the component is receiving props, but there aren’t any old props to compare to. |

Note:

1. Please keep in mind that due to the fact that the function is called with all props, even those that did not change. It is expected the developers implement a check to determine if the actual value has changed, for example:

    ```js
    componentWillReceiveProps(nextProps) {
      if(nextProps.myProps !== this.props.myProps) {
        // nextProps.myProp has a different value than our current prop
        // so we can perform some calculations based on the new value
      }
    }
    ```

2. Due to the fact that with React Fiber (post 16 beta) this function might be called multiple times before the render function is actually called. So it is not recommended to use any side-effect causing operations here.

### shouldComponentUpdate(nextProps, nextState)

| Questions | Comments |
| -------- | -------- |
| **Timing** | We have new props and React ask permission for whether it should update or not. |
| **Useful?** | It is an awesome place to improve performance. |
| **Most common use case** | Controlling exactly when your component will re-render. |
| **Can call setState()**  | No. |

> shouldComponentUpdate() always return a boolean

### componentWillUpdate(nextProps, nextState)

| Questions | Comments |
| -------- | -------- |
| **Timing** | Now we’ve committed to updating. Want me to do anything before I re-render? |
| **Useful** | No...,  it’s basically the same as componentWillReceiveProps, except you are not allowed to call this.setState(). |
| **Use cases** | If you were using shouldComponentUpdate AND needed to do something when props change, componentWillUpdate makes sense. |
| **Most common use case** | Used instead of componentWillReceiveProps on a component that also has shouldComponentUpdate (but no access to previous props). |
| **Can call setState()**  | No. |

### componentDidUpdate()

| Questions | Comments |
| -------- | -------- |
| **Timing** | If our component is receiving more props than those relevant to our canvas, we don’t want to waste time redrawing the canvas every time it updates. |
| **Useful** | So so... |
| **Use cases** | If we want to rearrange the grid after the DOM itself updates, we use componentDidUpdate to do so. |
| **Most common use case** | Updating the DOM in response to prop or state changes. |
| **Can call setState()**  | Yes. |

## Unmounting

### componentWillUnmount()

| Questions | Comments |
| -------- | -------- |
| **Timing** | Your component is going to go away. Before it goes, it asks if you have any last-minute requests. |
| **Executing times** | 1, before unmounting |
| **Useful** | Basically, clean up anything to do that solely involves the component in question — when it’s gone, it should be completely gone. |
| **Use cases** | 1. Cancel any outgoing network requests. |
|               | 2. Remove all event listeners associated with the component. |
| **Most common use case** | Cleaning up any leftover debris from your component. |
| **Can call setState()**  | No. |
