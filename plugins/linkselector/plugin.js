CKEDITOR.plugins.add( 'linkselector', {
    icons: 'linkselector',
    init: function( editor ) {
        // Plugin logic goes here...
        editor.addCommand( 'linkselector', new CKEDITOR.dialogCommand( 'linkselectorDialog' ) );

        editor.ui.addButton( 'linkselector', {
            label: 'Link Selector',
            command: 'linkselector',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'linkselectorDialog', this.path + 'dialogs/linkselector.js' );

        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'linkselectorGroup' );
            editor.addMenuItem( 'linkselectorItem', {
                label: 'Link selector',
                icon: this.path + 'icons/linkselector.png',
                command: 'linkselector',
                group: 'linkselectorGroup'
            });
            editor.contextMenu.addListener( function( element ) {
                if ( element.getAscendant( 'a', true ) ) {
                    return { linkselectorItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }
    }
});