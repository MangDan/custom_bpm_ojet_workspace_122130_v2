define(['ojs/ojcore', 'text!./ojet-fileupload-component.html', './ojet-fileupload-component', 'text!./component.json', 'css!./ojet-fileupload-component', 'ojs/ojcomposite'],
    function(oj, view, viewModel, metadata) {
        oj.Composite.register('ojet-fileupload-component', {
            view: {inline: view},
            viewModel: {inline: viewModel},
            metadata: {inline: JSON.parse(metadata)}
        });
    }
);