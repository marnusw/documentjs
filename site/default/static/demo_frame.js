steal("can/control","./demo_frame.mustache","jquery","can/observe","./prettify.js",function(Control,demoFrameMustache,$){
	
	

return can.Control({
	init: function() {
		// Render out the demo container.
		this.element.html(demoFrameMustache( {demoSrc: '../' + this.element.data('demoSrc')}));

		// Start with the demo tab showing.
		this.showTab('demo');

		// When the iframe loads, grab the HTML and JS and fill in the other tabs.
		var self = this;
		var iFrame = this.element.find("iframe");
		iFrame.load(function() {
			var demoEl = this.contentDocument.getElementById('demo-html'),
				sourceEl = this.contentDocument.getElementById('demo-source')

			var html = demoEl ? demoEl.innerHTML : this.contentWindow.DEMO_HTML;
			
			if(!html) {
				// try to make from body
				var clonedBody = $(this.contentDocument.body).clone();
				clonedBody.find("script").each(function(){
					if(!this.type || this.type.indexOf("javascript") >= 0){
						$(this).remove()
					}
				});
				clonedBody.find("style").remove();
				html = $.trim( clonedBody.html() );
			}

			var source = sourceEl ? sourceEl.innerHTML : this.contentWindow.DEMO_SOURCE;
			if(!source){
				var scripts = $(this.contentDocument.body).find("script:not([src])");
				// get the first one that is JS
				for(var i =0; i < scripts.length; i++){
					if(!scripts[i].type || scripts[i].type.indexOf("javascript") >= 0){
						source =  scripts[i].innerHTML
					}
				}
				
			}
			source = $.trim(source);

			$('[data-for=html] > pre').html(self.prettify(html));
			$('[data-for=js] > pre').html(self.prettify( source ));
			//prettyPrint();
			
			var frame = this,
				lastHeight = 0;
			
			var checkHeight = function(){
				var current = $(frame).contents().height();
				if(current && (current > lastHeight) ) {
					iFrame.height(current);
					lastHeight = current;
				}
				setTimeout( arguments.callee, 200 )
			}
			
			checkHeight()
			
			
			
		});
	},
	'.tab click': function(el, ev) {
		this.showTab(el.data('tab'));
	},
	showTab: function(tabName) {
		$('.tab', this.element).removeClass('active');
		$('.tab-content', this.element).hide();
		$('.tab[data-tab=' + tabName + ']', this.element).addClass('active');
		$('[data-for=' + tabName + ']', this.element).show();
	},
	prettify: function(unescaped) {
		return prettyPrintOne(unescaped.replace(/</g, '&lt;'));
	}
});

})