(function(params) {


    var instance = Cla.ui.ciCombo({
        name: 'instance',
        class: 'DockerInstance',
        fieldLabel: _('Instance'),
        value: params.data.instance || '',
        allowBlank: false,
        with_vars: 1
    });

    return [
        instance
    ]
})