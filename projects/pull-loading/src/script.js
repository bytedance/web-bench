/*
distanceY 表示手指拖动的距离（Y轴或X轴，取决于方向）。
在动画函数 anim(y, transitionDuration) 中，实际位移会被 DAMPING 阻尼系数缩小：
y = y / DAMPING;
这样，拖动越远，实际内容移动的距离越小，产生“越拉越难拉动”的感觉，类似弹簧阻力。
当松手时，如果拖动距离超过阈值（DISTINCE），会触发“释放切换到下一屏”；否则回弹到初始位置
*/

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    console.log('页面已加载');
    // 在这里添加你的 JS 代码

    initialzer();
});

const $el = document.getElementById("content");
var $noticeTxt = document.getElementById("noticeTxt");

var direction;
var disable = false;
var self = this;
var switchTxt = '继续拖动，查看详情';

//初始化下拉刷新参数
var startY;
var distanceY = 0;
//是否已经促发了
var hasEnded;
var status = 0; //0：提示；1：释放提示；2：加载中
var DAMPING = 2; //阻尼系数
var DISTINCE = 50 * DAMPING;
var direction;
var isEndOption = false;
var isHorizontal = false;
var isEnd;

var navigatorBarHeight = 0;
var wHeight = window.innerHeight;
var App={pulling:false} ;

  // css3 prefix detect
  var pre = (Array.prototype.slice
    .call(window.getComputedStyle(document.documentElement, ''))
    .join('')
    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
)[1];

window.onresize = function () {
    navigatorBarHeight = wHeight - window.innerHeight;
};

function initialzer() {
    // 一些参数

    var navigatorBarHeight = 0;
    var wHeight = window.innerHeight;
    window.onresize = function () {
        navigatorBarHeight = wHeight - window.innerHeight;
    };
    var isHorizontal = direction == 'horizontal';

    //检查是否到了页面底部，到达底部以后才启动下拉刷新
    var screenHeight;
    var fn = function () {
        screenHeight = window.innerHeight;
    };
    window.addEventListener('orientationchange', fn);
    var height, offset;
    isEnd = function () {
        fn();
        return function () {
            height = document.documentElement.scrollHeight || document.body.scrollHeight;
            offset = height - ((window.pageYOffset || window.scrollY) + screenHeight);
            return offset < 1;
        };
    };

}


var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;
})(); // 优化动画

/*
    transform : default
    transition : default
    supportTransform3d : true /false
    prefix:
*/
var css3Support = function (name) {
    /*
    //transition: width 2s;
    //-moz-transition: width 2s;  /* Firefox 4 */
    //-webkit-transition: width 2s;   /* Safari 和 Chrome */
    //-o-transition: width 2s;    /* Opera */

    var style = document.createElement('div').style;
    var supportTransform3d = function () {
        return 'webkitPerspective' in style || 'perspective' in style;
    }();
    var TransformProperty = function () {
        return 'transform' in style ? 'transform' : '-' + pre + '-transform';
    }();
    var transitionProperty = function () {
        return 'transition' in style ? 'transition' : '-' + pre + '-transition';
    }();

    var o = {
        transform: TransformProperty,
        transition: transitionProperty,
        supportTransform3d: supportTransform3d,
        prefix: pre
    }
    return o[name] ? o[name] : '';
}

//特性检测
var style = document.createElement('div').style;
var supportTransform3d = css3Support('supportTransform3d');
var TransformProperty = css3Support('transform');
var transitionProperty = css3Support('transition');
var getTranslate = function (x, y) {
    if (x) {
        return supportTransform3d
            ? 'translate3d(' + x + 'px, 0, 0)'
            : 'translate(' + x + 'px, 0)';
    } else {
        return supportTransform3d
            ? 'translate3d(0, ' + y + 'px, 0)'
            : 'translate(0, ' + y + 'px, 0)';
    }
};
function getPage(event, page) {

    // 兼容性处理
    return event.changedTouches ? event.changedTouches[0][page] : event[page];
}

var preventDefault = function (e) {

    if (!self.scrolling) {
        return;
    }
    if (self.moveReady) {

        if (disable) {
            return;
        }

        if (!$el || status === 2) {
            return;
        }
        if (!hasEnded && isEnd()) {
            hasEnded = true;
        }


        if (hasEnded) {
            // console.log('preventDefault');

            // var pageX = getPage(e, 'pageX');
            // var pageY = getPage(e, 'pageY');

            // console.log('pageX:'+pageX);    
            // console.log('pageY:'+pageY);

            // if (!startY) {
            //     startY = isHorizontal ? self.basePageX : self.basePageY - navigatorBarHeight;
            // }
            // // console.log('startY:'+startY);
            // distanceY = (isHorizontal ? pageX : (pageY - navigatorBarHeight)) - startY;

            // if (distanceY > 0) {
            //     return;
            // }

        }
        else {
            return;
        }
    }
    console.log("时间阻止")
    e.preventDefault();
};

//变化、动画
var ticking = false;

//变化、动画
var anim = function (y, transitionDuration) {
    if (disable) {
        return;
    }
    y = y / DAMPING;
    if (y > 0) {
        y = 0;
    }
    if (transitionDuration) {
        // 修改前：$el.css(transitionProperty, TransformProperty + ' ' + transitionDuration + 'ms ease-out');
        $el.style[transitionProperty] = TransformProperty + ' ' + transitionDuration + 'ms ease-out';
        setTimeout(function () {
            if (disable) {
                return;
            }
            // 修改前：$el.css(transitionProperty, 'none');
            $el.style[transitionProperty] = 'none';
        }, transitionDuration);
    }
    if (isHorizontal) {
        // 修改前：$el.css(TransformProperty, 'translateX(' + y + 'px)' + ' ' + (supportTransform3d ? 'translateZ(0)' : ''));
        $el.style[TransformProperty] = 'translateX(' + y + 'px)' + ' ' + (supportTransform3d ? 'translateZ(0)' : '');
    } else {
        // 修改前：$el.css(TransformProperty, 'translateY(' + y + 'px)' + ' ' + (supportTransform3d ? 'translateZ(0)' : ''));
        $el.style[TransformProperty] = 'translateY(' + y + 'px)' + ' ' + (supportTransform3d ? 'translateZ(0)' : '');
    }
};

$el.addEventListener('touchstart', function (event) {
    if (isEnd()) {
        document.addEventListener('touchmove', preventDefault, false);
        self.isReady = true;
    }
    else {
        self.isReady = false;
    }

    if (disable) {
        return;
    }
    ticking = false;
    console.log('event:' + event);
 
    self.basePageX = getPage(event, 'pageX');
    self.basePageY = getPage(event, 'pageY');
    console.log('self.basePageX:' + self.basePageX);

});

$el.addEventListener('touchmove', function (e) {
    if (!self.isReady) {
        return;
    }

    if (disable) {
        return;
    }
    if (!$el || status === 2) {
        return;
    }
    if (!hasEnded && isEnd()) {
        hasEnded = true;
    }

    if (hasEnded) {
        var pageX = getPage(e, "pageX");
        var pageY = getPage(e, "pageY");
        if (!startY) {
            startY = isHorizontal ? self.basePageX : self.basePageY - navigatorBarHeight;
        }
        // console.log('startY:'+startY);
        distanceY = (isHorizontal ? pageX : (pageY - navigatorBarHeight)) - startY;


        if (distanceY < 0) {
            // e.preventDefault();
        }
        // console.log('distanceY:'+distanceY);

        // 按照requestAnimationFrame频率,超过丢弃
        if (requestAnimFrame) {
            if (!ticking) {
                ticking = true;
                requestAnimFrame(function () {
                    ticking = false;
                    anim(distanceY);
                })
            }
        }
        else {
            anim(distanceY);
        }

        if (distanceY < -DISTINCE && status !== 1) {
            status = 1;
            $noticeTxt.textContent='释放切换到下一屏';
        } else if (distanceY >= -DISTINCE && status !== 0) {
            status = 0;
            $noticeTxt.textContent='上拉切换到下一屏';
        }
    }
});

$el.addEventListener('touchend', function(e) {
    document.removeEventListener('touchmove', preventDefault, false);
    if(!self.isReady){
        return;
    }

    if (disable) {
        return;
    }
    if (!$el || status === 2) {
        return;
    }
    var reset = function() {
        status !== 0 && ($noticeTxt.textContent = switchTxt);
        startY = null;
        distanceY = 0;
        hasEnded = false;
        status = 0;

    };
    if (hasEnded) {
        if (distanceY <= -DISTINCE) {

            // self.disable();
            document.removeEventListener('touchmove', preventDefault, false);
            // loading.show($loadingTarget);
            // $noticeTxt.text('正在切换到下一屏');
            anim(-DISTINCE, 200);
            status = 2;
            setTimeout(function() {
                // loading.hide();
                anim(0);
                reset();
                // 屏幕左右滑动触发中
                if(App.sliderChangeFlg){
                    App.pulling = false;
                    self.enable();
                    anim(0);
                    return;
                }
                // options.go(self);
            }, 200);
        } else {
            anim(0, distanceY !== 0 ? 200 : null);
            reset();
        }
    }
});