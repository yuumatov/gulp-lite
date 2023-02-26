import './vendors/jquery-3.6.3.min.js'
import './vendors/jquery-ui.min.js'

$(function() {
    $(".accordion").accordion({
		heightStyle: 'content',
		collapsible: 'true',

		classes: {
			'ui-accordion-header-active': 'accordion__header--active',
			'ui-accordion-content-active': 'accordion__content--active'
		}
	});
});
