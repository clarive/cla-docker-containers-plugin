var reg = require('cla/reg');

reg.register('service.docker.task', {
    name: _('Docker Task'),
    icon: '/plugin/cla-docker-containers-plugin/icon/logo-docker.svg',
    form: '/plugin/cla-docker-containers-plugin/form/docker-task-form.js',
    rulebook: {
        moniker: 'docker_task',
        description: _('Launch a Docker command'),
        required: ['server', 'command'],
        allow: ['server', 'user', 'task', 'command', 'task_none', 'command_parameters', 'errors', 'task_container',
            'task_image', 'image_name', 'image_version', 'container_name'
        ],
        mapper: {
            'command':'optionsTask',
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
                user: 'clarive',
                command: ['info', '-f']
            }
        }, {
            docker_task: {
                server: 'docker_server',
                use: 'Image',
                task: 'create',
                image_name: 'hello_world',
                image_version: 'latest',
                command: ['-d'],
                command_parameters: ''
            }
        }, {
            docker_task: {
                server: 'docker_server',
                use: 'Container',
                command: 'exec',
                container_name: 'first_container',
                command_parameters: 'ls'
            }
        }]
    },
    handler: function(ctx, params) {

        var log = require('cla/log');
        var reg = require('cla/reg');
        var ci = require('cla/ci');
        var errorsType = params.errors || 'fail';
        var server = params.server;
        var command = '';
        var commandOutput = '';
        var command = 'docker ';
        var task = '';
        var optionsTask = params.optionsTask || [];
        var commandParameters = params.commandParameters || '';
        var imageOrContainer = '';
        var use = params.use || 'rulebook';
        var user = params.user || "";
        var imageName = params.imageName || '';
        var imageVersion = params.imageVersion || '';

        var availableCommands = {
            Image: ['run', 'create'],
            Container: ['commit', 'exec']
        };

        var serverCheck = ci.findOne({
            '$or': [{
                name: server + ''
            }, {
                mid: server + ''
            }]
        });

        if (!serverCheck){
            log.fatal(_("Server Resource doesn't exist"));
        }
        var serverMid = serverCheck.mid;

        var launchDockerCommand = function(server, command, errorsType, params, user) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Docker Task'),
                config: {
                    errors: errorsType,
                    server: server,
                    user: user,
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

        if (use != 'rulebook') {
            if (use == 'Image') {
                task = params.taskImage || '';
                imageOrContainer = (imageVersion != '') ? (imageName + ':' + imageVersion) : (imageName);
            } else if (use == 'Container') {
                task = params.taskContainer || '';
                imageOrContainer = params.containerName || '';
            } else {
                task = params.taskNone || '';
            }
            command += task;
            command = command + " " + optionsTask.join(" ") + imageOrContainer;

            if (use != 'Generic' && availableCommands[use].indexOf(task) != -1) {
                command += ' ' + commandParameters;
            }
        } else {
            command += optionsTask.join(" ");
        }

        log.info(_("Launching command: ") + command);

        commandOutput = launchDockerCommand(serverMid, command, errorsType, params, user);

        log.info(_("Command finished"));

        return commandOutput.output;
    }
});

reg.register('service.docker.terminate_container', {
    name: _('Docker Terminate Container'),
    icon: '/plugin/cla-docker-containers-plugin/icon/logo-docker.svg',
    form: '/plugin/cla-docker-containers-plugin/form/docker-terminate_container-form.js',
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
