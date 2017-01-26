var reg = require('cla/reg');

reg.register('service.task.docker', {
    name: 'Docker Task',
    icon: 'plugin/cla-docker-plugin/icon/logo-docker.svg',
    form: '/plugin/cla-docker-plugin/form/docker-task-form.js',

    handler: function(ctx, params) {

        var regRunRemote = require('cla/reg');

        var errorsType = params.errors || 'fail';
        var command = '';
        var output = '';

        var buildDockerCommand = function(params) {
            var command = 'docker ';
            var task = '';
            var optionsTask = params.optionsTask || [];
            var commandParameters = params.commandParameters || '';
            var imageOrContainer = '';
            var use = params.use || '';
            var availableCommands = {
                Image: ['run', 'create'],
                Container: ['commit', 'exec']
            };

            if (use == 'Image') {
                task = params.taskImage || '';
                if (params.imageVersion != '') {
                    imageOrContainer = params.imageName + ':' + params.imageVersion || '';
                } else {
                    imageOrContainer = params.imageName || '';
                }
            } else if (use == 'Container') {
                task = params.taskContainer || '';
                imageOrContainer = params.containerName || '';
            } else {
                task = params.taskNone || '';
            }
            command += task;

            optionsTask.forEach(function(element) {
                command += ' ' + element;
            });

            if (use != 'Generic') {
                command += ' ' + imageOrContainer;
                if (availableCommands[use].indexOf(task) != -1) {
                    command += ' ' + commandParameters;
                }
            }

            return command;
        }

        command = buildDockerCommand(params);

        output = regRunRemote.launch('service.scripting.remote', {
            name: 'Docker Task',
            config: {
                errors: errorsType,
                server: params.server,
                user: params.user,
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
});