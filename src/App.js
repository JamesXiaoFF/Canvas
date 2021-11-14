import React, { Component } from 'react';
import './App.css';

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
  canvas = React.createRef()

  showImage = () => {
    const canvas = this.canvas.current
    const ctx = canvas.getContext('2d')
    const url = 'https://media-public.canva.cn/k2Xu0/MAEhC6k2Xu0/1/s2.png'
    loadImageToCanvas(url).then(imageObj => {
      const into = document.createElement("canvas")
      const ctx2 = into.getContext('2d')
      into.width = canvas.width
      into.height = canvas.height
      ctx2.drawImage(imageObj, 0, 0, into.width, into.height)
      let pattern = ctx.createPattern(into, 'no-repeat')
      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }).catch(err => {
      alert(err)
    })
  }
  render() {
    return (
      <div>
        <canvas ref={this.canvas} width="360px" height="640px"></canvas>
        <button onClick={this.showImage}>开始</button>
      </div>
    )
  }
};
