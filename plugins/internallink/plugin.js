CKEDITOR.plugins.add( 'internallink', {
    icons: 'internallink',
    init: function( editor ) {
        // Plugin logic goes here...
        editor.addCommand( 'internallink', new CKEDITOR.dialogCommand( 'internallinkDialog' ) );

        editor.ui.addButton( 'Internallink', {
            label: 'Insert Internallink',
            command: 'internallink',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'internallinkDialog', this.path + 'dialogs/internallink.js' );

        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'internallinkGroup' );
            editor.addMenuItem( 'internallinkItem', {
                label: 'Edit Internallink',
                icon: this.path + 'icons/internallink.png',
                command: 'internallink',
                group: 'internallinkGroup'
            });
            editor.contextMenu.addListener( function( element ) {
                if ( element.getAscendant( 'a', true ) ) {
                    return { internallinkItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }
    }
});