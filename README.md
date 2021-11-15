- 点击按钮生成canvas，**isPlaying记录是否播放**

  - 若为false则播放视频，**isUpdating记录是否操作（移动或放缩）canvas上面的rnd图层**
    - 若为false，则持续通过timerCallback调用computeFrame调用drawImage生成连续帧，将视频绘制在特定位置
    - 若为true，则停止在那个特定位置继续绘制，改为在rnd组件的onResize与onDrag这两个cb中绘制。这里的绘制思路如下（用drag举例）：
      - 在onDragStart中设置isUpdating为true
      - 在onDrag中pop上一时刻的存储rnd组件位置的数组，得到有关x和y的数据，先把上一时刻位置的擦除，再绘制这一时刻的视频帧，最后push这一时刻的rnd组建位置的数组，形成循环
      - 在onDragStop中设置isUpdating为false，设置新的x和y的数据，在新的位置重新调用computeFrame实现循环
  - 若为true则暂停视频

  
