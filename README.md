# code2mind

code2mind 是什么，它是能将按规定格式写好的文本，转换成思维导图的工具

### example
[demo](https://robinwp.github.io/blog/code2mind)
```html
<script src=dist/code2mind.min.js></script>
<script>
const code2mind = new Code2Mind({
  themes: 'dea',
  heightSpac: 50,// 垂直间隔
  widthSpac: 100,// 水平间隔
  lineStyle: { // 连接线样式
    curvature: 80, // 连接线曲度
    stroke: '#DEDEDE', // 连接线颜色
    strokeWidth: 2, // 连接线粗细
  }, 
  el: "#code2mind", // 挂载的元素
  width: number, // 默认挂载元素的宽度
  height: number, // 默认挂载元素的高度
});
code2mind.render(`主题\n副主题\n\t子主题1\n\t子主题2`);
</script>
```

### feature

* 支持自定义比例下载思维导图
* 优化布局
* 支持图片
* 支持更多皮肤
