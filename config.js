/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

    // http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
    // http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_2
    config.extraPlugins = 'abbr';
    config.allowedContent = true;
};
