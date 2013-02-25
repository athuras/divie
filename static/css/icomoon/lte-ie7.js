/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-help' : '&#x21;',
			'icon-arrow-right' : '&#x40;',
			'icon-arrow-right-2' : '&#x23;',
			'icon-arrow-left' : '&#x24;',
			'icon-arrow-down' : '&#x25;',
			'icon-arrow-up' : '&#x26;',
			'icon-arrow-left-2' : '&#x27;',
			'icon-arrow-down-2' : '&#x28;',
			'icon-arrow-up-2' : '&#x29;',
			'icon-arrow-left-3' : '&#x2a;',
			'icon-arrow-down-3' : '&#x2b;',
			'icon-arrow-up-3' : '&#x2c;',
			'icon-arrow-right-3' : '&#x2d;',
			'icon-arrow-left-4' : '&#x2e;',
			'icon-arrow-down-4' : '&#x2f;',
			'icon-arrow-up-4' : '&#x30;',
			'icon-untitled' : '&#x31;',
			'icon-locked' : '&#x22;',
			'icon-unlocked' : '&#x32;',
			'icon-unlock-fill' : '&#x33;',
			'icon-lock-fill' : '&#x34;',
			'icon-unlocked-2' : '&#x35;',
			'icon-locked-2' : '&#x36;',
			'icon-checkmark' : '&#x37;',
			'icon-close' : '&#x38;',
			'icon-cancel' : '&#x39;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};