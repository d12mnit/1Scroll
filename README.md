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
        width: 700,                 //容器宽度，不设置默认100%;
        height: 1300,               //容器高度, 不设置默认100%;    也可通过css直接设置
        direction: 'vertical',   //设置滚动方向  'vertical'垂直,'horizontal',水平
        draggable: true,    //是否允许拖拽切换
        autoPlay: true,     //是否自动轮播
        mousewheel: true,   //是否允许鼠标滚轮滚动
        speed: 500,    //毫秒
        loop: false      //是否无限循环
    })
</script>
```
正在完善pagination按钮功能，并计划加入动态生成html结构，方便模板化使用.
