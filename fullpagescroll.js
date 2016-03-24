/*
 * @Author: v_mmmzzhang
 * @Date:   2016-02-24 13:21:30
 * @Last Modified by:   v_mmmzzhang
 * @Last Modified time: 2016-03-24 09:34:23
 */

var PageScroll;
PageScroll = function(container, params) {
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
    //容器宽度设置
    if (s.params.width || s.params.height) {
        s.container.css({
            width: s.params.width || (100 + '%'),
            height: s.params.height || (100 + '%')
        });
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
    $(window).resize(function(event) {
        s.scroll_height = parseInt(s.scroll_item.css('height'));
        s.scroll_width = parseInt(s.scroll_item.css('width'));
        s.slideTo(s.currentPageIndex, null);
    });
    //滚屏方向判断
    if (s.params.direction === 'vertical' || !s.params.direction) {
        s.container.addClass('vertical_scroll');
        s.isVertical = true;
    }
    if (s.params.direction === 'horizontal') {
        s.container.addClass('horizontal_scroll');
        s.isHorizontal = true;
    }

    s.scroll_Speed = s.params.speed || 500;
    s.wrapper.css({
        'transition-duration': s.scroll_Speed / 1000 + 's'
    });
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
        start: function(istouch, event) {
            s.wrapper.addClass('isDrag');
            if (s.params.loop) s.Loop.loopFixListen();
            s.touches.startPageX = istouch ? event.touches[0].pageX : event.pageX;

            s.touches.startPageY = istouch ? event.touches[0].pageY : event.pageY;
            s.touches.isDrag = true;
            s.wrapper.css({
                'transition-duration': 0 + 's'
            });
            var temp = s.wrapper.css('transform').split(',');
            s.touches.currentPageY = parseInt(temp[temp.length - 1]);
            s.touches.currentPageX = parseInt(temp[temp.length - 2]);
            s.pauseAutoPlay();
        },
        move: function(istouch, event) {
            if (!s.touches.isDrag) return;
            if (istouch) {
                s.touches.diff = s.isHorizontal ? event.touches[0].pageX - s.touches.startPageX : event.touches[0].pageY - s.touches.startPageY;
            } else {
                s.touches.diff = s.isHorizontal ? event.pageX - s.touches.startPageX : event.pageY - s.touches.startPageY;
            }
            if (s.isDraggable) {
                s.touches.endPosition = s.isHorizontal ? s.touches.diff + s.touches.currentPageX : s.touches.diff + s.touches.currentPageY;
                if (s.isHorizontal) {
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
        end: function(event) {
            s.touches.isDrag = false;
            s.wrapper.removeClass('isDrag');
            s.pagePositonFix();
            s.params.loop ? s.pagination.setChange(s.currentPageIndex - 1) : s.pagination.setChange(s.currentPageIndex);
            s.wrapper.css({
                'transition-duration': s.scroll_Speed / 1000 + 's'
            });
        }
    };
    //鼠标拖拽监听
    s.wrapper.on('mousedown', function(event) {
        event.preventDefault();
        s.slideListen.start(false, event);
    }).on('mousemove', function(event) {
        event.preventDefault();
        s.slideListen.move(false, event);
    }).on('mouseup', function(event) {
        event.preventDefault();
        s.slideListen.end(event);
    });
    //Touch 事件监听
    s.wrapper.on('touchstart', function(event) {
        event = event.originalEvent;
        event.preventDefault();
        if (event.touches.length == 1) {
            s.slideListen.start(true, event);
        }
    }).on('touchmove', function(event) {
        event = event.originalEvent;
        event.preventDefault();
        s.slideListen.move(true, event);
    }).on('touchend', function(event) {
        event = event.originalEvent;
        event.preventDefault();
        s.slideListen.end(event);
    });
    s.slideTo = function(targetIndex, speed) {
        if (speed !== null) {
            s.wrapper.css({
                'transition-duration': speed / 1000 + 's'
            });
        } else {
            s.wrapper.css({
                'transition-duration': s.scroll_Speed / 1000 + 's'
            });
        }
        if (!s.isHorizontal) {
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
    s.pagePositonFix = function() {
        if (s.touches.diff > s.scroll_height / 4 && s.currentPageIndex > 0) {
            s.slideTo(--s.currentPageIndex, null);
        } else if (s.touches.diff < -s.scroll_height / 4 && s.currentPageIndex < s.scroll_number - 1) {
            s.slideTo(++s.currentPageIndex, null);
        } else {
            s.slideTo(s.currentPageIndex, null);
        }
        s.touches.diff = 0;
        if (s.params.autoPlay) s.setAutoPlay();
    };
    //占坑
    s.setAutoPlay = function() {
        /* body... */
        s.autoplay = setInterval(function() {
            if (s.params.loop) {
                if (s.currentPageIndex < s.scroll_number - 1) {
                    s.slideTo(++s.currentPageIndex, null);
                    setTimeout(function() {
                        s.Loop.loopFixListen();
                        s.pagination.setChange(s.currentPageIndex - 1);
                    }, s.scroll_Speed + 100);
                }
            } else {
                if (s.currentPageIndex < s.scroll_number - 1) {
                    s.slideTo(++s.currentPageIndex, null);
                    s.pagination.setChange(s.currentPageIndex);
                }
            }
        }, 3000);
    };
    if (s.params.autoPlay) s.setAutoPlay();

    s.pauseAutoPlay = function() {
        if (s.autoplay) clearInterval(s.autoplay);
    };
    s.wheelListen = {
        isWheel: false,
        mouselisten: function() {
            var _this = this;
            $(window).on('mousewheel DOMMouseScroll', function(event) {
                event.preventDefault();
                event = event.originalEvent;

                delta = event.wheelDelta || -event.detail;
                if (!_this.isWheel) {
                    _this.isWheel = true;
                    s.pauseAutoPlay();
                    if (delta > 0) {
                        /*滚轮向上滚动*/
                        if (s.currentPageIndex > 0) {
                            s.slideTo(--s.currentPageIndex, null);
                            s.params.loop ? s.pagination.setChange(s.currentPageIndex - 1) : s.pagination.setChange(s.currentPageIndex);
                        }
                    } else {
                        /*滚轮向下滚动*/
                        if (s.currentPageIndex < s.scroll_number - 1) {
                            s.slideTo(++s.currentPageIndex, null);
                            s.params.loop ? s.pagination.setChange(s.currentPageIndex - 1) : s.pagination.setChange(s.currentPageIndex);
                        }
                    }
                    setTimeout(function() {
                        _this.isWheel = false;
                        s.setAutoPlay();
                        if (s.params.loop) s.Loop.loopFixListen();
                    }, s.scroll_Speed + 100);
                }
            });
        }
    };
    if (s.params.mousewheel) s.wheelListen.mouselisten();
    s.Loop = {
        createLoop: function() {
            var slides = s.scroll_item;
            s.wrapper.append(slides.eq(0).clone(true).removeClass('active').addClass('duplicated'));
            s.wrapper.prepend(slides.eq(s.scroll_number - 1).clone(true).removeClass('active').addClass('duplicated'));
            s.scroll_item = s.wrapper.children('.scroll-page');
            s.scroll_number = s.scroll_item.length;
            this.loopFix(1);
        },
        loopFix: function(index) {
            s.currentPageIndex = index;
            s.slideTo(index, 0);
        },
        loopFixListen: function() {
            if (s.currentPageIndex == s.scroll_number - 1) {
                s.Loop.loopFix(1);
            } else if (s.currentPageIndex == 0) {
                s.Loop.loopFix(s.scroll_number - 2);
            }
        }
    };
    if (s.params.loop) s.Loop.createLoop();
    s.pagination = {
        init: function() {
            this.createPagination();
            this.listen();
            this.setChange(0);
        },
        createPagination: function() {
            var num = s.params.loop ? s.scroll_number - 2 : s.scroll_number;
            var wrap = $('<div></div>');
            while (num--) {
                wrap.append('<span></span>');
            }
            wrap.addClass('pagination');
            if (s.params.direction == 'vertical') {
                wrap.addClass('vertical');
            } else {
                wrap.addClass('horizontal');
            }
            s.container.append(wrap);
        },
        listen: function() {
            var wrap = s.container.find('.pagination');
            wrap.on('click', 'span', function(event) {
                event.preventDefault();
                s.pauseAutoPlay();
                var index = $(this).index();
                index = s.params.loop ? index + 1 : index;
                s.currentPageIndex = index;
                wrap.find('span').removeClass('selected');
                $(this).addClass('selected');
                s.slideTo(index, null);
                setTimeout(function() {
                    s.setAutoPlay();
                }, s.scroll_Speed);
            });
        },
        setChange: function(index) {
            console.log(index);
            var num = s.params.loop ? s.scroll_number - 2 : s.scroll_number;
            var btn = s.container.find('.pagination span');
            btn.removeClass('selected');
            index == num ? btn.eq(0).addClass('selected') : btn.eq(index).addClass('selected');
        }
    };
    if (s.params.pagination) {
        s.pagination.init();
    }
};
