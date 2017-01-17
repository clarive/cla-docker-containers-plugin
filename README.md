# Docker Task Plugin

Execute a docker task. You can run applications in a container, packaged with all its dependencies and libraries.

## Requeriments

This plugin requires Docker to be installed in the instance to work properly.

To install Docker you need to click [here](https://docs.docker.com/engine/installation/linux/centos/) and follow the instructions.

## Installing

To install the plugin place the cla-docker-plugin folder inside `CLARIVE_BASE/plugins`
directory in Clarive's instance.

## How to use

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service.

Form to configure has the following fields:

- **Server** - Server that holds the remote file, server to connect to.
- **Use** - We must select if we want to use Image commands, Containers commands or Generic commands
- **Task** - Depending on the selection of the field above we will see some commands or others.
- **Option Task** - This panel is to set the options of the selected command. If we select 'Write command in options task', we can write in the panel the command that we want with its options. We can find [here](https://docs.docker.com/engine/reference/commandline/) a list of docker commands and the options that we can put to each one of them.
- **Image Name** - Name of the image we want to use. This field only appears if we have selected Image in the Use field. If the command can be executed with a list of images, we can put several images separate with a space.
- **Image Version** - Version of the image we want to use. This is optional, this field only appears if we have selected Image in the Use field.
- **Container Name** - Name of the container we want to use. This field only appears if we have selected Container in the Use field. If the command can be executed with a list of containers, we can put several containers separate with a space.
- **Command Parameters** - This is optional, this field only appears when the command may need it.
- **Errors and output** - These two fields are related to manage control errors. Options are:
   - **Fail and output error** - Search for configurated error pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Warn and output warn** - Search for configurated warning pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Custom** - In case combo box errors is set to custom a new form is showed to define the behavior with these fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in monitor.
   - **Warn** - Range of return code values to warn the user. A warn message will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in monitor.

Example:


      Server: generic_server
      Use: Image
      Task: run
      Option Task: --rm
      Image Name: hello-world
      Image Version: latest
      Command Parameters:
      Error: fail
      Output:
            Error:
            Warn:
            Ok: *Hello
            Capture:



