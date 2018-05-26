define(['ojs/ojcore', 'text!./task-detail-component.html', './task-detail-component', 'text!./component.json', 'css!./task-detail-component', 'ojs/ojcomposite'],
    function(oj, view, viewModel, metadata) {
        oj.Composite.register('task-detail-component', {
            view: {inline: view},
            viewModel: {inline: viewModel},
            metadata: {inline: JSON.parse(metadata)}
        });
    }
);