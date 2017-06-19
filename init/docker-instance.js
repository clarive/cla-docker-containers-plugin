var ci = require("cla/ci");

ci.createRole("Docker");

ci.createClass("DockerInstance", {
    form: '/plugin/cla-docker-plugin/form/docker-instance.js',
    icon: 'plugin/cla-docker-plugin/icon/logo-docker.svg',
    roles: ["Docker"],
    has: {
        server: {
            is: "rw",
            isa: "ArrayRef",
            required: true
        },
        id: {
            is: "rw",
            isa: "Str",
            required: true
        }
    }

});