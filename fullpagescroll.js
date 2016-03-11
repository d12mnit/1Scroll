/*
* @Author: v_mmmzzhang
* @Date:   2016-02-24 13:21:30
* @Last Modified by:   v_mmmzzhang
* @Last Modified time: 2016-03-11 09:10:23
*/

var PageScroll;
PageScroll = function (container, params) {
    var s = this;

    s.container = $(container);
    if (s.container.length === 0) return;
    if (s.container.length > 1) {
        var tempArr = [];
        s.container.each(function () {
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
    s.scroll_item.removeClass('active').eq(s.currentPageIndex).addClass('active');
    //页面缩放重定义
    $(window).resize(function (event) {
        s.scroll_height = parseInt(s.scroll_item.css('height'));
        s.scroll_width = parseInt(s.scroll_item.css('width'));
        s.slideTo(s.currentPageIndex, null);
    });
    //滚平方向判断
    if (s.params.direction === 'vertical' || !s.params.direction) {
        s.container.addClass('vertical_scroll');
        s.isVertical = true;
    }
    if (s.params.direction === 'horizonal') {
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
    };
    s.slideListen = {
        start: function (istouch,event) {
            s.wrapper.addClass('isDrag');
            s.touches.startPageX = istouch ? event.touches[0].pageX : event.pageX;

            s.touches.startPageY = istouch ? event.touches[0].pageY : event.pageY;
            s.touches.isDrag = true;

            var temp = s.wrapper.css('transform').split(',');
            s.touches.currentPageY = parseInt(temp[temp.length - 1]);
            s.touches.currentPageX = parseInt(temp[temp.length - 2]);
            s.pauseAutoPlay();
        },
        move: function (istouch,event) {
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
        end: function (event) {
            s.touches.isDrag = false;
            s.wrapper.removeClass('isDrag');
            s.pagePositonFix();
        }
    };
    //鼠标拖拽监听
    s.wrapper.on('mousedown', function (event) {
        event.preventDefault();
        s.slideListen.start(false,event);
    }).on('mousemove', function (event) {
        event.preventDefault();
        s.slideListen.move(false,event);
    }).on('mouseup', function (event) {
        event.preventDefault();
        s.slideListen.end(event);
    });
    //Touch 事件监听
    s.wrapper.on('touchstart', function (event) {
        event = event.originalEvent;
        event.preventDefault();
        if (event.touches.length == 1) {
            s.slideListen.start(true,event);
        }
    }).on('touchmove', function (event) {
        event = event.originalEvent;
        event.preventDefault();
        s.slideListen.move(true,event);
    }).on('touchend', function (event) {
        event = event.originalEvent;
        event.preventDefault();
        s.slideListen.end(event);
    });
    s.slideTo = function (targetIndex, speed) {
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
        s.scroll_item.removeClass('active').eq(s.currentPageIndex).addClass('active');
    };
    s.pagePositonFix = function () {
        if (s.touches.diff > s.scroll_height / 4 && s.currentPageIndex > 0) {
            s.slideTo(--s.currentPageIndex, null);
        } else if (s.touches.diff < -s.scroll_height / 4 && s.currentPageIndex < s.scroll_number - 1) {
            s.slideTo(++s.currentPageIndex, null);
        } else {
            s.slideTo(s.currentPageIndex, null);
        }
        s.touches.diff = 0;
        s.setAutoPlay();
    };
    //占坑
    s.setAutoPlay = function () {
        /* body... */
        s.autoplay = setInterval(function () {
            if (s.currentPageIndex < s.scroll_number - 1) {
                s.slideTo(++s.currentPageIndex, null);
            } else {
                s.slideTo(0, null);
                s.currentPageIndex = 0;
            }
        }, 3000);
    };
    s.setAutoPlay();
    s.pauseAutoPlay = function () {
        clearInterval(s.autoplay);
    };
    s.wheelListen = {
        isWheel: false,
        mouselisten: function () {
            var _this = this;
            $(window).on('mousewheel DOMMouseScroll', function (event) {
                event.preventDefault();
                event = event.originalEvent;
                delta = event.wheelDelta || -event.detail;
                if(!_this.isWheel){
                    _this.isWheel = true;
                    s.pauseAutoPlay();
                    if (delta > 0) {
                        /*滚轮向上滚动*/
                        console.log(delta);
                        if(s.currentPageIndex>0){
                            s.slideTo(--s.currentPageIndex,null);
                        }
                    } else{
                        /*滚轮向下滚动*/
                        if(s.currentPageIndex< s.scroll_number-1){
                            s.slideTo(++s.currentPageIndex,null);
                        }
                    }
                    setTimeout(function(){
                        _this.isWheel = false;
                        s.setAutoPlay();
                    },500);
                }
            });
        }
    };
    s.wheelListen.mouselisten();
};
