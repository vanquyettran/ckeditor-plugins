var repoName = '';
CKEDITOR.dialog.add( 'internallinkDialog', function ( editor ) {
    return {
        // ... The dialog definition comes here ...
        title: 'Internallink Properties',
        minWidth: 0.75 * window.innerWidth,
        minHeight: 0.75 * window.innerHeight,

        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    // UI elements of the first tab will be defined here.
                    {
                        type: 'select',
                        id: 'href',
                        label: 'Href',
                        items: [],
                        validate: CKEDITOR.dialog.validate.notEmpty( "Href field cannot be empty." ),
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "data-href" ) );
                        },
                        commit: function( element ) {
                            element.setAttribute( "data-href", this.getValue() );
                            // element.repoName = this.getValue();
                            var input = this.getInputElement().$;
                            element.repoName = input.repoName;
                            // element.setAttribute( "data-name", input.options[ input.selectedIndex ].value );
                            element.setAttribute( "data-name", input.repoName );
                        }
                    },
                    {
                        type: 'checkbox',
                        id: 'textbyname',
                        label: 'Text by Name',
                        'default': 'checked',
                        onClick: function() {
                            // this = CKEDITOR.ui.dialog.checkbox
                            // alert( 'Checked: ' + this.getValue() );
                            if (this.getValue()) {
                                console.log(CKEDITOR.dialog.getCurrent().getContentElement( 'tab-basic', 'text' ).getInputElement().$);
                                CKEDITOR.dialog.getCurrent().getContentElement( 'tab-basic', 'text' ).getInputElement().$.value = repoName;
                            }
                        },
                        setup: function( element ) {
                            this.setValue( element.getAttribute('data-textbyname') );
                        },
                        commit: function( element ) {
                            element.setAttribute('data-textbyname', this.getValue());
                        }
                    },
                    {
                        type: 'checkbox',
                        id: 'titlebyname',
                        label: 'Title by Name',
                        'default': 'checked',
                        onClick: function(element) {
                            // this = CKEDITOR.ui.dialog.checkbox
                            // alert( 'Checked: ' + this.getValue() );
                            if (this.getValue()) {
                                console.log(CKEDITOR.dialog.getCurrent().getContentElement( 'tab-basic', 'title' ).getInputElement().$);
                                CKEDITOR.dialog.getCurrent().getContentElement( 'tab-basic', 'title' ).getInputElement().$.value = repoName;
                            }
                        },
                        setup: function( element ) {
                            this.setValue( element.getAttribute('data-titlebyname') );
                        },
                        commit: function( element ) {
                            element.setAttribute('data-titlebyname', this.getValue());
                        }
                    },
                    {
                        type: 'text',
                        id: 'text',
                        label: 'Text',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Text field cannot be empty." ),
                        setup: function( element ) {
                            this.setValue( element.getText() );
                        },
                        commit: function( element ) {
                            element.setText(this.getValue());
                        }
                    },
                    {
                        type: 'text',
                        id: 'title',
                        label: 'Title',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Title field cannot be empty." ),
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "title" ) );
                        },
                        commit: function( element ) {
                            element.setAttribute( "title", this.getValue());
                        }
                    }


                ]
            },
            {
                id: 'tab-adv',
                label: 'Advanced Settings',
                elements: [
                    // UI elements of the second tab will be defined here.
                    {
                        type: 'text',
                        id: 'id',
                        label: 'Id',
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "id" ) );
                        },
                        commit: function ( element ) {
                            var id = this.getValue();
                            if ( id )
                                element.setAttribute( 'id', id );
                            else if ( !this.insertMode )
                                element.removeAttribute( 'id' );
                        }
                    },
                    {
                        type: 'text',
                        id: 'class',
                        label: 'Class',
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "class" ) );
                        },
                        commit: function ( element ) {
                            var className = this.getValue();
                            if ( className )
                                element.setAttribute( 'class', className );
                            else if ( !this.insertMode )
                                element.removeAttribute( 'class' );
                        }
                    }
                ]
            }
        ],

        onShow: function() {

            // The code that will be executed when a dialog window is loaded.
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( element )
                element = element.getAscendant( 'a', true );

            if ( !element || element.getName() != 'a' ) {
                element = editor.document.createElement( 'a' );
                this.insertMode = true;
            }
            else
                this.insertMode = false;

            // Select2
            var selector = 'select.cke_dialog_ui_input_select';

            select2(selector);

            if (this.insertMode) {
                $(selector).select2('open');
            } else {
                $(selector).empty()
                    .append('<option>' + element.getAttribute('data-href') + '</option>')
                    .val(element.getAttribute('data-href'))
                    .trigger("change");
            }

            this.element = element;

            if ( !this.insertMode )
                this.setupContent( element );
        },

        onOk: function() {
            var dialog = this;
            var internallink = dialog.element;

            dialog.commitContent( internallink );

            if ( dialog.insertMode )
                editor.insertElement( internallink );
        }
    };
});

function select2(selector) {
    $(selector).select2({
        ajax: {
            url: "http://localhost/tiengtrunganhduong.com/test/search-articles",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term, // search term
                    page: params.page
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;

                return {
                    results: data.items,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 1,
        templateResult: formatRepo, // omitted for brevity, see the source of this page
        templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
    });

    function formatRepo (repo) {
        if (repo.loading) {
            return repo.text;
        }
        return (
            '<div class="row select2-option-row">' +
            ' <img src="' + repo.image_src + '" width="50px">' +
            ' <strong>' + repo.name + '</strong>' +
            ' <span>&rightarrow;</span>' +
            ' <span style="color:#f98">' + repo.id + '</span>' +
            '</div>'
        );
    }

    function formatRepoSelection (repo) {
        repoName = repo.name;
        return repo.id || repo.text;
    }

    $(selector).on("change", function (event) {
        this.repoName = repoName;
        CKEDITOR.dialog.getCurrent().getContentElement( 'tab-basic', 'text' ).getInputElement().$.value = repoName;
        CKEDITOR.dialog.getCurrent().getContentElement( 'tab-basic', 'title' ).getInputElement().$.value = repoName;
    });
}