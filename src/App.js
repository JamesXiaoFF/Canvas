import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import { Rnd } from "react-rnd"

function loadImageToCanvas(url) {
  return new Promise((resolve, reject) => {
    let imageObj = new Image()
    imageObj.src = url
    imageObj.onload = function () {
      resolve(imageObj)
    }
    imageObj.onerror = function (err) {
      reject(err)
    }
  })
}

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      xyArray: [100, 100],
      whArray: [200, 200],
      isUpdating: false,
      isPlaying: false
    }
    this.canvas1 = React.createRef()
    this.video = React.createRef()
    this.button = React.createRef()
  }

  showImage = () => {
    const url = 'https://media-public.canva.cn/k2Xu0/MAEhC6k2Xu0/1/s2.png'
    //废弃画背景image，改为将image在css中作为背景，但暂时保留此方法
    loadImageToCanvas(url).then(imageObj => {
      this.loadVideoToCanvas()
    }).catch(err => {
      alert(err)
    })
  }

  loadVideoToCanvas = () => {
    const video = this.video.current
    const button = this.button.current
    if (!this.state.isPlaying) {
      video.play()
      this.setState({ isPlaying: true })
      button.innerText = '播放'
    }
    else {
      video.pause()
      this.setState({ isPlaying: false })
      button.innerText = '暂停'
    }

    video.addEventListener('play', () => {
      this.timerCallback();
    }, false);
  }

  timerCallback = () => {
    const video = this.video.current

    if (video.paused || video.ended) {
      return;
    }
    this.computeFrame();
    setTimeout(() => {
      this.timerCallback();
    }, 0);
  }

  computeFrame = () => {
    const video = this.video.current
    const canvas1 = this.canvas1.current
    const ctx1 = canvas1.getContext('2d')

    if (!this.state.isUpdating) {
      ctx1.drawImage(video, this.state.x, this.state.y, this.state.width, this.state.height);
      ctx1.fillStyle = 'rgb(255,0,0)'
      ctx1.fillRect(this.state.x, this.state.y + this.state.height, this.state.width, 2)
    }

  }

  render() {
    return (
      <div>
        <video ref={this.video} src="https://mdn.github.io/dom-examples/canvas/chroma-keying/media/video.mp4" controls={true} crossOrigin="anonymous" />
        <div className="canvas1">
          <canvas ref={this.canvas1} width="360px" height="640px"></canvas>
          <Rnd
            //style={{ background: "#f7c744" }}  //用于测试
            bounds="parent"
            size={{ width: this.state.width, height: this.state.height }}
            position={{ x: this.state.x, y: this.state.y }}

            onDragStart={(e, d) => {
              this.setState({ isUpdating: true })
            }}
            onDrag={(e, d) => {
              const canvas1 = this.canvas1.current
              const ctx1 = canvas1.getContext('2d')
              const video = this.video.current
              const y = this.state.xyArray.pop()
              const x = this.state.xyArray.pop()
              ctx1.clearRect(x, y, this.state.width, this.state.height + 2);
              ctx1.drawImage(video, x + d.deltaX, y + d.deltaY, this.state.width, this.state.height);
              ctx1.fillStyle = 'rgb(255,0,0)'
              ctx1.fillRect(x + d.deltaX, y + d.deltaY + this.state.height, this.state.width, 2)
              this.state.xyArray.push(x + d.deltaX, y + d.deltaY)
            }}
            onDragStop={(e, d) => {
              this.setState({ x: d.x, y: d.y, isUpdating: false })
              this.computeFrame()
            }}

            onResizeStart={(e, direction, ref, delta, position) => {
              this.setState({ isUpdating: true })
            }}
            onResize={(e, direction, ref, delta, position) => {
              console.log(delta, position)
              const canvas1 = this.canvas1.current
              const ctx1 = canvas1.getContext('2d')
              const video = this.video.current
              const height = this.state.whArray.pop()
              const width = this.state.whArray.pop()
              const y = this.state.xyArray.pop()
              const x = this.state.xyArray.pop()
              ctx1.clearRect(x, y, width, height + 2);
              ctx1.drawImage(video, position.x, position.y, ref.offsetWidth, ref.offsetHeight);
              ctx1.fillStyle = 'rgb(255,0,0)'
              ctx1.fillRect(position.x, position.y + ref.offsetHeight, ref.offsetWidth, 2)
              this.state.xyArray.push(position.x, position.y)
              this.state.whArray.push(ref.offsetWidth, ref.offsetHeight)
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              this.setState({
                x: position.x,
                y: position.y,
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                isUpdating: false
              });
              this.computeFrame()
            }}

            enableResizing={true}
          >
          </Rnd>
        </div>
        <Button ref={this.button} id="button" variant="contained" onClick={this.showImage}>开始</Button>
      </div>
    )
  }
};
