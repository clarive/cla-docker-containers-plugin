(function(params) {
    Cla.help_push({
        title: _('Docker Task'),
        path: 'rules/palette/generic/docker-task'
    });
    var data = params.data || {};
    var availableCommands = {
        Generic: [''],
        Image: ['run', 'create'],
        Container: ['commit', 'exec']
    };

    var server = Cla.ui.ciCombo({
        name: 'server',
        class: 'BaselinerX::CI::generic_server',
        fieldLabel: _('Server'),
        value: params.data.server || '',
        allowBlank: false,
    });

    var userTextField = Cla.ui.textField({
        name: 'user',
        fieldLabel: _('User'),
        value: params.data.user
    });

    var use = Cla.ui.comboBox({
        fieldLabel: _('Use'),
        name: 'use',
        value: params.data.use || '',
        data: [
            ['Generic'],
            ['Image'],
            ['Container']
        ],
        singleMode: true,
        allowBlank: false
    });

    use.on('addItem', function() {
        var v = use.getValue();
        var taskvalue = '';
        optionsTask.hide();
        taskContainer.hide();
        taskImage.hide();
        taskNone.hide();
        commandParameters.hide();
        if (v == 'Image') {
            optionsTask.show();
            imageName.show();
            imageVersion.show();
            containerName.hide();
            taskImage.show();
            taskvalue = taskImage.getValue();
            if (taskvalue == 'create' || taskvalue == 'run') {
                commandParameters.show();
            }
        } else if (v == 'Container') {
            optionsTask.show();
            imageName.hide();
            imageVersion.hide();
            containerName.show();
            taskContainer.show();
            taskvalue = taskContainer.getValue();
            if (taskvalue == 'commit' || taskvalue == 'exec') {
                commandParameters.show();
            }
        } else if (v == 'Generic') {
            optionsTask.show();
            taskNone.show();
            imageName.hide();
            imageVersion.hide();
            containerName.hide();
        }
    });

    var taskContainer = new Baseliner.ComboDouble({
        name: 'taskContainer',
        fieldLabel: _('Task Type'),
        data: [
            ['commit', 'commit'],
            ['diff', 'diff'],
            ['exec', 'exec'],
            ['export', 'export'],
            ['inspect', 'inspect'],
            ['kill', 'kill'],
            ['logs', 'logs'],
            ['pause', 'pause'],
            ['rm', 'rm'],
            ['start', 'start'],
            ['stop', 'stop'],
            ['unpause', 'unpause'],
            [' ', 'Write command in options task']
        ],
        value: params.data.taskContainer || '',
        hidden: true
    });

    taskContainer.on('select', function() {
        var valueTask = taskContainer.getValue();
        if (availableCommands['Container'].indexOf(valueTask) != -1) {
            commandParameters.show();
        } else {
            commandParameters.hide();
        }
    });

    var taskImage = new Baseliner.ComboDouble({
        name: 'taskImage',
        fieldLabel: _('Task Type'),
        data: [
            ['create', 'create'],
            ['history', 'history'],
            ['inspect', 'inspect'],
            ['push', 'push'],
            ['rmi', 'rmi'],
            ['run', 'run'],
            ['save', 'save'],
            [' ', 'Write command in options task']
        ],
        value: params.data.taskImage || '',
        hidden: true
    });

    taskImage.on('select', function() {
        var valueTask = taskImage.getValue();
        if (availableCommands['Image'].indexOf(valueTask) != -1) {
            commandParameters.show();
        } else {
            commandParameters.hide();
        }
    });

    var taskNone = new Baseliner.ComboDouble({
        name: 'taskNone',
        fieldLabel: _('Task Type'),
        data: [
            ['ps', 'ps'],
            ['info', 'info'],
            ['images', 'images'],
            ['build', 'build'],
            [' ', 'Write command in options task']
        ],
        value: params.data.taskNone || '',
        hidden: true
    });

    var imageName = Cla.ui.textField({
        name: 'imageName',
        fieldLabel: _('Image Name'),
        value: params.data.imageName,
        hidden: true
    });

    var imageVersion = Cla.ui.textField({
        name: 'imageVersion',
        fieldLabel: _('Image version'),
        value: params.data.imageVersion || 'latest',
        hidden: true
    });

    var containerName = Cla.ui.textField({
        name: 'containerName',
        fieldLabel: _('Container Name'),
        value: params.data.containerName || '',
        hidden: true
    });

    var optionsTask = new Baseliner.ArrayGrid({
        fieldLabel: _('Options Task'),
        name: 'optionsTask',
        value: params.data.optionsTask,
        description: 'Options',
        default_value: '.',
        hidden: true
    });

    var commandParameters = new Cla.ui.textArea({
        name: 'commandParameters',
        fieldLabel: _('Command Parameters'),
        value: params.data.commandParameters || '',
        anchor: '50%',
        height: 50,
        hidden: !(params.data.use && availableCommands[params.data.use].indexOf(params.data.taskImage) != -1) &&
            !(params.data.use && availableCommands[params.data.use].indexOf(params.data.taskContainer) != -1)
    });

    var errors = new Baseliner.ComboSingle({
        fieldLabel: _('Errors'),
        name: 'errors',
        value: params.data.errors || 'fail',
        data: [
            'fail',
            'warn',
            'custom',
            'silent'
        ]
    });

    var customError = new Ext.Panel({
        layout: 'column',
        fieldLabel: _('Return Codes'),
        frame: true,
        hidden: params.data.errors != 'custom',
        items: [{
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Ok'),
                name: 'rcOk',
                value: params.data.rcOk
            }
        }, {
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Warn'),
                name: 'rcWarn',
                value: params.data.rcWarn
            }
        }, {
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Error'),
                name: 'rcError',
                value: params.data.rcError
            }
        }],
        show_hide: function() {
            errors.getValue() == 'custom' ? this.show() : this.hide();
            this.doLayout();
        }
    });

    errors.on('select', function() {
        customError.show_hide()
    });

    return [
        server,
        userTextField,
        use,
        taskContainer,
        taskNone,
        taskImage,
        optionsTask,
        imageName,
        imageVersion,
        containerName,
        commandParameters,
        errors,
        customError,
        new Baseliner.ErrorOutputTabs({
            data: params.data
        })
    ]
})