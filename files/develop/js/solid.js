jQuery(function(){
  // google-code-prettify
  jQuery("pre").addClass("prettyprint");
  
  
  // fitvids
  jQuery("iframe[src*='youtube.com']").wrap('<div class="video_wrapper"></div>');
  jQuery(".video_wrapper").fitVids();
  
  
  // Menu
  function toggleMenu() {
    var nav = jQuery("#nav");
    var toggle = jQuery("#nav-toggle");
    var wrapper = jQuery("#wrapper");
    
    var navHeight = nav.outerHeight();
    jQuery(window).on("resize", function(){
      var navHeight = nav.outerHeight();
    });
    
    nav.css({
      "top" : navHeight * -1,
      "opacity" : 1
    });
    
    var flag = "close";
    var speed = 600;
    var easing = "easeInOutCubic";
    
    function navOpen() {
      nav.stop().transition({ "top" : 0 }, speed, easing);
      wrapper.stop().transition({ "top" : navHeight, delay : 50 }, speed, easing);
      flag = "open";
      toggle.addClass("navopen");
    }
    function navClose() {
      nav.stop().transition({ "top" : navHeight * -1 , delay : 50 }, speed, easing);
      wrapper.stop().transition({ "top" : 0 }, speed, easing);
      flag = "close";
      toggle.removeClass("navopen");
    }
    
    toggle.on("click", function(){
      if (flag === "close") {
        navOpen();
      }
      else if (flag === "open") {
        navClose();
      }
    });
    
    jQuery(window).on("resize", function(){
      navClose();
    });
  };
  toggleMenu();
  
  
	// Back to Top
	function backTop() {	
		jQuery("#backtop-arrow").on("click", function(){
			jQuery("html, body").stop().animate({ scrollTop : 0 }, 1000, "easeOutCubic");
		});
	};
	backTop();
});
