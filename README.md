# Docker Task Plugin

<img src="https://cdn.rawgit.com/clarive/cla-docker-plugin/master/public/icon/logo-docker.svg?sanitize=true" alt="Docker Plugin" title="Docker Plugin" width="120" height="120">

Execute a docker task. You can run applications in a container, packaged with all its dependencies and libraries from Clarive.

## What is Docker

Docker is a software technology providing containers. Docker provides an additional layer of abstraction and automation of operating-system-level virtualization on Windows and Linux.

## Requirements

This plugin requires Docker to be installed in the instance to work properly.

To install Docker you need to click [here](https://docs.docker.com/engine/installation/linux/centos/) and follow the instructions.

## Installing

To install the plugin place the cla-docker-plugin folder inside `$CLARIVE_BASE/plugins`
directory in Clarive's instance.

## Parameters

- **Server** - Server that holds the remote file, server to connect to.
- **User** - User which will be used to connect to the server.
- **Use** - We must select if we want to use 'Image' commands, 'Container' commands or 'Generic' commands
- **Task** - Depending on the selection of the field above we will see some commands or others.
- **Option Task** - This panel is to set the options of the selected command. If we select 'Write command in options task', we can write in the panel the command that we want with its options. We can find [here](https://docs.docker.com/engine/reference/commandline/) a list of docker commands and the options that we can put to each one of them.
- **Image Name** - Name of the image we want to use. This field only appears if we have selected Image in the Use field. If the command can be executed with a list of images, we can put several images separate with a space.
- **Image Version** - Version of the image we want to use. This is optional, this field only appears if we have selected Image in the Use field.
- **Container Name** - Name of the container we want to use. This field only appears if we have selected Container in the Use field. If the command can be executed with a list of containers, we can put several containers separate with a space.
- **Command Parameters** - This is optional, this field only appears when the command may need it. Usually for running commands into containers or images.

- **Errors and output** - These two fields are related to manage control errors. Options are:
   - **Fail and output error** - Search for configurated error pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Warn and output warn** - Search for configurated warning pattern in script output. If found, an error message is displayed in monitor showing the match.
   - **Custom** - In case combo box errors is set to custom a new form is showed to define the behavior with these fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in monitor.
   - **Warn** - Range of return code values to warn the user. A warn message will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in monitor.


## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Example:

      Server: docker_server
      User: clarive
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

This example will download the hello-world image and execute it. So you should get a hello world message in the output.

### In Clarive SE

### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

- **server** - Server that holds the remote file, server to connect to. Name or mid.
- **user** - User which will be used to connect to the server.
- **command** - Write the command you wish to perform into an array.

The next operation will get your docker service information.

```yaml
rule: Docker demo.
do:
   - docker_task:
       server: docker_server   # use the mid set to the resource you created
       user: "docker_server_user"
       command:
         - info
```

This command will get all the information about your Docker, like number of images, running and stopped containers, etc.

If you want to download an image from Docker and run it, just follow the next example:

```yaml
do:
   - docker_task:
       server: docker_server   # use the mid set to the resource you created
       user: "docker_server_user"
       command:
         - run
         - hello-world:latest
```

This example will download the hello-world image and execute it. So you should get a hello world message in the output.


If you want to execute a command inside an existing Docker container, just follow the next example:

```yaml
do:
   - docker_task:
       server: docker_server   # use the mid or name set to the resource you created
       user: "docker_server_user"
       command:
         - exec
         - container_id
         - ls
```

This command will execute the 'ls' command in the container.


If you want to save your command output into a variable, just follow the next example:

```yaml
# This will save the output into the 'myvar' variable.
do:
  - myvar = docker_task:
      server: docker_server   # use the mid or name set to the resource you created
      user: "docker_server_user"
      command:
        - info
  - echo: ${myvar}
```

## Outputs

## Success

This service will return the console output generated by the Docker command executed.

```yaml
do:
  - myvar = docker_task:
       server: docker_server   # use the mid or name set to the resource you created
       user: "clarive"
       command:
         - version
  - echo: ${myvar}
```

For this command the output will be similar to this one:

```yaml
Client:
 Version: 18.01.0-ce
 API version: 1.35
 Go version:  go1.9.2
 Git commit:  03596f5
 Built: Wed Jan 10 20:07:19 2018
 OS/Arch: linux/amd64
 Experimental:  false
 Orchestrator:  swarm

Server:
 Engine:
  Version:  18.01.0-ce
  API version:  1.35 (minimum version 1.12)
  Go version: go1.9.2
  Git commit: 03596f5
  Built:  Wed Jan 10 20:10:58 2018
  OS/Arch:  linux/amd64
  Experimental: false
```

## Possible configuration failures

### No Docker command

```yaml
OUTPUT: Redirecting to /bin/systemctl restart ntpd.service
docker: 'abc' is not a docker command.
See 'docker --help'.
```

Make sure that the command is available in Docker.

### Parameter required

```yaml
Error in rulebook (compile): Required argument(s) missing for op "docker_task": "command"
```

Make sure you have all required parameter defined.

### Not allowed parameter

```yaml
Error in rulebook (compile): Argument `Task` not available for op "docker_task"
```

Make sure you are using the correct paramaters (make sure you are writing the parameters names correctly).

## Tips

To get available commands in Docker, just run this command:

```yaml
do:
   - myvar = docker_task:
       server: docker_server   # use the mid set to the resource you created
       user: clarive
       command:
         - --help
   - echo: ${myvar}
```

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.