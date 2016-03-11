# 1Scroll
个人用快速构建全屏滚动及轮播插件，完善中

#### 如何使用
HTML结构如下
``` html
<div class="container">
    <div class="wrapper">
        <div class="scroll-page"></div>
        <div class="scroll-page"></div>
        <div class="scroll-page"></div>
        <div class="scroll-page"></div>
        <div class="scroll-page"></div>
    </div>
</div>
```
需配合CSS实现布局，CSS文件暂时未完善。

接下来引用jQuery和本滚动插件，并创建设置参数。
``` html
<script src="jquery-2.2.1.min.js"></script>
<script src="fullpagescroll.js"></script>
<script>
    var init = new PageScroll('.container',{
        direction: 'vertical',
        draggable: true,
        mouseWheel: true,
        autoPlay: true
    })
</script>
```
正在添加并完善无缝loop,与pagination按钮等功能，并计划加入动态生成html结构，方便模板化使用.