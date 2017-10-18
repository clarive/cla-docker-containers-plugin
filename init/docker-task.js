var reg = require('cla/reg');

reg.register('service.docker.task', {
    name: _('Docker Task'),
    icon: '/plugin/cla-docker-plugin/icon/logo-docker.svg',
    form: '/plugin/cla-docker-plugin/form/docker-task-form.js',
    rulebook: {
        moniker: 'docker_task',
        description: _('Launch a Docker command'),
        required: ['server', 'use', 'task'],
        allow: ['server', 'task', 'use', 'options_task', 'taskNone', 'command_parameters', 'errors', 'task_container',
            'task_image', 'image_name', 'image_version', 'container_name'
        ],
        mapper: {
            'options_task':'optionsTask',
            'command_parameters': 'commandParameters',
            'task_container': 'taskContainer',
            'task_image': 'taskImage',
            'image_version': 'imageVersion',
            'container_name': 'containerName',
            'image_name': 'imageName',
            'task_none': 'taskNone'
        },
        examples: [{
            docker_task: {
                server: 'docker_server',
                use: 'Generic',
                task: 'info',
                options_task: ['-f']
            }
        }, {
            docker_task: {
                server: 'docker_server',
                use: 'Image',
                task: 'create',
                image_name: 'hello_world',
                image_version: 'latest',
                options_task: ['-d'],
                command_parameters: ''
            }
        }, {
            docker_task: {
                server: 'docker_server',
                use: 'Container',
                task: 'exec',
                container_name: 'first_container',
                command_parameters: 'ls'
            }
        }]
    },
    handler: function(ctx, params) {

        var log = require('cla/log');
        var reg = require('cla/reg');
        var errorsType = params.errors || 'fail';
        var server = params.server;
        var command = '';
        var output = '';
        var command = 'docker ';
        var task = '';
        var optionsTask = params.optionsTask || [];
        var commandParameters = params.commandParameters || '';
        var imageOrContainer = '';
        var use = params.use || '';
        var taskRulebook = params.task;

        var availableCommands = {
            Image: ['run', 'create'],
            Container: ['commit', 'exec']
        };

        var launchDockerCommand = function(server, command, errorsType, params) {
            output = reg.launch('service.scripting.remote', {
                name: _('Docker Task'),
                config: {
                    errors: errorsType,
                    server: server,
                    path: command,
                    output_error: params.output_error,
                    output_warn: params.output_warn,
                    output_capture: params.output_capture,
                    output_ok: params.output_ok,
                    meta: params.meta,
                    rc_ok: params.rcOk,
                    rc_error: params.rcError,
                    rc_warn: params.rcWarn
                }
            });
            return output;
        }

        if (use == 'Image') {
            task = params.taskImage || taskRulebook || '';
            if (params.imageVersion != '') {
                imageOrContainer = params.imageName + ':' + params.imageVersion || '';
            } else {
                imageOrContainer = params.imageName || '';
            }
        } else if (use == 'Container') {
            task = params.taskContainer || taskRulebook || '';
            imageOrContainer = params.containerName || '';
        } else {
            task = params.taskNone || taskRulebook || '';
        }
        command += task;
        command = command + " " + optionsTask.join(" ");

        if (use != 'Generic') {
            command += ' ' + imageOrContainer;
            if (availableCommands[use].indexOf(task) != -1) {
                command += ' ' + commandParameters;
            }
        }

        log.info(_("Launching command: ") + command);

        output = launchDockerCommand(server, command, errorsType, params);

        log.info(_("Command finished"));

        return output;
    }
});

reg.register('service.docker.terminate_container', {
    name: _('Docker Terminate Container'),
    icon: '/plugin/cla-docker-plugin/icon/logo-docker.svg',
    form: '/plugin/cla-docker-plugin/form/docker-terminate_container-form.js',
    rulebook: {
        moniker: 'docker_terminate',
        description: _('Terminate Docker instance'),
        required: ['instance'],
        examples: [{
            docker_terminate: {
                instance: ['docker_ci']
            }
        }]
    },
    handler: function(ctx, params) {
        var ci = require("cla/ci");
        var log = require("cla/log");

        var instanceId = params.instance[0];
        var instanceCi = ci.load(instanceId);

        var output = instanceCi.terminate();
    }
});