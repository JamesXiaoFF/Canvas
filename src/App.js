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
      height: 200
    }
    this.canvas1 = React.createRef()
    this.video = React.createRef()
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
    video.play()
    //监听第一次播放
    video.addEventListener('play', () => {
      this.timerCallback();
    }, false);
  }

  timerCallback = () => {
    const video = this.video.current
    //若不在播放则返回
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
    //画视频的每一帧
    ctx1.drawImage(video, this.state.x, this.state.y, this.state.width, this.state.height);
    //画视频每一帧下面的红条
    ctx1.fillStyle = 'rgb(255,0,0)'
    ctx1.fillRect(this.state.x, this.state.y + this.state.height, this.state.width, 2)

  }

  render() {
    return (
      <div>
        <video ref={this.video} src="https://mdn.github.io/dom-examples/canvas/chroma-keying/media/video.mp4" controls={true} crossOrigin="anonymous" />
        <div className="canvas1">
          <canvas ref={this.canvas1} width="360px" height="640px"></canvas>
          <Rnd
            // style={{ background: "#f7c744" }}  //用于测试
            bounds="parent"
            size={{ width: this.state.width, height: this.state.height }}
            position={{ x: this.state.x, y: this.state.y }}
            //暂时没有弄清原理
            onDragStart={(e, d) => {

            }}
            //拖拽结束执行
            onDragStop={(e, d) => {
              const canvas1 = this.canvas1.current
              const ctx1 = canvas1.getContext('2d')
              ctx1.clearRect(this.state.x, this.state.y, this.state.width, this.state.height + 2);
              this.setState({ x: d.x, y: d.y }, () => console.log(this.state));
              this.computeFrame()
            }}
            //暂时没有弄清原理
            onResizeStart={(e, direction, ref, delta, position) => {

            }}
            //缩放结束执行
            onResizeStop={(e, direction, ref, delta, position) => {
              const canvas1 = this.canvas1.current
              const ctx1 = canvas1.getContext('2d')
              ctx1.clearRect(this.state.x, this.state.y, this.state.width, this.state.height + 2);
              this.setState({
                width: ref.offsetWidth,
                height: ref.offsetHeight
              });
              this.computeFrame()
            }}

            enableResizing={true}
          >
            <div id="rnd"></div>
          </Rnd>
        </div>
        <Button id="button" variant="contained" onClick={this.showImage}>开始</Button>
      </div>
    )
  }
};
