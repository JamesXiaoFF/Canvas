import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';

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
    this.canvas1 = React.createRef()
    this.video = React.createRef()
  }

  showImage = () => {
    const canvas1 = this.canvas1.current
    const ctx1 = canvas1.getContext('2d')
    const url = 'https://media-public.canva.cn/k2Xu0/MAEhC6k2Xu0/1/s2.png'
    loadImageToCanvas(url).then(imageObj => {
      ctx1.drawImage(imageObj, 0, 0, canvas1.width, canvas1.height - 2)
      ctx1.fillStyle = 'rgb(255,0,0)'
      ctx1.fillRect(0, canvas1.height - 2, canvas1.width, 2)
      this.loadVideoToCanvas()
    }).catch(err => {
      alert(err)
    })
  }

  loadVideoToCanvas = () => {
    const canvas1 = this.canvas1.current
    const video = this.video.current
    video.play()
    video.addEventListener('play', () => {  //监听第一次播放
      this.width = canvas1.width;
      this.height = canvas1.height - 2;
      this.timerCallback();
    }, false);
  }

  timerCallback = () => {
    const video = this.video.current
    if (video.paused || video.ended) {    //若不在播放则返回
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
    ctx1.drawImage(video, 0, 0, this.width, this.height);
  }

  render() {
    return (
      <div>
        <video ref={this.video} src="https://mdn.github.io/dom-examples/canvas/chroma-keying/media/video.mp4" controls={true} crossOrigin="anonymous" />
        <canvas ref={this.canvas1} width="360px" height="640px"></canvas>
        <Button id="button" variant="contained" onClick={this.showImage}>开始</Button>
      </div>
    )
  }
};
