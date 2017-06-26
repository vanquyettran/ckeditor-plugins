
var modelId = null;

var modelName = '';

var modelType = '';

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
                        id: 'model-type',
                        label: 'Model Class',
                        items: [
                            ['Article', 'Article'],
                            ['Article Category', 'ArticleCategory']
                        ],
                        default: 'Article',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Model Type field cannot be empty." ),
                        onChange: function ( element ) {
                            modelType = this.getValue();
                            modelId = null;
                            modelName = '';
                            $('#' + ckeInputElement('tab-basic', 'model').id).empty();
                            ckeInputElement('tab-basic', 'text').value = '';
                            ckeInputElement('tab-basic', 'title').value = '';
                        },
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "data-model-type" ) );
                        },
                        commit: function( element ) {
                            element.setAttribute( "data-model-type", this.getValue() );
                        }
                    },
                    {
                        type: 'select',
                        id: 'model',
                        label: 'Model',
                        items: [],
                        validate: CKEDITOR.dialog.validate.notEmpty( "Model field cannot be empty." ),
                        setup: function( element ) {
                            this.setValue( element.getAttribute( "data-model-id" ) );
                        },
                        commit: function( element ) {
                            // var input = this.getInputElement().$;
                            element.setAttribute( "data-model-id", modelId );
                            element.setAttribute( "data-model-name", modelName );
                        }
                    },
                    {
                        type: 'checkbox',
                        id: 'auto-text',
                        label: 'Auto Text',
                        default: 'checked',
                        onClick: function() {
                            // this = CKEDITOR.ui.dialog.checkbox
                            var elm = ckeContentElement( 'tab-basic', 'text' );
                            if (this.getValue()) {
                                elm.setValue(modelName);
                                elm.disable();
                            } else {
                                elm.enable();
                            }
                        },
                        setup: function( element ) {
                            this.setValue( 'true' === element.getAttribute('data-auto-text') );
                        },
                        commit: function( element ) {
                            element.setAttribute('data-auto-text', this.getValue());
                        }
                    },
                    {
                        type: 'checkbox',
                        id: 'auto-title',
                        label: 'Auto Title',
                        default: 'checked',
                        onClick: function(element) {
                            // this = CKEDITOR.ui.dialog.checkbox
                            var elm = ckeContentElement( 'tab-basic', 'title' );
                            if (this.getValue()) {
                                elm.setValue(modelName);
                                elm.disable();
                            } else {
                                elm.enable();
                            }
                        },
                        setup: function( element ) {
                            this.setValue( 'true' === element.getAttribute('data-auto-title') );
                        },
                        commit: function( element ) {
                            element.setAttribute('data-auto-title', this.getValue());
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
                            if ( id ) {
                                element.setAttribute( 'id', id );
                            } else if ( !this.insertMode ) {
                                element.removeAttribute( 'id' );
                            }
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
                            if ( className ) {
                                element.setAttribute( 'class', className );
                            } else if ( !this.insertMode ) {
                                element.removeAttribute( 'class' );
                            }
                        }
                    }
                ]
            }
        ],

        // Act on tab switching
        onLoad : function() {
            // Act on tab switching
            this.on('selectPage', function (event) {
                // console.log('modelId: ' + modelId, 'modelName: ' + modelName, 'modelType: ' + modelType);
            });
        },

        onShow: function() {

            // The code that will be executed when a dialog window is loaded.
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( element ) {
                element = element.getAscendant( 'a', true );
            }

            if ( !element || element.getName() != 'a' ) {
                element = editor.document.createElement( 'a' );
                this.insertMode = true;
            } else {
                this.insertMode = false;
            }

            this.element = element;

            if ( !this.insertMode ) {
                this.setupContent( element );
            }

            // Select2
            var selector = '#' + ckeInputElement('tab-basic', 'model').id;
            select2(selector);
            if (this.insertMode) {
                $(selector).select2('open');
                modelId = null;
                modelName = '';
                modelType = '';
            } else {
                modelId = element.getAttribute('data-model-id');
                modelName = element.getAttribute('data-model-name');
                modelType = element.getAttribute('data-model-type');
                $(selector).empty()
                    .append('<option value="' + modelId + '">' + modelName + '</option>')
                    .val(modelId).trigger("change");
            }

            if (ckeContentElement('tab-basic', 'auto-title').getValue()) {
                ckeContentElement('tab-basic', 'title').disable();
            }
            if (ckeContentElement('tab-basic', 'auto-text').getValue()) {
                ckeContentElement('tab-basic', 'text').disable();
            }
        },

        onOk: function() {
            var dialog = this;
            var internallink = dialog.element;

            dialog.commitContent( internallink );

            if ( dialog.insertMode ) {
                editor.insertElement( internallink );
            }
        }
    };
});

function select2(selector) {
    $(selector).select2({
        ajax: {
            url: "http://localhost/tiengtrunganhduong.com/test/search-models",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term, // search term
                    page: params.page,
                    type: modelType
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
            ' <span style="color:#f98">' + repo.url + '</span>' +
            '</div>'
        );
    }

    function formatRepoSelection (repo) {
        modelId = repo.id;
        modelName = repo.name || repo.text;
        return modelName;
    }

    $(selector).on("change", function (event) {
        if (ckeContentElement('tab-basic', 'auto-text').getValue()) {
            ckeContentElement('tab-basic', 'text').disable();
            ckeContentElement('tab-basic', 'text').setValue(modelName);
        }
        if (ckeContentElement('tab-basic', 'auto-title').getValue()) {
            ckeContentElement('tab-basic', 'title').disable();
            ckeContentElement('tab-basic', 'title').setValue(modelName);
        }
    });
}

function ckeInputElement(tabId, elmId)
{
    return CKEDITOR.dialog.getCurrent().getContentElement( tabId, elmId ).getInputElement().$;
}
function ckeContentElement(tabId, elmId) {
    return CKEDITOR.dialog.getCurrent().getContentElement( tabId, elmId );
}