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
        class: 'generic_server',
        fieldLabel: _('Server'),
        value: params.data.server || '',
        allowBlank: false,
        with_vars: 1
    });

    var use = Cla.ui.comboBox({
        fieldLabel: _('Use'),
        name: 'use',
        value: params.data.use || '',
        data: [
            ['Generic', 'Generic'],
            ['Image', 'Image'],
            ['Container', 'Container']
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
        optionsTask.allowBlank = true;
        taskContainer.allowBlank = true;
        taskImage.allowBlank = true;
        taskNone.allowBlank = true;
        commandParameters.allowBlank = true;
        if (v == 'Image') {
            optionsTask.show();
            imageName.show();
            imageVersion.show();
            containerName.hide();
            taskImage.show();
            taskvalue = taskImage.getValue();
            optionsTask.allowBlank = false;
            imageName.allowBlank = false;
            imageVersion.allowBlank = true;
            containerName.allowBlank = true;
            taskImage.allowBlank = false;
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
            optionsTask.allowBlank = false;
            imageName.allowBlank = true;
            imageVersion.allowBlank = true;
            containerName.allowBlank = false;
            taskContainer.allowBlank = false;
            if (taskvalue == 'commit' || taskvalue == 'exec') {
                commandParameters.show();
            }
        } else if (v == 'Generic') {
            optionsTask.show();
            taskNone.show();
            imageName.hide();
            imageVersion.hide();
            containerName.hide();
            optionsTask.allowBlank = false;
            taskNone.allowBlank = false;
            imageName.allowBlank = true;
            imageVersion.allowBlank = true;
            containerName.allowBlank = true;
        }
    });

    var taskContainer = Cla.ui.comboBox({
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
        hidden: true,
        singleMode: true,
        width: 400
    });

    taskContainer.on('addItem', function() {
        var valueTask = taskContainer.getValue();
        if (availableCommands['Container'].indexOf(valueTask) != -1) {
            commandParameters.show();
        } else {
            commandParameters.hide();
        }
    });

    var taskImage = Cla.ui.comboBox({
        name: 'taskImage',
        fieldLabel: _('Task Type'),
        data: [
            ['create', 'create'],
            ['history', 'history'],
            ['inspect', 'inspect'],
            ['push', 'push'],
            ['pull', 'pull'],
            ['rmi', 'rmi'],
            ['run', 'run'],
            ['save', 'save'],
            [' ', 'Write command in options task']
        ],
        value: params.data.taskImage || '',
        hidden: true,
        singleMode: true,
        width: 400
    });

    taskImage.on('addItem', function() {
        var valueTask = taskImage.getValue();
        if (availableCommands['Image'].indexOf(valueTask) != -1) {
            commandParameters.show();
        } else {
            commandParameters.hide();
        }
    });

    var taskNone = Cla.ui.comboBox({
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
        hidden: true,
        singleMode: true,
        width: 400
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

    var optionsTask = Cla.ui.arrayGrid({
        fieldLabel: _('Options Task'),
        name: 'optionsTask',
        value: params.data.optionsTask,
        description: 'Options',
        default_value: '.',
        hidden: true
    });

    var commandParameters = Cla.ui.textArea({
        name: 'commandParameters',
        fieldLabel: _('Command Parameters'),
        value: params.data.commandParameters || '',
        anchor: '50%',
        height: 50,
        hidden: !(params.data.use && availableCommands[params.data.use].indexOf(params.data.taskImage) != -1) &&
            !(params.data.use && availableCommands[params.data.use].indexOf(params.data.taskContainer) != -1)
    });

    var errorBox = Cla.ui.errorManagementBox({
        errorTypeName: 'errors',
        errorTypeValue: params.data.errors || 'fail',
        rcOkName: 'rcOk',
        rcOkValue: params.data.rcOk,
        rcWarnName: 'rcWarn',
        rcWarnValue: params.data.rcWarn,
        rcErrorName: 'rcError',
        rcErrorValue: params.data.rcError,
        errorTabsValue: params.data
    })

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [
            server,
            use,
            taskContainer,
            taskNone,
            taskImage,
            optionsTask,
            imageName,
            imageVersion,
            containerName,
            commandParameters,
            errorBox
        ]
    });

    return panel;
})