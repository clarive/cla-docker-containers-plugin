(function(params) {

    return [
        Cla.ui.ciCombo({
            name: 'server',
            class: 'generic_server',
            fieldLabel: _('Server'),
            value: params.rec.server || '',
            allowBlank: false
        }),
        Cla.ui.textField({
            name: 'id',
            fieldLabel: _('Instance ID'),
            allowBlank: false
        })
    ]
})