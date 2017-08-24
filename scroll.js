var scrollModel = (function ($) {
	var dataObj;
	var pressFlag = false;
	var startPos;
	var slideT;

	function init(obj) {
		dataObj = {
			node: obj.node,
			contentW: obj.contentW? obj.contentW: '',
			contentH: obj.contentH ? obj.contentH: '',
			barW: obj.barW ? obj.barW : 0,
			barBg: obj.barBg ? obj.barBg : '#F1F1F1',
			barTopH: obj.barTopH ? obj.barTopH : 0,
			barSlideBg: obj.barSlideBg ? obj.barSlideBg: "#b1b1b1",
			barTopBg: obj.barTopBg? obj.barTopBg : "#d2d2d2"
		};

		slideT = 0;
		dataObj.scrollHeight = $(dataObj.node).find(".scroll-block").height();
		dataObj.barSlideHeight = (dataObj.contentH-2*dataObj.barTopH)*dataObj.contentH/dataObj.scrollHeight;
		rederBar();
		events();
	}

	//渲染滚动条
	function rederBar() {  

		$(dataObj.node).css({"width": dataObj.contentW, "height": dataObj.contentH});
		$(dataObj.node).find(".scroll-block").css({"width": $(dataObj.node).width()+17-dataObj.barW, "height": dataObj.contentH});

		var barHtml = '<div class="scroll-bar" style = "width: '+dataObj.barW+'px; background-color: '+dataObj.barBg+'">';
				barHtml += 	'<div class="s-bar-top" style = "width: '+dataObj.barW+'px; height: '+dataObj.barTopH+'px; background-color: '+dataObj.barTopBg+'"></div>';
				barHtml += 	'<div class="s-bar-middle" style = "height: '+(dataObj.contentH-2*dataObj.barTopH)+'px; margin-top: '+ dataObj.barTopH+'px">';
					barHtml += 	'<div class="s-bar-slider" style = "width: '+dataObj.barW+'px; height: '+dataObj.barSlideHeight+'px; top: 0px; background-color: '+dataObj.barSlideBg+'"></div>';
				barHtml += 	'</div>';
				barHtml += 	'<div class="s-bar-bottom" style = "width: '+dataObj.barW+'px; height: '+dataObj.barTopH+'px; background-color: '+dataObj.barTopBg+'"></div>';
			barHtml += 	'</div>';

			$(dataObj.node).append(barHtml);
	}

	function events() {

		//滚轮事件
		$(dataObj.node).find(".scroll-block").scroll(function(e) {
			if (!pressFlag) {
				slideT = (dataObj.contentH-2*dataObj.barTopH)*e.target.scrollTop/dataObj.scrollHeight;
				$(dataObj.node).find(".s-bar-slider").css({"top": slideT});
			}
		});


		$(dataObj.node).find(".s-bar-slider").mousedown(function(e) {
			pressFlag = true;
			startPos = e.clientY;
			moveSlide();
			return false;
		})
		
		//取消点击滑块事件
		$(dataObj.node).find(".s-bar-slider").click(function() {
			return false;
		})

		$(dataObj.node).mouseup(function() {
			pressFlag = false;
			$(dataObj.node).off("mousemove");
			return false;
		})

		//点击滚动条定位
		$(dataObj.node).find(".s-bar-middle").click(function(e) {
			var clickHeight = e.clientY - $(this).offset().top;
			if (clickHeight<dataObj.barSlideHeight/2) {
				slideT = 0;
			}
			else if(clickHeight> dataObj.contentH-2*dataObj.barTopH-dataObj.barSlideHeight/2) {
				slideT = dataObj.contentH-2*dataObj.barTopH-dataObj.barSlideHeight/2;
			}
			else {
				slideT = clickHeight - dataObj.barSlideHeight/2;
			}
			slideTo();
			return false;
		})	


		var timer;
		$(dataObj.node).find(".s-bar-top").click(function() {
			slideTop();
		})
		$(dataObj.node).find(".s-bar-top").mousedown(function() {
			timer = setInterval(function() {
				slideTop();
			},100)
		})
		$(dataObj.node).find(".s-bar-top").mouseout(function() {
			clearInterval(timer);
		})
		$(dataObj.node).find(".s-bar-top").mouseup(function() {
			clearInterval(timer);
		})

		$(dataObj.node).find(".s-bar-bottom").click(function() {
			slideBottom();
		})
		$(dataObj.node).find(".s-bar-bottom").mousedown(function() {
			timer = setInterval(function() {
				slideBottom();
			},100)
		})
		$(dataObj.node).find(".s-bar-bottom").mouseout(function() {
			clearInterval(timer);
		})
		$(dataObj.node).find(".s-bar-bottom").mouseup(function() {
			clearInterval(timer);
		})
	}

	//滑块向上移动
	function slideTop() {
		if (slideT > 3) {
			slideT -= 3;
		}
		else {
			slideT = 0;
		}
		slideTo();
	}

	//滑块向下移动
	function slideBottom() {
		if (slideT <= dataObj.contentH-2*dataObj.barTopH-dataObj.barSlideHeight-3) {
			slideT += 3;
		}
		else {
			slideT = dataObj.contentH-2*dataObj.barTopH-dataObj.barSlideHeight;
		}
		slideTo();
	}

	//移动滑块事件
	function moveSlide() {
		$(dataObj.node).find(".s-bar-slider").mousemove(function(e) {
			if (pressFlag) {
				var st = slideT + e.clientY-startPos;

				if ((st >= 0) &&(st <= dataObj.contentH-2*dataObj.barTopH-dataObj.barSlideHeight) ) {
					slideT += e.clientY-startPos;
					slideTo();
					startPos = e.clientY;
				}
			}
		})
		
	}

	//滚动条和内容移动
	function slideTo() {
		$(dataObj.node).find(".s-bar-slider").css({"top": slideT});
		$(dataObj.node).find(".scroll-block").scrollTop(dataObj.scrollHeight*(slideT)/(dataObj.contentH-2*dataObj.barTopH));
	}

	return {init: init};
})(jQuery);

scrollModel.init({
	node: document.getElementById("scroll1"),
	contentH: 200,
	barW: 5,
	barBg: '#fff4b4',
	barTopH: 10,
	barSlideBg: '#5cc74f',
	barTopBg: '#50d7ff'
})