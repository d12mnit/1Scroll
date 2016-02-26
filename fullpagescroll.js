/**
 * @author D12mnIT
 * @version 1.0 beta
 */

var PageScroll = function(container, params) {
    var s = this;

    s.container = $(container);
    if (s.container.length === 0) return;
    if (s.container.length > 1) {
        var tempArr = [];
        s.container.each(function() {
            var container = this;
            tempArr.push(new PageScroll(container, params));
        });
        return tempArr;
    }
    s.params = params;
    //Wrapper
    s.wrapper = s.params.wrapperClass ? s.container.children('.' + s.params.wrapperClass) : s.container.children('.wrapper');

    if (s.params.pagination) {
        s.paginationInit();
    }
    if (s.params.scrollButton) {
        s.prevButton = s.container.find('.prevButton');
        s.nextButton = s.container.find('.nextButton');
    }
    if (s.params.draggable) {
        s.isDraggable = true;
    }
    s.scroll_item = s.wrapper.children('.scroll-page');
    s.scroll_height = parseInt(s.scroll_item.css('height'));
    s.scroll_width = parseInt(s.scroll_item.css('width'));
    s.scroll_number = s.scroll_item.length;

    //当前页面位置
    s.currentPageIndex = 0;
    //页面缩放重定义
    $(window).resize(function(event) {
        s.scroll_height = parseInt(s.scroll_item.css('height'));
        s.scroll_width = parseInt(s.scroll_item.css('width'));
        s.slideTo(s.currentPageIndex,null);
    });
    //滚平方向判断
    if (s.params.direction === 'vertical' || !s.params.direction) {
        s.container.addClass('vertical_scroll');
        s.isVertical = true;
    }
    if (s.params.direction === 'horizonal') {
        console.log(s.isHorizonal)
        s.container.addClass('horizonal_scroll');
        s.isHorizonal = true;
    }
    //容器宽度设置
    if (s.params.width || s.params.height) {
        s.container.css({
            width: s.params.width || (100 + '%'),
            height: s.params.height || (100 + '%')
        });
    }
    //触摸及拖动数据保存
    s.touches = {
        startPageX: 0,
        startPageY: 0,
        currentPageX: 0,
        currentPageY: 0,
        diff: 0,
        endPosition: 0,
        isDrag: false
    }
    s.slideListen = {
            start: function(istouch) {
                s.wrapper.addClass('isDrag');
                s.touches.startPageX = istouch ? event.touches[0].pageX : event.pageX;

                s.touches.startPageY = istouch ? event.touches[0].pageY : event.pageY;
                s.touches.isDrag = true;

                var temp = s.wrapper.css('transform').split(',');
                s.touches.currentPageY = parseInt(temp[temp.length - 1]);
                s.touches.currentPageX = parseInt(temp[temp.length - 2]);
            },
            move: function(istouch) {
                if (!s.touches.isDrag) return;
                if (istouch) {
                    s.touches.diff = s.isHorizonal ? event.touches[0].pageX - s.touches.startPageX : event.touches[0].pageY - s.touches.startPageY;
                } else {
                    s.touches.diff = s.isHorizonal ? event.pageX - s.touches.startPageX : event.pageY - s.touches.startPageY;
                }
                if (s.isDraggable) {
                    s.touches.endPosition = s.isHorizonal ? s.touches.diff + s.touches.currentPageX : s.touches.diff + s.touches.currentPageY;
                    if (s.isHorizonal) {
                        s.wrapper.css({
                            'transform': 'translate3d(' + s.touches.endPosition + 'px,0,0)'
                        });
                    } else {
                        s.wrapper.css({
                            'transform': 'translate3d(0,' + s.touches.endPosition + 'px,0)'
                        });
                    }
                }
            },
            end: function() {
                s.touches.isDrag = false;
                s.wrapper.removeClass('isDrag');
                s.pagePositonFix();
            }
        }
        //鼠标拖拽监听
    s.wrapper.on('mousedown', function(event) {
        event.preventDefault();
        s.slideListen.start(false);
    }).on('mousemove', function(event) {
        event.preventDefault();
        s.slideListen.move(false);
    }).on('mouseup', function(event) {
        event.preventDefault();
        s.slideListen.end();
    });
    //Touch 事件监听
    s.wrapper.on('touchstart', function(event) {
        event = event.originalEvent;
        event.preventDefault();
        if (event.touches.length == 1) {
            s.slideListen.start(true);
        }
    }).on('touchmove', function(event) {
        event = event.originalEvent;
        event.preventDefault();
        s.slideListen.move(true);
    }).on('touchend', function(event) {
        event = event.originalEvent;
        event.preventDefault();
        s.slideListen.end();
    });
    s.slideTo = function(targetIndex, speed) {
        if (!s.isHorizonal) {
            var targetPosition = -targetIndex * s.scroll_height;
            s.wrapper.css({
                'transform': 'translate3d(0,' + targetPosition + 'px,0)'
            });
        } else {
            var targetPosition = -targetIndex * s.scroll_width;
            s.wrapper.css({
                'transform': 'translate3d(' + targetPosition + 'px,0,0)'
            });
        }
    }
    s.pagePositonFix = function() {
            if (s.touches.diff > s.scroll_height / 4 && s.currentPageIndex > 0) {
                s.slideTo(--s.currentPageIndex, null);
            } else if (s.touches.diff < -s.scroll_height / 4 && s.currentPageIndex < s.scroll_number - 1) {
                s.slideTo(++s.currentPageIndex, null);
            } else {
                s.slideTo(s.currentPageIndex, null);
            }
            s.touches.diff = 0;
        }
        //占坑
    s.setAutoPlay = function() {
        /* body... */
    }

    s.pasueAutoPlay = function() {

    }

}